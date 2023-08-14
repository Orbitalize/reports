import { useState, useEffect, useMemo } from "react";
import {
  ReportsReportTestRunReport,
  ReportsReportTestSuiteActionReport,
} from "../types/TestRunReport";
import { RouteObject } from "react-router-dom";
import { parseReport } from "./reportParser";
import { getNavFromCapability } from "./reportNavigation";

const reportUrl =
  "/monitoring-tests-reports/uss_qualifier/output/report_uspace.json";

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

  const parsedReport = useMemo(
    () => (report ? parseReport(report) : undefined),
    [report]
  );

  const nav = useMemo(
    () => (parsedReport ? getNavFromCapability(parsedReport.capability) : []),
    [parsedReport]
  );

  console.log("Nav", nav);
  return { report, nav };
};
