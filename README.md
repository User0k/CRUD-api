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

### Product Model

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "inStock": boolean
}
```

> **_NOTE:_** You don't need to provide the product id. Instead its creation depends on the server.

### Endpoints and Supported Methods

- **GET** `/api/products` is used to get all products
  - Server answers with `status code` **200** and all products records
- **GET** `/api/products/{productId}`
  - Server answers with `status code` **200** and record if product with this id is found
  - Server answers with `status code` **400** and _No correct UUID provided_ message if `productId` is invalid
  - Server answers with `status code` **404** and _Product with this id not found_ message if record with `id === productId` doesn't exist
- **POST** `/api/products` is used to create record about new product and store it in database
  - Server answers with `status code` **201** and newly created record
  - Server answers with `status code` **400** and specific validation messages (e.g., _Name must be a string_, _Price must be greater than 0_, etc.)
- **PUT** `/api/products/{productId}` is used to update existing product
  - Server answers with `status code` **200** and updated record
  - Server answers with `status code` **400** and _No correct UUID provided_ message if `productId` is invalid
  - Server answers with `status code` **404** and _Product with this id not found_ message if record with `id === productId` doesn't exist
- **DELETE** `/api/products/{productId}` is used to delete existing product from database
  - Server answers with `status code` **204** if the record is found and deleted
  - Server answers with `status code` **400** and _No correct UUID provided_ message if `productId` is invalid
  - Server answers with `status code` **404** and _Product with this id not found_ message if record with `id === productId` doesn't exist
- **Any Incorrect** method or not supported endpoint
  - Server answers with `status code` **404** and helpful hints about available endpoints
- **Server error**
  - Server answers with `status code` **500** and message _Internal server error_

## Usage Example

**Get All Products:**

```bash
GET http://localhost:4000/api/products
```

**Create Product:**

```bash
POST http://localhost:4000/api/products \
JSON '{"name": "Laptop", "description": "Gaming laptop", "price": 1299.99, "category": "Electronics", "inStock": true}'
```

**Update Product:**

```bash
PUT http://localhost:4000/api/products/{id} \
JSON '{"name": "Gaming Laptop", "description": "Gaming laptop", "price": 1499.99, "category": "Electronics", "inStock": true}'
```

**Delete Product:**

```bash
DELETE http://localhost:4000/api/products/{id}
```

## How Load Balancer Works

Load balancer listens for requests on your port (`4000` by default), workers are set on `port + 1` each limited by threads of your system. 
For example, if you have `12 threads`, you will get 11 workers that start from `4001` to `4011` port. For simplicity, you will get messages from balancer and worker in terminal when they are ready. 
Workers use *Round-robin algorithm*: each subsequent request is sent to worker on `port + 1` relative to the previous one. If the circle is over (`4011` port is hit in previous response), it starts from the first one (`4001`).
To examine this behavior you can also see a message from worker with its `port`, `method` and `url`. See the exmaple from my machine:

![load-balancer](https://github.com/user-attachments/assets/8121d334-a3b7-4ba9-a501-4086c8b06622)

