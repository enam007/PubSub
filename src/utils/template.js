const otpTemplate = (otp) => {
  return `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333333; text-align: center;">Your OTP for Login</h2>
      <p style="font-size: 16px; color: #555555;">Your OTP for login is 
        <strong style="font-size: 18px; color: #4CAF50;">${otp}</strong> and is valid for <strong style="font-size: 18px; color: #4CAF50;">5 minutes</strong>.
      </p>
    </div>`;
};

const notificationTemplate = (productName, price) => {
  return `<p>The product "<strong>${productName}</strong>" is now available for <strong>{price}OMR</strong>.</p>`;
};

export default { otpTemplate, notificationTemplate };
