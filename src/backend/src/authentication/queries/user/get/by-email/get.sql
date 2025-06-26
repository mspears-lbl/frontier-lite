select
    u.id as "id",
    u.uuid as "uuid",
    u.first_name as "firstName",
    u.last_name as "lastName",
    u.email as "email",
    u.password as "passwordHash",
    u.role as "role",
    u.status as "status",
    comments as "comments",
    extract(epoch from created_date) as created,
    extract(epoch from modified_date) as modified
from
    auth.user as u
where 
    lower(trim(u.email)) = lower(trim(${email}))
;
