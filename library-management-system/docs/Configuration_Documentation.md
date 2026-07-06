# Library Management System — Configuration Documentation

## 1. Overview
A role-based Library Management System on ServiceNow automating book
requests, inventory control, and approvals for an academic library.
Students submit and track borrow requests; librarians manage
inventory and approvals. Role-based ACLs secure every operation, a
Flow Designer flow automates request routing, and two reports surface
borrowing trends.

## 2. Roles
| Role | Purpose |
|---|---|
| `u_student` | View available books, submit and track own borrow requests. |
| `u_librarian` | Manage book inventory, approve/reject/return requests. |

Created via `roles/create_roles.js`.

## 3. Users
Demo users created via `users/create_users.js`, mapped to team members
(librarians: Uggina Jyothi, Bethapudi Syam Benny; students: Abdul
Khadar, Bheemanapalli Reshma, Bandi Jai Deekshith Sai).

## 4. Tables

### 4.1 Library Book (`u_library_book`)
| Field | Type | Notes |
|---|---|---|
| Book ID (`u_book_id`) | String, unique | Business key |
| Title (`u_title`) | String | |
| Author (`u_author`) | String | |
| Category (`u_category`) | Choice | Fiction / Non-Fiction / Sci-Tech / Reference |
| Total Copies (`u_total_copies`) | Integer | |
| Available Copies (`u_available_copies`) | Integer | Auto-maintained |
| Availability Status (`u_availability_status`) | Choice, read-only | Available / Unavailable, auto-derived |

### 4.2 Book Request (`u_book_request`)
| Field | Type | Notes |
|---|---|---|
| Requested Book (`u_requested_book`) | Reference → Library Book | |
| Requested By (`u_requested_by`) | Reference → sys_user | Defaults to current user |
| Request Status (`u_request_status`) | Choice | Pending / Approved / Rejected / Returned |
| Request Date (`u_request_date`) | Date/Time, read-only | Auto-stamped |
| Return Date (`u_return_date`) | Date/Time | Stamped on return |
| Processed By (`u_processed_by`) | Reference → sys_user, read-only | Librarian who acted |
| Rejection Reason (`u_rejection_reason`) | String | |

Definitions in `tables/*.xml`.

## 5. Access Control Rules
Full detail in `acl/library_book_acl.md` and `acl/book_request_acl.md`.

- Students: read all books; create/read/limited-write their own
  requests only (cancel while Pending).
- Librarians: full CRUD on books; full write on requests (approve,
  reject, mark returned).
- Field ACL locks `u_request_status` writes to `u_librarian`.

## 6. Automation

### 6.1 Business Rules (`business_rules/`)
| Rule | Trigger | Purpose |
|---|---|---|
| `BR_BookRequest_BeforeInsert` | before insert | Default requester/date, force status = Pending |
| `BR_BookRequest_ValidateAvailability` | before insert | Block requests for 0-copy books |
| `BR_BookRequest_ApprovalRouting` | before update (status changes) | Enforce librarian-only transitions, stamp processor |
| `BR_BookRequest_UpdateAvailability_OnApprove` | after update → Approved | Decrement available copies |
| `BR_BookRequest_UpdateAvailability_OnReturn` | after update → Returned | Increment available copies |

### 6.2 Script Include
`LibraryUtils` (`script_includes/LibraryUtils.js`) centralizes
availability math and librarian look-up, reused by business rules and
the Flow Designer script step.

### 6.3 Flow Designer
`flow_designer/Book_Request_Approval_Flow.md` — triggers on new
Pending requests, routes an approval task to a librarian, updates
status on the decision, and emails the student. A companion "Mark as
Returned" UI Action closes the loop and restores inventory.

### 6.4 Client Script / UI Policy
- `CS_BookRequest_FilterAvailableBooks.js` — limits the book picker to
  in-stock titles.
- `UP_BookRequest_ReadonlyAfterApproval.md` — locks core fields once a
  request has been processed; defines the Approve/Reject/Return UI
  Actions.

## 7. Reports
- **Most Borrowed Books** — bar chart, grouped by book, filtered to
  Approved/Returned requests. (`reports/Most_Borrowed_Books_Report.md`)
- **Active Book Requests** — worklist grouped by status, oldest
  Pending first. (`reports/Active_Book_Requests_Report.md`)

## 8. Testing
`test/Test_Scenarios.md` contains 10 impersonation-based test cases
covering role boundaries, request lifecycle, availability automation,
and reporting accuracy, plus a sign-off checklist.

## 9. Deployment Sequence
1. `roles/create_roles.js`
2. `users/create_users.js`
3. Import `tables/*.xml` (or recreate manually)
4. Apply ACLs from `acl/*.md`
5. Add business rules from `business_rules/*.js`
6. Add `script_includes/LibraryUtils.js`
7. Build flow per `flow_designer/Book_Request_Approval_Flow.md`
8. Add client script + UI policy + UI actions
9. Build reports per `reports/*.md`
10. Execute `test/Test_Scenarios.md`
