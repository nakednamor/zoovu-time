import { addMissingZero, removeLeadingZeros } from "../Utilities";

describe("addMissingZero(..)", () => {
  describe("without expected length", () => {
    for (let i = 0; i <= 9; i++) {
      const expected = "0" + i;
      test(`uses default length 2 and should transform ${i} to ${expected}`, () => {
        const actual = addMissingZero(i);
        expect(actual).toEqual(expected);
      });
    }

    test("should transform 20 to 20", () => {
      expect(addMissingZero(20)).toEqual("20");
    });
  });

  const expectedLength = 4;
  describe(`with expected length ${expectedLength}`, () => {
    for (let i = 0; i <= 9; i++) {
      const expected = "000" + i;
      test(`should transform ${i} to ${expected}`, () => {
        const actual = addMissingZero(i, expectedLength);
        expect(actual).toEqual(expected);
      });
    }

    test("should transform 1234 to 1234", () => {
      expect(addMissingZero(1234)).toEqual("1234");
    });
  });
});

const removeLeadingZerosSetup = {
  "01:12": 112,
  "10:56": 1056,
  "03:01": 301,
  "00:01": 1,
  "00:35": 35,
  "00:00": 0
};
describe("removeLeadingZeros(..)", () => {
  Object.keys(removeLeadingZerosSetup).forEach(input => {
    const expected = removeLeadingZerosSetup[input];
    test(`should transform ${input} to ${expected}`, () => {
      const actual = removeLeadingZeros(input);
      expect(actual).toEqual(expected);
    });
  });
});
