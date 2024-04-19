# Northcoders News API

Welcome to my NC News API Project!

## Description

NC News API allows you to access application data programmatically. The goal is to simulate the building of a real world backend service, similar to platforms like Reddit,
to deliver information to front-end architectures.

## Hosted version

You can check out a hosted version of the API [here](https://my-back-end-project.onrender.com)

## Getting Started

To run this on your local machine, follow these steps:

1. **Create Environment Files:**

   - Create two `.env` files:
     - For development environment variables, create a file named `.env.development`.
     - For test environment variables, create a file named `.env.test`.

2. **Find Database Name:**

   - Open the `setup.sql` file and find the database name.

3. **Configure Environment Variables:**
   - In the `.env.development` file, add the following line:
     ```
     PGDATABASE=database_name_here
     ```
   - In the `.env.test` file, add the following line:
     ```
     PGDATABASE=database_name_here_test
     ```

## Installation and Setup

1. **Clone the repository:**

   - In terminal, run:
     ```
     git clone https://github.com/hassan0341/My-Back-End-Project.git
     ```

2. **Install dependencies:**

   - In terminal, run:
     ```
     npm install
     ```

3. **Setup the Database:**

   - In terminal, run:
     ```
     npm run setup-dbs
     ```

4. **Seed the Database:**

   - In terminal, run:
     ```
     npm run seed
     ```

5. **Test the Database:**

   - In terminal, run:
     ```
     npm test
     ```

## Minimum Requirements

- Node.js version 21.6.1 or later
- PostreSQL version 14.11 or later
