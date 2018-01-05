var farmInfo = {
	"farmNo": null,
	"farmNm": null,
	"farmAddr": null,
	"farmerNm": null,
	"regType": null,
	"regYmd": null
}

class FarmInfo {
	constructor() {
	  this.farmNo =  null;
	  this.farmNm = null;
	  this.farmAddr = null;
	  this.farmerNm = null;
	  this.regType = null;
	  this.regYmd = null;
	}
}

var butcheryInfo = {
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
	//"processPlaceNm": null,
}

class ButcheryInfo {
	constructor() {
	  this.butcheryPlaceAddr = null;
	  this.butcheryPlaceNm = null;
	  this.butcheryYmd = null;
	  this.firstGradeNm = null;
	  this.gradeNm = null;
	  this.inspectPassYn = null;
	  this.inspectMethod = null;
	  this.butcheryShape = null;
	  this.butcheryWeight = null;
	  this.backFatThickness = null;
	  //"abattCode": null,
	  //"processPlaceNm": null,
	}
}

var processInfo = {
  // key (23) = YYYYMMDD (8) + lotNo (12) + seresNo(3)
	"type": "processInfo",
  "previousKeyHistory": [],
  "nextKey": null,
  //"trackHistory": null,
  "corpNo": null,
  "nextCorpNo": null,
  "lotNo": null,
  "processPlaceNm": null,
  "processPlaceAddr": null,
  "processYmd": null,
  "processWeight": 0,
  "processPart": null,
  "purchasingCost": 0,
  "sellingPrice": 0,
  "cost": 0,
  "marginRate": 0.0
}

class ProcessInfo {
  constructor(idIn) {
		if (!idIn) {
		  //console.log('No id was entered');
		  throw "No id was entered";
	  } else if (idIn.length != 26) {
			throw "ID is incorrect (Wrong lenght of ID). It must be 23 long"
		}
		// key (26) = YYYYMMDD (8) + lotNo (15) + seresNo(3)
    this._id = idIn;
    this.type =  "processInfo";
    this.previousKeyHistory = [];
    this.nextKey = null;
    //"trackHistory": null,
    this.corpNo = null;
    this.nextCorpNo = null;
    this.lotNo = null;
    this.processPlaceNm = null;
    this.processPlaceAddr = null;
    this.processYmd = null;
    this.processWeight = 0;
    this.processPart = null;
    this.purchasingCost = 0;
    this.sellingPrice = 0;
    this.cost = [0];
    this.marginRate = 0.0;
	}

  /*
	setLotNo(lotNoIn) {
			this.lotNo = lotNoIn;
  }
	*/
}

class Corp {
	constructor() {
	  this.name = null;
		this.corpNo = null;
		this.ownerName = null;
		this.corpPhone = null;
		this.corpMobile = null;
		this.address = null;
		this.category = null;
		this.bussness = null;
		this.fax = null;
		this.email = null;
	}
}

class Animal {

}

class Pig {
	constructor(idIn) {
	// key (24) = pig.butcheryInfo.butcheryYmd (8) + pig.traceNo (12) + pig.pigNo (4)
	//console.log(idIn);
	  if (!idIn) {
		  //console.log('No id was entered');
		  throw "No id was entered";
	  } else if (idIn.length != 24) {
			throw "ID is incorrect (Wrong lenght of ID). It must be 24 long"
		}

	  this._id = idIn;
	  this.type = "pig";
    this.traceNo = null;
	  this.pigNo = null;
	  this.birthYmd = null;
	  this.lsTypeCd = null;
	  this.lsTypeNm = null;
	  this.sexCd = null;
	  this.sexNm = null;
    
	  this.farmInfo = new FarmInfo;
	  this.butcheryInfo = new ButcheryInfo,

    this.processed = 0;
	  this.processInfo = [];

	  this.processHistory = [];
	}

}

var processType = {
	frozenType: ['냉장', '냉동'],
  parts: ['삼겹살', '대박삼겹살', '목심', '미박목심', '앞다리', '미박앞다리', '뒷다리', '미박뒷다리', '갈비', '등갈비',
	  '등심', '미박등심', '안심', '사태', '미박사태', '갈매기살', '항정살', '등심덧살', '잡육', '퉁삼겹', '뒷다리3mm',
		'뒷자리s', '제비추리', '사태훈제', '목심(주)', '항미전지', '미박갈비', '삼겹미추리', '삼겹연골', '뼈삼겹살',
		'0mm뒷다리', '등심삼겹살', '미박삼겹살(A)', '미박삼겹살(B)'
	]
}

var pigLotNo = {
	//key = 'L1'(2) + today(6) + corpNo(4) + '000'(3)
	"type": "pigLotNo",
	"lotNoYmd": null,
	"referenceKey": [],
	"traceNoArr": [],
	"labels": [],
}

class PigLotNo {
	constructor(idIn) {
		if (!idIn) {
		  //console.log('No id was entered');
		  throw "No id was entered";
	  } else if (idIn.length != 15) {
			throw "ID is incorrect (Wrong lenght of ID). It must be 15 long"
		}
		this._id = idIn;
		this.type = "pigLotNo";
		this.pigLotNoYmd = null;
		this.referenceKey = [];
		this.traceNoArr = [];
		this.labels = []
	}
}

var trackHistory = {
	"start": null,
	"end": null
}

var schemas = {
  //"pig": pig,
	"processInfo": processInfo,
	"processType": processType,
	"pigLotNo": pigLotNo,
  "trackHistory": trackHistory,
	"Pig": Pig,
	"ProcessInfo": ProcessInfo,
	"PigLotNo": PigLotNo
}

module.exports = schemas;