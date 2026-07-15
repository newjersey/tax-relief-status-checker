import { Duration, Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { fileURLToPath } from "url";
import { Alarm, ComparisonOperator, Metric, TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const LAMBDA_TIMEOUT_SECONDS = 5;
const LAMBDA_MEMORY_MB = 512;

export interface InfraStackProps extends StackProps {
  readonly stageName: string;
  readonly vpcId: string;
  readonly connectString: string;
  readonly credentialsName: string;
  readonly dbCredentialsSecretArn: string;
  readonly allowedOrigins: string[];
}

export class InfraStack extends Stack {
  /** The Lambda function serving the Property Tax Relief Status API. */
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    new Alarm(this, "PropertyTaxReliefStatusApi500Alarm", {
      metric: new Metric({
        namespace: "TaxReliefStatusApi",
        metricName: "ResponseCount",
        dimensionsMap: { statusCode: "500" },
        statistic: "Sum",
      }),
      threshold: 0,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      alarmName: "PropertyTaxReliefStatusApi500Alarm",
      alarmDescription: "Alarm for API errors",
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.MISSING,
    });

    const vpc = ec2.Vpc.fromLookup(this, `vpc-${props.stageName}`, {
      vpcId: props.vpcId,
    });

    const vpcConfig = this.buildVpcConfig(vpc);

    this.lambdaFunction = new lambda.Function(this, "PropertyTaxReliefStatusApi", {
      functionName: `property-tax-relief-status-api-${props.stageName}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(DIRNAME, "../../lambda/lambda.zip")),
      timeout: Duration.seconds(LAMBDA_TIMEOUT_SECONDS),
      memorySize: LAMBDA_MEMORY_MB,
      environment: {
        STAGE: props.stageName,
        CONNECT_STRING: props.connectString,
        DB_CREDS_SECRET_NAME: props.credentialsName,
      },
      reservedConcurrentExecutions: 5,
      ...vpcConfig,
    });

    this.lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
      cors: { allowedOrigins: props.allowedOrigins },
    });

    const amplifyIamRole = new iam.Role(this, "amplifyIamRole", {
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
    });

    amplifyIamRole.attachInlinePolicy(
      new iam.Policy(this, "InvokeLambdaPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["lambda:InvokeFunctionUrl", "lambda:InvokeFunction"],
            resources: [this.lambdaFunction.functionArn],
          }),
        ],
      }),
    );

    const customPolicy = new iam.Policy(this, "LambdaCustomPolicy", {
      statements: [
        new iam.PolicyStatement({
          actions: ["secretsmanager:GetSecretValue"],
          resources: [props.dbCredentialsSecretArn],
        }),
      ],
    });

    this.lambdaFunction.role?.attachInlinePolicy(customPolicy);
  }

  private buildVpcConfig(
    vpc: ec2.IVpc,
  ): Pick<lambda.FunctionProps, "vpc" | "vpcSubnets" | "securityGroups"> {
    const lambdaSecurityGroup = new ec2.SecurityGroup(this, "LambdaSecurityGroup", {
      vpc,
      description: "Security group for the Property Tax Relief Status API Lambda",
      allowAllOutbound: true,
    });

    const secretsManagerEndpointSecurityGroup = new ec2.SecurityGroup(
      this,
      "SecretsManagerEndpointSecurityGroup",
      {
        vpc,
        description: "Security group for the Secrets Manager VPC endpoint",
        allowAllOutbound: false,
      },
    );

    secretsManagerEndpointSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(443),
      "Allow HTTPS from Lambda security group",
    );

    new ec2.InterfaceVpcEndpoint(this, "SecretsManagerEndpoint", {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
      securityGroups: [secretsManagerEndpointSecurityGroup],
    });

    return {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [lambdaSecurityGroup],
    };
  }
}
