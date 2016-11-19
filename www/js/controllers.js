angular.module('starter.controllers', [])


.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}])

.controller('ikitchenCtrl', function($scope,$state) {
	$scope.toSearchPage = function(){
		$state.go('menu-search-page');
	}
})
//菜谱搜索页面
.controller('SearchPageCtrl', function($scope,$state,$ionicHistory) {
	$scope.returnpage =function(){
		$scope.searchval = "";
		$state.go("tab.ikitchen");
	}


	$scope.searchval = "";
	$scope.search_show = false;
	$scope.search_change = function(){
		if($scope.searchval == ""){
			$scope.search_show = false;
		}else{
			$scope.search_show = true;
		}
    // $scope.search_show = $scope.searchval?false:true;

	}
})
//菜谱搜索列表
.controller('MenuSearchCtrl', function($scope,$ionicModal,$http,$state) {
    //获取菜谱列表
    $http({
      url:'js/menuLists.json',
      method:'GET'
    }).success(function(data,header,config,status){
      //响应成功
      $scope.menuLists = data
    }).error(function(data,header,config,status){
      console.log('sss');
      //处理响应失败
    });
    //end
   /* $scope.toMenuDetail = function(){
      $state.go('menu-detail');
    }*/
    //浮动框//
	  $scope.contacts = [
	    { name: 'Gordon Freeman' },
	    { name: 'Barney Calhoun' },
	    { name: 'Lamarr the Headcrab' },
	  ];

	  $ionicModal.fromTemplateUrl('templates/modal.html', {
	    scope: $scope
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

	  $scope.createContact = function(u) {
	    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
	    $scope.modal.hide();
	  };
  //浮动框//
})
/*菜谱详情页*/
.controller('MenuDetailCtrl', function($scope,$http,$stateParams) {
  var id = $stateParams.id;
  console.log(id)
  $http({
    url:'js/menuLists.json',
    method:'GET'
  }).success(function(data,header,config,status){
    //响应成功
    angular.forEach(data,function(obj,n){
       while(obj.id == id){
        $scope.menu = obj;
         return;
       }
      console.log($scope.menu.title);
    })

  }).error(function(data,header,config,status){
    console.log('sss');
    //处理响应失败
  });


})
//创建菜谱详情
.controller('CreateDetailCtrl', function($scope) {

})

.controller('CreateNameCtrl', function($scope) {
	$scope.isshow = true;
	$scope.show = function(){
		$scope.isshow = !$scope.isshow;
	}
})
/*每周流行菜谱*/
.controller('PopulCtrl', function($scope,$http) {

	$http({
		url:'js/popudata.json',
		method:'GET'
	}).success(function(data,header,config,status){
		//响应成功
		$scope.popu_data = data
	}).error(function(data,header,config,status){
		console.log('sss');
		//处理响应失败
	});

})


.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
