const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// ── POST /addmeal ────────────────────────────────────────────

describe('POST /addmeal', () => {
    test('valid data returns 201 with ok status', async () => {
        const res = await request(app).post('/addmeal').send({ name: 'Oats', calories: 350 });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('ok');
    });

    test('missing name returns 400', async () => {
        const res = await request(app).post('/addmeal').send({ calories: 350 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });

    test('non-numeric calories returns 400', async () => {
        const res = await request(app).post('/addmeal').send({ name: 'Oats', calories: 'notanumber' });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });

    test('negative calories returns 400', async () => {
        const res = await request(app).post('/addmeal').send({ name: 'Oats', calories: -10 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });

    test('saves calories as a number, not a string', async () => {
        await request(app).post('/addmeal').send({ name: 'Rice', calories: 300 });
        const list = await request(app).get('/meals');
        expect(typeof list.body.data[0].calories).toBe('number');
    });
});

// ── POST /addworkout ─────────────────────────────────────────

describe('POST /addworkout', () => {
    test('valid data returns 201', async () => {
        const res = await request(app).post('/addworkout').send({ name: 'Bench Press', weight: 80, reps: 10 });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('ok');
    });

    test('missing name returns 400', async () => {
        const res = await request(app).post('/addworkout').send({ weight: 80, reps: 10 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });

    test('non-numeric weight returns 400', async () => {
        const res = await request(app).post('/addworkout').send({ name: 'Squat', weight: 'heavy' });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });

    test('saves weight as a number', async () => {
        await request(app).post('/addworkout').send({ name: 'Deadlift', weight: 100 });
        const list = await request(app).get('/exercises');
        expect(typeof list.body.data[0].weight).toBe('number');
    });
});

// ── GET /meals ───────────────────────────────────────────────

describe('GET /meals', () => {
    test('returns paginated envelope', async () => {
        await request(app).post('/addmeal').send({ name: 'Rice', calories: 300 });
        const res = await request(app).get('/meals');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('pages');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.total).toBe(1);
    });

    test('respects limit query parameter', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).post('/addmeal').send({ name: `Meal ${i}`, calories: 200 + i });
        }
        const res = await request(app).get('/meals?limit=2');
        expect(res.body.data.length).toBe(2);
        expect(res.body.total).toBe(5);
        expect(res.body.pages).toBe(3);
    });
});

// ── DELETE /meals/:id ────────────────────────────────────────

describe('DELETE /meals/:id', () => {
    test('deletes an existing meal and removes it from the list', async () => {
        await request(app).post('/addmeal').send({ name: 'Toast', calories: 150 });
        const list = await request(app).get('/meals');
        const id = list.body.data[0]._id;

        const res = await request(app).delete(`/meals/${id}`);
        expect(res.status).toBe(200);

        const after = await request(app).get('/meals');
        expect(after.body.total).toBe(0);
    });

    test('returns 404 for a non-existent id', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/meals/${fakeId}`);
        expect(res.status).toBe(404);
    });
});

// ── PUT /meals/:id ───────────────────────────────────────────

describe('PUT /meals/:id', () => {
    test('updates the calories field', async () => {
        await request(app).post('/addmeal').send({ name: 'Oats', calories: 300 });
        const list = await request(app).get('/meals');
        const id = list.body.data[0]._id;

        const res = await request(app).put(`/meals/${id}`).send({ calories: 400 });
        expect(res.status).toBe(200);
        expect(res.body.calories).toBe(400);
    });

    test('rejects invalid calories on update', async () => {
        await request(app).post('/addmeal').send({ name: 'Oats', calories: 300 });
        const list = await request(app).get('/meals');
        const id = list.body.data[0]._id;

        const res = await request(app).put(`/meals/${id}`).send({ calories: 'abc' });
        expect(res.status).toBe(400);
    });

    test('returns 404 for a non-existent id', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).put(`/meals/${fakeId}`).send({ calories: 200 });
        expect(res.status).toBe(404);
    });
});

// ── GET /health ──────────────────────────────────────────────

describe('GET /health', () => {
    test('returns ok status', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
