module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    ".(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest-config/file-mock.js",
    '.(css|less)$': '<rootDir>/jest-config/style-mock.js',
    '.(svg|archimate)$': '<rootDir>/jest-config/content-mock.js'
  },
  setupFiles: ['<rootDir>/jest-config/env-setup.js'],
};