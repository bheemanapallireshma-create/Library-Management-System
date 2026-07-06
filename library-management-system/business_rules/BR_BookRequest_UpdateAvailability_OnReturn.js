/*
 * Business Rule: BR_BookRequest_UpdateAvailability_OnReturn
 * Table:        u_book_request
 * When:         after
 * Insert:       false
 * Update:       true
 * Condition:    current.u_request_status == 'returned' &&
 *               previous.u_request_status != 'returned'
 * Order:        100
 *
 * Purpose: When a book request is marked as "Returned" (by the
 * librarian, typically via a UI Action), increments the available
 * copy count on the related Library Book and flips Availability
 * Status back to "available".
 */
(function executeRule(current, previous) {

    var utils = new LibraryUtils();
    utils.adjustAvailableCopies(current.getValue('u_requested_book'), +1);

})(current, previous);
