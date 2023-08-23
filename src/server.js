import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = 8000;

// MIDDLEWARE
app.use(express.json());

// END POINTS
app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    // connect to mongoDB
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    // access to db
    const db = client.db('react-blog-db'); // in shell > use react-blog-db
    // select data
    const article = await db.collection('articles').findOne({ name }); // in shell > db.articles.find({ name: “abcd”})

    if (article) {
        res.json(article);
    } else {
        // res.sendStatus(404).send('Article is not found');
        res.sendStatus(404);
    }
    
});

// upvote
app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvote: 1 }, // increment "upvotes" by 1
    })

    // const article = articlesInfo.find(a => a.name === name);
    const article = await db.collection('articles').findOne({ name })
    
    if (article) {
        res.send(`the ${name} article now has ${article.upvote} upvotes`);
    } else {
        res.send('The article is not exist');
    }
    
});

// comments
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text }},
    })

    // const article = articlesInfo.find(a => a.name === name);
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        // article.comments.push({postedBy, text});
        res.send(article.comments);
    } else {
        res.send('The article is not exist');
    }

});

app.listen(PORT, () => {
    console.log('listing')
});