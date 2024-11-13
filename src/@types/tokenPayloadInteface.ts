import { JwtPayload } from "jsonwebtoken";

export default interface AuthTokenPayload extends JwtPayload {
  id: string;
}
