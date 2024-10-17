const app = require("./app");


app.listen(process.env.PORT, () => {
    console.log("Server jede na portu: " + String(process.env.PORT));
});
