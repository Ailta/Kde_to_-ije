const jsondb = require("simple-json-db");
const db = new jsondb("hodnoceni.json");

if (!db.has("ageRange")){
    db.set("ageRange", ["15-17", "18-21", "22-27", "28-35", "36-42", "43-48"]);
}

exports.pridat = (typ, id, hodnoceni) => {
	let mista_typu = db.get(typ);
	
	if (mista_typu == undefined){
		mista_typu = {};
	}
	
	if (mista_typu[id] == undefined){
		mista_typu[id] = {"15-17": {"nextID": 1, "videno": 0}, "18-21": {"nextID": 1, "videno": 0}, "22-27": {"nextID": 1, "videno": 0}, "28-35": {"nextID": 1, "videno": 0},  "36-42": {"nextID": 1, "videno": 0}, "43-48": {"nextID": 1, "videno": 0}};
	}
	
	console.log(hodnoceni);
	
	const vekRange = hodnoceni["vek_range"];
	
	let nextID = mista_typu[id][vekRange]["nextID"];
	console.log(nextID);
	console.log(mista_typu[id][vekRange]);
	mista_typu[id][vekRange][nextID] = hodnoceni["rating"];
	//if (hodnoceni["common_range"]) {
	mista_typu[id][hodnoceni["common_range"]]["videno"] += 1;
	mista_typu[id][vekRange]["nextID"] += 1;
	
	//}
	
	db.set(typ, mista_typu);
}

exports.ziskatDleID = (typ, id) => {
	let mista_typu = db.get(typ);
	return mista_typu[id];
}

exports.getAgeRanges = () => {
	return db.get("ageRange");
}