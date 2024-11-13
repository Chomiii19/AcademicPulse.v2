"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
// Defining user schema
const userSchema = new mongoose_1.Schema({
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
        validate: [validator_1.default.isEmail, "Invalid email"],
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
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    });
});
// comparePassword method to compare password to the encrypted password
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
const User = (0, mongoose_1.model)("user", userSchema);
exports.default = User;
