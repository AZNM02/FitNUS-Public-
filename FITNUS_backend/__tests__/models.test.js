const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let Meal;
let Workout;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    // Import after connection so the mongoose.models cache is already set
    Meal = require('../MealDetails');
    Workout = require('../WorkoutDetails');
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async () => {
    await Meal.deleteMany({});
    await Workout.deleteMany({});
});

// ── MealInfo schema ──────────────────────────────────────────

describe('MealInfo schema', () => {
    test('saves a valid meal with calories stored as a number', async () => {
        const meal = await Meal.create({ name: 'Chicken Rice', calories: 450 });
        expect(meal.name).toBe('Chicken Rice');
        expect(typeof meal.calories).toBe('number');
        expect(meal.calories).toBe(450);
    });

    test('defaults protein, carbs, and fat to 0', async () => {
        const meal = await Meal.create({ name: 'Plain Rice', calories: 200 });
        expect(meal.protein).toBe(0);
        expect(meal.carbs).toBe(0);
        expect(meal.fat).toBe(0);
    });

    test('saves macro fields correctly when provided', async () => {
        const meal = await Meal.create({ name: 'Salmon', calories: 350, protein: 30, carbs: 5, fat: 20 });
        expect(meal.protein).toBe(30);
        expect(meal.carbs).toBe(5);
        expect(meal.fat).toBe(20);
    });

    test('rejects a meal with no name', async () => {
        await expect(Meal.create({ calories: 300 })).rejects.toThrow();
    });

    test('rejects a meal with no calories', async () => {
        await expect(Meal.create({ name: 'Mystery Food' })).rejects.toThrow();
    });

    test('rejects a string value for calories', async () => {
        await expect(Meal.create({ name: 'Test', calories: 'abc' })).rejects.toThrow();
    });

    test('auto-sets the date field on creation', async () => {
        const before = new Date();
        const meal = await Meal.create({ name: 'Banana', calories: 90 });
        const after = new Date();
        expect(meal.date).toBeDefined();
        expect(new Date(meal.date).getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(new Date(meal.date).getTime()).toBeLessThanOrEqual(after.getTime());
    });
});

// ── WorkoutInfo schema ───────────────────────────────────────

describe('WorkoutInfo schema', () => {
    test('saves a valid exercise with weight stored as a number', async () => {
        const exercise = await Workout.create({ name: 'Bench Press', weight: 80, reps: 8 });
        expect(exercise.name).toBe('Bench Press');
        expect(typeof exercise.weight).toBe('number');
        expect(exercise.weight).toBe(80);
    });

    test('rejects an exercise with no name', async () => {
        await expect(Workout.create({ weight: 80 })).rejects.toThrow();
    });

    test('optional numeric fields are undefined when omitted', async () => {
        const exercise = await Workout.create({ name: 'Run' });
        expect(exercise.distance).toBeUndefined();
        expect(exercise.duration).toBeUndefined();
        expect(exercise.weight).toBeUndefined();
        expect(exercise.reps).toBeUndefined();
    });

    test('saves all optional fields correctly', async () => {
        const exercise = await Workout.create({
            name: 'Squat',
            duration: 45,
            sets: 4,
            weight: 100,
            reps: 6,
            distance: 0,
            notes: 'Felt strong today',
        });
        expect(exercise.sets).toBe(4);
        expect(exercise.notes).toBe('Felt strong today');
    });

    test('auto-sets the date field on creation', async () => {
        const before = new Date();
        const exercise = await Workout.create({ name: 'Plank' });
        const after = new Date();
        expect(new Date(exercise.date).getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(new Date(exercise.date).getTime()).toBeLessThanOrEqual(after.getTime());
    });
});
