const databaze = require("../models/hodnoceniModel");

exports.pridatRecenzi = (data) => {
	databaze.pridat("kino", data.id, {"vek_range": data.vek_range, "common_range": data.common_range, "rating": data.rating});
	return;
}