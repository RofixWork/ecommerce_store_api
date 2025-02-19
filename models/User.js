import { Schema, model, Model } from "mongoose";
import email_validate from "email-validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "please provide name..."],
      trim: true,
      minlength: [3, "minimum 3 characters required..."],
      maxlength: [100, "maximum 100 characters allowed"],
    },
    email: {
      type: Schema.Types.String,
      required: [true, "please provide email..."],
      unique: true,
      trim: true,
      validate: {
        validator: (email) => email_validate.validate(email),
        message: "Please provide a valid email address...",
      },
      maxlength: [100, "maximum 100 characters allowed..."],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "please provide password..."],
      minlength: [8, "minimum 8 characters required..."],
      trim: true,
      maxlength: [255, "maximum 255 characters allowed"],
      select: false
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    methods: {
        createJWT() {
            return jwt.sign({
                id: this._id,
                name: this.name,
                role: this.role,
            }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
        },
        async isPasswordValid(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
  }
);

UserSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

/**
 * @type {Model}
 */
const User = model("User", UserSchema);

export default User;
