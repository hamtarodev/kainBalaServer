import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { APIGatewayEvent } from 'aws-lambda';
import { ok } from './../../commons/utils/responses';

export const handler = async (event: APIGatewayEvent) => {
  console.log(event.body);

  const serverInstance = process.env.INSTANCE_ID || '';

  const ec2Client = new EC2Client({ region: process.env.REGION || '' });
  const command = new DescribeInstancesCommand({
    InstanceIds: [serverInstance]
  });

  const result = await ec2Client.send(command);
  console.log(result);

  return ok({
    result
  });
};