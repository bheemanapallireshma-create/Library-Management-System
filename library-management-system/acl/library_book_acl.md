# Access Control Rules — `u_library_book`

Create each rule under **System Security > Access Control (ACL)**. Type = `record`
unless noted otherwise. All rules target table `u_library_book`.

| # | Operation | Requires Role | Condition Script | Notes |
|---|-----------|---------------|-------------------|-------|
| 1 | read  | `u_student`, `u_librarian` | *(none)* | Both roles can view books/availability. |
| 2 | create | `u_librarian` | *(none)* | Only librarians add new book records. |
| 3 | write | `u_librarian` | *(none)* | Only librarians edit book details / availability. |
| 4 | delete | `u_librarian` | *(none)* | Only librarians can remove a book record. |

## Rule 1 — Read (Student + Librarian)
```
Table:      u_library_book
Operation:  read
Roles:      u_student, u_librarian
Script:     (leave blank — role check is sufficient)
```

## Rule 2 — Create (Librarian only)
```
Table:      u_library_book
Operation:  create
Roles:      u_librarian
```

## Rule 3 — Write (Librarian only)
```
Table:      u_library_book
Operation:  write
Roles:      u_librarian
```

## Rule 4 — Delete (Librarian only)
```
Table:      u_library_book
Operation:  delete
Roles:      u_librarian
```

## Optional: Field-level ACL — restrict editing of `u_available_copies`
Prevents even librarians from manually corrupting the count outside of the
approval/return automation. Only System Administrator can override.

```
Table:      u_library_book.u_available_copies
Operation:  write
Roles:      admin
Advanced:   true
Script:
  answer = gs.hasRole('admin');
```
