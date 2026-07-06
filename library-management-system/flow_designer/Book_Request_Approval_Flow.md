# Flow Designer — "Book Request Approval Flow"

Build this in **Flow Designer** (`Flow Designer > Designer`). It complements
(not replaces) the business rules — the flow handles orchestration,
routing, and notifications; the business rules enforce data integrity
at the record level.

## Flow Properties
- **Name:** Book Request Approval Flow
- **Table:** Book Request [`u_book_request`]
- **Trigger type:** Record Created
- **Condition:** `Request Status is Pending`

## Flow Steps

### 1. Trigger — Record Created
```
Table:      u_book_request
Operation:  Created
Condition:  u_request_status = pending
```

### 2. Action — Look Up Record (Library Book)
```
Table:  u_library_book
Filter: sys_id = trigger.u_requested_book
```
Returns the book's Title, Author, and Available Copies for use in
notifications below.

### 3. Action — Script Step: Determine Approving Librarian
```javascript
// Inputs:  none
// Outputs: librarian (Reference - sys_user)
(function execute(inputs, outputs) {
    var utils = new LibraryUtils();
    outputs.librarian = utils.getNextLibrarianForApproval();
})(inputs, outputs);
```

### 4. Action — Create Task / Approval
```
Type:        Ask For Approval
Table:       u_book_request
Approver:    {librarian from step 3}
Short Desc:  Approve borrow request: {LookupRecord.u_title} requested by {trigger.u_requested_by}
```

### 5. Decision — Approval Outcome
```
If Approval = Approved  -> go to Step 6a
If Approval = Rejected  -> go to Step 6b
```

### 6a. Action — Update Record (on Approved)
```
Table:  u_book_request (trigger record)
Set:    u_request_status = approved
        u_processed_by   = {librarian}
```
*(This update fires `BR_BookRequest_ApprovalRouting` and
`BR_BookRequest_UpdateAvailability_OnApprove` automatically, which
decrements the book's available copies.)*

### 6b. Action — Update Record (on Rejected)
```
Table:  u_book_request (trigger record)
Set:    u_request_status    = rejected
        u_processed_by      = {librarian}
        u_rejection_reason  = {approval.comments}
```

### 7. Action — Notify Student
```
Type:     Send Email / Notification
To:       trigger.u_requested_by
Subject:  Your book request has been {u_request_status}
Body:     Your request for "{u_title}" is now {u_request_status}.
          {If rejected: Reason - {u_rejection_reason}}
```

## Return Flow (separate, simpler flow or UI Action)
A lightweight second flow, **"Book Return Flow"**, or a UI Action button
"Mark as Returned" on the Book Request form:

```
Trigger:   Manual (UI Action) or Record Updated where u_request_status = returned
Action:    Update Record -> u_return_date = now (if blank)
Effect:    Fires BR_BookRequest_UpdateAvailability_OnReturn,
           incrementing the book's available copies automatically.
```

## Notes
- Only users with the `u_librarian` role can act on the Approval task
  (enforced by the ACLs in `acl/book_request_acl.md`).
- The Script step calls the `LibraryUtils` Script Include so the
  librarian-selection logic isn't duplicated between the flow and any
  future scheduled jobs/UI Actions.
