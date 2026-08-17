import { Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as cwActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";

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

  /** The Lambda function serving the ANCHOR autofile lookup API. */
  public readonly autofileLambdaFunction: lambda.Function;

  /** The DynamoDB table storing SSN/ZIP hashes for ANCHOR autofile lookup. */
  public readonly autofileTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    const alarmNotificationTopic = new sns.Topic(this, "PropertyTaxReliefStatusApiAlarmTopic", {
      topicName: `property-tax-relief-status-api-alarms-${props.stageName}`,
      displayName: "Property Tax Relief Status API Alarms",
    });

    const api500Alarm = new cw.Alarm(this, "PropertyTaxReliefStatusApi500Alarm", {
      metric: new cw.Metric({
        namespace: "TaxReliefStatusApi",
        metricName: "ResponseCount",
        dimensionsMap: { StatusCode: "500" },
        statistic: "Sum",
      }),
      threshold: 0,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      alarmName: "PropertyTaxReliefStatusApi500Alarm",
      alarmDescription: "Alarm for API errors",
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cw.TreatMissingData.NOT_BREACHING,
    });

    api500Alarm.addAlarmAction(new cwActions.SnsAction(alarmNotificationTopic));

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
          new iam.PolicyStatement({
            actions: ["lambda:InvokeFunctionUrl", "lambda:InvokeFunction"],
            resources: [this.autofileLambdaFunction.functionArn],
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

    this.autofileTable = new dynamodb.Table(this, "AnchorAutofileSsnZipTable", {
      tableName: `anchor-autofile-ssn-zip-${props.stageName}`,
      partitionKey: { name: "ssnZipHash", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.autofileLambdaFunction = new lambda.Function(this, "AnchorAutofileApi", {
      functionName: `anchor-autofile-api-${props.stageName}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(DIRNAME, "../../lambda-anchor-autofile-api/lambda.zip"),
      ),
      timeout: Duration.seconds(LAMBDA_TIMEOUT_SECONDS),
      memorySize: LAMBDA_MEMORY_MB,
      environment: {
        TABLE_NAME: this.autofileTable.tableName,
      },
      ...vpcConfig,
    });

    this.autofileTable.grantReadData(this.autofileLambdaFunction);

    this.autofileLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
      cors: { allowedOrigins: props.allowedOrigins },
    });
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

    new ec2.GatewayVpcEndpoint(this, "DynamoDbEndpoint", {
      vpc,
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
      subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
    });

    return {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [lambdaSecurityGroup],
    };
  }
}
