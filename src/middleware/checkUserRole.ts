export default (allowedRoles: string[]) => (req: any, res: any, next: any) => {
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Insufficient role access.' });
  }
};