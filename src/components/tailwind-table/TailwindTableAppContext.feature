# src/components/tailwind-table/TailwindTableAppContext.feature
@storybook-running @component
Feature: Tailwind Table operations that require an Application Context
  As a user of the application
  I want to interact with data tables and forms
  So that I can perform CRUD operations on my data

  Background:
    Given I am viewing the application
    And I have Switched to Table View

  Scenario: Real-time synchronization between form edits and table data
    When I view the "Data records table" as a grid
    And I click the "Expand row" button for row 2
    Then I should see an "Edit record form" for row 2
    When I update "Name" in the edit form
    Then the row data should be updated with my changes

  Scenario: Creating a new row
    When I view the "Data records table" as a grid
    And I click the "Add new record" button
    Then I should see a form for creating a new record
    When I fill out the form and submit
    Then a new row should be added to the table

  Scenario: Deleting a row
    When I view the "Data records table" as a grid
    And I click the "Delete row" button for row 2
    Then that row should be removed from the table
