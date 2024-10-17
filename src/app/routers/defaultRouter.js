const defaultRouter = require('express').Router();
const defaultController = require('../controllers/defaultController');


defaultRouter.post('/pridatRecenzi', (req, res) => {
	let data = req.body;
	console.log(data);
	res.json({"sent": true});
});

defaultRouter.get('/', (req, res) => {
    res.render("index.ejs");
});

defaultRouter.get('*', (req, res) => res.send('EREOR 404!!'));

module.exports = defaultRouter;