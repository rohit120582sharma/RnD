var myApp = angular.module('paintMyHome',[]);

myApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

myApp.controller('paintMyHomeController',function($scope,$http){
	console.log('paintMyHomeController Controller Initialized');
	
	//Basic Color Arrays Initialization
	$scope.palleteObj={
		data:[
			{
			   "palleteName":"Fashion Fiesta 1",
			   "shades":[
				  {
					"name":"Happy Go Lucky 1",
					"code":"AB1234",
					"hex":"#5b9232",
					"color":"#5b9232"
				  },
				  {
					"name":"Happy Go Lucky 2",
					"code":"AB1234",
					"hex":"#5b3292",
					"color":"#5b3292"
				  }
			   ]
			},
			{
			   "palleteName":"Fashion Fiesta 2",
			   "shades":[
				  {
					"name":"Happy Go Lucky 2 A",
					"code":"AB1234",
					"hex":"#925b32",
					"color":"#925b32"
				  }
			   ]
			}
		]
	};
	
	$scope.activePrimary=0;
	
	
	//Nerolac Colors
	$scope.getNerolacColors = function() {
		$http({
			method: 'GET',
			url: 'https://www.cliqueholding.com/color-palette/color-codes/'
		}).then(function successCallback(response) {
			$scope.palletes = response.data.colors;
		}, function errorCallback(response) {
			console.log('No color codes found', response);
		});
	};
	
	//Custom Pallete Colors
	$scope.getCustomColorPalletes = function() {
		$http({
			method: 'GET',
			url: 'http://139.59.1.238/color-palette/color-codes/'
		}).then(function successCallback(response) {
			
			$scope.palletesCustom = $scope.palleteObj.data;
		}, function errorCallback(response) {
			console.log('No Custom Palletes Found', response);
		});
	};

	//Updating Pallete on basis on user selection from dropdown
	$scope.updateCurrentPalleteSelection = function(val) {
		$scope.currentUserSelection = val;
		if(val==='nerolacdefault') {
			if($scope.stringColor===undefined) {
				$scope.getNerolacColors();
			}	
		} else {
			if($scope.palletesCustom===undefined) {
				$scope.getCustomColorPalletes();
			}	
		}
	};
	
	
	//Maintaining 'Recently Used Colors' for further user reference
	$scope.recentlyUsedColors = [];	
	$scope.updateSelectedColor = function(hex,name) {
		$scope.usedColor = {
			colorCode: hex,
			colorName: name
		};
		if($scope.recentlyUsedColors.length===7) {
			$scope.recentlyUsedColors.shift();
			$scope.recentlyUsedColors.push($scope.usedColor);
		} else {
			$scope.recentlyUsedColors.push($scope.usedColor);
		}
        
        window.selectedColor=hex;
	};
	
	//Initializing Default Values for App to begin
	$scope.currentUserSelection = 'nerolacdefault';
	$scope.avilablePalletes = 'nerolacdefault';
	$scope.getNerolacColors();
});
