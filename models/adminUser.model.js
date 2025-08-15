import mongoose from "mongoose";

const adminUserModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const AdminUser = mongoose.model("AdminUser", adminUserModel);

export default AdminUser;
