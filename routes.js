const authRoutes = require('./routes/authentication');

async function setRoutes(app) {  
  app.use('/api/auth/', authRoutes);
};

module.exports = {setRoutes};