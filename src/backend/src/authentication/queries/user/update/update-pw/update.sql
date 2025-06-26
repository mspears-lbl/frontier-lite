update
    auth.user
set
    password = ${passwordHash}
where 
    uuid = ${uuid}
;
