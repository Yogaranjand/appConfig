import axios from 'axios';
const expect = require('chai').use(require('chai-as-promised')).expect;
describe('GET http://localhost:3000/config/', () => {
  
  it('should return config data', async () => {
    const response = await axios.get('http://localhost:3000/config/');
    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal({"Name":"Sample Application","Company Name":"Invenco","Coding Challenge":true});
    return true;
  });
});