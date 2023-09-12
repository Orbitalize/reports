import {
  ReportsReportCapabilityVerifiedConditionEvaluationReport,
  ReportsReportCheckedCapability,
  ReportsReportCheckedRequirement,
  ReportsReportParticipantCapabilityConditionEvaluationReport1,
  ReportsReportParticipantCapabilityEvaluationReport,
  ReportsReportRequirementsCheckedConditionEvaluationReport,
  ReportsReportSpuriousReportMatch,
  ReportsReportTestRunReport,
  ReportsReportTestSuiteActionReport,
  ReportsReportTestSuiteReport,
} from "../types/TestRunReport";
import { NotImplementedError } from "../utils/Errors";
import {
  Capability,
  Check,
  CheckResult,
  Report,
  Requirement,
} from "./capabilityTypes";
import * as jp from "jsonpath";

// TODO: Refactor into a class to improve warnings and errors handling.

const parseChecks = (
  r: ReportsReportCheckedRequirement,
  root: ReportsReportTestSuiteActionReport
): Check[] => {
  const expandCheck = (checkLocation: string, result: CheckResult): Check => {
    const l = jp.parse(checkLocation);
    const check = jp.value(root, jp.stringify(l));
    if (!check) {
      throw new Error(`Unable to locate check ${checkLocation}`);
    }
    const step = jp.value(root, jp.stringify(l.slice(0, -2)));
    const _case = jp.value(root, jp.stringify(l.slice(0, -4)));
    const scenario = jp.value(root, jp.stringify(l.slice(0, -6)));

    return {
      scenario: {
        name: scenario.name,
        docUrl: scenario.documentation_url,
      },
      case: {
        name: _case.name,
        docUrl: _case.documentation_url,
      },
      step: {
        name: step.name,
        docUrl: step.documentation_url,
      },
      name: check.name,
      result,
      details: step,
    };
  };

  const res = [
    ...r.passed_checks.map((c) => expandCheck(c, "pass")),

    ...r.failed_checks.map((c) => expandCheck(c, "fail")),
  ];
  return res;
};

const parseRequirementsCheck = (
  requirementsCheck: ReportsReportRequirementsCheckedConditionEvaluationReport,
  root: ReportsReportTestSuiteReport
): Requirement[] => {
  return [
    ...requirementsCheck.passed_requirements.map((pr) => ({
      name: pr.requirement_id,
      checks: parseChecks(pr, root),
    })),

    ...requirementsCheck.failed_requirements.map((fr) => ({
      name: fr.requirement_id,
      checks: parseChecks(fr, root),
    })),

    ...requirementsCheck.untested_requirements.map((ur) => ({
      name: ur,
      checks: [],
    })),
  ];
};

const parseCheckedCapability = (
  checkedCapability: ReportsReportCheckedCapability,
  parentTestSuite: ReportsReportTestSuiteReport
): Capability => {
  const capabilityLocation = checkedCapability.capability_location;
  const ce = jp.value(
    parentTestSuite,
    capabilityLocation
  ) as ReportsReportParticipantCapabilityEvaluationReport;
  if (!ce) {
    console.error(
      `Unable to locate checked capability ${checkedCapability.capability_id}: ${capabilityLocation}`
    );
  }
  const name = ce ? ce.capability_id : checkedCapability.capability_id;
  const participant_id = ce ? ce.participant_id : "unknown";

  const childCapabilities = ce
    ? parseCapabilityEvaluations(
        [ce],
        jp.value(parentTestSuite, checkedCapability.report_location)
      )
    : [];

  return {
    name,
    participant_id,
    result: ce
      ? ce.condition_evaluation.condition_satisfied
        ? "pass"
        : "fail"
      : "missing", // TODO: Verify that this statement is correct
    childCapabilities,
    requirements: [],
  };
};

const parseMissingCapability = (missingCapabilityId: string): Capability => {
  return {
    name: missingCapabilityId,
    result: "missing",
    childCapabilities: [],
    requirements: [],
  };
};

const parseSpuriousMatches = (
  _spuriousMatches: ReportsReportSpuriousReportMatch
): Capability[] => {
  throw new NotImplementedError(
    `SpuriousMatches not implemented yet: ${_spuriousMatches}`
  );
};

const parseCapabilityVerified = (
  capabilityVerified: ReportsReportCapabilityVerifiedConditionEvaluationReport,
  parentTestSuite: ReportsReportTestSuiteReport
): Capability[] => {
  return [
    ...capabilityVerified.checked_capabilities.map((cc) =>
      parseCheckedCapability(cc, parentTestSuite)
    ),
    ...capabilityVerified.missing_capabilities.map(parseMissingCapability),
    ...capabilityVerified.spurious_matches.map(parseSpuriousMatches),
  ].flat();
};

const parseConditionEvaluation = (
  condition: ReportsReportParticipantCapabilityConditionEvaluationReport1,
  parentTestSuite: ReportsReportTestSuiteReport
): [Requirement[], Capability[]] => {
  if (condition.all_conditions) {
    const sc = condition.all_conditions.satisfied_conditions.map((c) =>
      parseConditionEvaluation(c, parentTestSuite)
    );
    const uc = condition.all_conditions.unsatisfied_conditions.map((c) =>
      parseConditionEvaluation(c, parentTestSuite)
    );
    return [
      [...sc.map((s) => s[0]), ...uc.map((u) => u[0])].flat(),
      [...sc.map((s) => s[1]), ...uc.map((s) => s[1])].flat(),
    ];
  } else if (condition.requirements_checked) {
    const r = condition.requirements_checked;
    return [parseRequirementsCheck(r, parentTestSuite), []];
  } else if (condition.capability_verified) {
    return [
      [],
      parseCapabilityVerified(condition.capability_verified, parentTestSuite),
    ];
  } else {
    //   // TODO: Handle no_failed_checks check
    //   // TODO: Handle any_condition
    console.error(
      `Unsupported capabilityEvaluation with keys: ${JSON.stringify(
        Object.keys(condition)
      )}: ${JSON.stringify(condition)}`
    );
  }

  return [[], []];
};

const parseCapabilityEvaluations = (
  capabilityEvaluations: ReportsReportParticipantCapabilityEvaluationReport[],
  parentTestSuite: ReportsReportTestSuiteReport
): Capability[] => {
  return capabilityEvaluations
    .map((ce) => {
      const c = ce.condition_evaluation;
      const name = ce.capability_id;
      const participant_id = ce.participant_id;

      const evaluation = parseConditionEvaluation(c, parentTestSuite);
      return {
        name,
        participant_id,
        result: ce.verified ? "pass" : "fail",
        requirements: evaluation[0],
        childCapabilities: evaluation[1],
      };
    })
    .flat()
    .filter((x) => !!x) as Capability[];
};

const parseActions = (
  node?: ReportsReportTestSuiteActionReport
): Capability[] => {
  if (!node) return [];

  if (node.test_suite) {
    return [
      ...parseCapabilityEvaluations(
        node.test_suite.capability_evaluations,
        node.test_suite
      ),
    ].flat();
  } else if (node.test_scenario) {
    return [];
  } else if (node.action_generator) {
    return node.action_generator.actions
      .map((a) => {
        return parseActions(a);
      })
      .flat();
  } else {
    console.error(
      "One of test_suite, test_scenario or action_generator key should be defined."
    );
    return [];
  }
};

const _parseReport = (report: ReportsReportTestSuiteActionReport): Report => {
  if (report.test_suite) {
    return {
      name: report.test_suite.name,
      participants: report.test_suite.capability_evaluations.map(
        (c) => c.participant_id
      ),
      capability: {
        name: "root",
        childCapabilities: parseActions(report),
        result: "missing",
        requirements: [],
      },
    };
  } else {
    // TODO: Support other type of root element
    throw new NotImplementedError(
      "Not implemented: Only report with a single root test_suite is supported."
    );
  }
};

export const parseReport = (report: ReportsReportTestRunReport): Report => {
  const startTime = new Date().getTime();
  console.log("Input Report", report);
  const parsed = _parseReport(report.report);
  console.log("Parsed report", parsed);
  console.info(
    "[performance] Report rendered in ",
    new Date().getTime() - startTime,
    "ms"
  );
  return parsed;
};
