import { RouteObject } from "react-router-dom";
import { Capability } from "./capabilityTypes";
import { CapabilityTable } from "./CapabilityTable";

export const getNavFromCapability = (
  capability: Capability,
  path: string = ""
): RouteObject[] => {
  const children =
    capability.childCapabilities.flatMap((c, i) =>
      getNavFromCapability(c, `${path}/${i}`)
    ) || [];
  return [
    {
      path: path,
      element: <CapabilityTable capability={capability} />,
    },
    ...children,
  ];
};
