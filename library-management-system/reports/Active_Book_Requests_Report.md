# Report — "Active Book Requests"

Create under **Reports > Create New**.

```
Name:        Active Book Requests
Source Table: Book Request [u_book_request]
Type:        List / Pivot table
Filter:      Request Status IN Pending, Approved
Columns:     Requested Book, Requested By, Request Status, Request Date
Group by:    Request Status
Sort:        Request Date (ascending) - oldest pending requests surface first
```

## Steps
1. Reports > Create New.
2. Source type: **Table** → `Book Request`.
3. Type: **List** (for an operational worklist) — optionally also
   build a **Pivot Table** variant grouped by Request Status ×
   Category of the requested book, for trend analysis.
4. Filter conditions: `Request Status` is one of `Pending`, `Approved`
   (excludes closed-out Rejected/Returned requests).
5. Columns: Requested Book, Requested By, Request Status, Request
   Date, Return Date (if approved).
6. Sort by Request Date ascending so librarians action the oldest
   pending requests first.
7. Save and schedule a daily email of this report to the librarian
   group for visibility.

## Suggested companion dashboard
Combine both reports (`Most Borrowed Books` + `Active Book Requests`)
on a single **Library Management Dashboard**, restricted to users with
the `u_librarian` role via the dashboard's visibility settings.
