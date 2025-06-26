INSERT INTO registration.info (
    data
) VALUES (
    ${data}
)
returning
    id
;
