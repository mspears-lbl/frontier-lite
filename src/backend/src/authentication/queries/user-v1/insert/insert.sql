INSERT INTO auth.user (
    first_name,
    last_name,
    email,
    password,
    organization,
    status,
    created_date
)
values (
    ${firstName},
    ${lastName},
    ${email},
    ${password},
    ${organization},
    ${statusV2},
    coalesce(to_timestamp(${timestamp}), now())
)
returning
    id
;
