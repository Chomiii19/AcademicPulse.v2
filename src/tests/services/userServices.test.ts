import UserService from "../../services/userService";
import AppError from "../../errors/appError";
import verifyToken from "../../utils/verifyToken"; // Import the function to mock

jest.mock("../../utils/verifyToken", () => jest.fn()); // Mock the function directly

describe("UserService", () => {
  it("should throw error if token is not provided in checkToken", async () => {
    await expect(UserService.checkToken("")).rejects.toThrowError(
      new AppError("You are not logged in!", 401)
    );
  });

  it("should successfully decode token in checkToken", async () => {
    const mockToken = "validToken";
    const decoded = { id: "someUserId" };

    // Mock the implementation of verifyToken
    (verifyToken as jest.Mock).mockResolvedValueOnce(decoded); // Mock the return value of verifyToken

    const result = await UserService.checkToken(mockToken);
    expect(result).toEqual(decoded);
    expect(verifyToken).toHaveBeenCalledWith(mockToken); // Check if verifyToken was called with the correct token
  });

  it("should return user by ID", async () => {
    const mockUserId = "someUserId";
    const mockUser = { name: "John Doe", email: "john@example.com" };

    // Mock UserService.findById to return the mock user
    (UserService.findById as jest.Mock).mockResolvedValueOnce(mockUser);

    const user = await UserService.findById(mockUserId);
    expect(user).toEqual(mockUser);
    expect(UserService.findById).toHaveBeenCalledWith(mockUserId); // Check if findById was called with the correct ID
  });

  it("should throw error if user is not found in findById", async () => {
    const mockUserId = "someInvalidUserId";

    // Mock findById to return null (simulating user not found)
    (UserService.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(UserService.findById(mockUserId)).rejects.toThrowError(
      new AppError("User does not exist.", 404)
    );
  });
});
