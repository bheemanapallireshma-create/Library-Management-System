# Test Scenarios — Library Management System

Use **User Administration > Users > [user] > Impersonate User** to run
these as the actual role, not just as admin.

## TC-01: Student can view available books only
1. Impersonate a Student (e.g. `abdul.khadar`).
2. Navigate to `u_library_book.list`.
3. **Expect:** List loads (read ACL passes); create/edit/delete buttons
   absent or blocked.

## TC-02: Student can submit a borrow request
1. As Student, open **Book Request > New**.
2. Select a book with `Available Copies > 0`.
3. Submit.
4. **Expect:** Record inserts with `Request Status = Pending`,
   `Requested By` auto-set to the logged-in student,
   `Request Date` auto-stamped.

## TC-03: Student cannot request an unavailable book
1. As Student, attempt to create a request for a book with
   `Available Copies = 0`.
2. **Expect:** Insert blocked with error message from
   `BR_BookRequest_ValidateAvailability`.

## TC-04: Student cannot self-approve
1. As Student, open their own Pending request.
2. Attempt to change `Request Status` to `Approved`.
3. **Expect:** Field-level ACL blocks the change / UI Action not
   visible (no `u_librarian` role).

## TC-05: Librarian can manage book inventory
1. Impersonate a Librarian (e.g. `jyothi.uggina`).
2. Create a new Library Book record, then edit `Total Copies`.
3. **Expect:** Create/write succeed per ACL rules 2 & 3.

## TC-06: Librarian approves a request — availability updates
1. As Librarian, open a Pending request created in TC-02.
2. Click **Approve** (or action the Flow Designer approval task).
3. **Expect:**
   - `Request Status` → `Approved`
   - `Processed By` set to librarian
   - Related Library Book's `Available Copies` decrements by 1
     (via `BR_BookRequest_UpdateAvailability_OnApprove`)
   - `Availability Status` flips to `Unavailable` if that was the
     last copy.
   - Student receives notification (Flow Designer step 7).

## TC-07: Librarian rejects a request
1. As Librarian, open a different Pending request.
2. Click **Reject**, enter a reason.
3. **Expect:** `Request Status = Rejected`, `Rejection Reason` stored,
   book's Available Copies unchanged, student notified.

## TC-08: Return flow restores availability
1. As Librarian, open the Approved request from TC-06.
2. Click **Mark as Returned**.
3. **Expect:** `Request Status = Returned`, `Return Date` stamped,
   related book's `Available Copies` increments by 1
   (via `BR_BookRequest_UpdateAvailability_OnReturn`), Availability
   Status flips back to `Available`.

## TC-09: Role-based visibility on Book Request list
1. As Student A, confirm the Book Request list only shows Student A's
   own requests.
2. As Librarian, confirm the list shows requests from all students.

## TC-10: Reports render correctly
1. As Librarian, open **Most Borrowed Books** — confirm it reflects
   only Approved/Returned requests.
2. Open **Active Book Requests** — confirm only Pending/Approved rows
   appear, oldest first.

## Sign-off Checklist
- [ ] Roles `u_student` / `u_librarian` created and assigned correctly
- [ ] Tables `u_library_book` / `u_book_request` match field spec
- [ ] ACLs enforce read/write boundaries per role
- [ ] Flow Designer flow routes and notifies correctly
- [ ] Availability auto-updates on approve and on return
- [ ] Both reports return expected data
- [ ] All 10 test cases pass under impersonation
