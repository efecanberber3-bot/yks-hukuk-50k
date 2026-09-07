# Hukuk 50K OS — V32 Target Intelligence

V32 adds a dedicated **Hedef Simülasyonu** view to the V31 accountability build.

## What it does
- TYT + AYT EA current-net inputs
- Weekly study-minute and question-growth scenario inputs
- Target-alignment indicator
- Four-week scenario projection
- TYT / AYT gap guidance
- Coach priority recommendation
- Explicitly avoids claiming a real ranking prediction without sufficient official/individual data

## Migration
V32 uses localStorage key `hukuk50k-os-v32` and automatically migrates prior V31 data through the legacy-key migration list.

## Supabase
Existing V31 Supabase configuration is preserved. No new secret key is required for this module.
