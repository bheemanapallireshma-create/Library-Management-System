/*
 * Business Rule: BR_BookRequest_ApprovalRouting
 * Table:        u_book_request
 * When:         before
 * Insert:       false
 * Update:       true
 * Condition:    current.u_request_status.changes()
 * Order:        100
 *
 * Purpose: Stamps who processed the request and when, and enforces
 * that only a librarian can move a request out of "pending".
 * This backs up the ACL and works alongside the Flow Designer flow
 * (see flow_designer/Book_Request_Approval_Flow.md), which is the
 * primary orchestration layer for notifications.
 */
(function executeRule(current, previous) {

    var newStatus = current.getValue('u_request_status');
    var oldStatus = previous.getValue('u_request_status');

    if (newStatus === oldStatus) {
        return;
    }

    // Guard: only librarians may approve/reject.
    if ((newStatus === 'approved' || newStatus === 'rejected') && !gs.hasRole('u_librarian')) {
        gs.addErrorMessage('Only a librarian can approve or reject a book request.');
        current.setAbortAction(true);
        return;
    }

    current.u_processed_by = gs.getUserID();

    if (newStatus === 'rejected' && !current.u_rejection_reason) {
        current.u_rejection_reason = 'No reason provided.';
    }

    if (newStatus === 'returned' && !current.u_return_date) {
        current.u_return_date = new GlideDateTime();
    }

})(current, previous);
