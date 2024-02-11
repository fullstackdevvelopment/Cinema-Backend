export const ALLOW_ORIGINS = [
  'http://localhost:3000',
];

export default function cors(req, res, next) {
  try {
    const { origin } = req.headers;
    if (ALLOW_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  } catch (e) {
    next(e);
  }
}
