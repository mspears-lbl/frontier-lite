update
    auth.user
set
    first_name = ${firstName},
    last_name = ${lastName},
    email = ${email},
    password = ${password},
    organization = ${organization},
    status = ${status},
    role = ${role}
where 
    uuid = ${uuid}
;
