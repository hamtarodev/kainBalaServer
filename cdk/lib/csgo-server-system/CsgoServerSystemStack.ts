import { CfnElement, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Ec2NestedStack from './nested/Ec2NestedStack';
import ResourceNameConstants from './constants/ResourceNameConstants';
import LambdaNestedStack from './nested/LambdaNestedStack';

export default class CsgoServerSystemStack extends Stack {
  public ec2NestedStack: Ec2NestedStack;
  public lambdaNestedStack: LambdaNestedStack;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ec2NestedStack = new Ec2NestedStack(this, ResourceNameConstants.EC2_NESTED_STACK);
    this.lambdaNestedStack = new LambdaNestedStack(this, ResourceNameConstants.LAMBDA_NESTED_STACK);

    this.populateLambdaEnvs();
  }

  private populateLambdaEnvs() {
    this.lambdaNestedStack.addEnvToDescribeInstanceLambda(this.ec2NestedStack.csgoEc2Instance.instanceId);
  }

  getLogicalId(element: CfnElement): string {
    if (element.node.id.includes('NestedStackResource')) {
      return /([a-zA-Z0-9]+)\.NestedStackResource/.exec(element.node.id)?.[1] || '';
    }
    return super.getLogicalId(element);
  }
}