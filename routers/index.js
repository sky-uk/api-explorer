if(process.env.NODE_ENV === 'production') {
  module.exports = require('./RouterConfig.prod')
}else{
  module.exports = require('./RouterConfig.dev')
}

