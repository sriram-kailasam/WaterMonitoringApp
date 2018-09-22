CREATE OR REPLACE FUNCTION notify_humidity_data_changed() RETURNS TRIGGER AS $humidity_trigger$
    BEGIN
        PERFORM pg_notify('humidity_change_channel', row_to_json(NEW)::text);
        RETURN NEW;
    END;
$humidity_trigger$ LANGUAGE plpgsql;

CREATE TRIGGER humidity_trigger AFTER INSERT OR UPDATE ON humidity_data
    FOR EACH ROW EXECUTE PROCEDURE notify_humidity_data_changed();