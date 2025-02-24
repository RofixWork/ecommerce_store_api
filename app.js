// imports
import "express-async-errors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHnadlerMiddleware from "./middlewares/error-handler.js";
import connectDB from "./db/connect.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import fileUpload from "express-fileupload";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import path from "path";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import express_mongo_sanitize from "express-mongo-sanitize";
// imports

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
  })
);
app.use(helmet());
app.use(xss());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*");
    },
    credentials: true,
  })
);
app.use(express_mongo_sanitize()); // sanitizes MongoDB queries.

//middlewares
app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload()); // middleware to handle file uploads.

app.get("/api/v1/", (req, res) => {
  res.send("API MAIN ROUTER!");
});

//auth router
app.use("/api/v1/auth/", authRouter);
// user routes
app.use("/api/v1/users", userRouter);
// ?product routes
app.use("/api/v1/products", productRouter);
//reviews
app.use("/api/v1/reviews", reviewRouter);
//order routes
app.use("/api/v1/orders", orderRouter);
//custom middlewares
app.use(notFoundMiddleware);
app.use(errorHnadlerMiddleware);

const PORT = process.env.PORT || process.env.LOCAL_PORT;

// connect database and run server.
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`server running at: http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
})();
