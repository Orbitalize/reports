type CapabilityResult = "pass" | "fail" | "missing";
type CheckResult = "pass" | "fail";

export type Check = {
  result: CheckResult;
  name: string;
  detailLink: string;
};

export type Requirement = {
  name: string;
  checks: Check[];
};

export type Capability = {
  name: string;
  result: CapabilityResult;
  requirements: Requirement[];
  childCapabilities: Capability[];
};

export type Report = {
  capability: Capability;
};

export const exampleReport: Report = {
  capability: {
    name: "ASTM Service Provider",
    result: "fail",
    requirements: [
      {
        name: "astm.f3548.v21.GEN0310",
        checks: [
          {
            name: "Nominal behavior :: Setup :: Clear",
            result: "pass",
            detailLink: "Link to test details",
          },
          {
            name: "SP polling :: Poll :: Valid data",
            result: "pass",
            detailLink: "Link to test details",
          },
        ],
      },
      {
        name: "astm.f3548.v21.OPIN0030",
        checks: [
          {
            name: "...",
            result: "fail",
            detailLink: "Link to test details",
          },
          {
            name: "...",
            result: "pass",
            detailLink: "Link to test details",
          },
        ],
      },
      {
        name: "astm.f3548.v21.SDC0015",
        checks: [
          // Should display "Not tested"
        ],
      },
      {
        name: "astm.f3548.v21.GEN0200",
        checks: [
          {
            name: "...",
            result: "pass",
            detailLink: "Link to test details",
          },
        ],
      },
    ],
    childCapabilities: [
      {
        name: "ASTM SP Operator ID Provider",
        result: "pass",
        requirements: [
          {
            name: "child 1",
            checks: [
              {
                name: "Nominal behavior :: Setup :: Clear",
                result: "pass",
                detailLink: "Link to test details",
              },
              {
                name: "SP polling :: Poll :: Valid data",
                result: "pass",
                detailLink: "Link to test details",
              },
            ],
          },
          {
            name: "child 2",
            checks: [
              {
                name: "...",
                result: "fail",
                detailLink: "Link to test details",
              },
              {
                name: "...",
                result: "pass",
                detailLink: "Link to test details",
              },
            ],
          },
          {
            name: "child 3",
            checks: [
              // Should display "Not tested"
            ],
          },
          {
            name: "child 4",
            checks: [
              {
                name: "...",
                result: "pass",
                detailLink: "Link to test details",
              },
            ],
          },
        ],
        childCapabilities: [],
      },
    ],
  },
};
