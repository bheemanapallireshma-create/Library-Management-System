# UI Policy — "Lock Book Request After Processing"

**Table:** `u_book_request`
**Condition:** `Request Status is not Pending`
**Applies on:** Form view (not list edit)

## Policy Settings
```
Active:            true
Reverse if false:  true
Condition:         u_request_status != pending
```

## Field Actions
| Field | Read-only |
|---|---|
| Requested Book | true |
| Requested By | true |
| Request Date | true |

This prevents a student (or a librarian editing after the fact) from
altering the core details of a request once a librarian has acted on
it (approved, rejected, or marked returned). Status transitions
themselves continue to go through the UI Actions / Flow, governed by
the ACL and business rules.

## Companion UI Actions (Book Request form)
Create these under **System UI > UI Actions** on `u_book_request`:

1. **Approve** — visible when `u_request_status == pending` and
   `gs.hasRole('u_librarian')`. Sets `u_request_status = approved`.
2. **Reject** — same visibility; prompts for a rejection reason, then
   sets `u_request_status = rejected`.
3. **Mark as Returned** — visible when `u_request_status == approved`
   and `gs.hasRole('u_librarian')`. Sets `u_request_status = returned`.
