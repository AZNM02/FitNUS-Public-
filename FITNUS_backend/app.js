require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

app.use(express.json());

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => {
    console.log("Connected to Database");
}).catch((e) => {
    console.log(e);
});

require('./MealDetails');
require('./WorkoutDetails');
const Meal = mongoose.model("MealInfo");
const Workout = mongoose.model("WorkoutInfo");

// ── Validation chains (reused across POST and PUT) ───────────

const mealValidators = [
    body('name').optional().trim().notEmpty().withMessage('Meal name cannot be blank'),
    body('calories').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Calories must be a non-negative number'),
    body('protein').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Protein must be a non-negative number'),
    body('carbs').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Carbs must be a non-negative number'),
    body('fat').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Fat must be a non-negative number'),
];

const workoutValidators = [
    body('name').optional().trim().notEmpty().withMessage('Exercise name cannot be blank'),
    body('duration').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Duration must be a non-negative number'),
    body('sets').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Sets must be a non-negative number'),
    body('weight').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Weight must be a non-negative number'),
    body('reps').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Reps must be a non-negative number'),
    body('distance').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Distance must be a non-negative number'),
];

const parse = (v) => (v !== undefined && v !== '' ? parseFloat(v) : undefined);

// ── Health ───────────────────────────────────────────────────

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// ── Meals ────────────────────────────────────────────────────

app.post(
    '/addmeal',
    body('name').trim().notEmpty().withMessage('Meal name is required'),
    body('calories').isFloat({ min: 0 }).withMessage('Calories must be a non-negative number'),
    ...mealValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        try {
            await Meal.create({
                name: req.body.name,
                calories: parseFloat(req.body.calories),
                protein: parse(req.body.protein),
                carbs: parse(req.body.carbs),
                fat: parse(req.body.fat),
            });
            res.status(201).json({ status: 'ok', data: 'Meal Added' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

app.put(
    '/meals/:id',
    ...mealValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        try {
            const updated = await Meal.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
            );
            if (!updated) return res.status(404).json({ status: 'error', message: 'Meal not found' });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

app.delete('/meals/:id', async (req, res) => {
    try {
        const deleted = await Meal.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Meal not found' });
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/meals', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Meal.find().sort({ date: -1 }).skip(skip).limit(limit),
            Meal.countDocuments(),
        ]);
        res.json({ data, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ── Exercises ────────────────────────────────────────────────

app.post(
    '/addworkout',
    body('name').trim().notEmpty().withMessage('Exercise name is required'),
    ...workoutValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        const { name, duration, sets, weight, reps, distance, notes } = req.body;
        try {
            await Workout.create({
                name,
                duration: parse(duration),
                sets: parse(sets),
                weight: parse(weight),
                reps: parse(reps),
                distance: parse(distance),
                notes,
            });
            res.status(201).json({ status: 'ok', data: 'Workout Added' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

app.put(
    '/exercises/:id',
    ...workoutValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        try {
            const updated = await Workout.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
            );
            if (!updated) return res.status(404).json({ status: 'error', message: 'Exercise not found' });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

app.delete('/exercises/:id', async (req, res) => {
    try {
        const deleted = await Workout.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Exercise not found' });
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/exercises', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Workout.find().sort({ date: -1 }).skip(skip).limit(limit),
            Workout.countDocuments(),
        ]);
        res.json({ data, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(5001, () => {
    console.log("Server started.");
});
