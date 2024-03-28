import { MongoClient } from 'mongodb';

export async function connectDatabase() {
  const client: MongoClient = await MongoClient.connect(
    'mongodb+srv://drawyourmind:h0QGtbqOxTQHhhF4@clusters.v46crly.mongodb.net/drawyourmind?retryWrites=true&w=majority&appName=Clusters'
  );

  return client;
}

export async function insertDocument(
  client: MongoClient,
  collection: string,
  document: any
) {
  const db = client.db();
  await db.collection(collection).insertOne(document);
}

export async function getDocuments(client: MongoClient, collection: string) {
  const db = client.db();
  const documents = await db
    .collection(collection)
    .find()
    .sort({ _id: -1 })
    .toArray();
  return documents;
}

export async function getSearchResults(
  client: MongoClient,
  collection: string,
  query: number
) {
  const db = client.db();
  const documents = await db
    .collection(collection)
    .find({ no: query })
    .toArray();
  return documents;
}
