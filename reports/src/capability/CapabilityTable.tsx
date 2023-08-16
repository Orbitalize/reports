import {useLocation, useNavigate} from "react-router-dom";
import {Capability, Check, Requirement} from "./capabilityTypes";

type CapabilityTableProps = {
  capability: Capability;
};

export const CheckLabel = ({name, docUrl}: {name: string; docUrl?: string}) => {
  return docUrl ? <a href={docUrl}>{name}</a> : <>{name}</>;
};

export const CheckRow = ({check}: {check: Check}) => {
  const separator = " :: ";
  const checkSource = (
    <>
      <CheckLabel {...check.scenario} />
      {separator}
      <CheckLabel {...check.case} />
      {separator}
      <CheckLabel {...check.step} />
      {separator}
      <CheckLabel name={check.name} />
    </>
  );

  return (
    <tr>
      <td>{checkSource}</td>
      <td className={check.result === "pass" ? "pass" : "fail"}>
        {check.result === "pass" ? "PASS" : "FAIL"}
      </td>
      <td>
        <a href={check.detailsUrl}>Link</a>
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
  const navigate = useNavigate();
  return (
    <tr>
      <td colSpan={2}>
        <a onClick={() => navigate(path, {relative: "path"})}>
          {capability.name} ({capability.participant_id})
        </a>
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

export const CapabilityRows = ({capability}: {capability: Capability}) => {
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

export const CapabilityDebug = ({capability}: {capability: Capability}) => {
  return <code><pre style={{textAlign:"left"}}>{JSON.stringify(capability, null, 2)}</pre></code>;
};

export const CapabilityTable = ({capability}: CapabilityTableProps) => {
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
      <CapabilityDebug capability={capability} />
    </>
  );
};
