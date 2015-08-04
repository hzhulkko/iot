'use strict';

angular.module('ecoLogic')
  .controller('GeneralController', function ($scope, BackendService, $http, $filter) {
    $scope.unit = false;

    $http.get('https://pure-temple-2469.herokuapp.com/mainunit')
      .success(function(data){ $scope.mainunit = data; console.log($scope.mainunit); });

    $scope.colorPicker = function(value) {
      return Math.round(value * 2.55);
    }

    $scope.valittu = function(id){

      for (var i = 0; i < $scope.mainunit.length; i++) {
        if ($scope.mainunit[i]._id == id) {
          $scope.waterLevel = $scope.mainunit[i].water_level;
          $scope.nutrientLevel = $scope.mainunit[i].nutrient_level;
          $scope.mainunit[i].active = 'active';
        }
        else {
          $scope.mainunit[i].active = '';
        }
      }
      console.log($scope.mainunit);

      BackendService.getModules(id, function(modules){
        BackendService.getLatest(modules, function(values){
          $scope.table = values;
          $scope.sarja = [];
          $scope.tieto = [];
          $scope.otsikko = [ $filter('translate')('HEIGHT') , $filter('translate')('HUMIDITY'), $filter('translate')('TEMPERATURE')];

          values.forEach(function(value){
            $scope.sarja.push(value.module);
            $scope.tieto.push([ value.data.temperature,value.data.humidity,value.data.height] );
          });
          $scope.unit = true;
        });
      });
    };

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

});
