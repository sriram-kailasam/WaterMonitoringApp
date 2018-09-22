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
  return db.createTable('humidity_data', {
    datetime: 'timestamp',
    humidity: 'decimal',
    water_body_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'humidity_data_water_body_id_fk',
        table: 'water_bodies',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('humidity_data');
};

exports._meta = {
  "version": 1
};
