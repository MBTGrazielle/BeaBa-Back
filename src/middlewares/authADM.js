const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRETADM;

const checkAuth = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).json({
      mensagem: 'Você não está autorizado!',
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({
      mensagem: 'Erro no token',
      status: 400,
    });
  }

  try {
    jwt.verify(token, SECRET, err => {
      if (err) {
        return res.status(401).json({
          mensagem: 'Você não está autorizado!',
          status: 401,
        });
      }
      next();
    });
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
      status: 500,
    });
  }
};

module.exports = {
  checkAuth,
};
