import { ReportsReportTestSuiteActionReport } from "../types/TestRunReport"

type CapabilityRowProps = {
    capability: ReportsReportTestSuiteActionReport
}


const getTestSuiteRows = ({actions}: {actions: ReportsReportTestSuiteActionReport[] }) => {
    const children =  actions.filter((a: ReportsReportTestSuiteActionReport) => "test_suite" in a).map(({test_suite}) => {
        return <tr>
            <td colSpan={2}>{test_suite!.name}</td>
            <td colSpan={2}>{test_suite!.successful ? "PASS" : "FAIL"}</td>
        </tr>
    })
    if(!children.length) return []
    const header = <tr>
        <th colSpan={2}>Child Capability</th>
        <th colSpan={2}>Result</th>
    </tr>
    return [header, ...children]

}

export const CapabilityRow = ({capability: {test_suite}}: CapabilityRowProps) => {
    if(!test_suite) return null

    const childRows = getTestSuiteRows(test_suite) 
    const titleRowSpan = 1 + childRows.length
    return <>
        <tr>
            <td rowSpan={titleRowSpan}>{test_suite.name}</td>
        </tr>
        {childRows}
    </>

}