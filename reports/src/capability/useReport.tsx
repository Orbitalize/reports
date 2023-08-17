import {useState, useEffect, useMemo} from "react";
import {
  ReportsReportTestRunReport,
} from "../types/TestRunReport";
import {RouteObject} from "react-router-dom";
import {parseReport} from "./reportParser";
import {getNavFromCapability} from "./reportNavigation";

const reportUrl = "/report_uspace.json";

type UseReportProps = {
  report?: ReportsReportTestRunReport
}

type UseReportReturn = {
  loading: boolean,
  report?: ReportsReportTestRunReport;
  nav: RouteObject[];
};

export const useReport = ({report: _report}: UseReportProps): UseReportReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [report, setReport] = useState<ReportsReportTestRunReport>();

  useEffect(() => {
    if (_report) {
      setReport(_report as ReportsReportTestRunReport);
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      const res = await fetch(reportUrl);
      const json = await res.json();
      setReport(json as ReportsReportTestRunReport);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const parsedReport = useMemo(() => report ? parseReport(report) : undefined, [report]);
  const nav = useMemo(() => parsedReport ? getNavFromCapability(parsedReport.capability) : [], [parsedReport]);
  return {loading, report, nav};
};
