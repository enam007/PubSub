import nodemailer from "nodemailer";
const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail = async (email, subject, template) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    //text: `Your Otp for login is ${otp} This OTP is valid for 5 minutes`,
    html: template,
  };
  await transpoter.sendMail(mailOptions);
};

const sendEmailToSubcriber = async (subcribers, subject, template) => {
  const emailPromises = subcribers.map((subcriber) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: subcriber.email,
      subject: subject,
      html: template,
    };
    return transpoter.sendMail(mailOptions);
  });

  await Promise.all(emailPromises);
};

export { sendEmail, sendEmailToSubcriber };
