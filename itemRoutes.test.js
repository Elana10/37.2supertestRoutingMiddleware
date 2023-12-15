process.env.NODE_ENV = 'test'

const request = require("supertest");

const app = require('./app');
let items = require('./fakeDb');

let salsa = { name: 'Salsa', price : 3.99};

beforeEach(function(){
    items.push(salsa);
});

afterEach(function(){
    items.length = 0;
});

describe('GET /items', function(){
    test('Gets the full items list.', async function (){
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items : [salsa]});
    });
});

describe('GET /items/:name', function(){
    test('Get a single item', async function() {
        const resp = await request(app).get(`/items/${salsa.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({item:salsa});
    });

    test('Response with 404 if item not found', async function(){
        const resp = await request(app).get('/items/banana');
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /items", function(){
    test('Create new item', async function(){
        const banana = {name : "banana", price : .10}
        const resp = await request(app).post('/items').send(banana);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            added : banana
        });
    })
})

describe("PATCH /items/:name", function(){
    test("Update item", async function(){
        let updatedItem = {name: 'Salsa Verde'}
        const resp = await request(app).patch(`/items/${salsa.name}`).send(updatedItem);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated : {
                name : 'Salsa Verde', price : 3.99
            }
        });
    });
});

describe('DELETE /items/:name', function(){
    test('delete an item', async function(){
        const resp = await request(app).delete(`/items/${salsa.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Deleted"})
    })
})