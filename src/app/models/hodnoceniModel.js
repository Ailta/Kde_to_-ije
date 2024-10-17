const jsondb = require("simple-json-db");
const db = new jsondb("hodnoceni.json");

if (!db.has("nextID")){
    db.set("nextID", 1);
}

exports.pridat = (typ, id, hodnoceni) => {
	let mista_typu = db.get(typ);
	let nextID = mista_typu[id][hodnoceni["vek_range"]]["nextID"];
	mista_typu[id][hodnoceni["vek_range"]][nextID] = hodnoceni["hodnoceni"];
	if (hodnoceni["common_range"]) {
		mista_typu[id][hodnoceni["common_range"]]["videno"] -= -1;
	}
	db.set(typ, mista_typu);
}

exports.ziskatDleID = (typ, id) => {
	let mista_typu = bd.get(typ);
	return mista_typu["id"];
}