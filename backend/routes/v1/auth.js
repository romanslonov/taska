const authController = require('../../controllers/auth');

module.exports = (app) => {
  app.post('/auth/login', authController.login);
  app.post('/auth/register', authController.register);
  app.get('/auth/validate', authController.validate);
  app.post('/auth/confirmation', authController.confirmation);
  app.put('/auth/confirmation', authController.resend);
};
