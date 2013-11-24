var routes = require('routes');
var router = new routes.Router();

router.addRoute('/', require('./routes/index'));
router.addRoute('/static/*?', require('./routes/static'));

module.exports = router;
