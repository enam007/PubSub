import redis from "ioredis";
import { Subcriber } from "../models/subcriber.model.js";
import template from "../utils/template.js";
import { sendEmailToSubcriber } from "./email.service.js";

const redisSubcriber = new redis();

const intialize = async () => {
  redisSubcriber.psubscribe("subCategory:*", (err, count) => {
    if (err) {
      console.error("Failed to subcribe to Redis Channels: ", err);
      return;
    }
    console.log(`Subcribed to ${count} subCategory Channels`);
  });

  redisSubcriber.on("pmessage", async (pattern, channel, message) => {
    const { productName, subCategoryId, price } = JSON.parse(message);
    const subcribers = await Subcriber.find({ subCategoryId });
    if (subcribers.length === 0) {
      console.log(`No Subcribers for subCategoryId:  ${subCategoryId}`);
      return;
    }
    const notificationTemplate = template.notificationTemplate(
      productName,
      price
    );
    const subject = `Product Alert: ${productName} is now available!`;
    await sendEmailToSubcriber(subcribers, subject, notificationTemplate);
    console.log(`Recieved message from ${channel}:`, { productName, price });
  });
};

export default { intialize };
