import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import router
import userRouter from "./routes/user.routers.js";
import authRouter from "./routes/auth.router.js";
import productRouter from "./routes/product.router.js";
import categoryRouter from "./routes/category.router.js";
import alertRouter from "./routes/alert.router.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/alert", alertRouter);

export { app };
