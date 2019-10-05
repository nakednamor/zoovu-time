export const currentTimeRecord = (): string => {
  const now = new Date(Date.now());

  const hour = now.getHours();
  const min = now.getMinutes();
  const h = addMissingZero(hour);
  const m = addMissingZero(min);

  return h + ":" + m;
};

export const addMissingZero = (
  val: number,
  expectedLength: number = 2
): string => {
  let result = "" + val;
  while (result.length < expectedLength) {
    result = "0" + result;
  }
  return result;
};

export const log = (msg: string, obj?): void => {
  // tslint:disable-next-line:no-console
  console.log(msg);
  if (obj) {
    // tslint:disable-next-line:no-console
    console.log(obj);
  }
};

export const removeLeadingZeros = (val: string): number => {
  let tmp = val[val.length - 1];
  for (let i = 0; i < val.length - 1; i++) {
    if (val[i] !== "0" && val[i] !== ":") {
      break;
    } else {
      tmp = val[i] + tmp;
    }
  }

  return +tmp;
};
