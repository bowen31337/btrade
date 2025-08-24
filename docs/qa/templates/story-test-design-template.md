# Test Design: Story {epic}.{story}

Date: {date}
Designer: Quinn (Test Architect)
Story: {story_title}

## Test Strategy Overview

- Total test scenarios: {total_scenarios}
- Unit tests: {unit_count} ({unit_percentage}%)
- Integration tests: {integration_count} ({integration_percentage}%)
- E2E tests: {e2e_count} ({e2e_percentage}%)
- Priority distribution: P0: {p0_count}, P1: {p1_count}, P2: {p2_count}

## Story Requirements Analysis

### Acceptance Criteria Breakdown

#### AC1: {ac1_description}
**Testable Scenarios:**
- {scenario_1}
- {scenario_2}
- {error_conditions}
- {edge_cases}

#### AC2: {ac2_description}
**Testable Scenarios:**
- {scenario_1}
- {scenario_2}
- {error_conditions}
- {edge_cases}

## Test Scenarios by Acceptance Criteria

### AC1: {ac1_description}

#### Scenarios

| ID | Level | Priority | Test | Justification | Risk Mitigation |
|----|-------|----------|------|---------------|------------------|
| {epic}.{story}-UNIT-001 | Unit | P0 | {test_description} | {justification} | {risk_id} |
| {epic}.{story}-INT-001 | Integration | P0 | {test_description} | {justification} | {risk_id} |
| {epic}.{story}-E2E-001 | E2E | P1 | {test_description} | {justification} | {risk_id} |

### AC2: {ac2_description}

#### Scenarios

| ID | Level | Priority | Test | Justification | Risk Mitigation |
|----|-------|----------|------|---------------|------------------|
| {epic}.{story}-UNIT-002 | Unit | P1 | {test_description} | {justification} | {risk_id} |
| {epic}.{story}-INT-002 | Integration | P1 | {test_description} | {justification} | {risk_id} |

## Risk Coverage

### Identified Risks
- **RISK-001**: {risk_description}
  - Mitigated by: {test_ids}
- **RISK-002**: {risk_description}
  - Mitigated by: {test_ids}

### Risk-Test Mapping

| Risk ID | Risk Description | Test Coverage | Mitigation Level |
|---------|------------------|---------------|------------------|
| RISK-001 | {description} | {test_ids} | High/Medium/Low |
| RISK-002 | {description} | {test_ids} | High/Medium/Low |

## Test Level Justification

### Unit Tests
- **{test_id}**: {justification_for_unit_level}
- **{test_id}**: {justification_for_unit_level}

### Integration Tests
- **{test_id}**: {justification_for_integration_level}
- **{test_id}**: {justification_for_integration_level}

### E2E Tests
- **{test_id}**: {justification_for_e2e_level}
- **{test_id}**: {justification_for_e2e_level}

## Priority Assignment Rationale

### P0 Tests (Critical)
- **{test_id}**: {business_impact_justification}
- **{test_id}**: {security_compliance_justification}

### P1 Tests (High)
- **{test_id}**: {core_journey_justification}
- **{test_id}**: {frequent_use_justification}

### P2 Tests (Medium)
- **{test_id}**: {secondary_feature_justification}

## Recommended Execution Order

### Phase 1: Critical Validation (P0)
1. **Unit Tests** (fail fast)
   - {test_ids}
2. **Integration Tests**
   - {test_ids}
3. **E2E Tests**
   - {test_ids}

### Phase 2: Core Functionality (P1)
4. **Unit Tests**
   - {test_ids}
5. **Integration Tests**
   - {test_ids}
6. **E2E Tests**
   - {test_ids}

### Phase 3: Secondary Features (P2)
7. **Remaining Tests** (as time permits)
   - {test_ids}

## Test Data Requirements

### Input Data
- **Valid Inputs**: {valid_data_examples}
- **Invalid Inputs**: {invalid_data_examples}
- **Edge Cases**: {edge_case_data}
- **Boundary Values**: {boundary_values}

### Expected Outputs
- **Success Scenarios**: {expected_outputs}
- **Error Scenarios**: {expected_errors}
- **State Changes**: {expected_state_changes}

## Environment Setup

### Unit Test Environment
- Test framework: {framework}
- Mocking strategy: {mocking_approach}
- Dependencies: {test_dependencies}

### Integration Test Environment
- Test database: {database_setup}
- External services: {service_mocks}
- Configuration: {test_config}

### E2E Test Environment
- Browser setup: {browser_config}
- Test data: {test_data_setup}
- Environment URL: {test_environment}

## Coverage Validation

### Acceptance Criteria Coverage
- [ ] AC1: {coverage_status}
- [ ] AC2: {coverage_status}
- [ ] AC3: {coverage_status}

### Risk Coverage
- [ ] All identified risks have test coverage
- [ ] Critical paths tested at multiple levels
- [ ] No duplicate coverage across levels

### Quality Gates
- [ ] Every AC has at least one test
- [ ] P0 tests cover critical functionality
- [ ] Test levels are appropriate
- [ ] Test IDs follow naming convention
- [ ] Scenarios are atomic and independent

## Test Automation Strategy

### Automation Candidates
- **High Priority**: {automated_tests}
- **Medium Priority**: {semi_automated_tests}
- **Manual Only**: {manual_tests}

### CI/CD Integration
- **Pre-commit**: {pre_commit_tests}
- **Build Pipeline**: {build_tests}
- **Deployment**: {deployment_tests}

## Maintenance Considerations

### Test Stability
- **Stable Tests**: {stable_test_ids}
- **Potentially Flaky**: {flaky_test_ids}
- **High Maintenance**: {maintenance_heavy_tests}

### Future Considerations
- **Scalability**: {scalability_notes}
- **Performance**: {performance_considerations}
- **Security**: {security_test_notes}

---

## Gate YAML Block

```yaml
test_design:
  scenarios_total: {total_scenarios}
  by_level:
    unit: {unit_count}
    integration: {integration_count}
    e2e: {e2e_count}
  by_priority:
    p0: {p0_count}
    p1: {p1_count}
    p2: {p2_count}
  coverage_gaps: [] # List any ACs without tests
  risk_coverage:
    high_risk: {high_risk_coverage}
    medium_risk: {medium_risk_coverage}
    low_risk: {low_risk_coverage}
```

## Trace References

```text
Test design matrix: docs/qa/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md
P0 tests identified: {p0_count}
Critical path coverage: {critical_path_coverage}
Risk mitigation coverage: {risk_coverage_percentage}%
```