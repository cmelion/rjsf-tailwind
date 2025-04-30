@storybook-running @component
Feature: Tailwind Table Component
  As a user
  I want to view and manipulate tabular data
  So that I can effectively manage my information

  Background:
    Given I have a table with schema defining several properties
    And I have some initial data records

  Scenario: Viewing table data
    When I view the "Data records table" as a grid
    Then I should see column headers based on the schema properties
    And I should see rows displaying my data
    And each row should have action buttons

  Scenario: Sorting table data (ascending and descending and unsorted)
    When I view the "Data records table" as a grid
    When I click on column header labeled "Sort by Name"
    When I click on the column header labeled "Sort by Age"
    Then the data should be sorted by that column:
        | Age|
        | 45 |
        | 32 |
        | 27 |
    When I click on the column header labeled "Sort by Age" again
    Then the data should be sorted by that column:
        | Age|
        | 27 |
        | 32 |
        | 45 |
    When I click on the column header labeled "Sort by Age" again
    Then the data should be sorted by that column:
      | Age|
      | 32 |
      | 27 |
      | 45 |

  Scenario: Filtering table data
    When I view the "Data records table" as a grid
    And I toggle the "Expand column filters" control open
    And I enter search criteria in "Column Filters":
        | Placeholder    | Value |
        | Filter name... | John  |
        | Filter role... | admin |
    Then only matching rows should be displayed

  Scenario: Toggling column visibility
    When I view the "Data records table" as a grid
    And I open the column selector menu
    # Default hiding name column for now
    And I toggle visibility for a specific column
    Then that column should be hidden from view

  Scenario: Expanding a row for detailed view
    When I view the "Data records table" as a grid
    And I click the "Expand row" button for row 2
    Then I should see an "Edit record form" for row 2
