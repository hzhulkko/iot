/**
 * Created by Ralii on 12.5.15.
 */
angular.module('ecoLogic')
  .service('BackendService', function($http){

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

  });
