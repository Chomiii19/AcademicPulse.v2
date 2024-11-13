import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
// Defining user schema
const userSchema = new Schema({
    idNumber: {
        type: String,
        required: [true, "A user must have an id number"],
        unique: true,
    },
    surname: {
        type: String,
        required: [true, "A user must have a surname"],
    },
    firstname: {
        type: String,
        required: [true, "A user must have a firstname"],
    },
    middlename: {
        type: String,
    },
    extension: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        validate: [validator.isEmail, "Invalid email"],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "A user must have a phone number"],
        validate: {
            validator: (value) => {
                const val = value.replace(/\D/g, "");
                return val.length === 11 && val.startsWith("09") && true;
            },
            message: "Invalid phone number",
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return this.password === value;
            },
            message: "Password mismatch",
        },
    },
    passwordChangedAt: {
        type: Date,
        default: null,
    },
    isValid: {
        type: Boolean,
        default: false,
    },
});
// Pre-save middleware that encrypts password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
// comparePassword method to compare password to the encrypted password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
const User = model("user", userSchema);
export default User;
