# Stealth Startup: Full Stack Engineering Exercise

## Database

This backend application connects to an external MongoDB database.

## Tech Stack

TypeScript + ESLint, `cors`, [`express-mongo-sanitize`](https://www.npmjs.com/package/express-mongo-sanitize), MongoDB, Mongoose, Nodemon, `ts-node`

## Getting Started

This project is a server built with Node.js & Express.

**NOTE**: To properly connect to the database within a local environment, you will need to add an `.env` file to the root folder of this project on your local machine. A key `MONGODB_URI` should be added to this file, whose value will be a connection URI string of the database hosted on MongoDB. This environment variable has intentionally been hidden for safety & security.

First, install dependencies:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

You may test routes with [Postman](https://www.postman.com/), or another similar tool.
