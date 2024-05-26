export const ALLOW_ORIGINS = [
  'http://localhost:3000',
];

export default function corsM(req, res, next) {
  try {
    const { origin, referer } = req.headers;
    if (ALLOW_ORIGINS.includes(origin) || ALLOW_ORIGINS.includes(referer)) {
      res.setHeader('Access-Control-Allow-Origin', origin || referer);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  } catch (e) {
    next(e);
  }
}
