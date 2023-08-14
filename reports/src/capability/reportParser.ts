import {
  ReportsReportTestRunReport,
  ReportsReportTestSuiteActionReport,
} from "../types/TestRunReport";
import { Capability, Report, exampleReport } from "./capabilityTypes";

const parseTestSuite = (testSuite: ReportsReportTestSuiteActionReport) => {
  console.log("Parse test suite", testSuite);
  if (!testSuite.test_suite) return null;
  const capabilities = testSuite.test_suite.capability_evaluations.map(
    (c): Capability => ({
      name: `${c.capability_id} - ${c.participant_id}`,
      requirements: [],
      childCapabilities: [],
      result: c.verified ? "pass" : "fail",
    })
  );
  console.log("Parsed capbilities", capabilities);
};

export const parseReport = (report: ReportsReportTestRunReport): Report => {
  // FixMe: Actually parse the report
  console.log("Input Report", report);
  const parsed = parseTestSuite(report.report);
  console.log("Parsed report", parsed);
  return exampleReport;
};
