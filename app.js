// imports
import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import morgan from 'morgan';
import notFoundMiddleware from './middlewares/not-found.js';
import errorHnadlerMiddleware from './middlewares/error-handler.js';
import connectDB from './db/connect.js';
import authRouter from './routes/auth.routes.js';
// imports

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//auth router
app.use("/api/v1/auth/", authRouter);

//custom middlewares
app.use(notFoundMiddleware);
app.use(errorHnadlerMiddleware);

const PORT = process.env.PORT || process.env.LOCAL_PORT;

// connect database and run server. 
(async  () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`server running at: http://localhost:${PORT}`));
        
    } catch (error) {
        console.error(error);
        
    }
})();