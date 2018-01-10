// SPDX-License-Identifier: Apache-2.0
'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory) {

  $("#successDownload").hide();
  $("#successCreateLotNo").hide();
  $("#errorLotNoDate").hide();
  $("#sucessCreateNewProcess").hide();
  $("#errorProcessDate").hide();
  $("#successUpdateProcess").hide();
  $("#errorSummaryInfo").hide();

  $scope.downloadButechryInfoFromEkape = function() {
    var issueYmd = $scope.issuedYmd;

    appFactory.downloadButechryInfoFromEkape(issueYmd, function(data) {
      
      $scope.numButcheryInfo = data;

      if ($scope.numButcheryInfo != "error") {
        $("#successDownload").show();
      } else {
        $("#successDownload").hide();
      }
    });
  }


  // Create angular function for traceability system
  $scope.queryPigsWithDate = function() {

    var queryDate = $scope.queryButcheryYmdIn;

    appFactory.queryPigsWithDate(queryDate, function(data) {
      //console.log('queryPigsWithDate')
      //console.log(data);
      $scope.pigsInfo = data;
    });
  }

  $scope.createLotNo = function() {
    var traceNos = $scope.traceNosIn;
    traceNos = traceNos.replace(/\s+/g, '');
    traceNos = traceNos.replace(/,/g,'-');
    //console.log(traceNos);

    appFactory.createLotNo(traceNos, function(data){
      $scope.newLotNo = data;

      if ($scope.newLotNo != "error") {
        $("#successCreateLotNo").show();
      } else {
        $("#successCreateLotNo").hide();
      }
    });
  }

  $scope.queryLotNoWithDate = function() {
    var lotNoDateIn = $scope.lotNoDateIn;
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
  
  $scope.queryProcessInfoWithDate = function() {
    var processDate = $scope.processDateIn;

    appFactory.queryProcessInfo(processDate, function(data) {
      $scope.allProcessInfo = data;
      console.log(data);
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
    var dateRangeIn = $scope.summaryStartDateIn + '-' + $scope.summaryEndDateIn;

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

  return factory;
});
