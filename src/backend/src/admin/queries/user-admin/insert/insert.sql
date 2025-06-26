INSERT INTO auth.user (
    uuid,
    first_name,
    last_name,
    email,
    password,
    role
) VALUES (
    ${uuid},
    ${firstName},
    ${lastName},
    ${email},
    ${password},
    101
)
returning
    id as "id",
    uuid as "uuid",
    first_name as "firstName",
    last_name as "lastName",
    email as "email",
    password as "password",
    role
;
