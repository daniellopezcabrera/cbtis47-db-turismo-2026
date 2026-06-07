# Backup & Recovery Strategy
## Flygth With You — CBTis 47 · 2026

**DBA:** Roldan Barrera Edson Yalan  
**File:** `admin/backup_strategy.md`  
**Database Engine:** PostgreSQL (Supabase)  

---

## 1. Logical Backup vs Physical Backup

Before defining the strategy, it is important to understand the two types of backups that exist in PostgreSQL.

| | Logical Backup | Physical Backup |
|---|---|---|
| **What it saves** | SQL commands (`CREATE TABLE`, `INSERT`, etc.) | Binary files directly from disk |
| **Can you read it?** | Yes — it is a plain text `.sql` file | No — it is a binary copy |
| **Tool used** | `pg_dump` | Handled by the platform (Supabase) |
| **Best for** | Selective restores, migrating data, sharing | Full server recovery |
| **Speed** | Slower on large databases | Faster |

**In Flygth With You we use logical backups** via `pg_dump` because:
- Our database is hosted on Supabase and we do not have direct access to the server's disk
- Logical backups allow us to restore specific tables (e.g. only `flight_booking`) without touching the rest
- The resulting `.sql` file can be inspected and verified before restoring

Supabase also handles **automatic physical backups** on their end (daily snapshots on the free plan, point-in-time recovery on Pro plans). This serves as an additional safety layer we do not need to manage manually.

---

## 2. Backup Tool: pg_dump

`pg_dump` is the official PostgreSQL command-line tool for creating logical backups. It connects to the database and exports its contents as a `.sql` file containing all the commands needed to recreate the schema and data from scratch.

### Connection string for Flygth With You (Supabase)

To run `pg_dump` locally against our Supabase database, we need the connection string found in:  
**Supabase Dashboard → Project Settings → Database → Connection string**

```
postgresql://postgres:[YOUR-PASSWORD]@db.glowanhhntkudzsncfmt.supabase.co:5432/postgres
```

---

## 3. Backup Checklist

Use this checklist before and after every backup operation.

### Before running the backup
- [ ] Confirm you have the correct Supabase connection string
- [ ] Confirm the output directory exists and has enough disk space
- [ ] Confirm no critical transactions are in progress (check with the team)
- [ ] Note the current date and time for the filename

### Full database backup command

```bash
pg_dump \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --format=plain \
  --file=backups/flygth_full_2026-06-07.sql
```

> Replace `2026-06-07` with the actual date each time.

### Backup a single table (example: flight_booking)

```bash
pg_dump \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --table=flight_booking \
  --format=plain \
  --file=backups/flygth_flight_booking_2026-06-07.sql
```

### Backup only the schema (no data)

```bash
pg_dump \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --schema-only \
  --file=backups/flygth_schema_2026-06-07.sql
```

### After running the backup
- [ ] Confirm the `.sql` file was created in the `backups/` folder
- [ ] Confirm the file size is greater than 0 bytes
- [ ] Run the verification step (see Section 5)
- [ ] Move the file to the designated storage location (see Section 4)

---

## 4. Backup File Location & Naming Convention

### Local storage (development)

```
cbtis47-db-turismo-2026/
└── backups/
    ├── flygth_full_2026-06-07.sql
    ├── flygth_full_2026-06-14.sql
    └── flygth_schema_2026-06-07.sql
```

> The `backups/` folder must be listed in `.gitignore` — backup files must **never** be pushed to GitHub as they contain sensitive data.

### Naming convention

```
flygth_[scope]_[YYYY-MM-DD].sql
```

| Scope | Meaning |
|---|---|
| `full` | Complete database backup (schema + data) |
| `schema` | Structure only, no data |
| `[table_name]` | Single table backup (e.g. `flight_booking`) |

### Recommended backup frequency

| Type | Frequency | Trigger |
|---|---|---|
| Full backup | Weekly | Every Sunday before a new sprint |
| Schema backup | After every migration | After running `01_schema.sql` changes |
| Table backup | Before risky operations | Before bulk DELETE or UPDATE |

---

## 5. Automated Backup with Supabase

Since Flygth With You runs on Supabase, we take advantage of two built-in automatic backup mechanisms instead of configuring a cron job on a local machine.

### 5.1 Supabase automatic backups (built-in)

Supabase automatically creates **daily backups** of your project on the free plan. These are physical backups managed by the platform and can be restored directly from the dashboard.

**How to access them:**
1. Go to **Supabase Dashboard**
2. Navigate to **Project Settings → Backups**
3. Select the date you want to restore from
4. Click **Restore**

### 5.2 Scheduled local backup with Windows Task Scheduler

For additional logical backups from the development machine, we schedule a weekly `pg_dump` using Windows Task Scheduler (since the team works on Windows).

**Script to save as `backup_flygth.bat`:**

```bat
@echo off
set DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%
pg_dump ^
  --host=db.glowanhhntkudzsncfmt.supabase.co ^
  --port=5432 ^
  --username=postgres ^
  --dbname=postgres ^
  --format=plain ^
  --file=C:\backups\flygth_full_%DATE%.sql
echo Backup completed: flygth_full_%DATE%.sql
```

**How to schedule it:**
1. Open **Task Scheduler** → Create Basic Task
2. Name it `Flygth Weekly Backup`
3. Trigger: **Weekly** → Every Sunday at 8:00 PM
4. Action: Start a program → select `backup_flygth.bat`
5. Finish

---

## 6. Backup Verification

**This step is critical.** A backup file that cannot be restored is useless. After every backup, verify that the file is valid and complete before trusting it.

### 6.1 Check the file was created and is not empty

```bash
# On Windows (PowerShell)
Get-Item "backups\flygth_full_2026-06-07.sql" | Select-Object Name, Length

# On Linux/Mac
ls -lh backups/flygth_full_2026-06-07.sql
```

A valid backup file should be at least several kilobytes. A 0-byte file means something went wrong.

### 6.2 Inspect the contents of the backup file

Open the `.sql` file in any text editor and confirm it contains:
- [ ] `CREATE TABLE` statements for your main tables
- [ ] `INSERT INTO` statements with actual data
- [ ] No visible error messages at the top of the file

### 6.3 Test restore on a separate schema (without touching production)

```sql
-- Create a test schema to restore into
CREATE SCHEMA backup_test;

-- After restoring, verify key tables exist
SELECT COUNT(*) FROM backup_test.flight;
SELECT COUNT(*) FROM backup_test.person;
SELECT COUNT(*) FROM backup_test.flight_booking;

-- Clean up after verification
DROP SCHEMA backup_test CASCADE;
```

### 6.4 Verification checklist

- [ ] File exists and size is greater than 0 bytes
- [ ] File contains `CREATE TABLE` and `INSERT INTO` statements
- [ ] Test restore completed without errors
- [ ] Row counts in restored tables match the original
- [ ] Test schema was cleaned up after verification

---

## 7. Step-by-Step Restore Procedure

Follow these steps exactly when you need to restore the Flygth With You database from a backup file.

### When to restore
- Accidental `DELETE` or `UPDATE` without `WHERE` clause
- Corrupted data after a failed migration
- Moving the database to a new Supabase project

### Step 1 — Identify the correct backup file

```
backups/
├── flygth_full_2026-06-07.sql   ← most recent full backup
├── flygth_full_2026-05-31.sql
└── flygth_schema_2026-06-01.sql
```

Choose the most recent full backup taken **before** the incident occurred.

### Step 2 — Connect to the target database

```bash
psql \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres
```

### Step 3 — Drop existing tables (if restoring over current data)

> ⚠️ Only do this if you are sure you want to overwrite current data.

```sql
-- Inside psql, drop all tables in the correct order
-- (respecting foreign key dependencies)
DROP TABLE IF EXISTS ticket CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS booking_seat CASCADE;
DROP TABLE IF EXISTS flight_booking CASCADE;
DROP TABLE IF EXISTS trolley_booking CASCADE;
DROP TABLE IF EXISTS flight_incident CASCADE;
DROP TABLE IF EXISTS incident CASCADE;
DROP TABLE IF EXISTS trolley_trip CASCADE;
DROP TABLE IF EXISTS trolley_route_schedule CASCADE;
DROP TABLE IF EXISTS schedule_day CASCADE;
DROP TABLE IF EXISTS route_stop CASCADE;
DROP TABLE IF EXISTS flight CASCADE;
DROP TABLE IF EXISTS airplane CASCADE;
DROP TABLE IF EXISTS airplane_model CASCADE;
DROP TABLE IF EXISTS airport CASCADE;
DROP TABLE IF EXISTS route CASCADE;
DROP TABLE IF EXISTS bus_station CASCADE;
DROP TABLE IF EXISTS trolley CASCADE;
DROP TABLE IF EXISTS trolley_model CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS occupation CASCADE;
```

### Step 4 — Restore from the backup file

```bash
psql \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --file=backups/flygth_full_2026-06-07.sql
```

### Step 5 — Verify the restore was successful

```sql
-- Check that key tables have data
SELECT 'person' AS table_name, COUNT(*) AS rows FROM person
UNION ALL
SELECT 'flight', COUNT(*) FROM flight
UNION ALL
SELECT 'flight_booking', COUNT(*) FROM flight_booking
UNION ALL
SELECT 'trolley_trip', COUNT(*) FROM trolley_trip
UNION ALL
SELECT 'payment', COUNT(*) FROM payment;
```

### Step 6 — Re-apply security settings

After restoring, re-run the security file to restore roles, permissions, and RLS policies:

```bash
psql \
  --host=db.glowanhhntkudzsncfmt.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --file=src/03_users_security.sql
```

### Restore checklist

- [ ] Correct backup file identified
- [ ] Team notified before starting the restore
- [ ] Existing tables dropped (if applicable)
- [ ] Backup file restored without errors
- [ ] Row counts verified against expected values
- [ ] Security settings re-applied from `03_users_security.sql`
- [ ] Application tested and confirmed working

---

## 8. Summary

| Task | Tool | Frequency |
|---|---|---|
| Full logical backup | `pg_dump` | Weekly (every Sunday) |
| Automatic platform backup | Supabase Dashboard | Daily (automatic) |
| Schema-only backup | `pg_dump --schema-only` | After every migration |
| Backup verification | `psql` + text editor | After every backup |
| Full restore | `psql --file` | When incident occurs |

---
