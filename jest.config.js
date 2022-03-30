module.exports = {
  verbose: true,
  roots: ['src/'],
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/server/tests/**/*.test.js"],
    },
    {
      displayName: "frontend",
      testURL: 'http://localhost/',
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
      },
      transformIgnorePatterns: [
        // '/node_modules/',
        '/node_modules/(?!(lightweight-charts|fancy-canvas)/)',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest/scripts/setupTests.js'],
      transform: {
        '\\.jsx?$': 'babel-jest',
        '\\.(css|less|sass|scss)$': '<rootDir>/jest/__mocks__/styleMock.js',
      },
    }
  ],
  automock: false,
};
