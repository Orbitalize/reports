import {useNavigate} from "react-router-dom";
import {Capability, Check, Requirement} from "./capabilityTypes";
import {useEffect, useState} from "react";

type CapabilityTableProps = {
  capability: Capability;
};

export const CheckLabel = ({name, docUrl}: {name: string; docUrl?: string}) => {
  return docUrl ? <a href={docUrl}>{name}</a> : <>{name}</>;
};

export const CheckRow = ({check}: {check: Check}) => {
  const [showDetails, setShowDetails] = useState(false);
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
        <a onClick={() => setShowDetails(true)}>Link</a>
        {/* TODO: Beautify popup / move to a dedicated page */}
        {showDetails && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#fff",
            }}
          >
            <a onClick={() => setShowDetails(false)}>
              <i>Click anywhere to close.</i>
              <h2>
                {check.name} was evaluated in step {check.step.name}. Details:
              </h2>
              <pre>{JSON.stringify(check.details, null, 2)}</pre>
            </a>
          </div>
        )}
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
  // return <code><pre style={{textAlign:"left"}}>{JSON.stringify(capability, null, 2)}</pre></code>;
  useEffect(
    () => console.info("Displayed Capability: ", capability),
    [capability]
  );
  return <></>;
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
