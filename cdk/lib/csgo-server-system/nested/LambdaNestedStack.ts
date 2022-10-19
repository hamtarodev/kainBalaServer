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
  public describeInstancesLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.describeInstancesLambda = this.createDescribeInstancesLambda();
    
    this.createApiEndpoints();
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

    const ec2Policy = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess');
    lambdaFunc.role?.addManagedPolicy(ec2Policy);

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
  }

  public addEnvToDescribeInstanceLambda(instanceID: string) {
    this.describeInstancesLambda.addEnvironment('INSTANCE_ID', instanceID);
  }
}