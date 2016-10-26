// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
	
	 .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
});

//Custom services
weatherApp.service('cityService',function(){
	this.city="New York, NY";
})

// CONTROLLERS
weatherApp.controller('homeController', ['$scope','cityService','$log','$routeParams','$location', function($scope,cityService,$log,$routeParams,$location) {
    $scope.city=cityService.city;
	
	$scope.$watch('city',function(){
		cityService.city=$scope.city;
	});
	
	$scope.submit=function(){
		$location.path("/forecast");
	}
	/*$scope.$watch('days',function(){
		$log.days=$scope.days;
	});*/
}]);

weatherApp.controller('forecastController', ['$scope','cityService','$resource','$log','$routeParams', function($scope,cityService,$resource,$log,$routeParams) {
    $scope.city=cityService.city;
	$scope.days=$routeParams.days || '2';
	//console.log("log is " +$log.days);
	$scope.weatherAPI=$resource("http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=d2dc659a5cd2b12e6b84b595cee40eff", {callback:"JSON_CALLBACK"}, {get:{method:"JSONP"}});
	$scope.weatherResults=$scope.weatherAPI.get({
		q: $scope.city,
		cnt: $scope.days
	});
	//console.log($scope.weatherAPI);
	//console.log($scope.weatherResults);
	$scope.convertToCelcius=function(degCelcius){
		return (degCelcius-273.15).toFixed(2);
	};
	
	$scope.convertDate=function(wDate){
		
		return new Date(wDate * 1000);
	}
}]);

//Custom Directives
weatherApp.directive("weatherReport", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/weatherReport.html',
       replace: true,
       scope: {
           weatherDay: "=",
           convertToStandard: "&",
           convertToDate: "&",
           dateFormat: "@"
       }
   }
});
