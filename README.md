# Express Template

Node.js API template following MVC conventions.

By default, a [User](src/models/User.ts) and [Product](src/models/Product.ts) objects are modeled. Basic CRUD endpoints are defined in `/v1/products` and `/v1/users`.

## Installation

1. Create repository from [template](https://github.com/POWRFULCOW89/express-template/generate).

2. Install the dependencies:

    ```sh
    npm i
    ```

3. Run the tests:

    ```sh
    npm test
    ```

4. Start the server:

    ```sh
    npm start
    ```

5. Generate build:

    ```sh
    npm build
    ```

### Environment variables

- `MONGO_URI`. Connection string to a MongoDB cluster.
- `SAMPLE_TOKEN`. User token for testing.
- `SECRET`. Used for generating and validating passwords.
