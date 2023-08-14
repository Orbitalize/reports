import './App.css'

import { ReportsReportTestRunReport } from './types/TestRunReport'

// TODO: Replace with actual JSON report. Placeholder to verify proper typing.
const report: ReportsReportTestRunReport = {
  baseline_signature: '',
  codebase_version: '',
  commit_hash: '',
  report: {},
  configuration: {
    action: {},
    resources: {
      resource_declarations: {}
    }
  },
  file_signatures: {}
}

function App() {
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuration = JSON.stringify((window as any)["interuss"])
  console.log("Configuration:", configuration)
  return (
    <>
    <h1>Report</h1>
    <code>{JSON.stringify(report, null, 2)}</code>
    </>
  )
}

export default App
