import { rateLimitModule, RateLimitModule } from '../utils/rate-limit';
import { getTimestampInSeconds } from '../utils/time';
import { version } from 'node:process';

const NODE_MIN_VERSION_FOR_V3 = 'v20.0.0';

type InvokeResponse = {
  FunctionError?: string;
  Payload: PayloadResponseV2 | PayloadResponseV3;
};

type InvokeResponseV2 = {
  promise: () => Promise<InvokeResponse>;
};

type PayloadResponseV3 = {
  transformToString: () => string;
};

type PayloadResponseV2 = string | Buffer | Uint8Array | Blob;

type LambdaV2 = {
  invoke: (params: { FunctionName: string; Payload: string; InvocationType: string }) => InvokeResponseV2;
};

type LambdaV3 = {
  invoke: (params: { FunctionName: string; Payload: string; InvocationType: string }) => Promise<InvokeResponse>;
};

type LambdaLike = LambdaV2 | LambdaV3;

function isLambdaV3Compatible() {
  return version >= NODE_MIN_VERSION_FOR_V3;
}

function isLambdaV3(lambda: LambdaLike): lambda is LambdaV3 {
  return isLambdaV3Compatible();
}

// do our best to get .errorMessage, but return object by default
function cleanError(payload?: PayloadResponseV2 | PayloadResponseV3): PayloadResponseV2 | PayloadResponseV3 {
  if (!payload) {
    return 'Error occurred, but error payload was not defined';
  }
  try {
    const errMsg = JSON.parse(payload.toString()).errorMessage;
    if (errMsg) {
      return errMsg;
    }
  } catch (e) {}
  return payload;
}

export abstract class BaseActionClient {
  private lambda: LambdaLike;
  private invocationRateLimit: RateLimitModule;

  public constructor(credentials: string, private arn: string) {
    const creds = credentials ? JSON.parse(credentials) : undefined;

    this.invocationRateLimit = rateLimitModule.createCounterFor(arn, 300);

    if (isLambdaV3Compatible()) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Lambda } = require('@aws-sdk/client-lambda');
      this.lambda = new Lambda({
        credentials: {
          accessKeyId: creds.AccessKeyId,
          secretAccessKey: creds.SecretAccessKey,
          sessionToken: creds.SessionToken,
        },
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Lambda = require('aws-sdk/clients/lambda');
      this.lambda = new Lambda(
        creds
          ? {
              credentials: {
                accessKeyId: creds.AccessKeyId,
                secretAccessKey: creds.SecretAccessKey,
                sessionToken: creds.SessionToken,
              },
            }
          : undefined,
      );
    }
  }

  private async invoke(FunctionName: string, Payload: string) {
    if (isLambdaV3(this.lambda)) {
      return this.lambda.invoke({
        FunctionName,
        Payload,
        InvocationType: 'RequestResponse',
      });
    } else {
      return this.lambda
        .invoke({
          FunctionName,
          Payload,
          InvocationType: 'RequestResponse',
        })
        .promise();
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected async execute<T>(request: object): Promise<T> {
    const invocationTimeStamp = getTimestampInSeconds();

    this.invocationRateLimit.checkRateFor(invocationTimeStamp);
    this.invocationRateLimit.incrementRateFor(invocationTimeStamp);

    const invocationRequestResult = await this.invoke(this.arn, JSON.stringify(request));

    if (invocationRequestResult.FunctionError) {
      throw new Error(`Error while attempting request: ${cleanError(invocationRequestResult.Payload)}`);
    }

    return JSON.parse(
      isLambdaV3Compatible()
        ? (invocationRequestResult.Payload as PayloadResponseV3).transformToString()
        : (invocationRequestResult.Payload as string),
    ) as T;
  }
}
