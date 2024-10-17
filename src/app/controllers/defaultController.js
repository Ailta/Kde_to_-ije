const databaze = require("../models/hodnoceniModel");

exports.pridatRecenzi = (data) => {
	databaze.pridat("kino", data.id, {"vek_range": data.vek_range, "common_range": data.common_range, "rating": data.rating});
	return;
}

exports.dostatRecenze = (id) => {
	let place = databaze.ziskatDleID("kino", id);
	const ageRange = databaze.getAgeRanges();
	
	console.log(id);
	if (place != undefined) {
		const ageRangesWithVideno = ageRange.map(age => ({
			age: age,
			videno: place[age].videno
		}));

		// Sort the array based on videno values in descending order
		const sortedByVideno = ageRangesWithVideno.sort((a, b) => b.videno - a.videno);
		
		console.log(sortedByVideno);
		return sortedByVideno;
	}
	
	return undefined;
}