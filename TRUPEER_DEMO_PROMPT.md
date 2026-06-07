# Trupeer Demo Prompt

Create a polished 5-minute product demo video for a B2B SaaS product called **Audit Rescue Desk**.

Audience:
Manufacturing compliance officers and hackathon judges. The user is non-technical and does not know SQL.

Tone:
Calm, professional, credible, business-product focused. Avoid sounding like a hackathon checklist. Present the product as an early but serious workflow for solving real audit data problems.

Core story:
Audit Rescue Desk helps a manufacturing compliance team rescue corrupted warehouse data four days before a regulatory audit. The product does not silently overwrite data. It detects quality problems, groups them into understandable categories, ranks audit risk, lets the human owner choose remediation plans, stores decisions in Cognee-powered Policy Memory, and exports an audit-ready report.

Mandatory tool narrative:
1. **Kaggle Track 01 dataset**
   - Show that the workflow uses the Harven Manufacturing data rescue benchmark.
   - Mention corrupted warehouse data, duplicates, unit conflicts, impossible values, and orphaned references.

2. **Cognee SDK**
   - Explain that Cognee is the memory layer.
   - Say: "Every agent handoff and user policy decision is written through Cognee SDK memory."
   - Show the Cognee Memory Trail and Local Cognee Workspace.
   - Mention three memory actions:
     - remember: store agent traces and user policy notes
     - recall: retrieve prior policy guidance
     - improve: optionally promote selected session memory into longer-term policy memory when an LLM key is configured
   - Emphasize low-cost mode: concise summaries are stored, not the full 5,000-row CSV.

3. **Geodo**
   - Explain that the Domain Expert uses Geodo to research real-world customers, companies, and market context.
   - Tie Geodo to business context: traceability, acquired plants, audit defensibility, and customer reference validation.

4. **Trupeer**
   - This video itself is the product walkthrough.
   - Make the flow clear enough that a judge can understand the product without reading code.

Suggested screen flow:

0:00 - Product opening
Show the product name and Product Brief.
Narration:
"Audit Rescue Desk is a data rescue workflow for manufacturing compliance officers. It helps a team find, prioritize, and explain corrupted audit data without writing SQL."

0:30 - Load data
Open the Dashboard.
Click "Load audit dataset" or upload the Kaggle CSV.
Show file name, rows, columns, uploaded dataset switcher, and raw data preview.
Narration:
"The officer can load the benchmark audit export or upload their own CSV. The system immediately shows what file is active and gives a raw preview so the user knows exactly what is being reviewed."

1:10 - Quality categories and priority queue
Show the Exception & Fix Priority Board.
Narration:
"Instead of overwhelming the user with hundreds of rows, the product groups problems into data quality categories and recommends a P0 to P3 fix priority."

1:50 - Human-in-the-loop review
Show Decision Passport.
Select an issue from the queue.
Change manual fix priority.
Click Accept Fix or Needs Review.
Narration:
"The system recommends, but the compliance owner decides. Each recommendation has evidence, a reason, and a human decision state."

2:30 - Agent workflow
Open Analyst Notes or Design Agents.
Narration:
"The workflow is split into specialist agents: data forensics, risk triage, compliance action advice, and audit narration. Each agent has a distinct role and produces visible reasoning."

3:05 - Policy Memory
Open Local Cognee Workspace.
Type a policy note such as:
"For acquired plants, orphaned customer references should be escalated before unit conflicts. Do not auto-fix shipment dates unless source documents are attached."
Click Save policy memory.
Click Recall with Cognee if available.
Narration:
"This is the long-term product moat. Cognee stores how this team ranks risk and handles remediation. The next audit can start with remembered policy context instead of starting from scratch."

3:50 - Geodo research
Show Geodo Research Dossier.
Narration:
"The Domain Expert uses Geodo to research real-world customers, companies, and market context. That research grounds the product in actual compliance pressure, not just synthetic CSV checks."

4:20 - Report export
Show Audit Report.
Click Download.
Narration:
"Agent 4 turns the issue evidence, human decisions, and memory trail into a plain-English audit packet."

4:45 - Closing
Show Dashboard or Tutorial long-term story.
Narration:
"The first audit finds the problems. The next audit starts with the team's remembered policy. Audit Rescue Desk is designed to become more aligned with each compliance team after every review."

Visual instructions:
- Use a clean product-demo style.
- Highlight clicks and important UI areas.
- Avoid flashy marketing animations.
- Use captions for the four key concepts: Detect, Prioritize, Decide, Remember.
- Keep the video under 5 minutes.

Final tagline:
"Audit Rescue Desk turns broken manufacturing data into a defensible audit workflow, and Cognee turns each review into reusable policy memory."
