INSERT INTO auth.user (
    first_name,
    last_name,
    email,
    organization,
    password
) VALUES (
    ${firstName},
    ${lastName},
    ${email},
    ${organization},
    ${password}
)
returning
	id
;
