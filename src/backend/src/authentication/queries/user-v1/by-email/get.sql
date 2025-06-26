select
    id as "id",
    user_id as "userId",
    first_name as "firstName",
    last_name as "lastName",
    email as "email",
    level_id as "levelId",
    created_date as "createdDate",
    comments as "comments",
    password as "password",
    status_id as "statusId"
from
    auth.user_v1 as u
where 
    lower(trim(u.email)) = lower(trim(${email}))
;
