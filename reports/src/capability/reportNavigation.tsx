import { Link, RouteObject } from "react-router-dom";
import { Capability } from "./capabilityTypes";
import { CapabilityTable } from "./CapabilityTable";

export const getNavFromCapability = (
  capability: Capability,
  path: string = "",
  fullPath: string = ""
): RouteObject[] => {
  const children =
    capability.childCapabilities.flatMap((c, i) =>
      getNavFromCapability(c, `${i}`, `${fullPath}/${i}`)
    ) || [];
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
