import {
  getUser,
  updateUser,
  deleteUser,
} from "../../controllers/userController";
import UserService from "../../services/userService";
import { Request, Response, NextFunction } from "express";

// Mock UserService
jest.mock("../../services/userService");

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { cookies: { authToken: "someValidToken" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    // Reset mocks between tests to ensure clean state
    jest.clearAllMocks();
  });

  it("should return user data when getUser is called successfully", async () => {
    const mockDecoded = { id: "someUserId" };
    const mockUser = { name: "John Doe", email: "john@example.com" };

    // Mock the methods
    (UserService.checkToken as jest.Mock).mockResolvedValueOnce(mockDecoded);
    (UserService.findById as jest.Mock).mockResolvedValueOnce(mockUser);

    await getUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      data: { user: mockUser },
    });
  });

  it("should call next with error if user is not found in getUser", async () => {
    const mockDecoded = { id: "someInvalidUserId" };

    // Mock the methods
    (UserService.checkToken as jest.Mock).mockResolvedValueOnce(mockDecoded);
    (UserService.findById as jest.Mock).mockResolvedValueOnce(null);

    await getUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("User does not exist."),
      })
    );
  });

  it("should update user successfully", async () => {
    const mockDecoded = { id: "someUserId" };
    const mockUpdatedUser = {
      name: "Updated Name",
      email: "updated@example.com",
    };

    // Mock the methods directly
    (UserService.checkToken as jest.Mock).mockResolvedValueOnce(mockDecoded);
    (UserService.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
      mockUpdatedUser
    );

    await updateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      data: { user: mockUpdatedUser },
    });
  });

  it("should delete user successfully", async () => {
    const mockDecoded = { id: "someUserId" };

    // Mock the methods directly
    (UserService.checkToken as jest.Mock).mockResolvedValueOnce(mockDecoded);
    (UserService.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

    await deleteUser(req as Request, res as Response, next);

    expect(res.clearCookie).toHaveBeenCalledWith("authToken");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "User successfully deleted",
    });
  });
});
