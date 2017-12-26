// SPDX-License-Identifier: Apache-2.0
'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

  $("#success_holder").hide();
  $("#success_register").hide();
  $("#success_update_butchery").hide();
  $("#success_update_process").hide();
  $("#error_holder").hide();
  $("#error_query").hide();

  // Create angular function for traceability system
  $scope.queryAllUnprocessedPigs = function() {

    appFactory.queryAllUnprocessedPigs(function(data) {
      console.log('queryAllUnprocessedPigs')
      //var array = [];
      //for (var i = 0; i < data.length; i++){
        //parseInt(data[i].Key);
        //data[i].Record.Key = parseInt(data[i].Key);
      //  data[i].Record.Key = data[i].Key;
      //  array.push(JSON.parse(data[i]));
      //}
      //console.log(data);
      //console.log(data[0].value.pigNo);
      $scope.unprocessedPigs = data;
    });
  }

    $scope.queryCattle = function(){

        var id = $scope.trace_id;

        appFactory.queryCattle(id, function(data){
            $scope.query_cattle = data;

            if ($scope.query_cattle == "Could not locate cattle"){
                $("#error_query").show();
            } else{
                $("#error_query").hide();
            }

            //var array = [];
            //for (var i=0; i < data.package_info.length; i++){
            //    array.push(data.package_info[i].Record);                
            //}
            //array.sort(function(a, b) {
            //    return parseFloat(a.Key) - parseFloat(b.Key);
            //}
            //$scope.all_package_info = array;
            $scope.all_process_info = data.processInfo; 
        });
    }
});

// Angular Factory
app.factory('appFactory', function($http){
    
  var factory = {};

  // For traceability system
  factory.queryAllUnprocessedPigs = function(callback) {
    $http.get('/get_all_unprocessed_pigs/').success(function(output){
      callback(output)
    });
  }

    factory.queryCattle = function(id, callback){
        $http.get('/get_cattle/'+id).success(function(output){
            callback(output)
        });
    }

    factory.registerCattle = function(data, callback){
        var cattle = data.traceId + "-" + data.birthYmd + "-" + data.lsTypeNm + "-" + data.sexNm + "-" +
            data.farmerNm + "-" + data.regType + "-" + data.regYmd + "-" + data.farmAddr;

        $http.get('/register_cattle/'+cattle).success(function(output){
            callback(output)
        });
    }

    factory.updateButcheryInfo = function(data, callback){

        var butchery_info = data.traceId + "-" + data.butcheryPlaceNm + "-" + data.butcheryYmd + "-" +
            data.inspectPassYn + "-" + data.butcheryWeight + "-" + data.gradeNm + "-" + data.processPlaceNm;

        $http.get('/update_butchery_info/'+butchery_info).success(function(output){
            callback(output)
        });
    }

    factory.updateProcessInfo = function(data, callback){

        var process_info = data.traceId + "-" + data.processPlaceNm + "-" + data.processPlaceAddr + "-" +
            data.processPart + "-" + data.processWeight + "-" + data.processYmd;

        $http.get('/update_process_info/'+process_info).success(function(output){
            callback(output)
        });
    }
    return factory;
});