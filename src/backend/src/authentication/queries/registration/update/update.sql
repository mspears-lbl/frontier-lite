update
    auth.registration_info
set
    registration_status_id = ${registrationStatus}
where
    uuid = ${id}
;
