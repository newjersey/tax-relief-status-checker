/** Defines the deployment stages and their associated AWS account configuration. */

/** The name of a deployment stage. */
export type StageName = "dev";

/** Configuration for a single deployment stage. */
export interface StageConfig {
  /** The human-readable name of the stage. */
  readonly stageName: StageName;

  /** The AWS account ID where this stage is deployed. */
  readonly account: string;

  /** The AWS region where this stage is deployed. */
  readonly region: string;

  /** The oranames.tns configuration key to use for this environment */
  readonly connectString: string;

  /** The VPC ID to deploy the Lambda into. */
  readonly vpcId: string;

  /** The key of the secret in AWS Secrets Manager */
  readonly credentialsName: string;
}

/** Stage configurations keyed by stage name. */
export const stages: Record<StageName, StageConfig> = {
  dev: {
    stageName: "dev",
    account: "539590994798",
    region: "us-east-1",
    vpcId: "vpc-038303de2a7da1d47",
    connectString: "TAXU",
    credentialsName: "TAX2_CREDS_STAGING",
  },
  // prod: {
  //   stageName: "prod",
  //   account: "973370773553",
  //   region: "us-east-1",
  //   vpcId: vpc-019f1d6fba8ee4649,
  //   connectString: "TAX2_PROD",
  //.  credentialsName: "TAX2_CREDS_PROD"
  // },
};
