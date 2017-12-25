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
  // key (20) = YYYYMMDD (8) + lotNo (12)
  "referenceId": [],
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
	// key (24) = pig.butcheryInfo.butcheryYmd (8) + pig.traceNo (12) + pig.pigNo (4)
  "traceNo": null,
	"pigNo": null,
	"birthYmd": null,
	"lsTypeCd": null,
	"lsTypeNm": null,
	"sexCd": null,
	"sexNm": null,
    
	"farmInfo": farmInfo,
	"butcheryInfo": butcheryInfo,

  "processed": false,
	"processInfo": []
}

pigParts = {
	frozenType: ['냉장', '냉동'],
  parts: ['삼겹살', '대박삼겹살', '목심', '미박목심', '앞다리', '미박앞다리', '뒷다리', '미박뒷다리', '갈비', '등갈비',
	  '등심', '미박등심', '안심', '사태', '미박사태', '갈매기살', '항정살', '등심덧살', '잡육', '퉁삼겹', '뒷다리3mm',
		'뒷자리s', '제비추리', '사태훈제', '목심(주)', '항미전지', '미박갈비', '삼겹미추리', '삼겹연골', '뼈삼겹살',
		'0mm뒷다리', '등심삼겹살', '미박삼겹살(A)', '미박삼겹살(B)'
	]
}

var schemas = {
  "pig": pig,
	"processInfo": processInfo,
	"pigParts": pigParts
}


module.exports = schemas;