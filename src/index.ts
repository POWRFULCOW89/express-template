import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'

import './models/Product'
import './models/User'
import routes from './routes'
import handleAuthError from './util/handleAuthError'

import './config/passport'

const app = express();
let port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use('/v1', routes);
app.use(handleAuthError)

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        mongoose.set("debug", true);
        console.info(`Connected to database`);
    } catch (error) {
        console.error(`Connection error: ${error.stack}`);
        process.exit(1);
    }
}

app.listen(port || 3000, () => {
    console.log(`Server started at port ${port} at process: ${process.pid}`)
    connectToDb()
});

export default app;