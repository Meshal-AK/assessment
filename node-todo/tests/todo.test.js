const request = require("supertest");
const fs = require("fs");
const app = require("../src/app");
const setupDatabase = require("./fixtures/db");
const findTodoId = require("../src/utils/findTodoId");

beforeEach(setupDatabase);

test("Should create a new a todo with an Id of 4", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      done: true,
      priority: 5,
    })
    .expect("Content-Type", /json/)
    .expect(201);

  // Assert about the response
  expect(response.body).toMatchObject({
    text: "Test Four",
    done: true,
    priority: 5,
    id: "4",
  });

  // Assert that the database was changed correctly
  const rawData = fs.readFileSync(process.env.DATABASE);
  const data = JSON.parse(rawData);
  const { todo } = findTodoId(data, "4");
  expect(todo).not.toBeNull();
});

test("Should create a new a todo with an Id of 4 with only default values of priority and done", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
    })
    .expect("Content-Type", /json/)
    .expect(201);

  // Assert about the response
  expect(response.body).toMatchObject({
    text: "Test Four",
    done: false,
    priority: 3,
    id: "4",
  });
});

test("Should fail if id is given", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      id: 0,
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    id: "id is not allowed",
  });
});

test("Should fail if text contains non english words", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test 4",
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    text:
      "text with value Test 4 fails to match the required pattern: /^[a-zA-Z ]+$/",
  });
});

test("Should fail if text is empty", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "",
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    text: "text is not allowed to be empty",
  });
});

test("Should fail if priority is a non number", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      priority: "One",
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    priority: "priority must be a number",
  });
});

test("Should fail if priority is not an integer", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      priority: 4.9,
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    priority: "priority must be an integer",
  });
});

test("Should fail if priority is greater than 5", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      priority: 6,
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    priority: "priority must be less than or equal to 5",
  });
});

test("Should fail if priority is less than 1", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      priority: 0,
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    priority: "priority must be greater than or equal to 1",
  });
});

test("Should fail if done is a non boolean", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      text: "Test Four",
      done: 1,
    })
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    done: "done must be a boolean",
  });
});

test("Should get all non expired todos", async () => {
  const response = await request(app)
    .get("/todos")
    .send()
    .expect("Content-Type", /json/)
    .expect(200);

  // Assert about the response
  expect(response.body).toMatchObject([
    { done: true, id: "1", priority: 3, text: "Test One" },
    { done: true, id: "3", priority: 3, text: "Test Three" },
  ]);
});

test("Should get Test One", async () => {
  const response = await request(app)
    .get("/todos/1")
    .send()
    .expect("Content-Type", /json/)
    .expect(200);

  // Assert about the response
  expect(response.body).toMatchObject({
    done: true,
    id: "1",
    priority: 3,
    text: "Test One",
  });
});

test("Should fail to get expired Test Two", async () => {
  const response = await request(app)
    .get("/todos/2")
    .send()
    .expect("Content-Type", /json/)
    .expect(400);

  // Assert about the response
  expect(response.body).toMatchObject({
    error: "Todo not found",
  });
});

test("Should fail if todo doesn't exist", async () => {
  const response = await request(app)
    .get("/todos/999")
    .send()
    .expect("Content-Type", /json/)
    .expect(400);

  // Assert about the response
  expect(response.body).toMatchObject({
    error: "Todo not found",
  });
});

test("Should fail if parameter isn't valid", async () => {
  const response = await request(app)
    .get("/todos/one")
    .send()
    .expect("Content-Type", /json/)
    .expect(422);

  // Assert about the response
  expect(response.body).toMatchObject({
    idParam: "idParam must be a number",
  });
});

test("Should change from Text One to Hello and done should be false", async () => {
  const response = await request(app)
    .put("/todos/1")
    .send({
      text: "Hello",
      done: false,
    })
    .expect("Content-Type", /json/)
    .expect(200);

  // Assert about the response
  expect(response.body).toMatchObject({
    done: false,
    id: "1",
    priority: 3,
    text: "Hello",
  });
});

test("Should delete Text One", async () => {
  const response = await request(app)
    .delete("/todos/1")
    .send()
    .expect("Content-Type", /json/)
    .expect(200);

  // Assert about the response
  expect(response.body).toMatchObject({
    text: "Test One",
    done: true,
    priority: 3,
    id: "1",
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
