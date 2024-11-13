import UserService from "../../services/userService";
import AppError from "../../errors/appError";
import verifyToken from "../../utils/verifyToken"; // Import the function to mock

// Mock the verifyToken function
jest.mock("../utils/verifyToken");

describe("UserService", () => {
  it("should throw error if token is not provided in checkToken", async () => {
    await expect(UserService.checkToken("")).rejects.toThrowError(
      new AppError("Your are not logged in!", 401)
    );
  });

  it("should successfully decode token in checkToken", async () => {
    const mockToken = "validToken";
    const decoded = { id: "someUserId" };

    // Mock the implementation of verifyToken
    (verifyToken as jest.Mock).mockResolvedValue(decoded); // Type casting to jest.Mock

    const result = await UserService.checkToken(mockToken);
    expect(result).toEqual(decoded);
  });

  it("should return user by ID", async () => {
    const mockUserId = "someUserId";
    const mockUser = { name: "John Doe", email: "john@example.com" };

    // Mock UserService.findById to return the mock user
    const findByIdMock = jest.fn().mockResolvedValue(mockUser);
    UserService.findById = findByIdMock;

    const user = await UserService.findById(mockUserId);
    expect(user).toEqual(mockUser);
  });

  it("should throw error if user is not found in findById", async () => {
    const mockUserId = "someInvalidUserId";
    const findByIdMock = jest.fn().mockResolvedValue(null);
    UserService.findById = findByIdMock;

    await expect(UserService.findById(mockUserId)).rejects.toThrowError(
      new AppError("User does not exist.", 404)
    );
  });
});
