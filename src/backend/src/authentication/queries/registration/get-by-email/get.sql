select
	i.uuid as "id",
	i.first_name as "firstName",
	i.last_name as "lastName",
	i.email as "email",
	i.organization as "organization",
	i.registration_status_id as "registrationStatus",
	i.created_date as "created",
	i.modified_date as "modified"
from
	auth.registration_info as i
left join
	auth.user as au
	on trim(lower(au.email)) = trim(lower(i.email))
where
	trim(lower(i.email)) = trim(lower(${email}))
order by
	i.created_date desc
;
