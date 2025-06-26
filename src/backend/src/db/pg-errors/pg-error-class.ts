
export interface IPgErrorClass {
    code: string;
    description: string;
}

const pgErrorClasses = new Array<IPgErrorClass>();

pgErrorClasses.push({code: '00', description: 'Successful Completion'});
pgErrorClasses.push({code: '01', description: 'Warning'});
pgErrorClasses.push({code: '02', description: 'No Data (this is also a warning class per the SQL standard)'});
pgErrorClasses.push({code: '03', description: 'SQL Statement Not Yet Complete'});
pgErrorClasses.push({code: '08', description: 'Connection Exception'});
pgErrorClasses.push({code: '09', description: 'Triggered Action Exception'});
pgErrorClasses.push({code: '0A', description: 'Feature Not Supported'});
pgErrorClasses.push({code: '0B', description: 'Invalid Transaction Initiation'});
pgErrorClasses.push({code: '0F', description: 'Locator Exception'});
pgErrorClasses.push({code: '0L', description: 'Invalid Grantor'});
pgErrorClasses.push({code: '0P', description: 'Invalid Role Specification'});
pgErrorClasses.push({code: '0Z', description: 'Diagnostics Exception'});
pgErrorClasses.push({code: '20', description: 'Case Not Found'});
pgErrorClasses.push({code: '21', description: 'Cardinality Violation'});
pgErrorClasses.push({code: '22', description: 'Data Exception'});
pgErrorClasses.push({code: '23', description: 'Integrity Constraint Violation'});
pgErrorClasses.push({code: '24', description: 'Invalid Cursor State'});
pgErrorClasses.push({code: '25', description: 'Invalid Transaction State'});
pgErrorClasses.push({code: '26', description: 'Invalid SQL Statement Name'});
pgErrorClasses.push({code: '27', description: 'Triggered Data Change Violation'});
pgErrorClasses.push({code: '28', description: 'Invalid Authorization Specification'});
pgErrorClasses.push({code: '2B', description: 'Dependent Privilege Descriptors Still Exist'});
pgErrorClasses.push({code: '2D', description: 'Invalid Transaction Termination'});
pgErrorClasses.push({code: '2F', description: 'SQL Routine Exception'});
pgErrorClasses.push({code: '34', description: 'Invalid Cursor Name'});
pgErrorClasses.push({code: '38', description: 'External Routine Exception'});
pgErrorClasses.push({code: '39', description: 'External Routine Invocation Exception'});
pgErrorClasses.push({code: '3B', description: 'Savepoint Exception'});
pgErrorClasses.push({code: '3D', description: 'Invalid Catalog Name'});
pgErrorClasses.push({code: '3F', description: 'Invalid Schema Name'});
pgErrorClasses.push({code: '40', description: 'Transaction Rollback'});
pgErrorClasses.push({code: '42', description: 'Syntax Error or Access Rule Violation'});
pgErrorClasses.push({code: '44', description: 'WITH CHECK OPTION Violation'});
pgErrorClasses.push({code: '53', description: 'Insufficient Resources'});
pgErrorClasses.push({code: '54', description: 'Program Limit Exceeded'});
pgErrorClasses.push({code: '55', description: 'Object Not In Prerequisite State'});
pgErrorClasses.push({code: '57', description: 'Operator Intervention'});
pgErrorClasses.push({code: '58', description: 'System Error (errors external to PostgreSQL itself)'});
pgErrorClasses.push({code: '72', description: 'Snapshot Failure'});
pgErrorClasses.push({code: 'F0', description: 'Configuration File Error'});
pgErrorClasses.push({code: 'HV', description: 'Foreign Data Wrapper Error (SQL/MED)'});
pgErrorClasses.push({code: 'P0', description: 'PL/pgSQL Error'});
pgErrorClasses.push({code: 'XX', description: 'Internal Error'});
