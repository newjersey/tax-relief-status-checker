import * as cdk from "aws-cdk-lib";

import { InfraStack } from "../lib/infra-stack.ts";
import { STAGE_CONFIGURATIONS } from "../lib/stage-config.ts";

const app = new cdk.App();

const stageName = app.node.tryGetContext("stage");
if (stageName == null || typeof stageName !== "string" || stageName === "") {
  throw new Error(
    "Context argument 'stage' must be provided to the CDK command (e.g. `... stage=resx-sandbox`). Valid stages are [dev, prod].",
  );
}

if (!(stageName in STAGE_CONFIGURATIONS)) {
  throw new Error(
    `Context argument 'stage' is not one of the supported stages. Provided: ${stageName}, ` +
      `supported stages:\n  ${Object.keys(STAGE_CONFIGURATIONS).join("\n  ")}\n`,
  );
}

const stage = STAGE_CONFIGURATIONS[stageName];

const env: cdk.Environment = {
  account: stage.account,
  region: stage.region,
};

new InfraStack(app, `PropertyTaxReliefStatusApi-${stage.stageName}`, {
  env,
  vpcId: stage.vpcId,
  stageName: stage.stageName,
  connectString: stage.connectString,
  credentialsName: stage.credentialsName,
  dbCredentialsSecretArn: stage.secretArn,
});
