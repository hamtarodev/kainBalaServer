
import { APIGatewayEvent } from 'aws-lambda';
import { EC2Client, StartInstancesCommand } from '@aws-sdk/client-ec2';
import { badRequest, ok } from './../../commons/utils/responses';
import { IStartRequest } from './interfaces/IStartRequest';

export const handler = async (event: APIGatewayEvent) => {
  if (event.body === null) {
    return badRequest({
      message: 'Invalid input'
    });
  }

  const request: IStartRequest = JSON.parse(event.body);

  const ec2Client = new EC2Client({ region: process.env.REGION || '' });
  const command = new StartInstancesCommand({
    InstanceIds: [request.instanceId]
  });
  const result = await ec2Client.send(command);

  return ok({
    result
  });
};