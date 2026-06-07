# Cognee SDK Setup

Official docs:
- Remember: https://docs.cognee.ai/core-concepts/main-operations/remember
- Recall: https://docs.cognee.ai/core-concepts/main-operations/recall
- Improve: https://docs.cognee.ai/core-concepts/main-operations/improve

## What We Use

We use the local Cognee Python SDK, not Cognee Cloud.

The React app calls a local Python bridge:

```text
React app -> server/cognee_sdk_bridge.py -> cognee.remember / cognee.recall / cognee.improve
```

This gives us real Cognee SDK calls while keeping the browser simple.

## Install

```powershell
python -m pip install cognee
```

## Configure

Create `.env` in the project root:

```text
COGNEE_LOCAL_DATASET=audit_rescue_desk_policy_memory
COGNEE_SESSION_ID=audit_rescue_desk_demo
COGNEE_SDK_PORT=8787
COGNEE_ALLOWED_ORIGIN=http://localhost:5173
LLM_API_KEY=optional-openai-api-key-for-permanent-cognee-graph-memory
```

Do not commit `.env`.

## Low-Cost Mode

Default operation is low-cost session memory:

```text
cognee.remember(..., session_id=..., self_improvement=False)
```

This stores real Cognee session memory without automatically running the heavier permanent graph/self-improvement pipeline.

## Self-Evolving Policy Memory

When the user provides final risk ranking, remediation choices, and a natural-language policy note, the bridge can store it with:

```text
cognee.remember(policy_text, session_id=..., self_improvement=False)
```

For the demo, the Local Cognee Workspace panel now has real SDK actions:

- `Save policy memory` calls `cognee.remember`
- `Recall with Cognee` calls `cognee.recall`
- `Improve memory` calls `cognee.improve`

The first two are the default low-cost proof of actual Cognee SDK usage.

If we want to show deeper self-evolution, and an OpenAI key is available, we can promote selected policy summaries into permanent memory:

```text
cognee.remember(policy_text, dataset_name=..., self_improvement=False)
cognee.improve(dataset_name=..., session_ids=[...])
```

To control cost, we only send concise policy summaries, not the full 5,000-row CSV.

## Run

Terminal 1:

```powershell
npm run cognee:sdk
```

Terminal 2:

```powershell
npm run dev
```

The app should show `Cognee SDK connected`.

## Demo Line

> We use the Cognee SDK locally as the memory layer. Every agent handoff and user policy decision is written through `cognee.remember`, then future recommendations can call `cognee.recall` and `cognee.improve` to evolve the team's audit policy memory.
