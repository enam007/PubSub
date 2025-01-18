import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
    ],
    //exposedHeaders: ["set-cookie"],
  })
);
app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.options("*", cors());

// import router
import userRouter from "./routes/user.routers.js";
import authRouter from "./routes/auth.router.js";
import productRouter from "./routes/product.router.js";
import categoryRouter from "./routes/category.router.js";
import alertRouter from "./routes/alert.router.js";
import imageRouter from "./routes/image.router.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/alert", alertRouter);
app.use("/api/v1/image", imageRouter);

export { app };
