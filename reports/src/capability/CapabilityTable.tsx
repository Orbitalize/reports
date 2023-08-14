import { CapabilityRow } from "./CapabilityRow";
import { ReportsReportTestSuiteActionReport } from "../types/TestRunReport";
import { Outlet } from "react-router-dom";

type CapabilityTableProps = {
  report: ReportsReportTestSuiteActionReport;
};

export const CapabilityTable = ({ report }: CapabilityTableProps) => {
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
          <CapabilityRow capability={report} />
        </tbody>
      </table>
      <br />
      <br />
      <Outlet />
    </>
  );
};
