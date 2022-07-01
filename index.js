const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwemsex.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)



async function run() {

    try {
        await client.connect();

        const serviceCollection = client.db('Task').collection('Taskdata');


        // task create
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await serviceCollection.insertOne(newTask);
            res.send(result);
        });


        // Get all task
        app.get('/task-all', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const allTask = await cursor.toArray();
            res.send(allTask);
        });


        // Delete single task
        app.delete('/task-all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        // Update task
        // Get single task
        app.get('/task-all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleTask = await serviceCollection.findOne(query);
            res.send(singleTask);
        });
        // Update task
        app.put('/task-all/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: data.name,
                    description: data.description
                }
            };
            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })



    }
    finally {

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Task management!')
})

app.listen(port, () => {
    console.log(`Hello from Task management ${port}`)
})