
/* IMPORT */

import * as _ from 'lodash';
import {Schema} from 'mongoose';
import {mongooseToGraphQL} from './types';

/* MONGOOSE TO GRAPHQL */

//TODO: Add support for { type: Something: ref: 'Model' }

const M2G = function ( ...args ) {

  return M2G.schema ( ...args );

} as mongooseToGraphQL;

/* SCHEMA */

M2G.schema = function ( name: string, schema: {} | Schema ): string {

  if ( 'childSchemas' in schema && 'obj' in schema ) return M2G.schema ( name, schema.obj ); // Is a Mongoose's Schema

  const types: string[] = [];

  schema = _.cloneDeep ( schema );

  _.transform ( schema, ( acc, val, key: string ) => {

    const sub = _.isArray ( val ) ? val[0] : val;

    if ( !_.isPlainObject ( sub ) || sub.hasOwnProperty ( 'type' ) ) return;

    const subName = `${name}_${_.uniqueId ()}`;

    schema[key] = _.isArray ( val ) ? [subName] : subName;

    types.push ( M2G.schema ( subName, sub ) );

  });

  types.push ( `type ${name} ${M2G.plainObject ( schema )}` );

  return types.join ( '\n' );

};

/* MODEL */

M2G.model = function  ( model: Function ): string {

  return M2G.schema ( model['modelName'], model['schema'] );

};

/* PLAIN OBJECT */

M2G.plainObject = function ( obj: {} ): string {

  const types: string[] = [];

  for ( let key in obj ) {

    if ( !obj.hasOwnProperty ( key ) ) continue;

    types.push ( `${key}: ${M2G.type ( obj[key] )}` );

  }

  return `{
    ${types.join ( '\n' )}
  }`;

};

/* TYPE */

M2G.type = function ( type ): string { //TODO: Add support for JSON

  switch ( type ) {

    case String: return 'String';
    case Number: return 'Float'; //FIXME: What if we want an Int?
    case Date: return 'Date';
    // case Buffer: return; //TODO: Implement
    case Boolean: return 'Boolean';
    case Array: return '[]';

  }

  if ( _.isString ( type ) ) {

    return type;

  } else if ( _.isArray ( type ) ) {

    const converted = type.length ? M2G.type ( type[0] ) : '';

    return `[${converted}]`;

  } else if ( _.isPlainObject ( type ) ) {

    if ( type.hasOwnProperty ( 'type' ) ) {

      const required = !!type.required ? '!' : '',
            converted = M2G.type ( type.type );

      return `${converted}${required}`;

    } else {

      return M2G.plainObject ( type );

    }

  } else if ( _.isFunction ( type ) ) {

    if ( 'modelName' in type ) {

      return type.modelName;

    } else if ( 'schemaName' in type ) {

      switch ( type.schemaName ) {

        case 'ObjectId': return 'ID';
        // case Mixed: return; //TODO: Implement

      }

    }

  } else if ( _.isObject ( type ) && 'childSchemas' in type && 'obj' in type ) { // Is a Mongoose's Schema

    return M2G.plainObject ( type['obj'] );

  }

  throw new Error ( '[mongoose-to-graphql] Type conversion not supported' );

};

/* EXPORT */

const {schema, model, plainObject, type} = M2G;

export default M2G;
export {schema, model, plainObject, type};
