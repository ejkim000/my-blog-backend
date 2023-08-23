import { MongoClient } from 'mongodb';
let db;

async function connectToDb(cb) {
    // connect to mongoDB
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    // access to db
    const db = client.db('react-blog-db'); // in shell > use react-blog-db
    cb();
}

export {
    db,
    connectToDb,
}