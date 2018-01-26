/**
 * app.js defines modules of angular.js
 * 
 */

// SPDX-License-Identifier: Apache-2.0
'use strict';

var convertDateToYYYYMMDD = function(date) {
  var todayYYYY = date.getFullYear();
  var todayMM = (date.getMonth() + 1).toString();
  var todayMM = todayMM.padStart(2, '0');
  var todayDD = date.getDate().toString();
  var todayDD = todayDD.padStart(2, '0');
  var today = todayYYYY + todayMM + todayDD;
  
  return today;
}

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory) {

  $("#successDownload").hide();
  $("#errorPigDate").hide();
  $("#successCreateLotNo").hide();
  $("#errorLotNoDate").hide();
  $("#sucessCreateNewProcess").hide();
  $("#errorProcessDate").hide();
  $("#successCreateBox").hide();
  $("#errorBoxDate").hide();
  $("#successUpdateProcess").hide();
  $("#errorSummaryInfo").hide();

  //var today = new Date();
  //$scope.issueYmd = today.getFullYear() + '/' + today.getMonth() + 1 + '/' + today.getDay();
  //console.log($scope.issueYmd);

  $scope.downloadButechryInfoFromEkape = function() {
    if (!$scope.issueYmd) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }

    var issueYmd = convertDateToYYYYMMDD($scope.issueYmd);
    //console.log(issueYmd);

    $("#successDownload").hide();

    appFactory.downloadButechryInfoFromEkape(issueYmd, function(data) {

      //console.log('test')
      $scope.numButcheryInfo = data;

      if ($scope.numButcheryInfo != "error") {
        $("#successDownload").show();
      } else {
        $scope.numButcheryInfo = 'error';
        $("#successDownload").show();
      }
    });
  }

  $scope.getSummaryPigsByDate = function() {

    appFactory.getSummaryPigsByDate(function(data) {
      //console.log(data);
      $scope.pigsByDate = data;
    });
  }

  // Create angular function for traceability system
  $scope.queryPigsWithDate = function() {

    if (!$scope.queryButcheryYmdIn) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }

    var queryDate = convertDateToYYYYMMDD($scope.queryButcheryYmdIn);

    //console.log(issueYmd);
    appFactory.queryPigsWithDate(queryDate, function(data) {
      //console.log('queryPigsWithDate')
      //console.log(data);
      $scope.pigsInfo = data;
    });
  }

  $scope.createLotNo = function() {
    
    if (!$scope.traceNosIn) {
      alert('값을 제대로 입력해 주시기 바랍니다.')
      return;
    }

    var traceNos = $scope.traceNosIn;
    traceNos = traceNos.replace(/\s+/g, '');

    var check= traceNos.split(',');

    if (check.length > 20) {
      alert('최대 20개까지 넣을 수 있습니다')
      return;
    }

    for (var i = 0; i < check.length; i++) {
      if (check[i].length != 17) {
        alert('이력번호(12자리)-도체번호(4자리) 입력 값이 제대로 되지 않았습니다')
        return;
      }
    }

    $("#successCreateLotNo").hide();
    
    traceNos = traceNos.replace(/,/g,'_');
    console.log(traceNos);


    appFactory.createLotNo(traceNos, function(data){
      
      if (data.error) {
        $scope.newLotNo = data.error;
        $("#successCreateLotNo").show();
      } else {
        $scope.newLotNo = data.newLotNo;
         $("#successCreateLotNo").show();
      }
      /*
      if ($scope.newLotNo != "error") {
        $("#successCreateLotNo").show();
      } else {
        $("#successCreateLotNo").hide();
      }
      */
    });
  }

  $scope.queryLotNoWithDate = function() {

    if (!$scope.lotNoDateIn) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }
    var lotNoDateIn = convertDateToYYYYMMDD($scope.lotNoDateIn);
    //console.log(lotNoDate);
    
    appFactory.queryLotNoWithDate(lotNoDateIn, function(data) {
      //console.log(data);
      $scope.allLotNos = data;
      if ($scope.allLotNos == "error" || $scope.allLotNos.length == 0) {
        $("#errorDate").show();
      } else {
        $("#errorDate").hide();
      }
    });
  }

  $scope.createNewProcess = function() {

    if (!$scope.lotNoIn || !$scope.lotNoIn.length !== 16) {
      alert('묶음번호를 제대로 입력해 주시기 바랍니다.')
      return;
    }

    var lotNo = $scope.lotNoIn;
    //console.log(lotNo);

    appFactory.createNewProcess(lotNo, function(data) {
      $scope.newProcessNo = data;
      if ($scope.newProcessNo != "error") {
        $("#sucessCreateNewProcess").show();
      } else {
        $("#sucessCreateNewProcess").hide();
      }
    });
  }

  $scope.createBox = function() {
    if (!$scope.lotNoBoxIn) {
      alert('묶음번호를 입력해 주시기 바랍니다.')
      return;
    }

    var lotNoBox = $scope.lotNoBoxIn;
    lotNoBox = lotNoBox.replace(/\s+/g, '');
    var lotNos = lotNoBox.replace(/,/g,'-');

    var nextCorp = $scope.nextCorpIn;

    var input = lotNos + '-' + nextCorp;

    //console.log(input);
    
    appFactory.createBox(input, function(data) {
      $scope.createBox = data.id;

      if ($scope.createBox != "error") {
        $("#successCreateBox").show();
      } else {
        $("#successCreateBox").hide();
      }
    });
  }

  $scope.queryBoxwithDate = function() {
    if (!$scope.boxDateIn) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }
    var boxDate = convertDateToYYYYMMDD($scope.boxDateIn);

    //console.log(boxDate);
    appFactory.queryBoxwithDate(boxDate, function(data) {
      //console.log(data);
      $scope.allBox = data;
    });
  }
  
  $scope.queryProcessInfoWithDate = function() {

    if (!$scope.processDateIn) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }
    var processDate = convertDateToYYYYMMDD($scope.processDateIn);
    console.log(processDate);

    appFactory.queryProcessInfo(processDate, function(data) {
      $scope.allProcessInfo = data;
      //console.log(data);
      if ($scope.allProcessInfo == "error" || $scope.allProcessInfo.length == 0) {
        $("#errorProcessDate").show();
      } else {
        $("#errorProcessDate").hide();
      }
    });
  }

  $scope.updateProcessInfo = function() {
    var processInfoIn = $scope.processInfoIn.key + '-' + 
                        $scope.processInfoIn.lotNo + '-' + 
                        $scope.processInfoIn.processPlaceNm + '-' + 
                        $scope.processInfoIn.processPlaceAddr + '-' +
                        $scope.processInfoIn.processPart + '-' + 
                        $scope.processInfoIn.processWeight + '-' + 
                        $scope.processInfoIn.processYmd + '-' + 
                        $scope.processInfoIn.purchasingCost + '-' + 
                        $scope.processInfoIn.sellingPrice;

    //console.log(processInfoIn);
    appFactory.updateProcessInfo(processInfoIn, function(data) {
      $scope.updateProcess = data.id;
      //console.log(data);
      if ($scope.updateProcess != "error") {
        $("#successUpdateProcess").show();
      } else {
        $("#successUpdateProcess").hide();
      }
    });
  }

  $scope.queryProcessSummary = function() {
    if (!$scope.summaryStartDateIn || !$scope.summaryEndDateIn) {
      alert('날짜 값을 제대로 입력해 주시기 바랍니다.')
      return;
    }
    var dateRangeIn = convertDateToYYYYMMDD($scope.summaryStartDateIn) + '-' + convertDateToYYYYMMDD($scope.summaryEndDateIn);

    console.log(dateRangeIn);
    appFactory.queryProcessSummary(dateRangeIn, function(data) {
      $scope.allProcessSummary = data;
      //console.log(data);

      if ($scope.allProcessSummary == "error") {
        $("#errorSummaryInfo").show();
      } else {
        $("#errorSummaryInfo").hide();
      }
    });
  }







  $scope.loadProducts = function() {
    appFactory.loadProducts(function(data) {
      //console.log(data);
      $scope.allProducts = data.productCode;
      //console.log($scope.allProducts[0]);
    });
  }

  $scope.loadCustomers = function() {
    appFactory.loadCustomers(function(data) {
      //console.log(data);
      $scope.allCustomers = data.customers;
      //console.log($scope.allCustomers[0]);
    })
  }
});

// Angular Factory
app.factory('appFactory', function($http) {
  var factory = {};

  // For traceability system
  factory.downloadButechryInfoFromEkape = function(issueYmd, callback) {

    $http.get('/download_butcheryinfo_from_ekape/'+issueYmd).success(function(output) {
      callback(output);
    });
  }

  factory.getSummaryPigsByDate = function(callback) {

    $http.get('/get_summary_pigs_by_date/').success(function(output) {
      callback(output);
    });
  }

  factory.queryPigsWithDate = function(queryYmd, callback) {
    
    $http.get('/query_pigs_with_date/'+queryYmd).success(function(output) {
      callback(output)
    });
  }

  factory.createLotNo = function(traceNos, callback) {

    $http.get('/create_lot_no/'+traceNos).success(function(output) {
      callback(output)
    });
  }

  factory.queryLotNoWithDate = function(createdDate, callback) {

    $http.get('/query_lot_no_with_date/'+createdDate).success(function(output) {
      callback(output)
    });
  }

  factory.createNewProcess = function(lotNo, callback) {

    $http.get('/create_new_process/'+lotNo).success(function(output) {
      callback(output)
    });
  }

  factory.queryProcessInfo = function(processDate, callback) {

    $http.get('/query_process_info_with_date/'+processDate).success(function(output) {
      callback(output);
    });
  }

  factory.createBox = function(input, callback) {

    $http.get('/create_box/'+input).success(function(output) {
      callback(output);
    });
  }

  factory.queryBoxwithDate = function(boxDate, callback) {
    $http.get('/query_box_with_date/'+boxDate).success(function(output) {
      callback(output);
    })
  }

  factory.updateProcessInfo = function(processInfoIn, callback) {
    $http.get('/update_process_info/'+processInfoIn).success(function(output) {
      callback(output);
    });
  }

  factory.queryProcessSummary = function(dateRange, callback) {
    $http.get('/query_process_summary/'+dateRange).success(function(output) {
      callback(output);
    })
  }








  factory.loadProducts = function(callback) {
    $http.get('/load_product_code/').success(function(output) {
      callback(output);
    });
  }

  factory.loadCustomers = function(callback) {
    $http.get('/load_customers/').success(function(output) {
      callback(output);
    });
  }

  return factory;
});
