const defaultRouter = require('express').Router();
const defaultController = require('../controllers/defaultController');


defaultRouter.post('/pridatRecenzi', (req, res) => {
	let data = req.body;
	console.log(data);
	defaultController.pridatRecenzi(data);
	res.json({"sent": true});
});

defaultRouter.post('/dostatRecenze', (req, res) => {
	let data = req.body;
	console.log(data);
	let sortedAgeRanges = defaultController.dostatRecenze(data.id);
	
	const totalVideno = sortedAgeRanges.reduce((sum, item) => sum + item.videno, 0);
	const averageVideno = totalVideno / sortedAgeRanges.length;
	
	res.json({"sortedAgeRanges": sortedAgeRanges, "averageVideno": averageVideno});
});

defaultRouter.get('/', (req, res) => {
    res.render("index.ejs");
});

defaultRouter.get('*', (req, res) => res.send('EREOR 404!!'));

module.exports = defaultRouter;