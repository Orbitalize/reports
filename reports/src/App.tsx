import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useReport } from "./capability/useReport";

function App() {
  const { report, nav } = useReport();
  if (!report) {
    return <div>Report not found</div>;
  }
  console.log("Report", report);
  console.log("Nav", nav);
  const router = createBrowserRouter(nav);
  return <RouterProvider router={router} />;
}

export default App;
