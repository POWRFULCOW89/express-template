import { Schema, model, Document } from 'mongoose';
// import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

interface IUser extends Document {
    username: string;
    name: string;
    email: string;
    hash: string;
    salt: string;
    createPassword(password: string): void;
    toAuthJSON(): object;
    validatePassword(password: string): boolean;
    publicData(): object;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: String,
    salt: String
}, { collection: "users", timestamps: true });

// UserSchema.plugin(uniqueValidator, { message: "User already exists" });

UserSchema.methods.publicData = function () {
    return {
        _id: this._id,
        username: this.username,
        name: this.name,
        email: this.email,
    }
}

UserSchema.methods.createPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validatePassword = function (password: string) {
    const newHash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === newHash;
}

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    const maxDays = 60
    exp.setDate(today.getDate() + maxDays);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: exp.getTime() / 1000
    }, secret);
}

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    }
}

export default model<IUser>('User', UserSchema);