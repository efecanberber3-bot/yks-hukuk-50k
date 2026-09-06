# HUKUK 50K OS — Premium V5

Personal YKS 2027 EA / Hukuk performance operating system.

## V5 highlights
- Adaptive assistant engine: daily priorities are generated from overdue reviews, topic confidence, topic status and recent workload.
- One-click plan optimization adds assistant-generated study blocks to the current day.
- Spaced-review queue using 7/14-day review timing from topic completion/review.
- Weakness radar prioritization for TYT + AYT EA, with AYT Mathematics weighted as a strategic priority.
- Focus Room, daily tasks, habits, deneme logging, performance analytics, discipline, finance and JSON backup.
- Supabase Auth + RLS cloud sync supported through `cloud.js`.

## Deploy
Upload the folder contents to the GitHub Pages repository. Use `index.html` as the entry point.

## Supabase
Run `supabase-schema.sql` once in Supabase SQL Editor. In Settings > API, use the project URL and Publishable/anon key. Never place a `service_role` / secret key in this app.
