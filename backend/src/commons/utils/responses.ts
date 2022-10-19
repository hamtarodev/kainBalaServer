enum StatusCode {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400
}

interface LooseObject {
  [key: string]: string | number
}

export interface LambdaResponse {
  statusCode: number,
  headers: LooseObject,
  body: string
}

export const response = <T>(statusCode: StatusCode, responseBody: T): LambdaResponse => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responseBody)
  };
};

export const ok = <T>(responseBody: T): LambdaResponse => {
  return response(StatusCode.OK, responseBody);
};

export const notOk = <T>(responseBody: T): LambdaResponse => {
  return response(StatusCode.INTERNAL_ERROR, responseBody);
};

export const badRequest = <T>(responseBody: T): LambdaResponse => {
  return response(StatusCode.BAD_REQUEST, responseBody);
};