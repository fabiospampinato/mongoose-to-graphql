# Mongoose to Graphql

![Issues](https://img.shields.io/github/issues/fabiospampinato/mongoose-to-graphql.svg)
[![NPM version](https://img.shields.io/npm/v/mongoose-to-graphql.svg)](https://www.npmjs.com/package/mongoose-to-graphql)

Converts a Mongoose schema to its GraphQL representation.

## Install

```shell
$ npm install --save mongoose-to-graphql
```

## Usage

```js
import MongooseToGraphql from 'mongoose-to-graphql';

MongooseToGraphql.type ({
  type: [String],
  required: true
}); // [String]!

MongooseToGraphql ( 'Book', {
  title: String,
  category: Number
}); // type Book {
    //   title: String
    //   category: Float
    // }
```

## API

### `MongooseToGraphQL ( ...args )`

Calls `.schema` with `...args`.

### `.schema ( name: string, schema: {} | mongoose.Schema ): string`

Converts an object or a Mongoose schema to its GraphQL string representation.

### `.model ( model: Function ): string`

Converts a Mongoose model to its GraphQL string representation.

### `.plainObject ( obj: {} ): string`

Converts a plain object to its GraphQL string representation.

### `.type ( type: any ): string`

Converts a supported type to its GraphQL string representation, or throws an error.

## Related

- [mongease](https://github.com/fabiospampinato/mongease) - Tiny wrapper around Mongoose for easier creation of schemas and models. Supports plugins.
- [mongease-graphql](https://github.com/fabiospampinato/mongease-graphql) - Mongease plugin for adding support to GraphQL schemas creation.
- [mongease-graphql-builder](https://github.com/fabiospampinato/mongease-graphql-builder) - Module for auto-generating simple GraphQL queries from Mongease descriptions.

## License

MIT © Fabio Spampinato
