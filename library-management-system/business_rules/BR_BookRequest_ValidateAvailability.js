/*
 * Business Rule: BR_BookRequest_ValidateAvailability
 * Table:        u_book_request
 * When:         before
 * Insert:       true
 * Update:       false
 * Order:        200 (runs after BR_BookRequest_BeforeInsert)
 *
 * Purpose: Prevents a student from submitting a borrow request for a
 * book that has zero available copies.
 */
(function executeRule(current, previous /*null when async*/) {

    if (!current.u_requested_book) {
        gs.addErrorMessage('A book must be selected to submit a request.');
        current.setAbortAction(true);
        return;
    }

    var bookGr = new GlideRecord('u_library_book');
    if (!bookGr.get(current.u_requested_book)) {
        gs.addErrorMessage('Selected book could not be found.');
        current.setAbortAction(true);
        return;
    }

    var availableCopies = parseInt(bookGr.getValue('u_available_copies'), 10) || 0;

    if (availableCopies <= 0) {
        gs.addErrorMessage('This book currently has no available copies. Your request cannot be submitted.');
        current.setAbortAction(true);
    }

})(current, previous);
