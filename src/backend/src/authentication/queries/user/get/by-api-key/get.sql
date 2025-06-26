with 
    w_api_key as (
        select
            key_id,
            user_id,
            date_part('epoch', expire_time) * 1000 as expire_time
        from
            auth.api_key
        where
            api_key = sha512(${apiKey})::text
        and
            expire_time > now()
    )
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
join
    w_api_key as ak
    on ak.user_id = u.id
;
