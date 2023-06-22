import { Hex } from "./transactions";


export interface SignMessagePayload {
	message: Hex;
}

export interface SignedMessagePayload {
  sig: Hex;
  r: Hex;
  s: Hex;
  v: number;
}

export interface SignTypedDataPayload {
  domainSeparator: Hex;
  hashStructMessage: Hex;
}

export type JsonRpcResponse = {
  id: number | null;
  jsonrpc: '2.0';
  result: any;
  error?: {
    code: number;
    message: string;
    data?: string;
  };
};
