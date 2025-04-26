const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/User', () => ({
    findById: jest.fn()
}));

describe('verifyToken Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', async () => {
        req.headers['authorization'] = null;

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token verification fails', async () => {
        req.headers['authorization'] = 'Bearer invalidToken';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('invalidToken', process.env.JWT_SECRET);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to authenticate token',
            error: 'Invalid token'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
        req.headers['authorization'] = 'Bearer validToken';
        jwt.verify.mockReturnValue({ userId: 'user123' });
        User.findById.mockResolvedValue(null); // Simulate user not found

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
        expect(User.findById).toHaveBeenCalledWith('user123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if there is an error finding the user', async () => {
        req.headers['authorization'] = 'Bearer validToken';
        jwt.verify.mockReturnValue({ userId: 'user123' });
        User.findById.mockRejectedValue(new Error('Database error')); // Simulate database error

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
        expect(User.findById).toHaveBeenCalledWith('user123');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error finding user' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if token is valid and user is found', async () => {
        req.headers['authorization'] = 'Bearer validToken';
        jwt.verify.mockReturnValue({ userId: 'user123' });
        const mockUser = {
            _id: 'user123',
            name: 'John Doe',
            role: { name: 'user' }
        };
        User.findById.mockResolvedValue(mockUser);

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
        expect(User.findById).toHaveBeenCalledWith('user123');
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });
});