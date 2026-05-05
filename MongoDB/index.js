let readline = require("readline-sync");
let {MongoClient, ObjectId} = require("mongodb");

let username = "admin";
let password = "12345";
let cluster = "Medup";
let dbname = "Users";
let ColectionName = "Users";

const url = `mongodb+srv://${username}:${password}@${cluster}.wym14vh.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(url);

async function main() {

    try {

        await client.connect();
        console.log("Connected to MongoDB ");

        let db = client.db(dbname);
        let collection = db.collection(ColectionName);

    } catch (error   ) {
        console.error(error);
    } finally {
        await client.close();
    }
}
main().catch(console.error);