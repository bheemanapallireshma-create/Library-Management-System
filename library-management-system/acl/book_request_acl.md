# Access Control Rules — `u_book_request`

Create each rule under **System Security > Access Control (ACL)**.
All rules target table `u_book_request`. Advanced (scripted) conditions
are used so students can only see/act on their own requests, while
librarians see and manage everyone's.

## Rule 1 — Read
```
Table:      u_book_request
Operation:  read
Roles:      u_student, u_librarian
Advanced:   true
Script:
  // Librarians can read every request.
  // Students can only read requests they submitted themselves.
  answer = gs.hasRole('u_librarian') ||
           (gs.hasRole('u_student') && current.u_requested_by == gs.getUserID());
```

## Rule 2 — Create
```
Table:      u_book_request
Operation:  create
Roles:      u_student
Advanced:   true
Script:
  // Students may only create requests where they are the requester.
  answer = gs.hasRole('u_student') && current.u_requested_by == gs.getUserID();
```

## Rule 3 — Write
```
Table:      u_book_request
Operation:  write
Roles:      u_student, u_librarian
Advanced:   true
Script:
  // Librarians can update any request (approve/reject/return).
  // Students may edit only their own request, and only while it is still Pending
  // (e.g. to cancel), never to change the status themselves.
  if (gs.hasRole('u_librarian')) {
      answer = true;
  } else if (gs.hasRole('u_student') && current.u_requested_by == gs.getUserID()) {
      answer = current.u_request_status == 'pending';
  } else {
      answer = false;
  }
```

## Rule 4 — Delete
```
Table:      u_book_request
Operation:  delete
Roles:      u_librarian
```

## Field-level ACL — `u_request_status` write
Ensures only librarians (via the approval flow/UI action) can move a
request between Pending / Approved / Rejected / Returned.

```
Table:      u_book_request.u_request_status
Operation:  write
Roles:      u_librarian
```
