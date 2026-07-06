/*
 * Business Rule: BR_BookRequest_UpdateAvailability_OnApprove
 * Table:        u_book_request
 * When:         after
 * Insert:       false
 * Update:       true
 * Condition:    current.u_request_status == 'approved' &&
 *               previous.u_request_status != 'approved'
 * Order:        100
 *
 * Purpose: When a librarian approves a request, decrements the
 * available copy count on the related Library Book, and flips the
 * book's Availability Status to "unavailable" once copies hit zero.
 * Uses the LibraryUtils Script Include to keep the logic reusable
 * (also called from the Return business rule).
 */
(function executeRule(current, previous) {

    var utils = new LibraryUtils();
    utils.adjustAvailableCopies(current.getValue('u_requested_book'), -1);

})(current, previous);
