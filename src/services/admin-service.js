const { AdminRepository } = require("../database");
const { v4: uuidv4 } = require('uuid');
const sendEmail = require("../utils/emailSender");

const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors/app-errors");
const { VERIFICATION_URL, RESET_URL } = require("../config");

// All Business logic will be here
class AdminService {
  constructor() {
    this.repository = new AdminRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const existingAdmin = await this.repository.FindAdmin({ email });

    if (!existingAdmin)
      throw new NotFoundError("user not found with provided email id!");

    const validPassword = await ValidatePassword(
      password,
      existingAdmin.password,
      existingAdmin.salt
    );
    if (!validPassword) throw new ValidationError("password does not match!");

    const token = await GenerateSignature({
      email: existingAdmin.email,
      _id: existingAdmin._id,
    });

    return { id: existingAdmin._id, token };
  }

  // async SignUp(userInputs) {
  //   const { email, password, phone } = userInputs;

  //   // Check if a user with the same email already exists
  //   const existingUser = await this.repository.FindAdmin({ email });
  //   if (existingUser) {
  //     throw new Error('A user with this email already exists');
  //   }



  //   // create salt
  //   let salt = await GenerateSalt();

  //   let userPassword = await GeneratePassword(password, salt);

  //   const existingAdmin = await this.repository.CreateAdmin({
  //     email,
  //     password: userPassword,
  //     phone,
  //     salt,
  //   });

  //   const token = await GenerateSignature({
  //     email: email,
  //     _id: existingAdmin._id,
  //   });
  //   return { id: existingAdmin._id, token };
  // }

  async SignUp(userInputs) {
    const { email, password, phone, role, profilePicture } = userInputs;

    // Check if a user with the same email already exists
    const existingUser = await this.repository.FindAdmin({ email });
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    // Create salt and hash the password
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    // Generate a verification token
    const verifyToken = uuidv4(); // Make sure you have uuid installed and imported
    const verifyTokenExpiry = Date.now() + 3600000;

    if (profilePicture === undefined) {
      profilePicture = '/admin/images/default.png';
    }

    // Create the user with the hashed password, salt, and verification token
    const newUser = await this.repository.CreateAdmin({
      email,
      password: userPassword,
      phone,
      salt,
      verifyToken,
      verifyTokenExpiry, // Token expiry set to 1 hour
      role,
      profilePicture ,
    });

    // Send verification email
    const verificationUrl =VERIFICATION_URL + verifyToken;
    console.log(verificationUrl);

    
    await sendEmail({
      to: newUser.email,
      subject: 'Verify Your Email',
      html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    // Return a response indicating that a verification email has been sent
    return { message: "Signup successful, please verify your email." };
  }

  async GetProfile(id) {
    return this.repository.FindAdminById({ id });
  }

  async UpdateProfile(userId, updateFields, profilePicture) {
    const { firstName, lastName, phone } = updateFields;

    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    
    const updatedAdmin = await this.repository.UpdateAdminById(userId, updates);
  
    if (!updatedAdmin) {
        throw new NotFoundError("User not found.");
    }
  
    return FormateData(updatedAdmin);
}


  // async UpdateProfile(userId, updateFields, images) {
  //   // Specify which fields can be updated to prevent updating of sensitive fields
  //   const { firstName, lastName, phone } = updateFields;
  
  //   // Prepare the update object, excluding any fields not allowed or not provided
  //   const updates = {};
  //   if (firstName !== undefined) updates.firstName = firstName;
  //   if (lastName !== undefined) updates.lastName = lastName;
  //   if (phone !== undefined) updates.phone = phone;
  //   if (images !== undefined) updates.images = images;
    
  //   // Update the Admin in the database
  //   const updatedAdmin = await this.repository.UpdateAdminById(userId, updates);
  
  //   if (!updatedAdmin) {
  //     throw new NotFoundError("User not found.");
  //   }
  
  //   // Assuming FormateData formats the output
  //   return FormateData(updatedAdmin);
  // }
  
  

  async ChangePassword(userId, currentPassword, newPassword) {
    // Find the user by ID
    const admin = await this.repository.FindAdminById({ id: userId });
    if (!admin) {
      throw new NotFoundError('User not found');
    }
  
    // Validate current password
    const validPassword = await ValidatePassword(currentPassword, admin.password, admin.salt);
    if (!validPassword) {
      throw new ValidationError('Current password does not match');
    }
  
    // Generate a new salt and hash for the new password
    const newSalt = await GenerateSalt();
    const newHashedPassword = await GeneratePassword(newPassword, newSalt);
  
    // Update the user's password and salt in the database
    await this.repository.UpdateAdminById(admin._id, { password: newHashedPassword, salt: newSalt });
  
    return { message: 'Password updated successfully' };
  }
  

  async VerifyEmail(token) {
    const admin = await this.repository.FindAdminByToken({ verifyToken: token });
    if (!admin) {
      throw new NotFoundError('Invalid or expired token');
    }

    if (admin.verifyTokenExpiry < Date.now()) {
      throw new ValidationError('Token has expired');
    }

    // Update the user's isVerified field to true and remove the verification token
    await this.repository.UpdateAdminById(admin._id, {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    });

    return { message: 'Email verified successfully' };
  }

  async ResetPassword(token, password) {
    // Find a user with the provided reset token
    const admin = await this.repository.FindAdminByResetToken({ resetToken: token });
    if (!admin) {
      throw new NotFoundError('Invalid or expired token');
    }

    if (admin.resetTokenExpiry < Date.now()) {
      throw new ValidationError('Token has expired');
    }

    // Generate a new salt and hash the new password
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    // Update the user's password, salt, and remove the reset token
    await this.repository.UpdateAdminById(admin._id, {
      password: hashedPassword,
      salt: salt,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Password reset successful' };
  }
  
  async ResetPasswordLink(email) {
    // Check if a user with the provided email exists
    const admin = await this.repository.FindAdmin({ email });
    if (!admin) {
      throw new NotFoundError('No user found with this email.');
    }
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Assuming you have a method in your repository to update the admin
    await this.repository.UpdateAdminById(admin._id, {
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry,
    });

    const resetUrl = RESET_URL + resetToken;
    console.log(resetUrl);
    await sendEmail({
      to: admin.email,
      subject: 'Password Reset',
      html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    });

    // Return a meaningful message back to the controller to be sent to the user
    return { message: 'Password reset email sent.' };
}


  async DeleteProfile(userId) {
    const data = await this.repository.DeleteAdminById(userId);
    const payload = {
      event: "DELETE_PROFILE",
      data: { userId },
    };
    return { data, payload };
  }
}

module.exports = AdminService;
