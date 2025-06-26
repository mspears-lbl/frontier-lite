INSERT INTO auth.user (
    uuid,
    first_name,
    last_name,
    email,
    password
) VALUES (
    ${uuid},
    ${firstName},
    ${lastName},
    ${email},
    ${password}
)
returning
    id as "id",
    uuid as "uuid",
    first_name as "firstName",
    last_name as "lastName",
    email as "email",
    password as "password",
    role,
    status,
    extract(epoch from created_date) as created,
    extract(epoch from modified_date) as modified
;
