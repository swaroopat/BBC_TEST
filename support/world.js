const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.apiUrl = 'https://testapi.io/api/RMSTest/ibltest';
    this.response = null;
    this.responseTime = 0;
  }
}

setWorldConstructor(CustomWorld);
