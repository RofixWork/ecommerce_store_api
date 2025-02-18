import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import morgan from 'morgan';
import notFoundMiddleware from './middlewares/not-found.js';
import errorHnadlerMiddleware from './middlewares/error-handler.js';
import connectDB from './db/connect.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//custom middlewares
app.use(notFoundMiddleware);
app.use(errorHnadlerMiddleware);

const PORT = process.env.PORT || process.env.LOCAL_PORT;

(async  () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));
        
    } catch (error) {
        console.error(error);
        
    }
})();