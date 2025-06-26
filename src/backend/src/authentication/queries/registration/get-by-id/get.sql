select
	i.uuid as id,
	i.data,
	i.status_id as status,
	extract(epoch from i.timestamp) as timestamp,
	au.uuid as "userId",
	case
		when emu.id is not null then
			true
		else
			false
	end as "emailExists"
from
	registration.info as i
left join
	registration.registered_user as ru
	on ru.registration_id = i.id
left join
	auth.user as au
	on au.id = ru.user_id
left join
	auth.user as emu
	on lower(trim(emu.email)) = lower(trim(i.data->'contactInfo'->>'email'))
where
	i.uuid = ${id}
;
