import { useState, useEffect, useMemo } from "react";
import { ReportsReportTestRunReport } from "../types/TestRunReport";
import { RouteObject } from "react-router-dom";
import { parseReport } from "./reportParser";
import { getNavFromCapability } from "./reportNavigation";

const reportUrl = "/report_uspace.json";

type UseReportProps = {
  report?: ReportsReportTestRunReport;
};

type UseReportReturn = {
  loading: boolean;
  error?: string;
  report?: ReportsReportTestRunReport;
  nav: RouteObject[];
};

export const useReport = ({
  report: _report,
}: UseReportProps): UseReportReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [report, setReport] = useState<ReportsReportTestRunReport | undefined>(
    _report
  );

  useEffect(() => {
    const fetchReport = async () => {
      if (_report) return;
      setLoading(true);
      try {
        const res = await fetch(reportUrl);
        if (res.status === 404) {
          throw new Error("Report not found");
        }
        const json = await res.json();
        setReport(json as ReportsReportTestRunReport);
      } catch (err) {
        console.error(err);
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const parsedReport = useMemo(
    () => (report ? parseReport(report) : undefined),
    [report]
  );
  const nav = useMemo(
    () =>
      parsedReport
        ? getNavFromCapability(parsedReport.capability, parsedReport)
        : [],
    [parsedReport]
  );
  return { loading, error, report, nav };
};
