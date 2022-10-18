import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Ec2NestedStack from './nested/Ec2NestedStack';
import ResourceNameConstants from './constants/ResourceNameConstants';

export default class CsgoServerSystemStack extends Stack {
  public ec2NestedStack: Ec2NestedStack;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ec2NestedStack = new Ec2NestedStack(this, ResourceNameConstants.EC2_NESTED_STACK);
  }
}