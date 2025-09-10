const { mongoose } = require("../../configuration/dbConfig");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      require: true,
      default: "user", // user, staff, admin
    },
    googleId: {
      type: String,
      default: "",
    },
    clinic: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    address: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password trước khi save
userSchema.pre("save", async function (next) {
  // Chỉ hash password nếu nó được modify
  if (!this.isModified("password")) return next();
  
  // Hash password với cost 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method để check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Users", userSchema, "users");
