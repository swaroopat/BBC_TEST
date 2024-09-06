const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

When('a GET request to the API', async function() {
  const startTime = Date.now();
  this.response = await axios.get(this.apiUrl);
  this.responseTime = Date.now() - startTime;
});

When('a GET request to the API with date {string}', async function(date) {
  try {
    this.response = await axios.get(`${this.apiUrl}/${date}`);
  } catch (error) {
    this.response = error.response;
  }
});

Then(' HTTP status code should be {int}', function(statusCode) {
  assert.equal(this.response.status, statusCode);
});

Then('the response time is below {int} milliseconds', function(maxTime) {
  assert(this.responseTime < maxTime, `Response time ${this.responseTime}ms exceeds ${maxTime}ms`);
});

Then('all items should have a non-empty id', function() {
  const items = this.response.data.data;
  items.forEach(item => {
    assert(item.id && item.id.trim() !== '', 'Item id should not be empty');
  });
});

Then('all items should have type {string}', function(type) {
  const items = this.response.data.data;
  items.forEach(item => {
    assert.strictEqual(item.episode.type, type);
  });
});

Then('all episodes should have a non-empty title', function() {
  const items = this.response.data.data;
  items.forEach(item => {
    assert(item.episode.title && item.episode.title.trim() !== '', 'Episode title should not be empty');
  });
});

Then('only one episode should be live', function() {
  const items = this.response.data.data;
  const liveEpisodes = items.filter(item => item.episode.live);
  assert.equal(liveEpisodes.length, 1, 'There should be exactly one live episode');
});

Then('transmission_start less than transmission_end for all episodes', function() {
  const items = this.response.data.data;
  items.forEach(item => {
    const start = new Date(item.transmission_start);
    const end = new Date(item.transmission_end);
    assert(start < end, 'transmission_start should be before transmission_end');
  });
});

Then('the response header  contain a valid date', function() {
  assert(this.response.headers.date, 'Response header should contain a date');
  assert(!isNaN(new Date(this.response.headers.date).getTime()), 'Header date should be valid');
});

Then(' {string} and {string} in error object properties', function(prop1, prop2) {
  assert(this.response.data.hasOwnProperty(prop1), `Error object should have ${prop1} property`);
  assert(this.response.data.hasOwnProperty(prop2), `Error object should have ${prop2} property`);
});
