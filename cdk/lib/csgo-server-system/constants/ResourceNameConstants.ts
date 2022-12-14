import autoRename from './../../commons/utils/AutoRename';

export default class ResourceNameConstants {
  public static EC2_NESTED_STACK = 'EC2NestedStack';
  public static LAMBDA_NESTED_STACK = 'LambdaNestedStack';

  // Network
  public static CSGO_VPC_ID = 'EC2CSGOVpcID';
  public static CSGO_SG_ID = 'EC2CSGOSgID';

  // KeyPair
  public static CSGO_CFN_KEYPAIR_ID = 'EC2CSGOKeyPairID';
  public static CSGO_CFN_KEYPAIR_NAME = 'csgo-keypair';
  // default pre-made keypair
  public static CSGO_PREMADE_KEYPAIR = 'kainbala-csgo-keypair';

  // EC2
  public static EC2_CSGO_INSTANCE_ID = 'EC2CSGOInsrtanceID';
  public static EC2_CSGO_INSTANCE_NAME = autoRename('csgo-server');
  
  // Lambda
  public static DESCRIBE_INSTANCES_LAMBDA_ID  = 'DescribeInstanceLambda1ID';
  public static DESCRIBE_INSTANCES_LAMBDA_NAME = autoRename('describe-instance-lambda1');
  public static START_INSTANCE_LAMBDA_ID = 'StartInstanceLambda2ID';
  public static START_INSTANCE_LAMBDA_NAME = autoRename('start-instance-lambda2');

  // API GW
  public static CSGO_API_GW_ID = 'CsgoApiGwID';
  public static CSGO_API_GW_NAME = autoRename('csgo-api');
}