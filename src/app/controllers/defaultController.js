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
		let overallAverageRating = 0;
		let count = 0;
		
		const ageRangesWithRating = ageRange.map(age => {
            const ratings = [];
            // Collect all ratings for the current age range
            for (let i = 1; i < place[age]["nextID"]; i++) {
                if (place[age][i] !== undefined) {
                    ratings.push(Number(place[age][i])); // Convert to Number
                }
            }
            const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
            const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
			
			if (averageRating != 0) {
				count -= -1;
				
				overallAverageRating -= -(averageRating);
			}

            return {
                age: age,
                videno: place[age].videno,
                averageRating: averageRating
            };
        });
		
		overallAverageRating = overallAverageRating/count;
		
		const ageRangesWithVideno = ageRange.map(age => ({
			age: age,
			videno: place[age].videno
		}));

		// Sort the array based on videno values in descending order
		const sortedByVideno = ageRangesWithVideno.sort((a, b) => b.videno - a.videno);
		
		return {"sortedByVideno": sortedByVideno, "overallAverageRating": overallAverageRating, "ageRangesWithRating": ageRangesWithRating};
	}
	
	return undefined;
}