import { useEffect, useState } from 'react'
import './App.css'
import { CapabilityRow } from './capability/CapabilityRow'
const reportUrl = "/monitoring-tests-reports/uss_qualifier/output/report_uspace.json"

import { ReportsReportTestRunReport } from './types/TestRunReport'

// TODO: Replace with actual JSON report. Placeholder to verify proper typing.
// const report: ReportsReportTestRunReport = {
//   baseline_signature: '',
//   codebase_version: '',
//   commit_hash: '',
//   report: {},
//   configuration: {
//     action: {},
//     resources: {
//       resource_declarations: {}
//     }
//   },
//   file_signatures: {}
// }

function App() {
  const [report, setReport] = useState<ReportsReportTestRunReport>()

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch(reportUrl)
      const json = await res.json()
      setReport(json as ReportsReportTestRunReport)
    }
    fetchReport()
  }, [])

  console.log(report)
  if(!report) {
    return <div>Report not found</div>
  }

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
        <CapabilityRow capability={report.report} />
      </tbody>
    </table>
    </>
  )
}

export default App
