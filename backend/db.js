import dotenv from "dotenv";
dotenv.config({ debug: true });
import { mongoose } from "mongoose";

class Connection {
    static async init() {
        console.log('Connecting to MongoDB...');

        await mongoose.connect(process.env.DB_HOST)
            .then(() => { console.log('Successfully connected to MongoDB'); return true; })
            .catch(err => { console.error('Could not connect to MongoDB:', err); return false; });
    }
}

export default Connection;

