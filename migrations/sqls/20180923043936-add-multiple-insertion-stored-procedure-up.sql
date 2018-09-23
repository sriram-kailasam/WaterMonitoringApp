CREATE OR REPLACE FUNCTION insert_into_temperature_and_humidity_tables(
        datetime timestamp,
        minimum_temperature numeric,
        maximum_temperature numeric,
        humidity numeric,
        water_body_id int
    )
    RETURNS void AS $$

    BEGIN
        INSERT INTO temperature_data VALUES (
            datetime,
            minimum_temperature,
            maximum_temperature,
            water_body_id
        );

        INSERT INTO humidity_data VALUES (
            datetime,
            humidity,
            water_body_id
        );
    END;
$$ LANGUAGE plpgsql;