CREATE PROCEDURE greet AS $$
BEGIN
    dbms_output.put_line("Hello");
END;
LANGUAGE plpgsql;

EXECUTE greet;
