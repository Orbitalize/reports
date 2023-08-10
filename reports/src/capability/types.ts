

// type Report = {
// }

export type TestScenario = {
  test_scenario: {
    cases: unknown[];
    cleanup: unknown;
    documentation_url: string;
    end_time: string;
    start_time: string;
    name: string;
    successful: boolean;
    scenario_type: string
    notes: unknown[]
  }
}

export type ActionGenerator = {
  action_generator: {
    actions: TestScenario[];
    generator_type: string
  }
}

export type Action = TestSuite | ActionGenerator

export type TestSuite = {
  test_suite: {
    actions: Action[]; 
    capability_evaluation: unknown[];
    documentation_url: string;
    end_time: string;
    start_time: string;
    name: string;
    successful: boolean;
    suite_type: string
  }
}

export type ReportFile = {
  baseline_signature: string;
  codebase_version: string;
  commit_hash: string;
  configuration: unknown;
  file_signatures: Record<string, string>
  report: TestSuite
}
