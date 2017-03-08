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
  /*enter事件*/
  .directive('myEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.myEnter);
          });

          event.preventDefault();
        }
      });
    };
  })

  .filter('myLimitTo', [function () {
    return function (obj, limit) {
      var keys = Object.keys(obj);
      if (keys.length < 1) {
        return [];
      }
      var ret = new Object,
        count = 0;
      angular.forEach(keys, function (key, arrayIndex) {
        if (count >= limit) {
          return false;
        }
        ret[key] = obj[key];
        count++;
      });
        return ret;
    };
  }])
  /*测试*/
  .controller('TestCtrl', function ($scope, $http, $state) {
  })
  /*首页*/
  .controller('ikitchenCtrl', function ($scope, $state) {
    $scope.toSearchPage = function () {
      $state.go('menu-search');
    }
  })
  /*登录*/
  .controller('loginCtrl', function ($scope, $state) {


  })
  //菜谱搜索页面 menu-search
  .controller('SearchPageCtrl', function ($scope, $state, $ionicHistory, $http) {
    $scope.keys = {};
    //返回上一页
    $scope.returnpage = function () {
      $scope.search_show = false;//隐藏
      $scope.search_val = "";
      $state.go("tab.ikitchen");
      //$ionicHistory.goBack();
    };
    //最近搜索 热门搜索
    $http({
      url: 'http://120.24.225.232:8090/api/search/hot_recent/',
      method: 'get',
    }).success(function (data) {
      console.log(data.content);
      $scope.recent = data.content.recent;
      $scope.recent_show = $scope.recent.length == 0?false:true;
      $scope.hot = data.content.hot;

    }).error(function (status) {

    });
      //清空最近搜索
    $scope.clearRecent = function () {
      $http({
        url: 'http://120.24.225.232:8090/api/search/clear/',
        method: 'get',
      }).success(function (data) {
        $scope.recent_show = false;

      }).error(function (status) {

      });
    }
    //最近搜索 热门搜索 end

    $scope.search_val = "";
    $scope.search_show = false;

    //搜索框改变时
    $scope.search_change = function () {

      $scope.search_show = $scope.search_val == "" ? false : true;
      var data = {"input": $scope.search_val};
      if ($scope.search_val != "") {
        $http({
          url: 'http://120.24.225.232:8090/api/search/relate/',
          method: 'post',
          data: data
        }).success(function (data) {
          console.log(data.content);
          $scope.keys = data.content.hot;
          $scope.my_favorite = data.content.like;

        }).error(function (status) {

        });
      }

    };

    /*前往搜索相关的菜谱列表*/
    function goToMenuList(val) {
      var source = "menu-search";

      $http({
          url: 'http://120.24.225.232:8090/api/search/insert/',
        method: 'POST',
        data:{"input":val}
      }).success(function (data, header, config, status) {
          console.log(data);
      }).error(function (data, header, config, status) {

      });

      $state.go("menu-list", {"source": source, "search_key": val});
    }

    $scope.goToMenuList = goToMenuList;
    $scope.mykey = function (e) {
      var keycode = window.event ? e.keyCode : e.which;//获取按键编码
      if (keycode == 13) {
        goToMenuList($scope.search_val);
      }
    };


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
        $('.menu-panel img').css('height', $('.menu-panel img').css('width'));//高度等于宽度
      };

    }).error(function (status) {
      $scope.error = "访问失败啦" + status.detail;
      console.log('sss');
      console.log(status.detail);
      //处理响应失败
    });
    //相应分类的菜谱列表页
    $scope.goMeneList = function (id,name) {
      var param = {
        id: id,
        source: "menu-classification",
        search_key: name
      };
      $state.go("menu-list", param);
    };

  })
  //菜谱搜索列表 menu-list
  .controller('MenuSearchCtrl', function ($scope, $ionicModal, $http, $state, $stateParams, $ionicHistory) {
    console.log($stateParams);
    $scope.sort_active = {"auto": "active", "score": "", "do_num": ""};
    var source = $stateParams.source;//上一页
    var search_key = $stateParams.search_key;
    var search_id = $stateParams.id;
    $scope.search_key = search_key;
    // $scope.sortFlag = "score";

    $scope.menuSort = function (type) {
      $scope.sort_active = {"auto": "", "score": "", "do_num": ""};
      $scope.sort_active[type] = "active";
      $scope.sortFlag = type;
    };

    listByIdOrKey();

    //根据搜索条件搜索列表
    function listByIdOrKey() {
      var urlId = 'http://120.24.225.232:8090/api/cookbook/by_menu/?menu=' + search_id;  //根据分类获取列表
      var urkKey = 'http://120.24.225.232:8090/api/cookbook/by_name/?name=' + search_key;   //根据关键词类获取列表
      var url = search_id ? urlId : urkKey;

      $http({
        url: url,
        method: 'GET'
      }).success(function (data, header, config, status) {
        //响应成功
        $scope.menuLists = data.content;
        if($scope.menuLists.length == 0){ //没有搜索结果
          $scope.notFund = true;
        }else {
          $.each($scope.menuLists, function (i, item) {
            item.do_num = parseInt(item.do_num);
            item.score = parseFloat(item.score);
            item.favorite = parseInt(item.favorite);
          });
          console.log($scope.menuLists);
        }


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
    /*加载菜谱详细信息by id*/
    $http({
      url: 'http://120.24.225.232:8090/api/cookbook/by_cookbook_id/',
      method: 'POST',
      data:{"id":id}
    }).success(function (data, header, config, status) {
      //响应成功
      console.log("菜谱详情");
      console.log(data);
      $scope.menu = data.content;
      // /*angular.forEach(data, function (obj, n) {
      //   while (obj.id == id) {
      //     $scope.menu = obj;
      //     return;
      //   }
      //   console.log($scope.menu.title);
      // })*/

    }).error(function (data, header, config, status) {
      console.log('sss');
      //处理响应失败
    });
    //返回上一页
    $scope.goBack = function () {
      $ionicHistory.goBack();
    }


  })
  //创建菜谱名
  .controller('CreateNameCtrl', function ($scope,$state) {
    $scope.menuName = "";
    $scope.createDetail = function () {
      console.log($scope.menuName);
      $state.go("create-detail",{});
    }
  })
  //创建菜谱详情
  .controller('CreateDetailCtrl', function ($scope,$stateParams) {
    $scope.menu_name = $stateParams.menu_name;
    /*插件*/
    $scope.data = {
      showDelete: false, //显示delete
      adj:"调整用料"
    };
    //删除
    $scope.onItemDelete = function(material) {
      $scope.materials.splice($scope.materials.indexOf(material), 1);
    };
    $scope.materials = [
      { material: "",amount:"" }
    ];
    /*插件*/
    $scope.addMore = function () {
      $scope.materials.push({ material: "",amount:"" });
    }
    $scope.adjItem = function () {
      $scope.data.adj = $scope.data.showDelete?"调整用料":"调整完订单成";
      $scope.data.showDelete = !$scope.data.showDelete;
      $scope.data.showReorder = !$scope.data.showReorder
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

