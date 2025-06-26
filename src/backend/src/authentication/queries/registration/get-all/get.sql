select
	i.uuid as "id",
	i.first_name as "firstName",
	i.last_name as "lastName",
	i.email as "email",
	i.organization as "organization",
	i.registration_status_id as "registrationStatus",
	extract(epoch from i.created_date) as "created",
	extract(epoch from i.modified_date) as "modified",
	case
		when au.id is not null then true
		else false
	end as "hasAccount"
from
	auth.registration_info as i
left join
	auth.user as au
	on lower(trim(au.email)) = lower(trim(i.email))
order by
	i.created_date desc
;
