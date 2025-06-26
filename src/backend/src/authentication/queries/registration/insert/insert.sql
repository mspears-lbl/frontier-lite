INSERT INTO auth.registration_info (
    first_name,
    last_name,
    email,
    organization
) VALUES (
    ${firstName},
    ${lastName},
    ${email},
    ${organization}
)
returning
    id
;
