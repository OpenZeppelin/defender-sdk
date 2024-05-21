export const getTimestampInSeconds = (): number => Math.floor(Date.now() / 1000);

export const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond));
