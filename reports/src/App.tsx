import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useReport } from "./capability/useReport";
import { parseReport } from "./capability/reportParser";

function App() {
  const { report, nav } = useReport();

  console.log("Parsed report", report && parseReport(report));
  if (!report) {
    return <div>Report not found</div>;
  }

  // console.log("Report", report);
  // console.log("Nav", nav);
  const router = createBrowserRouter(nav);
  return <RouterProvider router={router} />;
  // return <CapabilityTable />;
}

export default App;
