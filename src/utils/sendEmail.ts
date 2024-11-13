import nodemailer from "nodemailer";
import IUser from "../@types/userInterfaces";
import userVerification from "./template/emailTemplate";

const sendMail = async function (subject: string, receiver: IUser) {
  try {
    const email = process.env.EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from: {
        name: "Technological University of the Philippines - Manila",
        address: email,
      },
      to: [receiver.email],
      subject: subject,
      text: "",
      html: userVerification(
        receiver.firstname,
        receiver.idNumber,
        receiver._id
      ),
    };

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email");
  }
};

export default sendMail;
