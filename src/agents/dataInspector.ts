import { Issue } from '../utils/issueTypes';
import { AgentPersonaSet, defaultAgentPersonas } from './agentPersonas';

type DraftIssue = Omit<Issue, 'riskLevel' | 'confidence' | 'recommendedPriority' | 'humanPriority' | 'priorityReason' | 'suggestedAction' | 'humanDecision'>;

const emptyValues = new Set(['', 'n/a', 'na', 'null', 'undefined', '-']);

function normalize(value: string | undefined) {
  return (value ?? '').trim().toLowerCase();
}

function rowNumber(index: number) {
  return index + 2;
}

function findFirstHeader(headers: string[], candidates: string[]) {
  return headers.find((header) => candidates.some((candidate) => normalize(header).includes(candidate)));
}

function getRecordKey(row: Record<string, string>, headers: string[]) {
  const idHeader = findFirstHeader(headers, ['part_number', 'part', 'product', 'sku', 'item', 'batch', 'lot']);
  if (idHeader && row[idHeader]) {
    return normalize(row[idHeader]);
  }

  return headers
    .map((header) => normalize(row[header]))
    .filter(Boolean)
    .join('|');
}

function getNumericValue(value: string | undefined) {
  const cleaned = (value ?? '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return cleaned ? Number(cleaned[0]) : null;
}

function getDateValue(value: string | undefined) {
  const date = Date.parse(value ?? '');
  return Number.isNaN(date) ? null : date;
}

function createFinding(input: Omit<DraftIssue, 'agentTrail'>, personas: AgentPersonaSet): DraftIssue {
  const persona = personas.inspector;
  return {
    ...input,
    agentTrail: [
      {
        agent: `${persona.id} - ${persona.name}`,
        role: persona.role,
        focus: persona.focus,
        workstyle: persona.workstyle,
        decision: `Flagged as ${input.type}.`,
        reason: input.visibleReason,
        evidenceUsed: input.evidence
      }
    ]
  };
}

export function inspectData(rows: Record<string, string>[], headers: string[], personas: AgentPersonaSet = defaultAgentPersonas): DraftIssue[] {
  const issues: DraftIssue[] = [];
  const seenRows = new Map<string, number>();
  const seenUnitsByKey = new Map<string, { unit: string; row: number }>();

  const unitHeader = findFirstHeader(headers, ['unit', 'uom']);
  const quantityHeader = findFirstHeader(headers, ['quantity', 'qty', 'amount', 'count']);
  const totalHeader = findFirstHeader(headers, ['total', 'expected', 'declared']);
  const weightHeader = findFirstHeader(headers, ['weight']);
  const productionDateHeader = findFirstHeader(headers, ['production_date', 'production date', 'made']);
  const shipDateHeader = findFirstHeader(headers, ['ship_date', 'ship date', 'shipped']);
  const customerHeader = findFirstHeader(headers, ['customer_id', 'customer id', 'customer']);

  rows.forEach((row, index) => {
    const displayRow = rowNumber(index);
    const rowSignature = headers.map((header) => normalize(row[header])).join('|');
    const previousRow = seenRows.get(rowSignature);

    if (previousRow) {
      issues.push(createFinding({
        id: `ISS-${issues.length + 1}`,
        type: 'Duplicate Record',
        rows: [previousRow, displayRow],
        evidence: `Rows ${previousRow} and ${displayRow} contain the same values across the uploaded columns.`,
        whyItMatters: 'Duplicate manufacturing records can overstate production, shipment, or inspection counts.',
        visibleReason: 'The same record appears more than once.'
      }, personas));
    } else if (rowSignature.replace(/\|/g, '')) {
      seenRows.set(rowSignature, displayRow);
    }

    headers.forEach((header) => {
      if (emptyValues.has(normalize(row[header]))) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Missing Value',
          rows: [displayRow],
          evidence: `Column "${header}" is blank or unavailable on row ${displayRow}.`,
          whyItMatters: 'Missing audit fields make it harder to prove what happened during production or inspection.',
          visibleReason: `Row ${displayRow} is missing "${header}".`
        }, personas));
      }
    });

    if (unitHeader) {
      const key = getRecordKey(row, headers);
      const unit = normalize(row[unitHeader]);
      const previousUnit = seenUnitsByKey.get(key);

      if (key && unit && previousUnit && previousUnit.unit !== unit) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Unit Conflict',
          rows: [previousUnit.row, displayRow],
          evidence: `The same product or batch uses "${previousUnit.unit}" on row ${previousUnit.row} and "${unit}" on row ${displayRow}.`,
          whyItMatters: 'Mixed units can cause incorrect totals and make audit evidence unreliable.',
          visibleReason: 'The same item is reported with conflicting units.'
        }, personas));
      } else if (key && unit) {
        seenUnitsByKey.set(key, { unit, row: displayRow });
      }
    }

    if (quantityHeader && totalHeader) {
      const quantity = getNumericValue(row[quantityHeader]);
      const total = getNumericValue(row[totalHeader]);
      if (quantity !== null && total !== null && quantity > total) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Contradiction',
          rows: [displayRow],
          evidence: `"${quantityHeader}" is ${quantity}, but "${totalHeader}" is ${total}.`,
          whyItMatters: 'A quantity greater than its declared total is a contradiction auditors will question.',
          visibleReason: `Row ${displayRow} has a quantity that is greater than its total.`
        }, personas));
      }
    }

    if (quantityHeader) {
      const quantity = getNumericValue(row[quantityHeader]);
      if (quantity !== null && (quantity <= 0 || quantity > 10000)) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Impossible Value',
          rows: [displayRow],
          evidence: `"${quantityHeader}" is ${quantity}, which is outside the expected manufacturing range.`,
          whyItMatters: 'Impossible quantities can distort production totals and point to corrupted source data.',
          visibleReason: `Row ${displayRow} has an impossible quantity.`
        }, personas));
      }
    }

    if (weightHeader) {
      const weight = getNumericValue(row[weightHeader]);
      if (weight !== null && weight <= 0) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Impossible Value',
          rows: [displayRow],
          evidence: `"${weightHeader}" is ${weight}, but weight must be greater than zero.`,
          whyItMatters: 'Invalid weights can break shipment, inventory, and audit reconciliation.',
          visibleReason: `Row ${displayRow} has an impossible weight.`
        }, personas));
      }
    }

    if (productionDateHeader && shipDateHeader) {
      const productionDate = getDateValue(row[productionDateHeader]);
      const shipDate = getDateValue(row[shipDateHeader]);
      if (productionDate !== null && shipDate !== null && shipDate < productionDate) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Impossible Value',
          rows: [displayRow],
          evidence: `"${shipDateHeader}" occurs before "${productionDateHeader}".`,
          whyItMatters: 'A shipment before production is an impossible timeline for audit evidence.',
          visibleReason: `Row ${displayRow} ships before it was produced.`
        }, personas));
      }
    }

    if (customerHeader) {
      const customerId = (row[customerHeader] ?? '').trim();
      if (customerId && !/^CU-\d{4}$/i.test(customerId)) {
        issues.push(createFinding({
          id: `ISS-${issues.length + 1}`,
          type: 'Orphaned Reference',
          rows: [displayRow],
          evidence: `"${customerHeader}" is "${customerId}", which does not match the known customer id format from the companion file.`,
          whyItMatters: 'Orphaned customer references prevent auditors from tracing a record to a valid customer.',
          visibleReason: `Row ${displayRow} points to a customer reference that may not exist.`
        }, personas));
      }
    }
  });

  return issues;
}
