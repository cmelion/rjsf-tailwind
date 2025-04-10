@storybook-running
Feature: Tailwind Table Component
  As a user
  I want to view and manipulate tabular data
  So that I can effectively manage my information

  Background:
    Given I have a table with schema defining several properties
    And I have some initial data records

  Scenario: Viewing table data
    When I view the table
    Then I should see column headers based on the schema properties
    And I should see rows displaying my data
    And each row should have action buttons
