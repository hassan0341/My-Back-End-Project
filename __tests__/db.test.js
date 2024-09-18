const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../db/app");
const endPoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end;
});

describe("GET /api", () => {
  test("Responds with an object describing all endpoints", () => {
    const expectedEndPoint = endPoints;
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;

        expect(endpoints).toEqual(expectedEndPoint);
      });
  });
});

describe("GET /api/topics", () => {
  test("GET 200: Responds with an array of topic objects", () => {
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
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200: Responds with an article object by ID", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        const expectedArticle = {
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(article).toMatchObject(expectedArticle);
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
  test("GET 200: Responds with articles object by ID with now a new property of comment_count", () => {
    return request(app)
      .get(`/api/articles/4`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(0);
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
  test("GET 400: Responds with an error when passed an invalid ID type", () => {
    return request(app)
      .get("/api/articles/mars")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: Responds with array of comments for given article ID", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const expectedComments = [
          {
            comment_id: 14,
            votes: 16,
            created_at: "2020-06-09T05:00:00.000Z",
            author: "icellusedkars",
            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
            article_id: 5,
          },
          {
            comment_id: 15,
            votes: 1,
            created_at: "2020-11-24T00:08:00.000Z",
            author: "butter_bridge",
            body: "I am 100% sure that we're not completely sure.",
            article_id: 5,
          },
        ];
        const { comments } = body;
        expect(comments.length).toBe(2);
        expect(comments).toEqual(expectedComments);
      });
  });
  test("GET 200: responds with an empty array when article ID exists but doesn't match any article ID in comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
  test("GET 200: Returns comment of correct amount when limit and page query applied", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=1&p=2")
      .expect(200)
      .then(({ body }) => {
        const expectedComment = [
          {
            comment_id: 15,
            votes: 1,
            created_at: "2020-11-24T00:08:00.000Z",
            author: "butter_bridge",
            body: "I am 100% sure that we're not completely sure.",
            article_id: 5,
          },
        ];
        const { comments } = body;
        expect(comments.length).toBe(1);
        expect(comments).toEqual(expectedComment);
      });
  });
  test("GET 400: Responds with an error when invalid limit or page inserted", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=abc&p=lul")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 400: Responds with an error when limit is negative", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=-5&p=2")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 400: Responds with an error when page is less than 1", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=1&p=0")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 404: Responds with error when the ID is non-existent", () => {
    return request(app)
      .get("/api/articles/83/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("error! ID not found");
      });
  });
  test("GET 400: Responds with an error when passed an invalid ID type", () => {
    return request(app)
      .get("/api/articles/mars/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET 200: Responds with an array of article objects sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET 200: Responds with articles filtered by topics", () => {
    return request(app)
      .get(`/api/articles?topic=cats`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET 200: Responds with articles sorted by votes in ascending order", () => {
    return request(app)
      .get(`/api/articles?sort_by=votes&order=asc`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("GET 200: Responds with articles sorted by comment_count in ascending order", () => {
    return request(app)
      .get(`/api/articles?sort_by=comment_count&order=asc`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSortedBy("comment_count", { ascending: true });
      });
  });
  test("GET 200: Responds with an empty array when there are no associated articles with the topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
  test("GET 200: Returns articles with default limit of 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article).toHaveProperty("total_count");
        });
      });
  });
  test("GET 200: Returns articles of correct amount when limit query applied", () => {
    return request(app)
      .get("/api/articles?limit=3")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(3);
        articles.forEach((article) => {
          expect(article).toHaveProperty("total_count");
        });
      });
  });
  test("GET 200: Responds with the correct articles for a specific limit and page", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(5);
      });
  });
  test("GET 200: Responds with an empty array when limit or page don't exist in database", () => {
    return request(app)
      .get("/api/articles?limit=999&p=999")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
  test("GET 400: Responds with an error when invalid limit or page inserted", () => {
    return request(app)
      .get("/api/articles?limit=abc&p=lul")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 400: Responds with an error when invalid sort_by column is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 400: Responds with an error when invalid order is provided", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test(`GET 404: Responds with error when topic inserted doesn't exist`, () => {
    return request(app)
      .get(`/api/articles?topic=planets`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Topic not found!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: Responds with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i am the body in the body",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("i am the body in the body");
      });
  });
  test("POST 400: Responds with error when request is missing properties", () => {
    const sendObj = {};
    return request(app)
      .post("/api/articles/5/comments")
      .send(sendObj)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request! Missing required fields");
      });
  });
  test("POST 404: Responds with an error when wrong endpoint inserted", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i am the body in the body",
    };
    return request(app)
      .post("/api/articoles/5/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Endpoint Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: Responds with the updated article", () => {
    const updatedArticle = { inc_votes: 20 };
    const expectedArticle = {
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      topic: "cats",
      author: "rogersop",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      created_at: "2020-08-03T13:14:00.000Z",
      votes: 20,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/5")
      .send(updatedArticle)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(expectedArticle);
      });
  });
  test(`PATCH 400: Responds with error when patch request is missing required data`, () => {
    const updatedArticle = {};
    request(app)
      .patch("/api/articles/5")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Missing required data");
      });
  });
  test(`PATCH 400: Responds with an error when patch request property is of invalid type`, () => {
    const updatedArticle = { inc_votes: "invalid" };
    return request(app)
      .patch("/api/articles/5")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test(`PATCH 400: Responds with an error when invalid ID is passed`, () => {
    const updatedArticle = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/cars")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test(`PATCH 404: Responds with an error when valid ID is passed, but does not exist in database`, () => {
    const updatedArticle = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/500")
      .send(updatedArticle)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ID does not exist");
      });
  });
  test("PATCH 404: Responds with an error when wrong endpoint inserted", () => {
    const updatedArticle = { inc_votes: 20 };
    return request(app)
      .patch("/api/articoles/5")
      .send(updatedArticle)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Endpoint Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: Responds with no content for ID inputted", () => {
    return request(app).delete("/api/comments/15").expect(204);
  });
  test(`DELETE 404: Responds with an error when ID doesn't exist`, () => {
    return request(app)
      .delete("/api/comments/150")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe(`ERROR! this comment doesn't exist`);
      });
  });
  test(`DELETE 400: Responds with an error when ID is of invalid format`, () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe(`Bad request`);
      });
  });
});

describe(`GET /api/users`, () => {
  test("GET 200: Responds with an array of user objects", () => {
    return request(app)
      .get(`/api/users`)
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET 200: Responds with a user by username inputted by the client", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  test("GET 404: Responds with an error when username is of valid type but not present in the database", () => {
    return request(app)
      .get("/api/users/bluecar")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error!, user not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH 200: Responds with the updated comment", () => {
    const patch = { inc_votes: 10 };
    const expectComment = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 26,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T12:17:00.000Z",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toEqual(expectComment);
      });
  });
  test(`PATCH 400: Responds with error when patch request is missing required data`, () => {
    const patch = {};
    request(app)
      .patch("/api/comments/1")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Missing required data");
      });
  });
  test(`PATCH 400: Responds with an error when patch request property is of invalid type`, () => {
    const patch = { inc_votes: "invalid" };
    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test(`PATCH 400: Responds with an error when invalid ID is passed`, () => {
    const patch = { inc_votes: 20 };
    return request(app)
      .patch("/api/comments/you")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test(`PATCH 404: Responds with an error when valid ID is passed, but does not exist in database`, () => {
    const updatedArticle = { inc_votes: 20 };
    return request(app)
      .patch("/api/comments/500")
      .send(updatedArticle)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ID does not exist");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST 201: Responds with the newly posted article", () => {
    const post = {
      author: "butter_bridge",
      title: "all tomorrows",
      body: "i am the one who knocks",
      topic: "cats",
      article_img_url:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    };
    return request(app)
      .post("/api/articles")
      .send(post)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          ...post,
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 400: Responds with and error when required fields are missing", () => {
    const post = {};
    return request(app)
      .post("/api/articles")
      .send(post)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("POST 400: Responds with and error when failing schema validation", () => {
    const post = {
      author: 7,
      title: 8,
      body: 8,
      topic: 8,
      article_img_url: 8,
    };
    return request(app)
      .post("/api/articles")
      .send(post)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("POST 201: Responds with the newly added topic", () => {
    const newTopic = {
      slug: "new_topic",
      description: "This is a new topic.",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toMatchObject(newTopic);
        expect(topic).toHaveProperty("slug", newTopic.slug);
        expect(topic).toHaveProperty("description", newTopic.description);
      });
  });
  test("POST 400:  Responds with and error when required fields are missing", () => {
    const newTopic = {};
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("POST 400: Responds with an error when failing schema validation", () => {
    const invalidTopic = {
      slug: 123,
      description: [],
    };

    return request(app)
      .post("/api/topics")
      .send(invalidTopic)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("POST 409: Responds with error when slug already exists", () => {
    const existingTopic = {
      description: "The man, the Mitch, the legend",
      slug: "mitch",
    };

    return request(app)
      .post("/api/topics")
      .send(existingTopic)
      .expect(409)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Topic already exists");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("DELETE 204: Responds with no content", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test(`DELETE 404: Responds with an error when ID doesn't exist`, () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe(`ERROR! this article doesn't exist`);
      });
  });
  test(`DELETE 400: Responds with an error when ID is of invalid format`, () => {
    return request(app)
      .delete("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe(`Bad request`);
      });
  });
});

describe("Undeclared endpoints", () => {
  test("ALL METHODS 404: Responds with an error for an endpoint not found", () => {
    return request(app)
      .get("/api/nothere")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ERROR! Endpoint Not Found");
      });
  });
});
