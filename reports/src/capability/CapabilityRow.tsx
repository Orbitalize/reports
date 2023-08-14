import { ReportsReportTestSuiteActionReport } from "../types/TestRunReport";

type CapabilityRowProps = {
  capability: ReportsReportTestSuiteActionReport;
};

const getTestSuiteRows = ({
  actions,
}: {
  actions: ReportsReportTestSuiteActionReport[];
}) => {
  const children = actions
    .filter(
      (a: ReportsReportTestSuiteActionReport) =>
        "test_suite" in a &&
        !a.test_suite?.actions.some((b) => "action_generator" in b)
    )
    .map(({ test_suite }, i) => {
      return (
        <tr key={test_suite!.name}>
          <td colSpan={2}>{<a href={`${i}`}>{test_suite!.name}</a>}</td>
          <td colSpan={2} className={test_suite!.successful ? "pass" : "fail"}>
            {test_suite!.successful ? "PASS" : "FAIL"}
          </td>
        </tr>
      );
    });
  if (!children.length) return [];

  const header = (
    <tr key="header">
      <th colSpan={2}>Child Capability</th>
      <th colSpan={2}>Result</th>
    </tr>
  );
  return [header, ...children];
};

const getActionRows = (capabity: ReportsReportTestSuiteActionReport) => {
  const rows = capabity.action_generator?.actions.map((a) => (
    <tr>
      <td>{a.test_scenario?.name}</td>
      <td className={a.test_scenario?.successful ? "pass" : "fail"}>
        {a.test_scenario?.successful ? "PASS" : "FAIL"}
      </td>
      <td>
        <a href={a.test_scenario?.documentation_url}>Link</a>
      </td>
    </tr>
  ));
  return rows || [];
};

const getActionGeneratorRows = (
  capability: ReportsReportTestSuiteActionReport
) => {
  console.log("suite", capability.test_suite);
  const actionRows = capability.test_suite?.actions
    .filter((a) => "action_generator" in a)
    .map((child) => {
      return getActionRows(child);
    })
    .flat(1);

  if (!actionRows?.length) {
    return null;
  }

  return (
    <>
      <tr>
        <td rowSpan={1 + (actionRows?.length || 0)}>
          {capability.test_suite?.name}
        </td>
      </tr>
      {actionRows}
    </>
  );
};

export const CapabilityRow = ({ capability }: CapabilityRowProps) => {
  if (!capability.test_suite) return null;
  console.log("Capability", capability);

  const requirementRows = getActionGeneratorRows(capability);
  const childRows = getTestSuiteRows(capability.test_suite);
  const titleRowSpan = 8;
  return (
    <>
      <tr>
        <td rowSpan={titleRowSpan}>{capability.test_suite.name}</td>
      </tr>
      {requirementRows}
      {childRows}
    </>
  );
};
