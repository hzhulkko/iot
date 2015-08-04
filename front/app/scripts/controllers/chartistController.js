/**
 * Created by Ralii on 16.5.15.
 */
angular.module('ecoLogic')
  .controller('ChartistController', function($scope, BackendService){
    var hum = [];
    var temp = [];
    var height = [];
    BackendService.getData()
      .success(function(data){
        for(var i = 0 ; i < data.length ; i++){
          $scope.otsikko.push(data[i].module_id);
          hum.push(data[i].humidity);
          temp.push(data[i].temperature);
          height.push(data[i].height);
        }
      });

    $scope.otsikko = ["1", "2", "3", "4", "5"];
    $scope.sarja = ['Korkeus', "Kosteus", "Lämpötila"];
    $scope.tieto = [
      [15,50,70,40,50], [85,90,92,95,40] , [25,24,22,25,26]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    $scope.janna = [
      {"nimi": "1", "height": 15, "alue": "Suomi", "kosteus":85 , "lampotila": 25},
      {"nimi": "2", "height": 50, "alue": "Suomi", "kosteus":90 , "lampotila": 24},
      {"nimi": "3", "height": 70, "alue": "Suomi", "kosteus":92 , "lampotila": 22},
      {"nimi": "4", "height": 40, "alue": "Suomi", "kosteus":95 , "lampotila": 25},
      {"nimi": "5", "height": 50, "alue": "Suomi", "kosteus":40 , "lampotila": 26}
    ];

    new Chartist.Bar('.ct-chart', {
      labels: $scope.sarja,
      series: $scope.tieto

    }, {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: false,
      axisY: {
        offset: 70
      }
    });



  });
