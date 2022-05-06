const router = require('express').Router();
const {MongoClient} = require('mongodb');
const client = new MongoClient("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const {startTimer, stopTimer} = require("../dataLogger");

let dbConnection;

client.connect(function (err, db) {
    if (err || !db) console.log(err)
    dbConnection = db.db('examensarbete');
    console.log('Successfully connected to MongoDB.');
});
router.get('/get/init', (req, res) => {

    dbConnection.collection("records").find().limit(10000).toArray(function (err, result) {
        if (err) console.log(err)
        else {
            idArray = [];
            result.forEach(document => {
                idArray.push(document["_id"]);
            })
            return res.status(200).json(idArray)
        }
    });
})

router.get('/:id', (req, res) => {

    startTimer("MongoDB-GET");
    dbConnection.collection("records").find({"_id": req.params.id}).toArray(function (err, result) {
        if (err) console.log(err)
        else {
            stopTimer("MongoDB-GET");
            return res.status(200).json(result)
        }
    });
})

router.post('/', async (req, res) => {

    let document = await dbConnection.collection("records").findOne({_id: req.body._id});
    if (document) await dbConnection.collection("records").deleteOne({_id: req.body._id});
    startTimer("MongoDB-POST");
    dbConnection.collection("records").insertOne(req.body, function (err, result) {
        if (err) console.log(err)
        else {
            stopTimer("MongoDB-POST");
            return res.status(200).json(result)
        }
    });
});

router.put('/:id', async (req, res) => {
    startTimer("MongoDB-PUT");
    dbConnection.collection("records").updateMany({"_id": req.params.id}, {$set: req.body}, function (error, result) {
        if (error) console.log(error)
        else {
            stopTimer("MongoDB-PUT");
            return res.status(200).json(result)
        }
    });
});

module.exports = router;