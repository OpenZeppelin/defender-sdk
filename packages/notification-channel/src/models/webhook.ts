export type SignatureVerificationParams = {
  body: any;
  signature: string;
  timestamp: string;
  secret: string;
  validityInMs?: number;
};
