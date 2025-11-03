import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';

When('I click on first item', async function () {
  await this.driver.get('https://lambdatest.github.io/sample-todo-app/');
  const firstItem = await this.driver.findElement({ name: 'li1' });
  await firstItem.click();
});

When('I click on second item', async function () {
  const secondItem = await this.driver.findElement({ name: 'li2' });
  await secondItem.click();
});

When('I add new item {string}', async function (newItemName) {
  const inputBox = await this.driver.findElement({ id: 'sampletodotext' });
  await inputBox.sendKeys(`${newItemName}\n`);
  const addButton = await this.driver.findElement({ id: 'addbutton' });
  await addButton.click();
});

Then('I should see new item in list {string}', async function (item) {
  const newItem = await this.driver.findElement({
    xpath: '//html/body/div/div/div/ul/li[last()]/span',
  });
  const text = (await newItem.getText()).trim();
  console.log('New item text:', text);
  assert.strictEqual(
    text,
    item.trim(),
    `Expected title to be "${item}", but got "${text}"`
  );
});
