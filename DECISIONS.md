# DECISIONS.md

## 1) Stack and Architecture Decisions

- **Frontend:** React + Vite for fast local development and simple deployment to Vercel/Netlify.
- **Backend:** Node.js + Express for explicit REST route control and easy middleware composition.
- **Database:** MongoDB + Mongoose for persisted document storage and schema validation.
- **Auth model:** JWT-based owner auth (`/api/auth/login`) with both bearer token support and an httpOnly cookie for flexibility.
- **Monorepo layout:** Separate `client` and `server` apps under one root with root scripts for local orchestration.

## 2) Pricing Formula (Plain Language)

Inputs are collected from active questions in config.

- `A` = roof area (`roof_area`)
- `R_m` = selected material `rate_per_sqft`
- `M_p` = selected pitch `multiplier`
- `M_s` = selected stories `multiplier`
- `R_t` = selected layer `tear_off_per_sqft`
- `W` = waste factor from modifiers (default 0.10)
- `F_p` = permit flat fee from modifiers (default 350)
- `S` = estimate spread percentage from modifiers (default 12% -> 0.12)

Formula:

- Base Material Cost = `A * R_m * (1 + W)`
- Tear-Off Cost = `A * R_t`
- Adjusted Subtotal = `(Base Material Cost + Tear-Off Cost) * M_p * M_s`
- Mid Estimate = `Adjusted Subtotal + F_p`
- Low Estimate = `Mid * (1 - S)`
- High Estimate = `Mid * (1 + S)`

All calculation logic is performed **server-side** to avoid browser tampering.

## 3) Scope Boundaries

Out of scope for assignment timeline:

- Multi-role RBAC beyond owner/bookkeeper shared login.
- Enterprise audit trails and config diff history UI.
- Multi-tenant company support.
- SMS/email delivery workflows.

## 4) Seed Data and Data Normalization

- Seeded initial active config at `config_version = 3`.
- Intentionally accepted legacy numeric strings (for example `"1.12"`) in the seed payload.
- Added normalization so option rates, multipliers, min/max, and modifiers are persisted as numbers.

## 5) Pre-Production Questions for Dale

- Should estimates expire if rates change after a lead is captured?
- Is there a minimum project size policy beyond roof area min/max?
- Should financing options appear as additional config-driven questions?
- What data retention policy should apply to captured leads?
- Should admin logins be per-user (Dale vs Marcus) instead of shared credentials?
