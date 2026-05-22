import { MongoClient } from "mongodb";
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
const uri = process.env.MONGODB_URI;
const options = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}
// eslint-disable-next-line prefer-const
client = new MongoClient(uri, options);
// eslint-disable-next-line prefer-const
clientPromise = client.connect();
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;