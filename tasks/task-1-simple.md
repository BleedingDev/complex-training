# Task 1 (Simple) — Filter Sites API
Goal: Make the sites API accept an optional `status` filter so it can return only matching sites.

- Add support for `status` values (`active`, `maintenance`, `offline`) on the list endpoint; keep default returning all.
- Ensure invalid status is rejected with a clear error, but existing clients keep working.
- Consider it done when filtered results come back correctly and the original behavior is preserved.
