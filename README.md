# CRUD API

A simple RESTful API for user management built with Node.js and TypeScript. Features in-memory database, load balancing, and comprehensive testing.

## Features

- RESTful CRUD operations for user management
- In-memory database with UUID-based storage
- Multi-process load balancing support
- API test cases
- TypeScript with full type safety

## Installation and setup

```bash
git clone https://github.com/User0k/CRUD-api.git
cd CRUD-api
git checkout dev
npm install
```

Rename `.env.example` file into `.env` and provide the port you want the app is run on (the default port is 4000).

## Running the Application and Tests

**Development Mode**

```bash
npm run start:dev
```

You must see the `Server is running on port YOUR_PORT.` message in terminal when the server is ready.

**Production Mode**

```bash
npm run start:prod
```

**Load Balancer Mode**

```bash
npm run start:multi
```

[How load balancer works](#how-load-balancer-works)

**Testing**

```bash
npm run test
```

### User Model

```json
{
  "id": "uuid",
  "username": "string",
  "age": "number",
  "hobbies": ["string"]
}
```

> **_NOTE:_** You don't need to provide the user id (you can but the server will not accept it). Instead its creation depends on the server.

### Endpoints and Supported Methods
- **GET** `api/users` is used to get all persons
  - Server answers with `status code` **200** and all users records
- **GET** `api/users/{userId}`
  - Server answers with `status code` **200** and record if user with this id is found
  - Server answers with `status code` **400** and *No correct UUID provided* message if `userId` is invalid
  - Server answers with `status code` **404** and *User with this id not found* message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
  - Server answers with `status code` **201** and newly created record
  - Server answers with `status code` **400** and *User should have username, age and hobbies fields* message if request `body` does not contain **required** fields
- **PUT** `api/users/{userId}` is used to update existing user
  - Server answers with `status code` **200** and updated record
  - Server answers with `status code` **400** and *No correct UUID provided* message if `userId` is invalid
  - Server answers with `status code` **404** and *User with this id not found* message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
  - Server answers with `status code` **204** if the record is found and deleted
  - Server answers with `status code` **400** and *No correct UUID provided* message if `userId` is invalid
  - Server answers with `status code` **404** and *User with this id not found* message if record with `id === userId` doesn't exist
- **Any Incorrect** method or not supported enpoint
  -  Server answers with `status code` **404**
- **Server error**
  - Server answers with `status code` **500**  and message *Internal server error*

## Usage Example

**Get All Users:**

```bash
GET http://localhost:4000/api/users
```

**Create User:**

```bash
POST http://localhost:4000/api/users \
JSON '{"username": "John", "age": 30, "hobbies": ["coding", "gaming"]}'
```

**Update User:**

```bash
PUT http://localhost:4000/api/users/{id} \
JSON '{"username": "Alice", "age": 25, "hobbies": ["reading"]}'
```

**Delete User:**

```bash
DELETE http://localhost:4000/api/users/{id}
```

## How Load Balancer Works

Load balancer listens for requests on your port (`4000` by default), workers are set on `port + 1` each limited by threads of your system. 
For example, if you have `12 threads`, you will get 11 workers that start from `4001` to `4011` port. For simplicity, you will get messages from balancer and worker in terminal when they are ready. 
Workers use *Round-robin algorithm*: each subsequent request is sent to worker on `port + 1` relative to the previous one. If the circle is over (`4011` port is hit in previous response), it starts from the first one (`4001`).
To examine this behavior you can also see a message from worker with its `port`, `method` and `url`. See the exmaple from my machine:

![load-balancer](https://github.com/user-attachments/assets/d9140aa4-7062-4f06-8c0d-697f30475959)
