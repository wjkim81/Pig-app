class FarmInfo {
	constructor() {
	  this.farmNo =  null;
	  this.farmNm = null;
	  this.farmAddr = null;
		this.farmerNo = null;
	  this.farmerNm = null;
	  this.regType = null;
	  this.regYmd = null;
	}
}

class ButcheryInfo {
	constructor() {
		// Check how to handl these two corp variable
		this.corpNo = null;
		this.corpNm = null;
		this.nextKey = null;



		this.butcheryCode = null;
	  this.butcheryPlaceAddr = null;
	  this.butcheryPlaceNm = null;
	  this.butcheryYmd = null;
		this.issueYmd = null;
		this.issueNo = null;
		this.butcheryUseCd = null;
		this.butcheryUseNm = null;
	  this.firstGradeNm = null;
	  this.gradeNm = null;
		this.judgeYmd = null;
	  this.inspectPassYn = null;
		this.inspectCode = null;
	  this.inspectMethod = null;
		this.skinYn = null;
	  this.butcheryShape = null;
	  this.butcheryWeight = null;
	  this.backFatThickness = null;
    this.fatup = null;
	  //"processPlaceNm": null,


		this.judgeBreedCd = null;
		this.judgeBreedNm = null;

		this.auctYmd = null;
		this.costAmt = null;

		this.belly = null;
		this.fatstick = null;
		this.insfat = null;
		this.yuksak = null;
		this.tissue = null;
		this.fatsak = null;
		this.fatqual = null;
		this.defectCode = null;
		this.defect = null;
		this.offgradeNo = null;





	}
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
    this.processWeight = 0.0;
    this.processPart = null;
    this.purchasingCost = 0;
    this.sellingPrice = 0;
    this.cost = [0];
    this.marginRate = 0.0;
		this.boxReference = null;
		this.lotNoTotalWeight = 0.0;
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
    
	  this.farmInfo = new FarmInfo();
	  this.butcheryInfo = new ButcheryInfo();

    this.processed = false;
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
		this.realKey = null;
		this.pigLotNoYmd = null;
		this.referenceKeys = [];
		this.traceNoPigNoArr = [];
		this.labels = []
		this.boxReference = null;
		this.lotNoTotalWeight = 0.0;
	}
}

class PigBox {
	constructor() {
    this.type = "pigBox";
		this.boxYmd = null;
		this.nextCorpNm = null;
		this.inBox = [];
	}
}

var trackHistory = {
	"start": null,
	"end": null
}

var schemas = {
  //"pig": pig,
	//"processInfo": processInfo,
	//"processType": processType,
	//"pigLotNo": pigLotNo,
  //"trackHistory": trackHistory,
	"Pig": Pig,
	"ProcessInfo": ProcessInfo,
	"PigLotNo": PigLotNo,
	"PigBox": PigBox
}

module.exports = schemas;