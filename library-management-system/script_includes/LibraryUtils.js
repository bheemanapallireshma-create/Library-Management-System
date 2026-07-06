/*
 * Script Include: LibraryUtils
 * Client callable: false
 * Accessible from: all application scopes
 *
 * Shared server-side helper functions for the Library Management
 * System, used by business rules and the Flow Designer flow's
 * "Script" step.
 */
var LibraryUtils = Class.create();
LibraryUtils.prototype = {

    initialize: function () {
    },

    /**
     * Adjusts the available copy count for a Library Book record and
     * keeps its Availability Status field in sync.
     *
     * @param {String} bookSysId - sys_id of the u_library_book record
     * @param {Number} delta     - +1 to return a copy, -1 to lend one out
     * @returns {Boolean} true if the update succeeded
     */
    adjustAvailableCopies: function (bookSysId, delta) {
        if (!bookSysId) {
            gs.error('LibraryUtils.adjustAvailableCopies called without a book sys_id');
            return false;
        }

        var bookGr = new GlideRecord('u_library_book');
        if (!bookGr.get(bookSysId)) {
            gs.error('LibraryUtils.adjustAvailableCopies: book not found - ' + bookSysId);
            return false;
        }

        var totalCopies = parseInt(bookGr.getValue('u_total_copies'), 10) || 0;
        var available = parseInt(bookGr.getValue('u_available_copies'), 10) || 0;

        available += delta;

        // Clamp between 0 and total copies to avoid data corruption.
        if (available < 0) {
            available = 0;
        }
        if (available > totalCopies) {
            available = totalCopies;
        }

        bookGr.setValue('u_available_copies', available);
        bookGr.setValue('u_availability_status', available > 0 ? 'available' : 'unavailable');
        bookGr.update();

        return true;
    },

    /**
     * Returns the sys_id of an active user who has the Librarian role,
     * used by the Flow Designer flow to route the approval task.
     * (Round-robins to the least-recently-assigned librarian.)
     *
     * @returns {String} sys_id of a librarian user, or '' if none found
     */
    getNextLibrarianForApproval: function () {
        var roleGr = new GlideRecord('sys_user_role');
        roleGr.addQuery('name', 'u_librarian');
        roleGr.query();

        if (!roleGr.next()) {
            return '';
        }

        var userRoleGr = new GlideRecord('sys_user_has_role');
        userRoleGr.addQuery('role', roleGr.getUniqueValue());
        userRoleGr.addQuery('user.active', true);
        userRoleGr.orderBy('user.sys_updated_on'); // simple round-robin proxy
        userRoleGr.query();

        if (userRoleGr.next()) {
            return userRoleGr.getValue('user');
        }

        return '';
    },

    type: 'LibraryUtils'
};
