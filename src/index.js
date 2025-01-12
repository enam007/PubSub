import connectDB from "./db/index.js";
import { app } from "./app.js";
import notificationService from "./services/notification.service.js";
const port = process.env.PORT || 8000;

try {
  await connectDB();

  try {
    await notificationService.intialize();
  } catch (error) {
    console.error(`Error occured in Redis:`, error);
  }
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
  app.on("error", (err) => {
    console.error("EXPRESS SERVER ERROR !!! ", err);
  });
} catch (error) {
  console.log("MONGODB CONNECTION FAILED !!! ", error);
}
