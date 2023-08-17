import { RouterProvider, createHashRouter } from "react-router-dom";
import { useReport } from "./capability/useReport";
import "./App.css";

function App() {
  // FIXME use the report from the config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuration = JSON.parse((window as any)["interuss"] || "{}");
  console.log("Configuration:", configuration);

  const { loading, report, nav } = useReport(configuration);
  if (loading) {
    return <div>Loading report...</div>;
  }
  if (!report) {
    return <div>Report not found</div>;
  }
  const router = createHashRouter(nav);
  return <RouterProvider router={router} />;
}

export default App;
