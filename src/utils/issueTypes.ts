export type IssueType =
  | 'Duplicate Record'
  | 'Unit Conflict'
  | 'Contradiction'
  | 'Missing Value'
  | 'Impossible Value'
  | 'Orphaned Reference';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type HumanDecision = 'Accept Fix' | 'Reject' | 'Needs Review' | '';
export type FixPriority = 'P0 Block Audit' | 'P1 Fix Before Review' | 'P2 Review Soon' | 'P3 Track';

export interface AgentReasoningStep {
  agent: string;
  role: string;
  focus: string;
  workstyle: string;
  decision: string;
  reason: string;
  evidenceUsed: string;
}

export interface Issue {
  id: string;
  type: IssueType;
  rows: number[];
  evidence: string;
  whyItMatters: string;
  riskLevel: RiskLevel;
  confidence: number;
  recommendedPriority: FixPriority;
  humanPriority: FixPriority;
  priorityReason: string;
  suggestedAction: string;
  visibleReason: string;
  humanDecision: HumanDecision;
  agentTrail: AgentReasoningStep[];
}

export interface ParsedDatasetInfo {
  fileName: string;
  rowCount: number;
  columnCount: number;
}
