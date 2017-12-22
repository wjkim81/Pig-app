var farmInfo = {
	  "farmNo": null,
	  "farmNm": null,
	  "farmAddr": null,
	  "farmerNm": null,
	  "regType": null,
	  "regYmd": null

}
butcheryInfo = {
	  "butcheryPlaceAddr": null,
	  "butcheryPlaceNm": null,
	  "butcheryYmd": null,
		"firstGradeNm": null,
	  "gradeNm": null,
	  "inspectPassYn": null,
		"inspectMethod": null,
		"butcheryShape": null,
	  "butcheryWeight": null,
		"backFatThickness": null,
	  "abattCode": null,
	  "processPlaceNm": null,
}
processInfo = {
    "key": null,
    "referenceId": null,
    "childId": null,
    "trackHistory": null,
    "corpNo": null,
    "lotNo": null,
    "processPlaceNm": null,
    "processPlaceAddr": null,
    "processYmd": null,
    "processWeight": null,
    "processPart": null,
    "purchasingCost": null,
    "sellingPrice": null,
    "cost": null,
    "marginRate": null
}

pig = {
    "traceNo": null,
	  "pigNo": null,
	  "birthYmd": null,
	  "lsTypeCd": null,
	  "lsTypeNm": null,
		"sexCd": null,
	  "sexNm": null,
    
	  "farmInfo": farmInfo,
	  "butcheryInfo": butcheryInfo,

	  "processInfo": null
}

var schemas = {
  "pig": pig,
	"processInfo": processInfo
}


module.exports = schemas;