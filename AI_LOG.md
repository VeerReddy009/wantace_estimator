# AI_LOG.md

## AI Tools Used

- GitHub Copilot (GPT-5.3-Codex)

## Example of Incorrect AI Output and Correction

- **Issue:** Early generated estimate spread handling assumed spread was always decimal form (`0.12`).
- **Why incorrect:** Assignment and seed data may store spread as percentage (`12`).
- **Correction implemented:** Added conversion guard in calculator (`> 1 ? value / 100 : value`) so both `12` and `0.12` are handled safely.

## Code Authorship Notes

Directly authored and validated in this implementation:

- API route/controller design (`/api/config`, `/api/estimate`, `/api/auth/login`, `/api/admin/*`).
- Dynamic estimator React flow and owner panel editor/table.
- Config normalization, validation, and server-side pricing engine.
- Root orchestration and environment setup documentation.
