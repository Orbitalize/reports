type CapabilityResult = "pass" | "fail" | "missing";
export type CheckResult = "pass" | "fail";

export type Check = {
  scenario: {
    name: string;
    docUrl: string;
  }
  case: {
    name: string;
    docUrl: string;
  }
  step: {
    name: string;
    docUrl: string;
  }

  name: string;
  result: CheckResult
  detailsUrl: string;
}

export type Requirement = {
  name: string;
  checks: Check[];
};

export type Capability = {
  name: string;
  participant_id?: string;
  result: CapabilityResult;
  requirements: Requirement[];
  childCapabilities: Capability[];
};

export type Report = {
  capability: Capability;
};
