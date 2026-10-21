const API_BASE = 'https://api.demoblaze.com';

describe('Demoblaze REST API Test Suite', () => {
  it('API-01 - POST /bycat (phones) returns array of phone items', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/bycat`,
      body: { cat: 'phone' },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('Items');
      expect(response.body.Items).to.be.an('array').and.have.length.greaterThan(0);
      response.body.Items.forEach((item) => {
        expect(item.cat).to.eq('phone');
        expect(item).to.have.all.keys('cat', 'desc', 'id', 'img', 'price', 'title');
      });
    });
  });

  it('API-02 - POST /bycat (notebooks) returns array of laptop items', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/bycat`,
      body: { cat: 'notebook' },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('Items');
      expect(response.body.Items).to.be.an('array').and.have.length.greaterThan(0);
      response.body.Items.forEach((item) => {
        expect(item.cat).to.eq('notebook');
      });
    });
  });

  it('API-03 - POST /bycat (monitors) returns array of monitor items', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/bycat`,
      body: { cat: 'monitor' },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('Items');
      expect(response.body.Items).to.be.an('array').and.have.length.greaterThan(0);
      response.body.Items.forEach((item) => {
        expect(item.cat).to.eq('monitor');
      });
    });
  });

  it('API-04 - POST /view with valid product ID returns product details', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/view`,
      body: { id: '1' },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('title', 'Samsung galaxy s6');
      expect(response.body).to.have.property('price', 360.0);
    });
  });

  it('API-05 - POST /login with valid credentials returns Auth_token', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/login`,
      body: {
        username: 'test',
        password: btoa('test'),
      },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('Auth_token:');
    });
  });

  it('API-06 - POST /login with incorrect password returns error message', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/login`,
      body: {
        username: 'test',
        password: btoa('WrongPassword!'),
      },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('errorMessage', 'Wrong password.');
    });
  });

  it('API-07 - POST /signup with already registered user returns duplicate error', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/signup`,
      body: {
        username: 'test',
        password: btoa('test'),
      },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('errorMessage', 'This user already exist.');
    });
  });
});
