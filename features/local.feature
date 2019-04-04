Feature: Add to Todo list functionality on local app

Scenario: Add Todo List on local app
    When I click on first item on local app
    When I click on second item on local app
    When I add new item "New item to the list" on local app
    Then I should see new item in list "New item to the list" on local app
