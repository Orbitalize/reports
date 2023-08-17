import { Link, RouteObject } from "react-router-dom";
import { Capability } from "./capabilityTypes";
import { CapabilityTable } from "./CapabilityTable";

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
  path: string = "/",
  fullPath: string = "/"
): RouteObject[] => {
  const children =
    capability.childCapabilities.flatMap((c, i) =>
      getNavFromCapability(c, `${i}`, joinRoutes(fullPath, i.toString()))
    ) || [];
  console.log("Full path", fullPath);
  return [
    {
      path: path,
      handle: {
        crumb: () => <Link to={fullPath}>{capability.name}</Link>,
      },
      children: [
        {
          index: true,
          element: <CapabilityTable capability={capability} />,
        },
        ...children,
      ],
    },
  ];
};
