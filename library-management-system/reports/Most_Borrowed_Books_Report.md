# Report — "Most Borrowed Books"

Create under **Reports > Create New**.

```
Name:        Most Borrowed Books
Source Table: Book Request [u_book_request]
Type:        Bar chart (horizontal)
Group by:    Requested Book (u_requested_book)
Aggregation: COUNT
Filter:      Request Status IN Approved, Returned
Sort:        Count (descending)
Max entries: Top 10
```

## Steps
1. Reports > Create New.
2. Source type: **Table** → `Book Request`.
3. Type: **Bar** (or **Pie** for a quick top-5 visual).
4. Group by: `Requested Book`.
5. Filter conditions: `Request Status` is one of `Approved`, `Returned`
   (so pending/rejected requests don't skew borrowing trends).
6. Style: sort descending by count, limit to top 10.
7. Save and add to the **Library Management** dashboard.

## Optional drill-down
Enable "Click to open record list" so a librarian can click a bar and
see every request tied to that book.
