import autoRename from './../../commons/utils/AutoRename';

export default class ResourceNameConstants {
  public static EC2_NESTED_STACK = 'EC2NestedStack';

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
}