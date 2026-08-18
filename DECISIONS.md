# DECISIONS.md

## 1. Project Overview

The goal is to build a configuration-driven roofing estimator for **Northline Roofing & Exteriors**.

The application has two parts:

* **Public Estimator:** Homeowners answer questions and receive an estimated price range.
* **Owner Panel:** Dale or Marcus can update pricing, edit questions, and view captured leads.

The main decision is to keep the **database as the source of truth**. Questions, labels, options, limits, rates, and modifiers are loaded from the API. Nothing that the owner may want to change is hardcoded in the frontend.

The estimate is calculated on the server so users cannot change the pricing logic in the browser.

---

## 2. Stack and Architecture

I used:

* **React + Vite** for the frontend because it is simple and works well for a multi-step estimator.
* **Node.js + Express** for the backend REST API.
* **MongoDB + Mongoose** for storing configuration and leads.
* **JWT authentication** to protect the owner panel.
* Separate `client` and `server` applications in one repository.

I kept authentication and roles simple because the assignment does not require complex RBAC.

---

## 3. Configuration-Driven Design

The estimator first requests the active configuration from the backend.

The response contains the business details, questions, labels, question types, limits, options, rates, multipliers, and modifiers.

The frontend uses this data to build the form dynamically.

This means Dale can change a question or price without changing frontend code or redeploying the application.

When a question is disabled, it is hidden from new estimator flows rather than deleted, so historical data is not affected.

---

## 4. Configuration Versions

The initial configuration is **version 3**.

Each lead stores the `config_version` used to calculate its estimate. This means old leads keep their original estimate even if pricing changes later.

For example, if the architectural shingle rate changes from `$5.90` to `$7.00`, new estimates use `$7.00`, while existing leads remain unchanged.

A complete configuration history and rollback system was left out because it was not required for the 24-hour assignment.

---

## 5. Pricing Formula

The calculation is performed on the backend.

```text
Base Material Cost
= Roof Area × Material Rate × (1 + Waste Factor)

Tear-Off Cost
= Roof Area × Tear-Off Rate

Adjusted Subtotal
= (Base Material Cost + Tear-Off Cost)
  × Pitch Multiplier
  × Stories Multiplier

Mid Estimate
= Adjusted Subtotal + Permit Fee

Low Estimate
= Mid Estimate × (1 - Spread)

High Estimate
= Mid Estimate × (1 + Spread)
```

The supplied defaults are:

* Waste factor: `10%`
* Permit fee: `$350`
* Spread: `12%`

The final estimates are rounded to whole dollars.

---

## 6. Validation and Seed Data

The backend validates the important inputs instead of trusting the frontend.

It checks required answers, roof-area limits, valid options, and numeric pricing values.

The supplied seed data contains some legacy inconsistencies. For example, the pitch multiplier `"1.12"` is a string even though it represents a number. I normalize numeric configuration values before using them.

There is also an older `config_version = 1` lead containing fields that are not present in version 3. I kept that historical lead unchanged rather than rewriting it.

---

## 7. Live Configuration Changes

Configuration is stored in the database, not in frontend code or a local JSON file.

Therefore, when Dale changes a price, the public estimator can use the updated configuration without a frontend redeployment.

Existing leads keep their original answers and estimates.

A draft/publish workflow could be added later for more control over configuration changes.

---

## 8. Scope Decisions

Because the assignment has a 24-hour limit, I focused on the core workflow:

1. Load configuration.
2. Display the estimator.
3. Collect customer details and answers.
4. Validate the data.
5. Calculate the estimate on the server.
6. Store the lead.
7. Show the estimate.
8. Manage configuration from the authenticated owner panel.
9. View captured leads.

I deliberately did not build:

* Complex RBAC
* Multi-tenancy
* Enterprise audit logs
* Configuration rollback UI
* SMS/email workflows
* CRM integration
* Payments
* Advanced analytics
* Financing features

I chose to finish the required features properly rather than leave additional features incomplete.

---

## 9. Questions for Dale

Before a production build, I would confirm:

* Should estimates expire when prices change?
* Is the result a rough estimate or a formal quote?
* Is there a minimum project size beyond the current roof-area limits?
* Should financing options be included?
* Should Dale and Marcus have separate accounts?
* Should configuration changes have an audit history?
* Should changes be published immediately or through a draft/publish process?
* How long should lead data be retained?
* Should new leads be sent to a CRM or another system?

---

## 10. What I Would Build Next

With another week, I would prioritize:

* Automated tests for the pricing engine.
* Configuration history and rollback.
* Draft/publish configuration changes.
* Separate owner accounts.
* CSV lead export.
* Ability to create new questions from the owner panel.
* Optional webhook/CRM integration.

## Final Decision

The main principle of the project is:

**Keep business configuration in the database and keep pricing logic on the server.**

This allows the business owner to change important values without developer help while keeping the pricing calculation controlled and reliable.
