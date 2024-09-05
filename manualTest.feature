Feature: IBL API Additional Manual Test Cases

Scenario: Verify channel information
  Given a GET request to https://testapi.io/api/RMSTest/ibltest
  When in response body
  Then the "channel" object contains the following information:
    | Field       | Value                     |
    | id          | bbc_one_london            |
    | title       | BBC One London            |
    | subtitle    | London                    |
    | type        | tv                        |
  And the "schedule_start" is a valid ISO 8601 date-time
  And the "schedule_end" is a valid ISO 8601 date-time
  And the "schedule_end" is exactly 24 hours after "schedule_start"

Scenario: Verify programme duration and consistency
  Given a GET request to https://testapi.io/api/RMSTest/ibltest
  When the "data" array in the response is checked
  Then each item have a "duration" field
  And the "duration" is a positive integer
  And the sum of all "duration" values is equal 86400 seconds (24 hours)
  And for each item, the difference between "transmission_end" and "transmission_start" is equal to  "duration"

Scenario: Verify programme categories and genres
  Given a GET request to https://testapi.io/api/RMSTest/ibltest
  When the "episode" object of each item in the "data" array is checked
  Then each "episode" have a "categories" array
  And each "categories" array should contain at least one category
  And each category have a non-empty "id" and "title"
  And each "episode" have a "genre" object
  And each "genre" object have a non-empty "id" and "title"
  And the "genre" titles be one of the following:
    | Genre Titles               |
    | Factual                    |
    | Entertainment & Comedy     |
    | Drama & Soaps              |
    | News, Sport & Weather      |
    | Children's                 |
