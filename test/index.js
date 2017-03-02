
/* IMPORT */

import {describe} from 'ava-spec';
import callSpy from 'call-spy';
import mongoose from 'mongoose';
import M2G, {schema, model, plainObject, type} from '../dist'

/* MONGOOSE TO GRAPHQL */

describe ( 'Mongoose to Graphql', it => {

  it ( 'Passes everything to `.schema`', t => {

    const args = [{}, true],
          res = {};

    M2G.schema = callSpy ( schema, res );

    M2G ( ...args );

    t.true ( res.called );
    t.deepEqual ( res.arguments, args );

  });

  describe ( 'schema', it => {

    it ( 'Converts a schema', t => {

      const name = 'Test',
            obj = {
              title: String,
              category: Number
            };

      t.is ( schema ( name, obj ).replace ( /\s+/g, ' ' ), 'type Test { title: String category: Float }' );

    });

  });

  describe ( 'model', it => {

    it ( 'Converts a model', t => {

      const S = new mongoose.Schema ({
        title: String,
        category: Number
      });
      const M = mongoose.model ( 'TestModel', S );
      const res = {};

      M2G.schema = callSpy ( schema, res );

      model ( M );

      t.true ( res.called );
      t.is ( res.arguments[0], 'TestModel' );
      t.is ( res.return.replace ( /\s+/g, ' ' ), 'type TestModel { title: String category: Float }' );

    });

  });

  describe ( 'plainObject', it => {

    it ( 'Converts plain objects', t => {

      const obj = {
        title: String,
        category: Number
      };

      t.is ( plainObject ( obj ).replace ( /\s+/g, ' ' ), '{ title: String category: Float }' );

    });

  });

  describe ( 'type', it => {

    it ( 'Converts simple types', t => {

      const map = {
        'String': String,
        'Float': Number,
        'Date': Date,
        'Boolean': Boolean,
        'ID': mongoose.Schema.Types.ObjectId,
        '[]': Array,
        'CustomType': 'CustomType',
        '[String]': [String],
        'String': { type: String }
      };

      for ( let converted in map ) {

        t.is ( type ( map[converted] ), converted );

      }

    });

    it ( 'Converts plain objects', t => {

      const plain = { category: Number },
            res = {};

      M2G.plainObject = callSpy ( plainObject, res );

      type ( plain );

      t.true ( res.called );

    });

    it ( 'Converts Mongoose\'s schemas', t => {

      const schema = new mongoose.Schema ({ category: Number }),
            res = {};

      M2G.plainObject = callSpy ( plainObject, res );

      type ( schema );

      t.true ( res.called );
      t.deepEqual ( res.arguments, [schema.obj] );

    });

    it ( 'Converts Mongoose\'s models', t => {

      const schema = new mongoose.Schema ({ category: Number }),
            model = mongoose.model ( 'TestType', schema ),
            res = {};

      t.is ( type ( model ), 'TestType' );

    });

    it ( 'Supports required types', t => {

      const obj = { type: String, required: true };

      t.is ( type ( obj ), 'String!' );

    });

    it ( 'Throws an error if the type is not supported', t => {

      t.throws ( () => type ( t ), /Type conversion not supported/ );

    });

  });

});
