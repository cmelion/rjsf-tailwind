// Generated from: src\components\tailwind-table\TailwindTable.feature
import { test } from "playwright-bdd";

test.describe('Tailwind Table Component', () => {

  test.beforeEach('Background', async ({ Given, And }) => {
    await Given('I have a table with schema defining several properties'); 
    await And('I have some initial data records'); 
  });
  
  test('Viewing table data', { tag: ['@storybook-running'] }, async ({ When, page, Then, And }) => { 
    await When('I view the table', null, { page }); 
    await Then('I should see column headers based on the schema properties', null, { page }); 
    await And('I should see rows displaying my data', null, { page }); 
    await And('each row should have action buttons', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('src\\components\\tailwind-table\\TailwindTable.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@storybook-running"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I have a table with schema defining several properties","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And I have some initial data records","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I view the table","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see column headers based on the schema properties","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I should see rows displaying my data","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And each row should have action buttons","stepMatchArguments":[]}]},
]; // bdd-data-end