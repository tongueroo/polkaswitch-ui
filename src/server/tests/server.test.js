const request = require("supertest");
const app = require("../app");
const path = require('path');

const mockFs = require('mock-fs');

beforeAll(() => {
  mockFs({
    'dist/index.html': mockFs.load(path.resolve(__dirname, 'mockFiles/mockIndex.html'))
  });
});

describe("Test important paths", () => {
  test("/ should return 200", async (done) => {
    const result = await request(app).get('/');
    expect(result.status).toBe(200);
    done();
  });

  test("/health should return 200", async (done) => {
    const result = await request(app).get('/health');
    expect(result.status).toBe(200);
    done();
  });
});

afterAll(() => {
  mockFs.restore();
});
