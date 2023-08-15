import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useReport } from "./capability/useReport";
import "./App.css";

function App() {
  // FIXME use the report from the config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuration = JSON.stringify((window as any)["interuss"]);
  console.log("Configuration:", configuration);

  const { report, nav } = useReport();
  if (!report) {
    return <div>Report not found</div>;
  }
  const router = createBrowserRouter(nav);
  return <RouterProvider router={router} />;
}

export default App;
