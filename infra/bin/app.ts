import * as cdk from "aws-cdk-lib";

import { InfraStack } from "../lib/infra-stack.ts";
import { stages } from "../lib/stage-config.ts";
import type { StageName } from "../lib/stage-config.ts";

const app = new cdk.App();

for (const [name, stage] of Object.entries(stages)) {
  const env: cdk.Environment = {
    account: stage.account,
    region: stage.region,
  };

  new InfraStack(app, `PropertyTaxReliefStatusApi-${name}`, {
    env,
    vpcId: stage.vpcId,
    stageName: name as StageName,
    connectString: stage.connectString,
    credentialsName: stage.credentialsName,
  });
}
