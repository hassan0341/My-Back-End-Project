const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../db/app");
const { fetchEndpoint } = require("../db/models/topics-model");

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

describe("/api", () => {
  test("responds with an object describing all endpoints", () => {
    const expectedEndPoint = fetchEndpoint();
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoint } = body;

        expect(endpoint).toEqual(expectedEndPoint);
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an article object by ID", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET 404: respond with an error for an ID that is not present", () => {
    return request(app)
      .get("/api/articles/34566")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("error! ID not found");
      });
  });
});
