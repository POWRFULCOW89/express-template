import passport from 'passport';
import { Request, Response } from 'express';
import User from '../models/User'; // Allows use of instance methods

const createUser = async (req: Request, res: Response) => {
    const { body } = req;
    const { password } = body;

    delete body.password;

    try {
        const user = new User(body);
        user.createPassword(`${password}`);
        let newUser = await user.save()
        res.send(newUser.toAuthJSON());
    } catch (error) {
        res.status(400).send("User already exists");
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    let limit = isNaN(parseInt(`${req.query.limit}`)) ? null : parseInt(`${req.query.limit}`);

    try {
        let users;

        if (limit) users = await User.find().limit(limit);
        else users = await User.find();

        res.send(users.map(user => user.publicData()));
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        let user = await User.findById(req.params.id);
        res.send(user.publicData());
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {

        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        if (req.body.password) user.createPassword(`${req.body.password}`);

        user.set(req.body);

        let finalUser = await user.save();
        return res.send(finalUser.publicData());

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        res.send(user.publicData());
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const loginUser = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        res.status(422).send("Missing email or password");
        return;
    }

    passport.authenticate('local', { session: false }, function (error, user, info) {
        if (error) {
            res.status(500).send(error.message);
            return;
        }

        if (user) {
            user.token = user.generateJWT();
            res.send({ user: user.toAuthJSON() });
            return;
        } else {
            res.status(422).send(info);
            return;
        }
    })(req, res);
}

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser };