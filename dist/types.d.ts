declare type mongooseToGraphQL = {
    (): string;
    schema: Function;
    model: Function;
    plainObject: Function;
    type: Function;
};
export { mongooseToGraphQL };
