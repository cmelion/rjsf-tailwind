# src/components/rjsf/RJSFSamplesAppContext.feature
@storybook-running @component
Feature: JSON Schema Form Samples
  As a user of the application
  I want to browse through different JSON Schema form samples
  So that I can see various form capabilities

  Background:
      Given I am viewing the application

  Scenario: JSON rules sample shows custom errors for invalid input
    When I click on the sample button for "JSON rule validation"
    Then I should see a form rendered correctly
    And the form title should match "JSON rule validation"
    When I fill out the form with:
      | field           | value     | role       |
      | Password        | abc       | textbox    |
      | Repeat password | def       | textbox    |
      | Age             | 17        | spinbutton |
    And I submit the form
    Then I should see the error "Passwords don't match"
    And I should see the error "You need to be 18 because of some legal thing"
    When I fill out the form with:
      | field           | value     | role       |
      | Age             | 56        | spinbutton |
    And I submit the form
    Then I should see the error "I see an age discrimination lawsuit headed your way"

  Scenario: Validation sample shows custom errors for invalid input
    When I click on the sample button for "Validation"
    Then I should see a form rendered correctly
    And the form title should match "Custom validation"
    When I fill out the form with:
      | field           | value     | role       |
      | Password        | abc       | textbox    |
      | Repeat password | def       | textbox    |
      | Age             | 17        | spinbutton |
    And I submit the form
    Then I should see the error "Passwords don't match"
    And I should see the error "You need to be 18 because of some legal thing"

  Scenario: Widgets sample shows custom errors for invalid input
    When I click on the sample button for "Widgets"
    Then I should see a form rendered correctly
    And the form title should match "Widgets"
    When I fill out the form with:
      | field      | value          | role       |
      | email      | invalid.email  | textbox    |
    And I submit the form
    Then I should see the error "must match format \"email\""

  Scenario Outline: Verify form title for each sample
    When I click on the sample button for "<sample>"
    Then I should see a form rendered correctly
    And the form title should match "<title>"

    Examples:
      | sample                   | title                           |
      | Blank                    |                                 |
      | Test Data                |                                 |
      | Simple                   | A registration form             |
      | UI Options               | A registration form             |
      | Nested                   | A list of tasks                 |
      | Arrays                   | A list of strings               |
      | Numbers                  | Number fields & widgets         |
      | Widgets                  | Widgets                         |
      | Ordering with Grid Layout| A registration form             |
      | References               | Shipping address                |
      | Custom                   | A localisation form             |
      | Errors                   | Contextualized errors           |
      | Examples                 | Examples                        |
      | Large                    | A rather large form             |
      | Date & time              | Date and time widgets           |
      | Files                    | Files                           |
      | Single                   |                                 |
      | Custom Array             |                                 |
      | Custom Object            | Custom: A registration form             |
      | Alternatives             | Image editor                    |
      | Property dependencies    | Property dependencies           |
      | Schema dependencies      | Schema dependencies             |
      | Additional Properties    | A customizable registration form|
      | Any Of                   |                                 |
      | Any Of with Custom Field |                                 |
      | One Of                   |                                 |
      | All Of                   |                                 |
      | If Then Else             |                                 |
      | Null fields              | Null field example              |
      | Enumerated objects       |                                 |
      | Nullable                 | A registration form (nullable)  |
      | ErrorSchema              | A registration form             |
      | Defaults                 | Schema default properties       |
      | Custom Field             | A registration form             |