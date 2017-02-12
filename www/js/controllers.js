angular.module('starter.controllers', [])
  .directive('autofocus', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        $timeout(function () {
          $element[0].focus();
        });
      }
    }
  }])
  /*测试*/
  .controller('TestCtrl', function ($scope, $http,$state){


  })
  /*首页*/
  .controller('ikitchenCtrl', function ($scope, $state) {
    $scope.toSearchPage = function () {
      $state.go('menu-search');
    }
  })
  //菜谱搜索页面 menu-search
  .controller('SearchPageCtrl', function ($scope, $state, $ionicHistory) {
    $scope.returnpage = function () {
      $scope.searchval = "";
      $state.go("tab.ikitchen");
      //$ionicHistory.goBack();
    };
    $scope.searchval = "";
    $scope.search_show = false;
    $scope.search_change = function () {
      if ($scope.searchval == "") {
        $scope.search_show = false;
      } else {
        $scope.search_show = true;
      }
      // $scope.search_show = $scope.searchval?false:true;

    };
    /*前往搜索相关的菜谱列表*/
    $scope.toListPage = function () {
      var source = "menu-search";
      $state.go("menu-list", {"source": source});
    }
  })

  /*
   * 菜谱分类
   */
  .controller('ClassificationCtrl', function ($scope, $state, $ionicHistory, $http) {
    $http({
      url: 'http://120.24.225.232:8090/api/menu/all/',
      method: 'get'
    }).success(function (data) {
      $scope.error = "访问成功啦";
      $scope.cf_list = data["content"];
      console.log($scope.cf_list);
      $scope.load = function () {
        $('.menu-panel img').css('height',$('.menu-panel img').css('width'));//高度等于宽度
      };

    }).error(function (status) {
      $scope.error = "访问失败啦"+status.detail;
      console.log('sss');
      console.log(status.detail);
      //处理响应失败
    });
    //相应分类的菜谱列表页
    $scope.goMeneList = function (id) {
      var param = {
        id:id,
        source:"menu-classification",
        key:null
      };
      $state.go("menu-list",param);
    };

  })
  //菜谱搜索列表 menu-list
  .controller('MenuSearchCtrl', function ($scope, $ionicModal, $http, $state, $stateParams, $ionicHistory) {
    console.log($stateParams);
    var source = $stateParams.source;//上一页
    if($stateParams.id){
      listById($stateParams.id);
    }
    //根据分类获取列表
    function listById(id){
      $http({
        url: 'http://120.24.225.232:8090/api/cookbook/by_menu/?menu='+id,
        method: 'GET'
      }).success(function (data, header, config, status) {
        //响应成功
        $scope.menuLists = data.content;
        console.log($scope.menuLists);
      }).error(function (data, header, config, status) {
        console.log('请求失败');
        //处理响应失败
      });
    }
    //本地获取菜谱列表
    // $http({
    //   url: 'js/menuLists.json',
    //   method: 'GET'
    // }).success(function (data, header, config, status) {
    //   //响应成功
    //   $scope.menuLists = data
    // }).error(function (data, header, config, status) {
    //   console.log('sss');
    //   //处理响应失败
    // });
    //end

    /* $scope.toMenuDetail = function(){
     $state.go('menu-detail');
     }*/
    //浮动框//
    $scope.contacts = [
      {name: 'Gordon Freeman'},
      {name: 'Barney Calhoun'},
      {name: 'Lamarr the Headcrab'},
    ];

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.createContact = function (u) {
      $scope.contacts.push({name: u.firstName + ' ' + u.lastName});
      $scope.modal.hide();
    };
    //浮动框//
    //返回上一页
    $scope.goBack = function () {
      $state.go(source);
      //$ionicHistory.goBack();
    }
    //进入菜谱详情页
    $scope.goDetail = function (id) {
      var obj = {
        id: id,
        source: "menu-list"
      };
      $state.go("menu-detail", obj);
    }
  })
  /*菜谱详情页*/
  .controller('MenuDetailCtrl', function ($scope, $http, $stateParams, $state, $ionicHistory) {
    var id = $stateParams.id;

    $http({
      url: 'js/menuLists.json',
      method: 'GET'
    }).success(function (data, header, config, status) {
      //响应成功
      angular.forEach(data, function (obj, n) {
        while (obj.id == id) {
          $scope.menu = obj;
          return;
        }
        console.log($scope.menu.title);
      })

    }).error(function (data, header, config, status) {
      console.log('sss');
      //处理响应失败
    });
    //返回上一页
    $scope.goBack = function () {
      $ionicHistory.goBack();
    }


  })
  //创建菜谱详情
  .controller('CreateDetailCtrl', function ($scope) {

  })

  .controller('CreateNameCtrl', function ($scope) {
    $scope.isshow = true;
    $scope.show = function () {
      $scope.isshow = !$scope.isshow;
    }
  })

  /*每周流行菜谱*/
  .controller('PopulCtrl', function ($scope, $http) {

    $http({
      url: 'js/popudata.json',
      method: 'GET'
    }).success(function (data, header, config, status) {
      //响应成功
      $scope.popu_data = data
    }).error(function (data, header, config, status) {
      console.log('sss');
      //处理响应失败
    });

  })


  .controller('ChatsCtrl', function ($scope, Chats) {

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
