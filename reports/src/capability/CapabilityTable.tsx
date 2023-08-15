import {
  Capability,
  Check,
  Requirement,
  exampleReport,
} from "./capabilityTypes";

type CapabilityTableProps = {
  capability?: Capability;
};

export const CheckRow = ({ check }: { check: Check }) => {
  return (
    <tr>
      <td>{check.name}</td>
      <td className={check.result === "pass" ? "pass" : "fail"}>
        {check.result === "pass" ? "PASS" : "FAIL"}
      </td>
      <td>
        <a href={check.detailLink}>Link</a>
      </td>
    </tr>
  );
};

const requirementRow = (requirement: Requirement) => {
  const checks = requirement.checks.map((c) => <CheckRow check={c} />);
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
        <a href={path}>{capability.name}</a>
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
      <td rowSpan={allRows.length + 1}>{capability.name}</td>
    </tr>,
    ...allRows,
  ];
};

export const CapabilityTable = ({
  capability = exampleReport.capability,
}: CapabilityTableProps) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th>Requirement</th>
            <th>Test Check</th>
            <th>Result</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <CapabilityRows capability={capability} />
        </tbody>
      </table>
    </>
  );
};
