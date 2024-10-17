const express = require('express');
const app = express();

app.use(express.static('./www'));
app.use(express.json());

// ejs init
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));

// app.use, NIKOLI app.get!
app.use('/', require("./routers/defaultRouter.js"));

app.listen(8000, () => console.log(`App listening on port 8000!`));
