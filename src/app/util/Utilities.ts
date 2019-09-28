export const currentTimeRecord = (): string => {
  const now = new Date(Date.now());

  const hour = now.getHours();
  const min = now.getMinutes();
  const h = addMissingZero(hour);
  const m = addMissingZero(min);

  return h + ":" + m;
};

const addMissingZero = (val: number, expectedLength: number = 2): string => {
  let result = "" + val;
  while (result.length < expectedLength) {
    result = "0" + result;
  }
  return result;
};
