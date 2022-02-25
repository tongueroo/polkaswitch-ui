module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    // '/node_modules/',
    '/node_modules/(?!(lightweight-charts|fancy-canvas)/)',
  ],
  testEnvironment: 'jsdom',
  automock: false,
  roots: ['src/'],
  setupFilesAfterEnv: ['<rootDir>/jest/scripts/setupTests.js'],
  transform: {
    '\\.jsx?$': 'babel-jest',
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/__mocks__/styleMock.js',
  },
};
