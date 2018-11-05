
/* IMPORT */

import {Schema} from 'mongoose';

/* TYPES */

type mongooseToGraphQL = {
  ( name: string, schema: {} | Schema ): string;
  schema: Function;
  model: Function;
  plainObject: Function;
  type: Function;
};

/* EXPORT */

export {mongooseToGraphQL};
