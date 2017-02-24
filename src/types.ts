
/* TYPES */

type mongooseToGraphQL = {
  (): string;
  schema: Function;
  model: Function;
  plainObject: Function;
  type: Function;
};

/* EXPORT */

export {mongooseToGraphQL};
