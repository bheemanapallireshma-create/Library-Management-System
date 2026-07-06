# Library Management System — ServiceNow Application

Role-based Library Management System built on the ServiceNow platform to automate
book requests, approvals, inventory tracking, and reporting for an academic library.

## Team
| Name | Role |
|---|---|
| Uggina Jyothi | Team Lead |
| Abdul Khadar | Member |
| Bheemanapalli Reshma | Member |
| Bandi Jai Deekshith Sai | Member |
| Bethapudi Syam Benny | Member |

## Project Stats
- Epics: 6
- Stories & Subtasks: 24 tasks / 0 subtasks

## Skills Used
ServiceNow, Workflow Management, Access Control List (ACL), Users/Groups/Roles Management

## Folder Structure

```
library-management-system/
├── README.md                          # This file
├── docs/
│   └── Configuration_Documentation.md # Full config write-up (tables, roles, ACLs, flow, reports)
├── roles/
│   └── create_roles.js                # Background script: creates student/librarian roles
├── users/
│   └── create_users.js                # Background script: creates demo users + role assignment
├── tables/
│   ├── library_book_table.xml         # Update Set XML: u_library_book table + fields
│   └── book_request_table.xml         # Update Set XML: u_book_request table + fields
├── acl/
│   ├── library_book_acl.md            # ACL rules + scripts for u_library_book
│   └── book_request_acl.md            # ACL rules + scripts for u_book_request
├── business_rules/
│   ├── BR_BookRequest_BeforeInsert.js
│   ├── BR_BookRequest_ValidateAvailability.js
│   ├── BR_BookRequest_ApprovalRouting.js
│   ├── BR_BookRequest_UpdateAvailability_OnApprove.js
│   └── BR_BookRequest_UpdateAvailability_OnReturn.js
├── script_includes/
│   └── LibraryUtils.js                # Reusable server-side helper functions
├── flow_designer/
│   └── Book_Request_Approval_Flow.md  # Flow Designer flow spec + trigger logic
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

## Deployment Order
1. Run `roles/create_roles.js` in a background script (or via **User Administration > Roles**).
2. Run `users/create_users.js` to create demo Student/Librarian users.
3. Import `tables/*.xml` as an Update Set (System Update Sets > Retrieved Update Sets > Import),
   or manually recreate the tables/fields per the XML using **System Definition > Tables**.
4. Apply ACLs from `acl/*.md` under **System Security > Access Control (ACL)**.
5. Add Business Rules from `business_rules/*.js` on table `u_book_request`.
6. Add the Script Include `script_includes/LibraryUtils.js`.
7. Build the Flow Designer flow per `flow_designer/Book_Request_Approval_Flow.md`.
8. Add the Client Script and UI Policy.
9. Build the two reports per `reports/*.md`.
10. Execute test cases in `test/Test_Scenarios.md` using **User Administration > Impersonate User**.
11. Review `docs/Configuration_Documentation.md` for the full write-up.
