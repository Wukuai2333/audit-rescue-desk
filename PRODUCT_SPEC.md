# Audit Rescue Desk Product Spec

## Goal

Build a demo-ready web app for non-technical compliance officers who need to inspect the Kaggle Track 01 Harven Manufacturing CSV data before an audit.

## Dataset

- Kaggle URL: https://www.kaggle.com/datasets/quantologist/track01-vibeforward-m-agents
- KaggleHub id: `quantologist/track01-vibeforward-m-agents`
- Local project copy:
  - `src/data/kaggle/track01_data_rescue.csv`
  - `src/data/kaggle/track01_customers.csv`
  - `src/data/kaggle/README_track01.md`
- Public demo downloads:
  - `public/data/kaggle/track01_data_rescue.csv`
  - `public/data/kaggle/track01_customers.csv`
- Scenario: 5,000 Harven Manufacturing warehouse records across plants A, B, and C, with seeded issues including duplicates, unit conflicts, impossible values, and orphaned references.

## MVP Workflow

1. Upload a manufacturing CSV file.
2. Parse the headers and rows in the browser.
3. Run four local agent steps:
   - Data Inspector: finds duplicate records, unit conflicts, contradictory totals, missing values, impossible values, and orphaned references.
   - Risk Ranker: orders issues by audit risk and recommends a P0-P3 fix priority.
   - Fix Advisor: suggests human-approved next actions.
   - Audit Narrator: creates a Markdown audit report.
4. Show a shared Cognee-style memory trail so the user can see what each agent contributed.
5. Let the user override fix priority and accept, reject, or mark each suggested fix for review.
6. Export a Markdown report for the submission/demo.

## Core Differentiator: Self-Evolving Policy Memory

Audit Rescue Desk should not only detect bad data once. It should learn how a compliance team prefers to handle risk over time.

Product name for this feature:
Policy Memory

Powered by:
Local Cognee SDK memory / recall / improve.

How it works:

1. The system detects data quality issue categories and recommends an initial risk order.
2. The user adjusts the risk order based on business context.
3. The user selects the final remediation plan for each issue category.
4. The user can type a natural-language handling policy, for example:
   "For acquired plants, orphaned customer references should be escalated before unit conflicts. Do not auto-fix shipment dates unless source documents are attached."
5. Agent 5, the Policy Learner, summarizes the user's decisions into reusable audit policy memory.
6. Cognee SDK stores:
   - dataset summary
   - detected quality categories
   - agent recommended risk ranking
   - user-adjusted risk ranking
   - final remediation plans
   - natural-language policy notes
   - exported report
7. On the next dataset, Agent 2 and Agent 3 recall Cognee memory and explain when a previous policy influenced risk ranking or remediation advice.

Business narrative:
Audit Rescue Desk becomes more aligned with each compliance team after every review. It remembers how the team ranks risk, which issues require escalation, and what remediation language should appear in the audit packet.

Safety boundary:
The system can stage remediation plans and generate cleaned drafts, but it must not silently overwrite uploaded data. Human approval remains required.

## First Build Scope

- React + Vite + TypeScript single-page app.
- CSV upload powered by Papa Parse.
- Local deterministic agent logic; no backend required for the first demo.
- Local Cognee SDK bridge available for real `cognee.remember`, `cognee.recall`, and `cognee.improve` calls.
- Geodo research dossier included for Domain Expert work on customers, companies, market, and manufacturing audit risk.
- Kaggle benchmark dataset copied into `src/data/kaggle`.
- Small local sample still included at `src/data/sampleManufacturingData.csv`.
- Policy Memory MVP stores user priority overrides, final remediation choices, natural-language handling notes, and generated reports for later recall.
- Report download from the browser.

## Out Of Scope For First Build

- User authentication.
- Server-side CSV storage.
- Automatic mutation of uploaded records.
