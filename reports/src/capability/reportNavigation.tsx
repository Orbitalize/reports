import { Link } from "@mui/material";
import { Link as RouterLink, RouteObject } from "react-router-dom";
import { Capability } from "./capabilityTypes";
import { CapabilityTable } from "./CapabilityTable";
import { Report } from "./capabilityTypes";

export const joinRoutes = (root: string, child: string): string => {
  const cleanChild = child.replace(/^\/+/g, ""); // remove leading slash
  if (root === "/") {
    return root + cleanChild;
  }
  const cleanRoot = root.replace(/\/$/, ""); // remove trailing slash
  if (!cleanRoot) {
    return cleanChild;
  } else if (!cleanChild) {
    return cleanRoot;
  } else {
    return `${cleanRoot}/${cleanChild}`;
  }
};

export const getNavFromCapability = (
  capability: Capability,
  report: Report,
  path: string = "/",
  fullPath: string = "/"
): RouteObject[] => {
  const children =
    capability.childCapabilities.flatMap((c, i) =>
      getNavFromCapability(
        c,
        report,
        `${i}`,
        joinRoutes(fullPath, i.toString())
      )
    ) || [];
  return [
    {
      path: path,
      handle: {
        crumb: (index?: number | string) => (
          <Link key={index} to={fullPath} component={RouterLink}>
            {capability.name}
          </Link>
        ),
      },
      children: [
        {
          index: true,
          element: <CapabilityTable capability={capability} report={report} />,
        },
        ...children,
      ],
    },
  ];
};
