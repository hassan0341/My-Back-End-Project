const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../db/app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end;
});

describe("/api/topics", () => {
  test("GET 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  test("GET 404: responds with not found when wrong endpoint is entered", () => {
    return request(app)
      .get("/api/tupacs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ERROR! Endpoint Not Found");
      });
  });
});
