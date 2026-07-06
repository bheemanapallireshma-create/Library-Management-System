/*
 * Client Script: CS_BookRequest_FilterAvailableBooks
 * Table:         u_book_request
 * Type:          onLoad
 * UI Type:       Desktop / Mobile / Service Portal
 *
 * Purpose: When a student opens a new Book Request form, restrict the
 * "Requested Book" reference field to only show books that currently
 * have at least one available copy.
 */
function onLoad() {
    // Only applies to new (unsubmitted) requests.
    if (!g_form.isNewRecord()) {
        return;
    }

    g_form.addFilterOptions('u_requested_book', 'u_available_copies>0^u_availability_status=available');
}
