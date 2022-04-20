import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

// Use Middleware
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB

const uri =
  'mongodb+srv://dbuser1:5TIcOy4wtuudJheR@node-mongo-crud.j9vef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const usersCollection = client.db('foodExpress').collection('users');

    // Get all users
    app.get('/users', async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // Get single user
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // Create a new user
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('Adding new user', newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Update a user
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: updatedUser,
      };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete a user
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch(console.dir);

// MongoDB

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Running node server');
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
