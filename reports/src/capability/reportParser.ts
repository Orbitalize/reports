import {
  ReportsReportCheckedRequirement,
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
    const check = jp.value(root, jp.stringify(l));
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

const getCapability = (
  testSuite: ReportsReportTestSuiteReport
): Capability[] => {
  return testSuite.capability_evaluations
    .map((ce) => {
      const c = ce.condition_evaluation;
      const name = `${ce.capability_id} (${ce.participant_id})`
      if (c.requirements_checked) {
        return {
          name,
          result: ce.verified ? "pass" : "fail",
          requirements: flattenRequirements(c.requirements_checked, testSuite),
          childCapabilities: [],
          participant_id: ce.participant_id,
        };
      } else if (c.capability_verified) {
        return {
          name,
          result: ce.verified ? "pass" : "fail",
          requirements: [],
          childCapabilities: [], // TODO: Add child capabilities
          participant_id: ce.participant_id,
        };
      } else {
        return null;
      }
    })
    .filter((x) => !!x) as Capability[];
};

const parseActions = (
  node?: ReportsReportTestSuiteActionReport
): Capability[] => {
  if (!node) return [];

  if (node.test_suite) {
    return [
      ...getCapability(node.test_suite),
      ...node.test_suite.actions.map((a) => parseActions(a)),
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
    // TODO Improve
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
        requirements:[]
      }
    };
  } else {
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
