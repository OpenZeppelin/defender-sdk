export function getMillisSince(date: Date): number {
  return new Date().getTime() - date.getTime();
}
