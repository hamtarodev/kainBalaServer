import {
  NestedStack,
  NestedStackProps,
  aws_lambda as lambda,
  aws_iam as iam
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import ResourceNameConstants from '../constants/ResourceNameConstants';
import LocationConstants from './../../commons/constants/LocationConstants';

export default class LambdaNestedStack extends NestedStack {
  public describeInstanceLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.describeInstanceLambda = this.createDescribeInstanceLambda();
  }

  private createDescribeInstanceLambda() {
    const lambdaFunc = new lambda.Function(this, ResourceNameConstants.DESCRIBE_INSTANCE_LAMBDA_ID, {
      functionName: ResourceNameConstants.DESCRIBE_INSTANCE_LAMBDA_NAME,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(LocationConstants.DESCRIBE_INSTANCE_LAMBDA_SRC),
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        REGION: this.node.tryGetContext('region')
      }
    });

    const ec2Policy = iam.ManagedPolicy.fromAwsManagedPolicyName('AamazonEC2FullAccess');
    lambdaFunc.role?.addManagedPolicy(ec2Policy);

    return lambdaFunc;
  }

  public addEnvToDescribeInstanceLambda(instanceID: string) {
    this.describeInstanceLambda.addEnvironment('INSTANCE_ID', instanceID);
  }
}