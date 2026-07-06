/*
 * create_roles.js
 * Run as a Background Script (System Definition > Scripts - Background)
 * Logged in as: administrator
 *
 * Creates two custom roles used to separate access and responsibilities
 * across the Library Management System:
 *   - u_student
 *   - u_librarian
 */

(function createLibraryRoles() {

    var rolesToCreate = [
        {
            name: 'u_student',
            description: 'Student role - can view available books and submit borrow requests.'
        },
        {
            name: 'u_librarian',
            description: 'Librarian role - can manage book inventory and approve/reject borrow requests.'
        }
    ];

    rolesToCreate.forEach(function (roleDef) {
        var existing = new GlideRecord('sys_user_role');
        existing.addQuery('name', roleDef.name);
        existing.query();

        if (existing.next()) {
            gs.info('Role already exists, skipping: ' + roleDef.name);
            return;
        }

        var role = new GlideRecord('sys_user_role');
        role.initialize();
        role.name = roleDef.name;
        role.description = roleDef.description;
        role.can_delegate = false;
        var sysId = role.insert();

        if (sysId) {
            gs.info('Created role: ' + roleDef.name + ' (' + sysId + ')');
        } else {
            gs.error('Failed to create role: ' + roleDef.name);
        }
    });

})();
