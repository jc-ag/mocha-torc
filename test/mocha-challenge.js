const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-json-schema');
const { describe, it } = require('mocha');
const { expect } = chai;


chai.use(chaiHttp);
chai.use(chaiJsonSchema);

const BASE_API_URL = 'https://api.football-data.org/';

describe('Torc REST API Test Automation Challenge', () => {

  it('should return success response with HTTP 200 OK', async () => {
    
    // Schema response definition
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        code: { type: 'string' },
        flag: { type: 'string', format: 'url' },
        parentAreaId: { type: 'number' },
        parentArea: { type: 'string' },
        childAreas: { type: 'array' }
      },
      required: [
        'id',
        'name',
        'code',
        'flag',
        'parentAreaId',
        'parentArea',
        'childAreas'
      ]
    };

    // HTTP REST Request
    const res = await chai
      .request(BASE_API_URL)
      .get('/v4/areas/2149');

    // Object type assertion
    expect(res).to.be.json;

    // HTTP code response assertion
    expect(res).to.have.status(200);
    
    // Schema asserion
    expect(JSON.parse(res.text)).to.be.jsonSchema(schema);

    // Response content assertion
    expect(JSON.parse(res.text).name).to.be.eq('Mexico')
  });

  it('should return error when trying to get invalid status match, with status code 403', async () => {

    // Schema response definition
    const schema = {
      type: 'object',
      properties: {
        message: { type: 'string' },
        errorCode: { type: 'number' }
      },
      required: [
        'message',
        'errorCode'
      ]
    };

    const requestQueryParams = {
      status: 'INVALID'
    }

    const res = await chai
      .request(BASE_API_URL)
      .get('/v4/persons/2019/matches')
      .query(requestQueryParams);
    
    // Object type assertion
    expect(res).to.be.json;

    // HTTP code response assertion
    expect(res).to.have.status(403);

    // Schema assertion
    expect(JSON.parse(res.text)).to.be.jsonSchema(schema);

    // Response content assertions
    expect(JSON.parse(res.text).message).to.be.eq('The resource you are looking for is restricted and apparently not within your permissions. Please check your subscription.')
    expect(JSON.parse(res.text).errorCode).to.be.eq(403)
    
  });

  it('should return a not found response with status code 404', async () => {

    // Schema response definition
    const schema = {
      type: 'object',
      properties: {
        error: { type: 'number' }
      },
      required: [
        'error'
      ]
    };

    // HTTP REST Request
    const res = await chai
      .request(BASE_API_URL)
      .get('/v4/area');
    
    // Object type assertion
    expect(res).to.be.json;
    
    // HTTP code response assertion
    expect(res).to.have.status(404);

    // Schema assertion
    expect(JSON.parse(res.text)).to.be.jsonSchema(schema);

    // Response content assertion
    expect(JSON.parse(res.text).error).to.be.eq(404)
  });

  it('should return error when trying to patch an area, with status code 405', async () => {

    // Schema response definition
    const schema = {
      type: 'object',
      properties: {
        message: { type: 'string' },
        errorCode: { type: 'number' }
      },
      required: [
        'message',
        'errorCode'
      ]
    };

    const requestBody = {
      "name": "Mexico lindo y querido"
    }

    const res = await chai
      .request(BASE_API_URL)
      .patch('/v4/areas/2000/')
      .send(requestBody);
    
    // Object type assertion
    expect(res).to.be.json;

    // HTTP code response assertion
    expect(res).to.have.status(405);

    // Schema assertion
    expect(JSON.parse(res.text)).to.be.jsonSchema(schema);

    // Response content assertions
    expect(JSON.parse(res.text).message).to.be.eq('Method not allowed. Use GET method only.')
    expect(JSON.parse(res.text).errorCode).to.be.eq(405)
    
  });

});