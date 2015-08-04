'use strict';

/**
 * @ngdoc overview
 * @name hackathonApp
 * @description
 * # hackathonApp
 *
 * Main module of the application.
 */
angular
  .module('ecoLogic', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularCharts',
    'chart.js',
    'uiGmapgoogle-maps',
    'pascalprecht.translate'
  ])
  .config(["$routeProvider", "$httpProvider", "$translateProvider", function ($routeProvider, $httpProvider, $translateProvider) {
    $translateProvider.translations('en', {
      'MAIN_INFO_TITLE': 'General Info',
      'CHARTS_TITLE': 'Module Charts',
      'MODULE': 'Module',
      'HEIGHT': 'Height',
      'TEMPERATURE': 'Temperature',
      'HUMIDITY': 'Humidity',
      'WATER_LEVEL': 'Water level',
      'NUTRIENT_LEVEL': 'Nutrient level'
    });
    $translateProvider.translations('fi', {
      'MAIN_INFO_TITLE': 'Yleistiedot',
      'CHARTS_TITLE': 'Moduulikohtaiset',
      'MODULE': 'Moduuli',
      'HEIGHT': 'Korkeus',
      'TEMPERATURE': 'Lämpötila',
      'HUMIDITY': 'Kosteus',
      'WATER_LEVEL': 'Vesimäärä',
      'NUTRIENT_LEVEL': 'Ravinnemäärä'
    });   
    
    $translateProvider.preferredLanguage('en');

    $routeProvider
      .when('/', {
        templateUrl: 'views/general.html',
        controller: 'GeneralController'
      });
  }]);

'use strict';

angular.module('ecoLogic')
  .controller('GeneralController', ["$scope", "BackendService", "$http", "$filter", function ($scope, BackendService, $http, $filter) {
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

}]);

/**
 * Created by Ralii on 12.5.15.
 */
angular.module('ecoLogic')
  .service('BackendService', ["$http", function($http){

    this.getModules = function(mainid, callback){
      $http.get('https://pure-temple-2469.herokuapp.com/module/')
        .success(function(data){
          callback(data.filter(function(x){ return x.main_unit_id == mainid }));
        })
    };

    this.getLatest = function(modules, callback){
      $http.get('https://pure-temple-2469.herokuapp.com/measurement/latest/')
        .success(function(data){
          var array = [];
          for(var i = 0 ; i < data.length ; i++){
            for(var k = 0 ; k < modules.length ; k++){
              if(modules[k]._id == data[i]._id) { array.push({module : modules[k].description, data: data[i] })}
            }
          }
          callback(array);
        })
    }

  }]);
