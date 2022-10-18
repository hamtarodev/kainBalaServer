import { CfnElement, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Ec2NestedStack from './nested/Ec2NestedStack';
import ResourceNameConstants from './constants/ResourceNameConstants';

export default class CsgoServerSystemStack extends Stack {
  public ec2NestedStack: Ec2NestedStack;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ec2NestedStack = new Ec2NestedStack(this, ResourceNameConstants.EC2_NESTED_STACK);
  }

  getLogicalId(element: CfnElement): string {
    if (element.node.id.includes('NestedStackResource')) {
      return /([a-zA-Z0-9]+)\.NestedStackResource/.exec(element.node.id)?.[1] || '';
    }
    return super.getLogicalId(element);
  }
}