/*
 * create_users.js
 * Run as a Background Script (System Definition > Scripts - Background)
 * Prerequisite: roles/create_roles.js has already been executed.
 *
 * Creates demo users for Students and Librarians and assigns
 * the appropriate roles (u_student / u_librarian).
 */

(function createLibraryUsers() {

    var usersToCreate = [
        { user_name: 'jyothi.uggina',   first_name: 'Jyothi',   last_name: 'Uggina',   email: 'jyothi.uggina@lib.edu',   role: 'u_librarian' },
        { user_name: 'benny.syam',      first_name: 'Benny',    last_name: 'Syam',     email: 'benny.syam@lib.edu',      role: 'u_librarian' },
        { user_name: 'abdul.khadar',    first_name: 'Abdul',    last_name: 'Khadar',   email: 'abdul.khadar@lib.edu',    role: 'u_student' },
        { user_name: 'reshma.bheema',   first_name: 'Reshma',   last_name: 'Bheemanapalli', email: 'reshma.bheema@lib.edu', role: 'u_student' },
        { user_name: 'deekshith.bandi', first_name: 'Deekshith',last_name: 'Bandi',    email: 'deekshith.bandi@lib.edu', role: 'u_student' }
    ];

    usersToCreate.forEach(function (u) {
        var userGr = new GlideRecord('sys_user');
        userGr.addQuery('user_name', u.user_name);
        userGr.query();

        var userSysId;
        if (userGr.next()) {
            userSysId = userGr.getUniqueValue();
            gs.info('User already exists, reusing: ' + u.user_name);
        } else {
            userGr.initialize();
            userGr.user_name = u.user_name;
            userGr.first_name = u.first_name;
            userGr.last_name = u.last_name;
            userGr.email = u.email;
            userGr.active = true;
            userSysId = userGr.insert();
            gs.info('Created user: ' + u.user_name + ' (' + userSysId + ')');
        }

        // Look up the role sys_id
        var roleGr = new GlideRecord('sys_user_role');
        roleGr.addQuery('name', u.role);
        roleGr.query();

        if (!roleGr.next()) {
            gs.error('Role not found: ' + u.role + ' — run create_roles.js first.');
            return;
        }

        // Assign role if not already assigned
        var userRoleGr = new GlideRecord('sys_user_has_role');
        userRoleGr.addQuery('user', userSysId);
        userRoleGr.addQuery('role', roleGr.getUniqueValue());
        userRoleGr.query();

        if (userRoleGr.next()) {
            gs.info('Role already assigned: ' + u.role + ' -> ' + u.user_name);
        } else {
            userRoleGr.initialize();
            userRoleGr.user = userSysId;
            userRoleGr.role = roleGr.getUniqueValue();
            userRoleGr.insert();
            gs.info('Assigned role ' + u.role + ' to ' + u.user_name);
        }
    });

})();
