import { AgentKey, AgentPersonaSet, defaultAgentPersonas } from './agentPersonas';

const roleToKey: Record<string, AgentKey> = {
  inspector: 'inspector',
  ranker: 'ranker',
  advisor: 'advisor',
  narrator: 'narrator'
};

function getValue(section: string, label: string) {
  const match = section.match(new RegExp(`^- ${label}:\\s*(.+)$`, 'im'));
  return match?.[1]?.trim();
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AG';
}

export function parseAgentPlaybookMarkdown(markdown: string): AgentPersonaSet {
  const next: AgentPersonaSet = structuredClone(defaultAgentPersonas);
  const sections = markdown.split(/^##\s+/m).slice(1);

  sections.forEach((section) => {
    const firstLine = section.split(/\r?\n/)[0]?.toLowerCase() ?? '';
    const key = Object.entries(roleToKey).find(([token]) => firstLine.includes(token))?.[1];
    if (!key) {
      return;
    }

    const current = next[key];
    const name = getValue(section, 'Name') ?? current.name;
    next[key] = {
      ...current,
      name,
      role: getValue(section, 'Role') ?? current.role,
      initials: getValue(section, 'Initials') ?? getInitials(name),
      focus: getValue(section, 'Focus') ?? current.focus,
      workstyle: getValue(section, 'Workstyle') ?? current.workstyle,
      decisionStyle: getValue(section, 'Decision bias') ?? current.decisionStyle,
      output: getValue(section, 'Output') ?? current.output
    };
  });

  return next;
}

export function serializeAgentPlaybook(personas: AgentPersonaSet) {
  return `# Audit Rescue Desk Agent Playbook

Edit this file to change the four specialist agents. Keep the section names and bullet labels.

## Inspector
- Name: ${personas.inspector.name}
- Role: ${personas.inspector.role}
- Initials: ${personas.inspector.initials}
- Focus: ${personas.inspector.focus}
- Workstyle: ${personas.inspector.workstyle}
- Decision bias: ${personas.inspector.decisionStyle}
- Output: ${personas.inspector.output}

## Ranker
- Name: ${personas.ranker.name}
- Role: ${personas.ranker.role}
- Initials: ${personas.ranker.initials}
- Focus: ${personas.ranker.focus}
- Workstyle: ${personas.ranker.workstyle}
- Decision bias: ${personas.ranker.decisionStyle}
- Output: ${personas.ranker.output}

## Advisor
- Name: ${personas.advisor.name}
- Role: ${personas.advisor.role}
- Initials: ${personas.advisor.initials}
- Focus: ${personas.advisor.focus}
- Workstyle: ${personas.advisor.workstyle}
- Decision bias: ${personas.advisor.decisionStyle}
- Output: ${personas.advisor.output}

## Narrator
- Name: ${personas.narrator.name}
- Role: ${personas.narrator.role}
- Initials: ${personas.narrator.initials}
- Focus: ${personas.narrator.focus}
- Workstyle: ${personas.narrator.workstyle}
- Decision bias: ${personas.narrator.decisionStyle}
- Output: ${personas.narrator.output}
`;
}
