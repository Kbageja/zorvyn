import jwt from 'jsonwebtoken';
const { verify } = jwt;

export function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userStatus = decoded.status;
    
    if (req.userStatus === 'INACTIVE') {
      return res.status(403).json({ error: 'Account is inactive' });
    }
    next();
  });
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Requires privileged role' });
    }
    next();
  };
}
