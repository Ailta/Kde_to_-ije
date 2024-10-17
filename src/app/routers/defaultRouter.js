const defaultRouter = require('express').Router();
const path = require('path');


defaultRouter.get('/', (req, res) => {
    res.render("index.ejs");
});


defaultRouter.get('*', (req, res) => res.send('EREOR 404!!'));

module.exports = defaultRouter;