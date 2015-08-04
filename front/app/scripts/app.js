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
  .config(function ($routeProvider, $httpProvider, $translateProvider) {
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
    
    $translateProvider.preferredLanguage('fi');

    $routeProvider
      .when('/', {
        templateUrl: 'views/general.html',
        controller: 'GeneralController'
      });
  });
