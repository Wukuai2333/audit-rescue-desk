# Audit Rescue Desk Build Checklist

Official reference:
- Rules: https://vibe-forward.vercel.app/#rules
- Stack: https://vibe-forward.vercel.app/#stack
- Event page: https://vibe-forward.vercel.app/
- Dataset: https://www.kaggle.com/datasets/quantologist/track01-vibeforward-m-agents

Use this checklist as the live source of truth while building and preparing the demo.

---

## 0. North Star

Product: Audit Rescue Desk

Track: Track 01 - Data Rescue

End user:
A manufacturing compliance officer who has never opened a database.

Core promise:
Find, review, fix or flag, and explain corrupted manufacturing data before a regulatory audit.

Do not build:
- [ ] A developer-only dashboard
- [ ] A generic CSV cleaner
- [ ] A hidden black-box LLM tool
- [ ] An app that silently overwrites data

Build:
- [ ] Plain-English audit rescue assistant
- [ ] Four agents with real handoffs
- [ ] Cognee memory layer between all agents
- [x] Geodo research section for real-world audit context
- [ ] Decision Passport for every issue
- [ ] Downloadable Agent 4 audit report
- [ ] Trupeer-ready 5-minute demo flow
- [ ] Policy Memory that learns from user risk ranking and remediation choices

---

## 1. Official Track Requirement

Track 01 scenario:
A manufacturer's data is corrupted four days before a regulatory audit. The product should help an organization find, fix, and explain broken data.

Checklist:
- [x] Product addresses Track 01: Data Rescue
- [x] Uses the Kaggle Track 01 benchmark dataset
- [x] End user is a non-technical compliance officer
- [x] Detects duplicate records
- [x] Detects unit conflicts
- [x] Detects contradictory numbers
- [x] Detects impossible values
- [x] Detects orphaned references
- [x] Helps the user find broken data
- [x] Lists the issue types found in the dataset
- [x] Recommends a fix priority for each issue
- [x] Lets the user manually override fix priority
- [x] Helps the user fix, flag, or escalate broken data
- [x] Helps the user explain broken data

Dataset files:
- [x] `src/data/kaggle/track01_data_rescue.csv`
- [x] `src/data/kaggle/track01_customers.csv`
- [x] `src/data/kaggle/README_track01.md`
- [x] `public/data/kaggle/track01_data_rescue.csv`
- [x] `public/data/kaggle/track01_customers.csv`

---

## 2. Official Five-Step Pipeline

Step 0 - Define:
- [x] Product Brief exists in `PRODUCT_SPEC.md`
- [ ] Export Product Brief as PDF for Devpost
- [x] Brief defines user, product, success condition, and out-of-scope items

Step 1 - Find It:
- [x] Agent 1 reads the dataset
- [x] Agent 1 finds broken data, duplicates, anomalies, and suspicious records
- [x] Agent 1 result should be easy to inspect in the UI

Step 2 - Rank It:
- [x] Agent 2 prioritizes findings
- [x] Every ranking has a visible reason and risk level
- [x] Worst issues appear first in the product
- [x] Human owner can override the recommended fix priority

Step 3 - Act On It:
- [x] Agent 3 suggests safe actions
- [x] Actions are fix, flag, or escalate style actions
- [x] Human decision can be recorded
- [x] Every action has a logged reason

Step 4 - Explain It:
- [x] Agent 4 writes a human-readable summary
- [x] Report is downloadable from the product
- [x] Report should include final human decisions
- [ ] Domain Expert should validate the narrative

Step 5 - Show It:
- [x] Product UI exists
- [x] Demo can be run as the end user, not as an engineer explaining code
- [x] Judge can see each agent role, focus, workstyle, decision, and reason
- [ ] Judge can operate the product cold

Critical rule:
- [x] Memory connects the agents through Cognee-style shared memory
- [ ] Replace local Cognee simulation with real Cognee if time allows

---

## 3. Official Stack Checklist

Mandatory tools:

Cognee:
- [x] Mandatory memory layer represented in the product
- [x] Every agent writes to the shared memory trail
- [x] UI includes Cognee Memory Trail
- [x] Local Cognee SDK bridge exists
- [ ] `python -m pip install cognee` completed
- [ ] `npm run cognee:sdk` shows connected in the UI
- [ ] OpenAI/LLM key added only if we want permanent graph memory or improve demo

Trupeer:
- [ ] Mandatory 5-minute demo video recorded
- [ ] Demo URL added to Devpost
- [ ] Presenter has a script
- [ ] Demo shows upload, agents, memory, decisions, and report export

Geodo:
- [x] Mandatory Geodo / real-world context section exists
- [ ] Domain Expert completes real-world research in Geodo web platform
- [x] Research plan covers customers, companies, and market
- [x] Research covers manufacturing audit risks
- [x] Research is reflected in the product UI
- [ ] Add real Geodo screenshot or exported notes before submission

Data:
- [x] Kaggle Track 01 dataset is used
- [x] Benchmark path is documented
- [ ] Findings should be benchmark-friendly for hidden answer key review

Recommended:
- [x] Codex used for build support
- [ ] LingCode optional; use only if the team wants another agent IDE surface

Optional special prize:
- [ ] PyMC stack considered only if probabilistic ranking or Bayesian uncertainty becomes useful

---

## 4. Official Rules Checklist

R01:
- [x] Minimum four agents exist
- [x] Handoffs are real, not one LLM call in a loop

R02:
- [x] Cognee is represented as memory layer
- [x] Every agent writes to the shared memory trail
- [x] SDK bridge can write agent traces through `cognee.remember`
- [ ] Demo shows successful Cognee SDK remember/recall
- [ ] Cognee stores user-adjusted risk ranking and final remediation policies
- [ ] Next analysis shows when recalled policy memory influenced a recommendation

R03:
- [ ] Trupeer demo video completed
- [ ] No submission without video

R04:
- [x] Geodo section exists
- [ ] Domain Expert performs Geodo research on web platform
- [ ] Domain Expert researches real-world entities: customers, companies, and market
- [ ] Product/demo shows how Geodo research informed the workflow

R05:
- [x] Product Brief exists
- [ ] Product Brief submitted
- [ ] Product is judged against our own success condition

R06:
- [x] Kaggle benchmark dataset is used
- [x] Benchmark earns bonus credibility through hidden answer key verification

R07:
- [x] Every agent decision has a visible reason
- [x] Avoid "the model said so" as an explanation

R08:
- [x] Agent 4 summary is downloadable from the product

R09:
- [ ] Team has 4-6 people
- [ ] Team has at least one Builder
- [ ] Team has at least one non-Builder role
- [ ] No solo submission

R10:
- [ ] Devpost submission complete by 5:00 PM
- [ ] No extension assumed

---

## 5. Judging Checklist: 25 Points

Agents that work - 5 pts:
- [x] Runs on real Kaggle data
- [x] Outputs are not hardcoded
- [ ] Handles the full dataset smoothly in the browser

Real collaboration - 5 pts:
- [x] Agent 2 uses Agent 1 findings
- [x] Agent 3 uses Agent 1 and Agent 2 outputs
- [x] Agent 4 uses the memory trail
- [x] Cognee Memory Trail makes handoffs visible

Matches our brief - 5 pts:
- [x] Product matches Audit Rescue Desk brief
- [x] Success condition is clear
- [ ] Demo explicitly says what success looks like

End user can use it - 5 pts:
- [x] Plain-English interface
- [x] Upload-based flow
- [x] Clear issue cards
- [x] Human decision buttons
- [ ] Cold judge test completed

Explainable - 5 pts:
- [x] Each issue shows evidence
- [x] Each issue shows why it matters
- [x] Each issue shows suggested action
- [x] Each issue shows the agent reasoning trail
- [x] Report includes memory trail and issue register

Finalist threshold:
- [ ] Target at least 20/25 internally
- [ ] Minimum 15/25 required for finalist consideration

---

## 6. Devpost Submission Checklist

Required by 5:00 PM:
- [ ] Product Brief PDF
- [ ] GitHub repo link
- [ ] Trupeer video URL
- [ ] Track selection: Track 01 - Data Rescue
- [ ] Written product description

No partial submissions:
- [ ] Confirm every required item is present before final submit

---

## 7. Demo Script Checklist

Suggested 5-minute Trupeer flow:
- [ ] 0:00 - Product name and user: compliance officer before audit
- [ ] 0:30 - Show Kaggle Track 01 dataset context
- [ ] 1:00 - Upload `track01_data_rescue.csv`
- [ ] 1:30 - Show Agent 1 findings on dashboard
- [ ] 2:00 - Show Agent 2 risk ranking
- [ ] 2:30 - Show Agent 3 suggested action and human decision
- [ ] 3:15 - Show Cognee Memory Trail
- [ ] 4:00 - Show Geodo real-world context
- [ ] 4:30 - Download Agent 4 Markdown report
- [ ] 4:50 - Close with success condition

Demo language:
- [ ] Say "Cognee is the memory layer between all four agents"
- [ ] Say "Every decision has a visible reason"
- [ ] Say "The product is built for a compliance officer, not an engineer"
- [ ] Say "Agent 4 produces a downloadable audit narrative"

---

## 8. Build Backlog

High priority:
- [x] Add a clear Exception & Fix Priority Board
- [x] Move support material into the right rail so the main workflow is easier to scan
- [ ] Convert issue review from individual-first to category-first quality problem review
- [ ] Add final remediation plan selection per issue category
- [ ] Add natural-language policy input box
- [ ] Add Agent 5 Policy Learner to summarize user decisions
- [ ] Store policy memory in local Cognee workspace and Cognee Cloud
- [ ] Show "Applied memory from previous review" in risk ranking and remediation recommendations
- [ ] Install Cognee SDK locally
- [ ] Run `npm run cognee:sdk`
- [ ] Run one upload and confirm Cognee SDK receives all four agent traces
- [ ] Add a visible recall query result from Cognee recall
- [ ] Improve orphaned customer detection by checking `track01_customers.csv`, not only ID format
- [ ] Add benchmark summary for total findings by issue type
- [ ] Add sample "Load Kaggle Dataset" button if browser file upload slows down demo
- [ ] Add report section for human decisions after decisions are changed
- [ ] Improve UI density for 5,000-row dataset output

Medium priority:
- [ ] Add issue filtering by risk and type
- [ ] Add search by record_id, customer_id, plant_id, or part_number
- [ ] Add CSV export of issue register
- [ ] Add confidence explanation for each issue type

Nice to have:
- [ ] Real Cognee Cloud integration
- [ ] Real Geodo screenshots or notes in product/report
- [ ] PyMC-style uncertainty scoring for issue priority
