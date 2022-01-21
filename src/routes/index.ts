import { Router } from 'express';
import productsRouter from './products';
import usersRouter from './users';

const router = Router();

router.use(function (err: Error, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).send('Invalid token provided.');
    }
});

router.get('/', (req, res) => {
    res.send('Welcome to our API');
})

router.use('/products', productsRouter);
router.use('/users', usersRouter);

export default router;