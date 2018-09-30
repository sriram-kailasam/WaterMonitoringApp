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
  return db.createTable('temperature_data', {
    datetime: 'timestamp',
    temperature: 'decimal',
    water_body_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'temperature_data_water_body_id_fk',
        table: 'water_bodies',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    }
  });
};

exports.down = function(db) {
  return db.dropTable('temperature_data');
};

exports._meta = {
  "version": 1
};
