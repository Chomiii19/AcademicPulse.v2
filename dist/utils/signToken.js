import jwt from "jsonwebtoken";
const signToken = (id) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey)
        throw new Error("There was an error finding the secret key.");
    return jwt.sign({ id }, secretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
export default signToken;
