# Pusaka — Setup Guide

The website for **Pusaka** (Pusat Layanan Studi Lanjut Karangturi). Built with
Next.js 16, Tailwind CSS, next-intl (ID/EN), and Supabase (database, auth,
image storage).

> The site is fully browsable **without** a backend — it falls back to bundled
> demo data (`lib/fixtures.ts`). Connect Supabase to enable real news
> publishing, the Aspirasi CRM, and admin login.

## 1. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Switch language with the **ID / EN** toggle in the header.

## 2. Connect Supabase (enables admin + real data)

1. Create a free project at https://supabase.com.
2. In **SQL Editor**, paste and run `supabase/migrations/0001_init.sql`.
   This creates all tables, enums, row-level-security policies, the three
   image storage buckets, and a trigger that gives every new auth user a
   `profiles` row.
3. Copy `.env.local.example` to `.env.local` and fill in the values from
   **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; used to create teacher accounts)
4. Restart `npm run dev`.

## 3. Create the first admin (super admin)

1. In Supabase → **Authentication → Users**, click **Add user** and create the
   account (set a password; confirm the email).
2. In **SQL Editor**, promote that user to super admin:

   ```sql
   update profiles
   set role = 'super_admin', full_name = 'Your Name'
   where email = 'you@example.com';
   ```

3. Log in at `/admin/login`. From **/admin/users** a super admin can create and
   disable other teacher accounts (role `editor`).

## Roles

| Role          | Can do                                                            |
| ------------- | ----------------------------------------------------------------- |
| `editor`      | Publish/edit news, manage programs & info sessions, triage Aspirasi |
| `super_admin` | Everything an editor can, plus create/disable teacher accounts    |

## Security model (RLS)

- **Public visitors** can read only *published* news, *active* programs, and
  info sessions, and may *submit* an Aspirasi. They can **never** read Aspirasi
  submissions or draft posts.
- **Staff** (active profiles) manage all content and read/triage Aspirasi.
- **Image uploads** are restricted to authenticated staff; the images
  themselves are publicly readable.

## 4. Deploy (Vercel)

1. Push the repo to GitHub and import it at https://vercel.com/new.
2. Add the three environment variables from `.env.local` in the Vercel project
   settings.
3. Deploy. Point a subdomain (e.g. `pusaka.karangturi.sch.id`) at it if desired.

## Project structure

```
app/                  Public pages + /admin
components/            UI (public/, admin/, ui/) + LocaleSwitcher
i18n/                  next-intl config (cookie-based locale), request, locale action
lib/                  constants, types, data layer, fixtures, supabase clients
messages/             id.json, en.json (UI strings)
supabase/migrations/  0001_init.sql (schema + RLS + storage)
public/               logo assets, info-session photos, programs/ielts.jpeg, video/pusaka.mp4
```
