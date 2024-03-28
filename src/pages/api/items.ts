import {
  connectDatabase,
  getDocuments,
  getSearchResults,
  insertDocument,
} from '@/helpers/db-util';
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const data = await JSON.stringify(req.body);
    const { name, url, image } = JSON.parse(req?.body);

    let client: MongoClient;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
    }

    try {
      await insertDocument(client, 'items', {
        name,
        url,
        image,
      });
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed!' });
      return;
    }

    res.status(201).json({ message: 'Signed Up!' });
  }

  if (req.method === 'GET') {
    let client: MongoClient;
    let documents: any;

    const { query } = req.query;
    const productId: number = Number(query);
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
    }

    try {
      documents = productId
        ? await getSearchResults(client, 'items', productId)
        : await getDocuments(client, 'items');

      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Get documents failed!' });
      return;
    }

    res.status(201).json({ result: documents });
  }
}
