import { RouterProvider, createHashRouter } from "react-router-dom";
import { useReport } from "./capability/useReport";
import { CustomThemeProvider } from "./ThemeContext";

function App() {
  // FIXME use the report from the config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuration = JSON.parse(
    document.getElementById("interuss_report_json")?.innerHTML || "{}"
  );
  console.log("Configuration:", configuration);

  const { loading, error, report, nav } = useReport(configuration);
  if (loading) {
    return <div>Loading report...</div>;
  }
  if (!report || error) {
    return !error ? <div>Report not found</div> : <div>{error}</div>;
  }
  const router = createHashRouter(nav);
  return (
    <CustomThemeProvider>
      <RouterProvider router={router} />;
    </CustomThemeProvider>
  );
}

export default App;
