/** Defines the deployment stages and their associated AWS account configuration. */

/** Configuration for a single deployment stage. */
export interface StageConfig {
  /** The human-readable name of the stage. */
  readonly stageName: string;

  /** The AWS account ID where this stage is deployed. */
  readonly account: string;

  /** The AWS region where this stage is deployed. */
  readonly region: string;

  /** The oranames.tns configuration key to use for this environment */
  readonly connectString: string;

  /** The VPC ID to deploy the Lambda into. */
  readonly vpcId: string;

  /** The key of the credentials secret in AWS Secrets Manager */
  readonly credentialsName: string;

  /** The arn for the credentials secret in AWS Secrets Manager */
  readonly secretArn: string;

  /** The CORS origins that are allowed to access the Lambda */
  readonly allowedOrigins: string[];
}

/** Stage configurations keyed by stage name. */
export const STAGE_CONFIGURATIONS: Record<string, StageConfig> = {
  dev: {
    stageName: "dev",
    account: "539590994798",
    region: "us-east-1",
    vpcId: "vpc-038303de2a7da1d47",
    connectString: "TAX2_TAXU",
    credentialsName: "TAX2_CREDS_STAGING",
    secretArn: "arn:aws:secretsmanager:us-east-1:539590994798:secret:TAX2_CREDS_STAGING-eNohgJ",
    allowedOrigins: ["https://amplifyapp.com"],
  },
  prod: {
    stageName: "prod",
    account: "973370773553",
    region: "us-east-1",
    vpcId: "vpc-019f1d6fba8ee4649",
    connectString: "TAX2_PROD",
    credentialsName: "TAX2_CREDS_PROD",
    secretArn: "arn:aws:secretsmanager:us-east-1:973370773553:secret:TAX2_CREDS_PROD-GpFZD1",
    allowedOrigins: ["https://propertytaxreliefstatus.nj.gov"],
  },
};
