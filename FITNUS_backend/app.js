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

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.post(
    '/addmeal',
    body('name').trim().notEmpty().withMessage('Meal name is required'),
    body('calories').isFloat({ min: 0 }).withMessage('Calories must be a non-negative number'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        try {
            await Meal.create({
                name: req.body.name,
                calories: parseFloat(req.body.calories),
            });
            res.status(201).json({ status: 'ok', data: 'Meal Added' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

app.post(
    '/addworkout',
    body('name').trim().notEmpty().withMessage('Exercise name is required'),
    body('duration').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Duration must be a non-negative number'),
    body('sets').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Sets must be a non-negative number'),
    body('weight').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Weight must be a non-negative number'),
    body('reps').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Reps must be a non-negative number'),
    body('distance').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Distance must be a non-negative number'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        const { name, duration, sets, weight, reps, distance, notes } = req.body;
        const parse = (v) => (v !== undefined && v !== '' ? parseFloat(v) : undefined);
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

app.get('/meals', async (req, res) => {
    try {
        const meals = await Meal.find().sort({ date: -1 });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/exercises', async (req, res) => {
    try {
        const exercises = await Workout.find().sort({ date: -1 });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(5001, () => {
    console.log("Server started.");
});
