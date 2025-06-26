INSERT INTO registration.registered_user (
    registration_id,
    user_id
)
select
    rr.id,
    au.id
from
    registration.info as rr,
    auth.user as au
where
    rr.uuid = ${registrationId}
and
    au.uuid = ${userId}
returning
    id
;
