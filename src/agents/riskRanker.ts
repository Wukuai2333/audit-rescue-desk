import { FixPriority, Issue, RiskLevel } from '../utils/issueTypes';
import { AgentPersonaSet, defaultAgentPersonas } from './agentPersonas';

const riskByType: Record<Issue['type'], RiskLevel> = {
  Contradiction: 'Critical',
  'Impossible Value': 'Critical',
  'Orphaned Reference': 'High',
  'Unit Conflict': 'High',
  'Duplicate Record': 'Medium',
  'Missing Value': 'Low'
};

const confidenceByType: Record<Issue['type'], number> = {
  Contradiction: 94,
  'Impossible Value': 93,
  'Orphaned Reference': 89,
  'Unit Conflict': 90,
  'Duplicate Record': 88,
  'Missing Value': 82
};

const priorityByType: Record<Issue['type'], FixPriority> = {
  Contradiction: 'P0 Block Audit',
  'Impossible Value': 'P0 Block Audit',
  'Orphaned Reference': 'P1 Fix Before Review',
  'Unit Conflict': 'P1 Fix Before Review',
  'Duplicate Record': 'P2 Review Soon',
  'Missing Value': 'P3 Track'
};

const riskOrder: Record<RiskLevel, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

const priorityOrder: Record<FixPriority, number> = {
  'P0 Block Audit': 4,
  'P1 Fix Before Review': 3,
  'P2 Review Soon': 2,
  'P3 Track': 1
};

const riskReasonByType: Record<Issue['type'], string> = {
  Contradiction: 'Contradictory totals can directly invalidate audit numbers, so this goes to the top of the queue.',
  'Impossible Value': 'Impossible values indicate source corruption and can break downstream audit reconciliation.',
  'Orphaned Reference': 'A record that cannot be traced to a valid master reference weakens audit traceability.',
  'Unit Conflict': 'Mixed units can turn correct-looking quantities into wrong totals.',
  'Duplicate Record': 'Duplicates can overstate counts, but they are often easier to isolate once found.',
  'Missing Value': 'Missing fields need cleanup, but single blanks are usually lower risk than contradictions.'
};

const priorityReasonByType: Record<Issue['type'], string> = {
  Contradiction: 'Contradictory totals can block audit readiness because the reported numbers cannot both be true.',
  'Impossible Value': 'Impossible values should be contained before review because they point to corrupted source data.',
  'Orphaned Reference': 'Records without valid traceability should be fixed before audit review begins.',
  'Unit Conflict': 'Unit conflicts can create wrong totals, so they should be resolved before review.',
  'Duplicate Record': 'Duplicates can usually be reviewed after blockers are contained, but before final packet export.',
  'Missing Value': 'Missing values should be tracked and filled, but they are usually lower priority than contradictions.'
};

export function rankIssues(
  issues: Array<Omit<Issue, 'riskLevel' | 'confidence' | 'recommendedPriority' | 'humanPriority' | 'priorityReason' | 'suggestedAction' | 'humanDecision'>>,
  personas: AgentPersonaSet = defaultAgentPersonas
): Issue[] {
  return issues
    .map((issue) => {
      const persona = personas.ranker;
      const riskLevel = riskByType[issue.type];
      const confidence = confidenceByType[issue.type];
      const recommendedPriority = priorityByType[issue.type];
      return {
        ...issue,
        riskLevel,
        confidence,
        recommendedPriority,
        humanPriority: recommendedPriority,
        priorityReason: priorityReasonByType[issue.type],
        suggestedAction: '',
        humanDecision: '' as const,
        agentTrail: [
          ...issue.agentTrail,
          {
            agent: `${persona.id} - ${persona.name}`,
            role: persona.role,
            focus: persona.focus,
            workstyle: persona.workstyle,
            decision: `Ranked ${riskLevel} risk with ${confidence}% confidence and recommended ${recommendedPriority}.`,
            reason: `${riskReasonByType[issue.type]} ${priorityReasonByType[issue.type]}`,
            evidenceUsed: `${issue.type}; affected rows ${issue.rows.join(', ')}; Agent 1 evidence: ${issue.evidence}`
          }
        ]
      };
    })
    .sort((a, b) => {
      const priorityDelta = priorityOrder[b.humanPriority] - priorityOrder[a.humanPriority];
      return priorityDelta || riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });
}
