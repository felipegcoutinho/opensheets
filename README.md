# Opensheets

This project contains a Next.js (v13+) application backed by Supabase.

## Database migrations

Migrations can be found in the `db/migrations` folder. Apply them manually using the Supabase SQL editor or CLI.

For example, to add the `transfer_id` column used when performing account transfers, run:

```sql
\i db/migrations/20240625_add_transfer_id.sql
```
