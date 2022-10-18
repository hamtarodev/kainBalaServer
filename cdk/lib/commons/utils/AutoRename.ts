import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const autoRename = (name: string): string => {
  const appName = app.node.tryGetContext('appName');

  return `${appName}-${name}`;
};

export default autoRename;