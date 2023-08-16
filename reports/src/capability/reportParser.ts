import {
  ReportsReportCapabilityVerifiedConditionEvaluationReport,
  ReportsReportCheckedCapability,
  ReportsReportCheckedRequirement,
  ReportsReportParticipantCapabilityConditionEvaluationReport1,
  ReportsReportParticipantCapabilityEvaluationReport,
  ReportsReportRequirementsCheckedConditionEvaluationReport,
  ReportsReportTestRunReport,
  ReportsReportTestSuiteActionReport,
  ReportsReportTestSuiteReport,
} from "../types/TestRunReport";
import {NotImplementedError} from "../utils/Errors";
import {
  Capability,
  Check,
  CheckResult,
  Report,
  Requirement,
} from "./capabilityTypes";
import * as jp from "jsonpath";

const flattenChecks = (
  r: ReportsReportCheckedRequirement,
  root: ReportsReportTestSuiteActionReport
): Check[] => {
  const expandCheck = (checkLocation: string, result: CheckResult): Check => {
    const l = jp.parse(checkLocation);
    let check = jp.value(root, jp.stringify(l));
    if (!check) {
      console.warn(`Unable to locate check ${checkLocation}`)
      if (!check) {
        check = jp.value(root, "$.actions[0].test_suite."+jp.stringify(l).slice(1))
        console.error(`Unable to locate check ${checkLocation}`)
      }
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
      detailsUrl: "", // TODO Add details page + navigation
    };
  };

  const res = [
    ...r.passed_checks.map((c) => expandCheck(c, "pass")),

    ...r.failed_checks.map((c) => expandCheck(c, "fail")),
  ];
  return res;
};

const flattenRequirements = (
  requirementsChecked: ReportsReportRequirementsCheckedConditionEvaluationReport,
  root: ReportsReportTestSuiteReport
): Requirement[] => {
  return [
    ...requirementsChecked.passed_requirements.map((pr) => ({
      name: pr.requirement_id,
      checks: flattenChecks(pr, root),
    })),

    ...requirementsChecked.failed_requirements.map((fr) => ({
      name: fr.requirement_id,
      checks: flattenChecks(fr, root),
    })),

    ...requirementsChecked.untested_requirements.map((ur) => ({
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
    ? parseCapabilityEvaluations([ce], jp.value(parentTestSuite, checkedCapability.report_location))
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

const parseSpuriousMatches =
  (): // spuriousMatches: ReportsReportSpuriousReportMatch,
  Capability[] => {
    throw new NotImplementedError("SpuriousMatches not implemented yet");
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
): Capability[] => {
  if (condition.all_conditions) {
    return [
      ...condition.all_conditions.satisfied_conditions.map((c) =>
        parseConditionEvaluation(c, parentTestSuite)
      ),
      ...condition.all_conditions.unsatisfied_conditions.map((c) =>
        parseConditionEvaluation(c, parentTestSuite)
      ),
    ].flat();
  } else if (condition.requirements_checked) {
    const r = condition.requirements_checked;
    console.log("FR", condition)
    return [{
      name: "unknown",
      requirements: flattenRequirements(r, parentTestSuite),
      childCapabilities: [],
      result: condition.condition_satisfied ? "pass" : "fail",
      // participant_id,  // TODO
    }]
  } else if (condition.capability_verified) {
    return parseCapabilityVerified(
      condition.capability_verified,
      parentTestSuite
    );
  }
  return [];
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

      if (c.requirements_checked) {
        console.log("RC", c.requirements_checked);
        return {
          name,
          participant_id,
          result: ce.verified ? "pass" : "fail",
          requirements: flattenRequirements(
            c.requirements_checked,
            parentTestSuite
          ),
          childCapabilities: [],
        };

      } else if (c.capability_verified) {
        console.log("CV", c.capability_verified);
        return {
          name,
          participant_id,
          result: ce.verified ? "pass" : "fail",
          requirements: [],
          childCapabilities: parseCapabilityVerified(
            c.capability_verified,
            parentTestSuite
          ),
        };

      } else if (c.all_conditions) {
        console.log("AC", c.all_conditions);
        return {
          name,
          participant_id,
          result: ce.verified ? "pass" : "fail",
          requirements: [],
          childCapabilities: [
            ...c.all_conditions.satisfied_conditions.map((sc) =>
              parseConditionEvaluation(sc, parentTestSuite)
            ),
            ...c.all_conditions.unsatisfied_conditions.map((sc) =>
              parseConditionEvaluation(sc, parentTestSuite)
            ),
          ].flat(),
        };
      }
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
    console.error("Unknown state");
    return [];
  }
};

const _parseReport = (report: ReportsReportTestSuiteActionReport): Report => {
  if (report.test_suite) {
    return {
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
