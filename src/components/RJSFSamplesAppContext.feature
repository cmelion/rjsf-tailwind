# src/components/rjsf/RJSFSamplesAppContext.feature
@storybook-running @component
Feature: JSON Schema Form Samples
  As a user of the application
  I want to browse through different JSON Schema form samples
  So that I can see various form capabilities

  Scenario Outline: Verify form title for each sample
    Given I am viewing the application
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
      | Validation               | Custom validation               |
      | Files                    | Files                           |
      | Single                   |                                 |
      | Custom Array             |                                 |
      | Custom Object            | A registration form             |
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