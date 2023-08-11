import { useState, useEffect, useMemo } from "react";
import {
  ReportsReportTestRunReport,
  ReportsReportTestSuiteActionReport,
} from "../types/TestRunReport";
import { RouteObject } from "react-router-dom";
import { CapabilityTable } from "./CapabilityTable";

const reportUrl =
  "/monitoring-tests-reports/uss_qualifier/output/report_uspace.json";

const getNavFromReport = (
  report: ReportsReportTestSuiteActionReport,
  path: string = ""
): RouteObject => {
  const children = report.test_suite?.actions.map((a, i) =>
    getNavFromReport(a, `${i}`)
  );
  return {
    path: `${path}`,
    element: <CapabilityTable report={report} />,
    children,
  };
};

type UseReportReturn = {
  report?: ReportsReportTestRunReport;
  nav: RouteObject[];
};

export const useReport = (): UseReportReturn => {
  const [report, setReport] = useState<ReportsReportTestRunReport>();

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch(reportUrl);
      const json = await res.json();
      setReport(json as ReportsReportTestRunReport);
    };
    fetchReport();
  }, []);

  const nav = useMemo(
    () => (report ? [getNavFromReport(report.report)] : []),
    [report]
  );

  return { report, nav };
};
