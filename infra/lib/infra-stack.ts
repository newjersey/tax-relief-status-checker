import { Duration, Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as path from "path";
import { fileURLToPath } from "url";

import type { StageName } from "./stage-config.ts";

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

/** Duration in seconds before the Lambda function times out. */
const LAMBDA_TIMEOUT_SECONDS = 5;

/** Memory allocated to the Lambda function in megabytes. */
const LAMBDA_MEMORY_MB = 512;

/**
 * Configuration for the infrastructure stack. Allows optional VPC placement for the Lambda
 * function.
 */
export interface InfraStackProps extends StackProps {
  /** The deployment stage this stack belongs to. */
  readonly stageName: StageName;

  /**
   * An existing VPC to deploy the Lambda function into. When provided, the Lambda will be placed in
   * the VPC's private subnets and a VPC endpoint for Secrets Manager will be created.
   */
  readonly vpcId: string;
  readonly connectString: string;
  readonly credentialsName: string;
}

/**
 * CDK stack defining the Property Tax Relief Status API Lambda function. Supports optional VPC
 * placement with a Secrets Manager VPC endpoint.
 */
export class InfraStack extends Stack {
  /** The Lambda function serving the Property Tax Relief Status API. */
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

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
      ...vpcConfig,
    });
  }

  /**
   * Builds VPC configuration for the Lambda function. When a VPC is provided, places the Lambda in
   * private subnets and creates a Secrets Manager VPC endpoint.
   */
  private buildVpcConfig(
    vpc: ec2.IVpc,
  ): Pick<lambda.FunctionProps, "vpc" | "vpcSubnets" | "securityGroups"> {
    const securityGroup = new ec2.SecurityGroup(this, "LambdaSecurityGroup", {
      vpc,
      description: "Security group for the Property Tax Relief Status API Lambda",
      allowAllOutbound: true,
    });

    const endpointSecurityGroup = new ec2.SecurityGroup(
      this,
      "SecretsManagerEndpointSecurityGroup",
      {
        vpc,
        description: "Security group for the Secrets Manager VPC endpoint",
        allowAllOutbound: false,
      },
    );

    endpointSecurityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(443),
      "Allow HTTPS from Lambda security group",
    );

    new ec2.InterfaceVpcEndpoint(this, "SecretsManagerEndpoint", {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
      securityGroups: [endpointSecurityGroup],
    });

    return {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
    };
  }
}
