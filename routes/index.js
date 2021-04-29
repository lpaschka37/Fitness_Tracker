// * View the combined weight of multiple exercises from the past seven workouts on the `stats` page.
// * View the total duration of each workout from the past seven workouts on the `stats` page.

const router = require('express').Router();
const path = require("path");
const db = require('../models/workout.js');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"));
});

router.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", 'stats.html'));
});

router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", 'exercise.html'));
});

//GET /api/workouts to get the last workout
router.get("/api/workouts", (req, res) => {
    db.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        },
    ])
        .sort({ day: -1 })
        .limit(1)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
    });

//   * Add exercises to the most recent workout plan.
//PUT /api/workouts to add exercise
router.put("/api/workouts/:id", (req, res) => {
    db.findByIdAndUpdate(
        req.params.id, 
        { 
            $push: 
            { 
                exercises: req.body 
            } 
        },
        { new: true }
        )
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

//   * Add new exercises to a new workout plan.
//POST /api/workouts to create workout
router.post("/api/workouts", (req, res) => {
    body = req.body;
    db.create(body)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

//GET /api/workouts/range to get workouts in range
router.get("/api/workouts/range", (req, res) => {
    db.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        },
    ])
    .sort( { day: -1 })
    .limit(7)
    .then(dbWorkout => {
        //console.log("dbWorkout", dbWorkout)
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

module.exports = router;
