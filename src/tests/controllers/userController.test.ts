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
  });

  it("should return user data when getUser is called successfully", async () => {
    const mockDecoded = { id: "someUserId" };
    const mockUser = { name: "John Doe", email: "john@example.com" };

    // Mock the methods
    (UserService.checkToken as jest.Mock).mockResolvedValue(mockDecoded);
    (UserService.findById as jest.Mock).mockResolvedValue(mockUser);

    await getUser(req as Request, res as Response, next);

    // Check if the status and json response are called correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      data: { user: mockUser },
    });
  });

  it("should return an error if user is not found in getUser", async () => {
    const mockDecoded = { id: "someInvalidUserId" };

    // Mock the methods
    (UserService.checkToken as jest.Mock).mockResolvedValue(mockDecoded);
    (UserService.findById as jest.Mock).mockResolvedValue(null);

    await getUser(req as Request, res as Response, next);

    // Check if next is called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should update user successfully", async () => {
    const mockDecoded = { id: "someUserId" };
    const mockUpdatedUser = {
      name: "Updated Name",
      email: "updated@example.com",
    };

    // Mock the methods directly without using 'mocked'
    (UserService.checkToken as jest.Mock).mockResolvedValue(mockDecoded);
    (UserService.findByIdAndUpdate as jest.Mock).mockResolvedValue(
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

    // Mock the methods directly without using 'mocked'
    (UserService.checkToken as jest.Mock).mockResolvedValue(mockDecoded);
    (UserService.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteUser(req as Request, res as Response, next);

    expect(res.clearCookie).toHaveBeenCalledWith("authToken");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "User successfully deleted",
    });
  });
});
