import { getUser, updateUser, deleteUser, } from "../../controllers/userController";
import UserService from "../../services/userService";
// Mock UserService
jest.mock("../../services/userService");
describe("UserController", () => {
    let req;
    let res;
    let next;
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
        UserService.checkToken.mockResolvedValueOnce(mockDecoded);
        UserService.findById.mockResolvedValueOnce(mockUser);
        await getUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "Success",
            data: { user: mockUser },
        });
    });
    it("should call next with error if user is not found in getUser", async () => {
        const mockDecoded = { id: "someInvalidUserId" };
        // Mock the methods
        UserService.checkToken.mockResolvedValueOnce(mockDecoded);
        UserService.findById.mockResolvedValueOnce(null);
        await getUser(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining("User does not exist."),
        }));
    });
    it("should update user successfully", async () => {
        const mockDecoded = { id: "someUserId" };
        const mockUpdatedUser = {
            name: "Updated Name",
            email: "updated@example.com",
        };
        // Mock the methods directly
        UserService.checkToken.mockResolvedValueOnce(mockDecoded);
        UserService.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
        await updateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "Success",
            data: { user: mockUpdatedUser },
        });
    });
    it("should delete user successfully", async () => {
        const mockDecoded = { id: "someUserId" };
        // Mock the methods directly
        UserService.checkToken.mockResolvedValueOnce(mockDecoded);
        UserService.findByIdAndDelete.mockResolvedValueOnce(null);
        await deleteUser(req, res, next);
        expect(res.clearCookie).toHaveBeenCalledWith("authToken");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "Success",
            message: "User successfully deleted",
        });
    });
});
