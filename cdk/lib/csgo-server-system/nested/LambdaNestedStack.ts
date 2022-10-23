import {
  NestedStack,
  NestedStackProps,
  aws_lambda as lambda,
  aws_iam as iam,
  aws_apigateway as apiGw
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import ResourceNameConstants from '../constants/ResourceNameConstants';
import LocationConstants from './../../commons/constants/LocationConstants';

export default class LambdaNestedStack extends NestedStack {
  private commonEc2ManagedPolicy: iam.IManagedPolicy;

  public describeInstancesLambda: lambda.Function;
  public startInstanceLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.createCommonEc2ManagedPolicy();

    this.describeInstancesLambda = this.createDescribeInstancesLambda();
    this.startInstanceLambda = this.createStartInstanceLambda();
    
    this.createApiEndpoints();
  }

  private createCommonEc2ManagedPolicy() {
    this.commonEc2ManagedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess');
  }

  private createDescribeInstancesLambda() {
    const lambdaFunc = new lambda.Function(this, ResourceNameConstants.DESCRIBE_INSTANCES_LAMBDA_ID, {
      functionName: ResourceNameConstants.DESCRIBE_INSTANCES_LAMBDA_NAME,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(LocationConstants.DESCRIBE_INSTANCES_LAMBDA_SRC),
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        REGION: this.node.tryGetContext('region')
      }
    });
    lambdaFunc.role?.addManagedPolicy(this.commonEc2ManagedPolicy);

    return lambdaFunc;
  }

  private createStartInstanceLambda() {
    const lambdaFunc = new lambda.Function(this, ResourceNameConstants.START_INSTANCE_LAMBDA_ID, {
      functionName: ResourceNameConstants.START_INSTANCE_LAMBDA_NAME,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(LocationConstants.START_INSTANCE_LAMBDA_SRC),
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        REGION: this.node.tryGetContext('region')
      }
    });
    lambdaFunc.role?.addManagedPolicy(this.commonEc2ManagedPolicy);

    return lambdaFunc;
  }

  private createApiEndpoints() {
    const serverAPI = new apiGw.RestApi(this, ResourceNameConstants.CSGO_API_GW_ID, {
      restApiName: ResourceNameConstants.CSGO_API_GW_NAME,
      description: 'API Gateway for CSGO Server and its Container Management',
      defaultCorsPreflightOptions: {
        allowOrigins: apiGw.Cors.ALL_ORIGINS,
        allowCredentials: true
      }
    });

    const describeInstancesEndpoint = serverAPI.root.resourceForPath('describe-instances');
    describeInstancesEndpoint.addMethod('GET', new apiGw.LambdaIntegration(this.describeInstancesLambda));

    const startInstanceEndpoint = serverAPI.root.resourceForPath('start-instance');
    startInstanceEndpoint.addMethod('POST', new apiGw.LambdaIntegration(this.startInstanceLambda));
  }

  public addEnvToDescribeInstanceLambda(instanceID: string) {
    this.describeInstancesLambda.addEnvironment('INSTANCE_ID', instanceID);
  }
}