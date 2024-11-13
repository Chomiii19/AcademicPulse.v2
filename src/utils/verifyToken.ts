import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = async (token: string): Promise<JwtPayload> => {
  return (await jwt.verify(
    token,
    process.env.SECRET_KEY as string
  )) as JwtPayload;
};

export default verifyToken;
