'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('water_bodies', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },

    name: 'string'
  });
};

exports.down = function(db) {
  return db.dropTable('water_bodies');
};

exports._meta = {
  "version": 1
};
