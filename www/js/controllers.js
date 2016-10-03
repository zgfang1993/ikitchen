angular.module('starter.controllers', [])

.controller('ikitchenCtrl', function($scope) {})
//创建菜谱详情
.controller('CreateDetailCtrl', function($scope) {})

.controller('CreateNameCtrl', function($scope) {
	$scope.isshow = true;
	$scope.show = function(){
		$scope.isshow = !$scope.isshow;
	}
})

.controller('PopulCtrl', function($scope,$http) {


	$http({
		url:'/js/popudata.json',
		method:'GET'
	}).success(function(data,header,config,status){
		//响应成功
		$scope.popu_data = data
	}).error(function(data,header,config,status){
		console.log('sss');
		//处理响应失败
	});


	/*$scope.popu_data = [
	{
		id:1,
		imgurl:"../img/popu1.png",
		title:"葱油饼",
		score:9.4,
		people:100,
		avatar:"../img/avatar1.jpg",
		name:"Lucky 荷"
	},
	{
		id:2,
		imgurl:"../img/popu2.png",
		title:"枣糕(最简单的做法)",
		score:8.4,
		people:900,
		avatar:"../img/avatar2.jpg",
		name:"猪猪"
	}
	]*/
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
