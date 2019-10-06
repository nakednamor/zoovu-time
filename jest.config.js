// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  // from ZP frontend
  roots: ['<rootDir>/src'],
  testRegex: '/__tests__/.*\\.spec\\.(js|jsx|ts|tsx)$',

  // modulePaths: ["<rootDir>/src/app/", "<rootDir>/src/app/util"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },


  // Automatically clear mock calls and instances between every test
  clearMocks: true,


  // The test environment that will be used for testing
  testEnvironment: "node",

};
