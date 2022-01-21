import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from '../controllers/users';
import auth from './auth';

const usersRouter = Router();

usersRouter.get('/:id', auth.required, getUserById);
usersRouter.get('/', auth.required, getAllUsers);
usersRouter.post('/', auth.optional, createUser);
usersRouter.post('/login', auth.optional, loginUser);
usersRouter.put('/:id', auth.required, updateUser);
usersRouter.delete('/:id', auth.required, deleteUser);

export default usersRouter;