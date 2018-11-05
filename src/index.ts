
/* IMPORT */

import cloneDeep = require ( 'lodash/cloneDeep' );
import isArray = require ( 'lodash/isArray' );
import isFunction = require ( 'lodash/isFunction' );
import isObject = require ( 'lodash/isObject' );
import isPlainObject = require ( 'lodash/isPlainObject' );
import isString = require ( 'lodash/isString' );
import transform = require ( 'lodash/transform' );
import uniqueId = require ( 'lodash/uniqueId' );
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

  schema = cloneDeep ( schema );

  transform ( schema, ( acc: any, val: any, key: string ) => {

    const sub = isArray ( val ) ? val[0] : val;

    if ( !isPlainObject ( sub ) || sub.hasOwnProperty ( 'type' ) ) return;

    const subName = `${name}_${uniqueId ()}`;

    schema[key] = isArray ( val ) ? [subName] : subName;

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

  if ( isString ( type ) ) {

    return type;

  } else if ( isArray ( type ) ) {

    const converted = type.length ? M2G.type ( type[0] ) : '';

    return `[${converted}]`;

  } else if ( isPlainObject ( type ) ) {

    if ( type.hasOwnProperty ( 'type' ) ) {

      const required = !!type.required ? '!' : '',
            converted = M2G.type ( type.type );

      return `${converted}${required}`;

    } else {

      return M2G.plainObject ( type );

    }

  } else if ( isFunction ( type ) ) {

    if ( 'modelName' in type ) {

      return type['modelName'];

    } else if ( 'schemaName' in type ) {

      switch ( type['schemaName'] ) {

        case 'ObjectId': return 'ID';
        // case Mixed: return; //TODO: Implement

      }

    }

  } else if ( isObject ( type ) && 'childSchemas' in type && 'obj' in type ) { // Is a Mongoose's Schema

    return M2G.plainObject ( type['obj'] );

  }

  throw new Error ( '[mongoose-to-graphql] Type conversion not supported' );

};

/* EXPORT */

const {schema, model, plainObject, type} = M2G;

export = Object.assign ( M2G as mongooseToGraphQL, { default: M2G as mongooseToGraphQL, schema, model, plainObject, type } );
