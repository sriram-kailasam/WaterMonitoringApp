CREATE OR REPLACE FUNCTION insert_into_temperature_and_humidity_tables(
        datetime timestamp,
        temperature numeric,
        humidity numeric,
        water_body_id int
    )
    RETURNS void AS $$

    BEGIN
        INSERT INTO temperature_data VALUES (
            datetime,
            temperature,
            water_body_id
        );

        INSERT INTO humidity_data VALUES (
            datetime,
            humidity,
            water_body_id
        );

        PERFORM pg_notify('temperature_humidity_change_channel', json_build_object(
            'date', to_char(datetime, 'DD-MM-YYYY'),
            'time', to_char(datetime, 'HH24:MI:SS'),
            'temperature', temperature,
            'humidity', humidity,
            'waterBodyId', water_body_id
        )::text);
    END;
$$ LANGUAGE plpgsql;