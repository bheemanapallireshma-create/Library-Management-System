/*
 * Business Rule: BR_BookRequest_BeforeInsert
 * Table:        u_book_request
 * When:         before
 * Insert:       true
 * Update:       false
 * Order:        100
 *
 * Purpose: Defaults Requested By to the current user (if blank) and
 * stamps the Request Date, and forces the status to "pending" for
 * any newly submitted request regardless of what the client sent.
 */
(function executeRule(current, previous /*null when async*/) {

    if (!current.u_requested_by) {
        current.u_requested_by = gs.getUserID();
    }

    if (!current.u_request_date) {
        current.u_request_date = new GlideDateTime();
    }

    // Never trust client-submitted status on create; every new request starts Pending.
    current.u_request_status = 'pending';

})(current, previous);
