import {
  NestedStack,
  NestedStackProps,
  aws_ec2 as ec2
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import ResourceNameConstants from './../constants/ResourceNameConstants';

export default class Ec2NestedStack extends NestedStack {
  private csgoVPC: ec2.IVpc;
  private csgoSecurityGroup: ec2.ISecurityGroup;
  private csgoKeyPair: ec2.CfnKeyPair;

  public csgoEc2Instance: ec2.Instance;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.createCsgoNetworkSettings();
    this.createCsgoKeyPair();

    this.csgoEc2Instance = this.createCsGoEc2Instance();
  }

  private createCsgoNetworkSettings() {
    this.csgoVPC = new ec2.Vpc(this, ResourceNameConstants.CSGO_VPC_ID, {
      natGateways: 0,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'asterisk',
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });

    this.csgoSecurityGroup = new ec2.SecurityGroup(this, ResourceNameConstants.CSGO_SG_ID, {
      vpc: this.csgoVPC,
      description: 'Allow SSH and UDP connection for CSGO activities',
      allowAllOutbound: true
    });

    this.csgoSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH For Admin');
    this.csgoSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.udp(27015),  'Gaming server port');
  }

  private createCsgoKeyPair() {
    this.csgoKeyPair = new ec2.CfnKeyPair(this, ResourceNameConstants.CSGO_CFN_KEYPAIR_ID, {
      keyName: ResourceNameConstants.CSGO_CFN_KEYPAIR_NAME,
      tags: [{
        key: 'appName',
        value: this.node.tryGetContext('appName')
      }]
    });
  }

  private createCsGoEc2Instance() {
    return new ec2.Instance(this, ResourceNameConstants.EC2_CSGO_INSTANCE_ID, {
      instanceName: ResourceNameConstants.EC2_CSGO_INSTANCE_NAME,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MEDIUM),
      vpc: this.csgoVPC,
      securityGroup: this.csgoSecurityGroup,
      machineImage: ec2.MachineImage.genericLinux({
        'ap-southeast-1': 'ami-0f74c08b8b5effa56'
      }),
      blockDevices: [{
        deviceName: '/dev/sda1',
        volume: ec2.BlockDeviceVolume.ebs(30),
      }]
    });
  }
}