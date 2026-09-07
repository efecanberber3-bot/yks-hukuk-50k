# Hukuk 50K OS V27 — Coach Engine

V27 builds on V26 and adds a data-aware, rule-based coaching layer.

## Coach engine
- Reads topic completion, confidence, question accuracy, overdue reviews, recent mock trend, study deficit and discipline.
- Produces a prioritized coaching narrative.
- Generates an adaptive plan for today or tomorrow and avoids duplicate open tasks.
- Adds coach-generated tasks directly into the task board.
- Keeps the existing Supabase/cloud data model compatible.

## Focus Room
- Keeps the 10–240 minute range in 10-minute increments.
- Defaults to 10 minutes.
- Uses a selected task to suggest a suitable duration.

## Deployment
Upload all files to the existing GitHub Pages repository. Keep `cloud-config.js` values unchanged. After deploy, hard refresh the page.
