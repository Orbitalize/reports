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

  const router = createBrowserRouter(nav);
  return <RouterProvider router={router} />;
}

export default App;
