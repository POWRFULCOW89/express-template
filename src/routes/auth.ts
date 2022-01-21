import { Request } from 'express'
import jwt from 'express-jwt'

const secret = process.env.SECRET

const getTokenFromHeader = (req: Request) => {
    const { headers: { authorization } } = req
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1]
    }
    return null;
}

export default {
    required: jwt({
        secret: secret,
        algorithms: ['HS256'],
        userProperty: 'user',
        credentialsRequired: true,
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret: secret,
        algorithms: ['HS256'],
        userProperty: 'user',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    }),
}
