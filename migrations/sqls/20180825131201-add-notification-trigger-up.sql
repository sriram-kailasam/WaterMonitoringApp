CREATE OR REPLACE FUNCTION notify_temperature_data_changed() RETURNS TRIGGER AS $temperature_trigger$
    BEGIN
        PERFORM pg_notify('temperature_change_channel', row_to_json(NEW)::text);
        RETURN NEW;
    END;
$temperature_trigger$ LANGUAGE plpgsql;

CREATE TRIGGER temperature_trigger AFTER INSERT OR UPDATE ON temperature_data
    FOR EACH ROW EXECUTE PROCEDURE notify_temperature_data_changed();