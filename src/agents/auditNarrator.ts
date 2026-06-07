import { Issue } from '../utils/issueTypes';

interface CreateAuditReportInput {
  datasetName: string;
  rowCount: number;
  columnCount: number;
  issues: Issue[];
  memoryTrail: Array<{ agent: string; note: string }>;
}

export function createAuditReport(input: CreateAuditReportInput) {
  const title = `Audit Rescue Desk Report - ${input.datasetName}`;
  const issueRows = input.issues.length
    ? input.issues
        .map(
          (issue) =>
            `| ${issue.id} | ${issue.type} | ${issue.humanPriority} | ${issue.riskLevel} | ${issue.rows.join(', ')} | ${issue.visibleReason} | ${issue.suggestedAction} | ${issue.humanDecision || 'Pending'} |`
        )
        .join('\n')
    : '| None | None | None | None | None | No issues detected by current checks. | None | None |';

  const memoryRows = input.memoryTrail.length
    ? input.memoryTrail.map((entry) => `- **${entry.agent}:** ${entry.note}`).join('\n')
    : '- No memory entries recorded.';

  const reasoningRows = input.issues.length
    ? input.issues
        .map((issue) => {
          const steps = issue.agentTrail
            .map((step) => `  - ${step.agent} ${step.role}: ${step.decision} Reason: ${step.reason}`)
            .join('\n');
          return `- **${issue.id}**\n${steps}`;
        })
        .join('\n')
    : '- No issue reasoning recorded.';

  const markdown = `# ${title}

## Dataset

- File: ${input.datasetName}
- Rows reviewed: ${input.rowCount}
- Columns reviewed: ${input.columnCount}
- Issues detected: ${input.issues.length}

## Issue Register

| ID | Type | Fix priority | Risk | Rows | Reason | Suggested action | Human decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
${issueRows}

## Shared Memory Trail

${memoryRows}

## Agent Reasoning Trail

${reasoningRows}

## Audit Note

Suggested actions are not applied automatically. A compliance owner should approve, reject, or mark each issue for review before relying on the cleaned dataset.
`;

  return { title, markdown };
}
