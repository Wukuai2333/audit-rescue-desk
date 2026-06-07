import { Issue } from '../utils/issueTypes';
import { AgentPersonaSet, defaultAgentPersonas } from './agentPersonas';

const actionByType: Record<Issue['type'], string> = {
  Contradiction: 'Pause this row for human review and verify the source document before using it in audit totals.',
  'Impossible Value': 'Hold this record from audit totals until the impossible value is corrected from source evidence.',
  'Orphaned Reference': 'Verify the referenced customer or master record before treating this row as audit-ready.',
  'Unit Conflict': 'Confirm the correct unit of measure with the production source and standardize only after approval.',
  'Duplicate Record': 'Keep one record, mark the duplicate for exclusion, and preserve both row numbers in the report.',
  'Missing Value': 'Request the missing value from the source owner or mark the record as incomplete for audit review.'
};

const actionReasonByType: Record<Issue['type'], string> = {
  Contradiction: 'The row should not be trusted until a person checks source documents because the numbers disagree.',
  'Impossible Value': 'The safest action is containment: hold the record out of audit totals until source evidence corrects it.',
  'Orphaned Reference': 'A compliance officer needs traceability, so the reference must be verified before approval.',
  'Unit Conflict': 'Standardizing units without approval could create a new audit error, so the unit owner must confirm.',
  'Duplicate Record': 'Removing a duplicate silently is risky; the report should preserve both rows and the exclusion reason.',
  'Missing Value': 'The missing field needs owner input or an explicit incomplete-record note.'
};

export function adviseFixes(issues: Issue[], personas: AgentPersonaSet = defaultAgentPersonas): Issue[] {
  return issues.map((issue) => ({
    ...issue,
    suggestedAction: actionByType[issue.type],
    humanDecision: issue.humanDecision || '',
    agentTrail: [
      ...issue.agentTrail,
      {
        agent: `${personas.advisor.id} - ${personas.advisor.name}`,
        role: personas.advisor.role,
        focus: personas.advisor.focus,
        workstyle: personas.advisor.workstyle,
        decision: actionByType[issue.type],
        reason: actionReasonByType[issue.type],
        evidenceUsed: `Risk ${issue.riskLevel}; confidence ${issue.confidence}%; why it matters: ${issue.whyItMatters}`
      }
    ]
  }));
}
