let express = require('express');
let app = express();
let port = process.env.port || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ThoufiyaShaik:24112003@cluster0.vnmbusa.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      await client.close();
    }
}

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post('/api/place', async (req, res) => {
    let place = req.body;
    let result = await postplace(place);
    client.close();
    res.json({statusCode: 201, message: 'success', data: result});
});

async function postplace(place) {
    await client.connect();
    let collection = await client.db().collection('places');
    return collection.insertOne(place);
}

app.get('/api/places', async (req, res) => {
    let result = await getAllplaces();
    client.close();
    res.json({statusCode: 201, message: 'success', data: result});
});

async function getAllplaces() {
    await client.connect();
    let collection = await client.db().collection('places');
    return collection.find().toArray();
}

app.listen(port, () => {
    console.log('server started');
    //run().catch(console.dir);;
});
// // Define a GET endpoint to server the card data
// app.get('/api/places',(req,res)=> {
//     req.json({ cards:cardList});
// });
// app.get('/api/places',(req,res)=> {
//     res.json({statuscode:200, data: cardList, message:"success"})
// })