import { Link as RouterLink } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Link,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Capability, Check, Requirement } from "./capabilityTypes";
import { useEffect, useState } from "react";
import { useMatches } from "react-router-dom";
import { ReactNode } from "react";

type CapabilityTableProps = {
  capability: Capability;
};

export const CheckLabel = ({
  name,
  docUrl,
}: {
  name: string;
  docUrl?: string;
}) => {
  return docUrl ? <Link href={docUrl}>{name}</Link> : <>{name}</>;
};

const getCheckId = (check: Check): string => {
  return [
    check.scenario.name,
    check.case.name,
    check.step.name,
    check.name,
  ].join("-");
};

const CheckStatusTag = ({ check }: { check: Check }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <Chip
        label={check.result === "pass" ? "PASS" : "FAIL"}
        color={check.result === "pass" ? "success" : "error"}
        onClick={() => setShowDetails(true)}
      />
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => setShowDetails(false)}
        open={showDetails}
      >
        <DialogContent>
          <Typography variant="h2" gutterBottom>
            {check.name} was evaluated in step {check.step.name}
          </Typography>
          <Typography>Details:</Typography>
          <pre>{JSON.stringify(check.details, null, 2)}</pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AggregatedStatusTag = ({ checks }: { checks: Check[] }) => {
  const successfulChecks = checks.reduce(
    (acc, check) => acc + (check.result === "pass" ? 1 : 0),
    0
  );
  const pass = successfulChecks === checks.length;
  return (
    <Chip label={pass ? "PASS" : "FAIL"} color={pass ? "success" : "error"} />
  );
};

const CheckAggregateRow = ({ checks }: { checks: Check[] }) => {
  const separator = " :: ";
  const checkSource = (
    <>
      <CheckLabel {...checks[0].scenario} />
      {separator}
      <CheckLabel {...checks[0].case} />
      {separator}
      <CheckLabel {...checks[0].step} />
      {separator}
      <CheckLabel name={checks[0].name} />
    </>
  );
  return (
    <tr>
      <td colSpan={2} style={{ padding: 0 }}>
        <Accordion square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              "& .MuiAccordionSummary-content": {
                display: "flex",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography>{checkSource}</Typography>
            <AggregatedStatusTag checks={checks} />
          </AccordionSummary>
          <AccordionDetails>
            <div className="checkStatusGrid">
              {checks.map((c) => (
                <CheckStatusTag check={c} />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </td>
    </tr>
  );
};

const checkAggregatedRows = (requirement: Requirement) => {
  // Group checks by ID
  const aggregatedChecks = requirement.checks.reduce((acc, check) => {
    const checkId = getCheckId(check);
    if (checkId in acc) {
      return { ...acc, [checkId]: [...acc[checkId], check] };
    } else {
      return { ...acc, [checkId]: [check] };
    }
  }, {} as Record<string, Check[]>);

  // For each check, display a checkRow
  // Aggregate titles by check ID
  return Object.keys(aggregatedChecks)
    .map((key) => {
      const checks = aggregatedChecks[key];
      return <CheckAggregateRow checks={checks} />;
    })
    .flat();
};

const requirementRow = (requirement: Requirement) => {
  console.log(requirement);
  // const checks = requirement.checks.map((c) => <CheckRow check={c} />);
  const checks = checkAggregatedRows(requirement);
  const requirementHeader = (
    <tr>
      <td rowSpan={checks.length + 1}>{requirement.name}</td>
      {!checks.length && <td colSpan={3}>Not tested</td>}
    </tr>
  );

  if (checks.length) {
    return [requirementHeader, ...checks];
  } else {
    return [requirementHeader];
  }
};

export const ChildCapabilityRow = ({
  capability,
  path,
}: {
  capability: Capability;
  path: string;
}) => {
  return (
    <tr>
      <td colSpan={2}>
        <Link to={path} component={RouterLink}>
          {capability.name} ({capability.participant_id})
        </Link>
      </td>
      <td
        className={capability.result === "pass" ? "pass" : "fail"}
        colSpan={2}
      >
        {capability.result === "pass" ? "PASS" : "FAIL"}
      </td>
    </tr>
  );
};

const ChildCapabilityHeader = () => {
  return (
    <tr>
      <th colSpan={2}>Child Capability</th>
      <th colSpan={2}>Result</th>
    </tr>
  );
};

export const CapabilityRows = ({ capability }: { capability: Capability }) => {
  const requirements = capability.requirements
    .flatMap((r) => requirementRow(r))
    .flat();
  const childCapabilities = capability.childCapabilities.map((c, i) => (
    <ChildCapabilityRow capability={c} path={i.toString()} />
  ));
  const childTable = childCapabilities
    ? [<ChildCapabilityHeader />, ...childCapabilities]
    : [];

  const allRows = [...requirements, ...childTable];
  return [
    <tr>
      <td rowSpan={allRows.length + 1}>
        {capability.name} ({capability.participant_id})
      </td>
    </tr>,
    ...allRows,
  ];
};

export const CapabilityDebug = ({ capability }: { capability: Capability }) => {
  // return <code><pre style={{textAlign:"left"}}>{JSON.stringify(capability, null, 2)}</pre></code>;
  useEffect(
    () => console.info("Displayed Capability: ", capability),
    [capability]
  );
  return <></>;
};

type CrumbHandle = { crumb: () => ReactNode };
function CapabolityBreadcrumbs() {
  const matches = useMatches();
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) =>
      Boolean((match.handle as CrumbHandle | undefined)?.crumb)
    )
    .slice(0, -1) // Skip last crumb
    .map((match) => (match.handle as CrumbHandle).crumb())
    .reverse();

  return <Breadcrumbs separator="<=">{crumbs}</Breadcrumbs>;
}

export const CapabilityTable = ({ capability }: CapabilityTableProps) => {
  if (!capability) {
    return <span>Capability not found</span>;
  }
  return (
    <>
      <CapabolityBreadcrumbs />
      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th>Requirement</th>
            <th colSpan={2}>Test Check</th>
          </tr>
        </thead>
        <tbody>
          <CapabilityRows capability={capability} />
        </tbody>
      </table>
      <CapabilityDebug capability={capability} />
    </>
  );
};
