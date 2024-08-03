import jwt from 'jsonwebtoken';

// eslint-disable-next-line consistent-return
const authM = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { USER_JWT_SECRET } = process.env;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, USER_JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authM;
