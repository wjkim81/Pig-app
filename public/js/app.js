// SPDX-License-Identifier: Apache-2.0
'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory) {

  $("#successCreateLotNo").hide();
  $("#errorLotNoDate").hide();
  $("#sucessCreateNewProcess").hide();
  $("#errorProcessDate").hide();
  $("#successUpdateProcess").hide();
  $("#errorSummaryInfo").hide();

  // Create angular function for traceability system
  $scope.queryAllUnprocessedPigs = function() {
    appFactory.queryAllUnprocessedPigs(function(data) {
      //console.log('queryAllUnprocessedPigs')
      $scope.unprocessedPigs = data;
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

  $scope.queryLotNo = function() {
    var lotNoDate = $scope.lotNoDateIn;
    //console.log(lotNoDate);
    
    appFactory.queryLotNoWithDate(lotNoDate, function(data) {
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
  factory.queryAllUnprocessedPigs = function(callback) {
    $http.get('/get_all_unprocessed_pigs/').success(function(output) {
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
