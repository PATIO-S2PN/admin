const { APIError } = require("../../utils/errors/app-errors");
const { AdminModel } = require("../models");

//Dealing with data base operations
class AdminRepository {
  async CreateAdmin({ email, password, phone, salt, verifyToken, verifyTokenExpiry, role, profilePicture }) {
    const admin = new AdminModel({
      email,
      password,
      salt,
      phone,
      verifyToken,
      verifyTokenExpiry,
      resetToken: '',
      resetTokenExpiry: '',  
      otp: '',
      otp_expiry: '',
      firstName: '',
      lastName: '',
      isVerified: false,
      role,
      profilePicture ,
    });

    const adminResult = await admin.save();
    return adminResult;
  }

  async FindAdmin({ email }) {
    const existingAdmin = await AdminModel.findOne({ email: email });
    return existingAdmin;
  }

  async FindAdminByToken({ verifyToken }) {
    const existingAdmin = await AdminModel.findOne({ verifyToken: verifyToken });
    return existingAdmin;
  }

  async FindAdminByResetToken({ resetToken }) {
    const existingAdmin = await AdminModel.findOne({ resetToken : resetToken });
    return existingAdmin;
  }

  async UpdateAdminById(id, data) {
    const existingAdmin = await AdminModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return existingAdmin;
  }
  

  async FindAdminById({ id }) {
    const existingAdmin = await AdminModel.findById(id);
    return existingAdmin;
  }

  async DeleteAdminById(id) {
    return AdminModel.findByIdAndDelete(id);
  }
}

module.exports = AdminRepository;
