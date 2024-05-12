const AdminService = require("./admin-service");
const AdminRepository = require("../database/repository/admin-repository");
const { ValidatePassword, GenerateSignature } = require("../utils");

// Ensure jest mocks the actual modules
jest.mock("../database/repository/admin-repository");
jest.mock("../utils");

describe("AdminService", () => {
  let service;
  let mockAdmin;

  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks to clear previous test data

    mockAdmin = {
      _id: "1",
      email: "admin@example.com",
      password: "hashedpassword",
      salt: "salt",
      verifyToken: "verifyToken",
      verifyTokenExpiry: Date.now() + 3600000,
      isVerified: false,
    };

    // Setup the service with a new instance before each test
    service = new AdminService();

    // Mock return values for the repository functions
    AdminRepository.prototype.FindAdmin = jest.fn();
    AdminRepository.prototype.CreateAdmin = jest.fn();
    AdminRepository.prototype.UpdateAdminById = jest.fn();
    AdminRepository.prototype.FindAdminById = jest.fn();
    AdminRepository.prototype.DeleteAdminById = jest.fn();
    AdminRepository.prototype.FindAdminByToken = jest.fn();
    AdminRepository.prototype.FindAdminByResetToken = jest.fn();
  });

  describe("SignIn", () => {
    it("should throw NotFoundError if admin does not exist", async () => {
      AdminRepository.prototype.FindAdmin.mockResolvedValue(null);
      await expect(
        service.SignIn({
          email: "nonexistent@example.com",
          password: "password",
        })
      ).rejects.toThrow("user not found with provided email id!");
    });
  });
});
