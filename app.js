// imports
import 'express-async-errors';
import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import notFoundMiddleware from './middlewares/not-found.js';
import errorHnadlerMiddleware from './middlewares/error-handler.js';
import connectDB from './db/connect.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import fileUpload from 'express-fileupload';
// imports

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));  // Enable all CORS requests.
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());  // middleware to handle file uploads.

app.get('/api/v1/', (req, res) => {
        console.log(req.signedCookies);
            
    
    res.send('Hello World!');
})

//auth router
app.use("/api/v1/auth/", authRouter);
// user routes
app.use('/api/v1/users', userRouter);
// ?product routes
app.use('/api/v1/products', productRouter);

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