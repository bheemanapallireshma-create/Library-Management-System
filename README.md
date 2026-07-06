# Library Management System — ServiceNow

A role-based Library Management System built on the ServiceNow platform to
automate and streamline library operations in an academic environment.
Students can browse available books, submit borrow requests, and track
request status. Librarians manage the book inventory and control the
approval process. Role-based access controls (ACLs) secure every operation,
automated Business Rules and a Flow Designer flow handle request routing
and availability updates, and reports surface borrowing trends.

## Team
| Name | Role |
|---|---|
| Uggina Jyothi | Team Lead |
| Abdul Khadar | Member |
| Bheemanapalli Reshma | Member |
| Bandi Jai Deekshith Sai | Member |
| Bethapudi Syam Benny | Member |

## Skills
ServiceNow · Workflow Management · Access Control List (ACL) · Users, Groups & Roles Management

## Repository Structure

```
library-management-system/
├── README.md                          # Project overview + folder guide
├── docs/
│   └── Configuration_Documentation.md # Full write-up: tables, roles, ACLs, flow, reports
├── roles/
│   └── create_roles.js                # Background script — creates Student & Librarian roles
├── users/
│   └── create_users.js                # Background script — creates demo users + role assignment
├── tables/
│   ├── library_book_table.xml         # Library Book table + field spec
│   └── book_request_table.xml         # Book Request table + field spec
├── acl/
│   ├── library_book_acl.md            # ACL rules for Library Book
│   └── book_request_acl.md            # ACL rules for Book Request
├── business_rules/
│   ├── BR_BookRequest_BeforeInsert.js
│   ├── BR_BookRequest_ValidateAvailability.js
│   ├── BR_BookRequest_ApprovalRouting.js
│   ├── BR_BookRequest_UpdateAvailability_OnApprove.js
│   └── BR_BookRequest_UpdateAvailability_OnReturn.js
├── script_includes/
│   └── LibraryUtils.js                # Shared server-side helper functions
├── flow_designer/
│   └── Book_Request_Approval_Flow.md  # Flow Designer flow spec
├── client_scripts/
│   └── CS_BookRequest_FilterAvailableBooks.js
├── ui_policies/
│   └── UP_BookRequest_ReadonlyAfterApproval.md
├── reports/
│   ├── Most_Borrowed_Books_Report.md
│   └── Active_Book_Requests_Report.md
└── test/
    └── Test_Scenarios.md              # Impersonation-based test cases
```

## How This Project Works

ServiceNow is a low-code platform, so this repository contains two kinds of
artifacts:

- **Executable scripts** (`roles/`, `users/`, and the code pasted into
  Business Rules / Script Includes / Client Scripts) — real JavaScript that
  runs inside the ServiceNow server.
- **Configuration specs** (`tables/`, `acl/`, `flow_designer/`, `reports/`,
  `ui_policies/`) — documented settings you recreate through the ServiceNow
  UI, since tables, ACLs, flows, and reports are declarative records, not
  standalone code files.

## Setup — Deployment Order

> Requires a ServiceNow instance (a free Personal Developer Instance works —
> sign up at developer.servicenow.com) and admin login.

1. **Create roles** — go to `System Definition > Scripts - Background`,
   paste and run `roles/create_roles.js`.
2. **Create demo users** — same page, paste and run `users/create_users.js`.
3. **Create tables** — recreate `u_library_book` and `u_book_request` under
   `System Definition > Tables`, using the field specs in `tables/*.xml`.
4. **Apply ACLs** — under `System Security > Access Control (ACL)`, add one
   rule per entry in `acl/*.md`.
5. **Add Business Rules** — under `System Definition > Business Rules`,
   create one record per file in `business_rules/`, using the header
   comment in each file for Table / When / Insert / Update / Order.
6. **Add the Script Include** — under `System Definition > Script Includes`,
   create `LibraryUtils` and paste in `script_includes/LibraryUtils.js`.
7. **Build the Flow** — in `Flow Designer`, build the flow described in
   `flow_designer/Book_Request_Approval_Flow.md`.
8. **Add Client Script / UI Policy / UI Actions** — per
   `client_scripts/` and `ui_policies/`.
9. **Build Reports** — per `reports/*.md`.
10. **Test** — impersonate a student and a librarian and run through
    `test/Test_Scenarios.md`.

Full detail on every table, role, ACL, and flow step is in
[`docs/Configuration_Documentation.md`](library-management-system/docs/Configuration_Documentation.md).

## Core Features
- Two custom roles: `u_student`, `u_librarian`
- `Library Book` table: Book ID, Title, Author, Category, Total Copies,
  Available Copies, Availability Status
- `Book Request` table: Requested Book, Requested By, Request Status,
  Request Date, Return Date
- ACL-secured read/write boundaries per role
- Flow Designer approval routing with student notifications
- Automatic inventory updates on approval and on return
- Reports: **Most Borrowed Books**, **Active Book Requests**
