const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();




// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gi8q3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log('database connected successfully');
        const database = client.db("studentInfo");
        const studentInfoCrud = database.collection("studentInfoCrud");

        // GET API
        app.get("/studentinfo", async (req, res) => {
            const cursor = studentInfoCrud.find({});
            const studentData = await cursor.toArray();
            res.send(studentData);
        });

        // Single Data Get API
        app.get("/studentinfo/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentInfoCrud.findOne(query);
            res.send(result);
        })

        // POST API
        app.post('/studentinfo', async (req, res) => {
            const data = req.body;
            console.log('hit the post api', data);

            const result = await studentInfoCrud.insertOne(data);
            console.log(result);
            res.json(result);
        });

        // DELETE API
        app.delete('/studentinfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentInfoCrud.deleteOne(query);
            res.json(result);

        })

        // PUT API (Update API)

        app.put('/studentinfo/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('updating user', req);
            // res.send('update not user')
            const updateStudentInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateStudentInfo.name,
                    class: updateStudentInfo.class,
                    roll: updateStudentInfo.roll,
                    group: updateStudentInfo.group
                },
            };
            const result = await studentInfoCrud.updateOne(filter, updateDoc, options);
            // console.log()
            res.json(result)
        })
    } finally {
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});