const jsondb = require("simple-json-db");
const db = new jsondb("hodnoceni.json");

if (!db.has("nextID")){
    db.set("nextID", 1);
}

exports.pridat = (misto, hodnoceni) => {
    
}
