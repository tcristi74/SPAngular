angular.module('app', ['ngRoute', 'dx'])
    .controller('MyController', function ($scope) {
      $scope.name = 'Case site'
    })
//     .run(function ($rootScope, $location) {
//     $rootScope.$on('$routeChangeError', function (e, next, prev, err) {
//         if (err === 'AUTH_REQUIRED') {
//             $location.path('/login')
//         }
//     })
// })
    .config(function ($routeProvider) {
      $routeProvider
            .when('/london', {
              template: '<nav></nav><h1>Main</h1><p>Click on the links to change this content</p>'
            })
            .when('/home', {
              template: '<home></home>'
            })
            .when('/data', {
              template: '<data></data>'
            })
            .when('/flags', {
              template: '<flags></flags>'
            })
          .when('/cases', {
            template: '<deals></deals>'
          })
            .otherwise('/cases')
    })
/*    .constant('IS_APP_WEB', false)
    .factory('spNgTestSvc', spNgTestSvc)
    .run(function () {
      var query = "/_api/web/lists/GetByTitle('settings')/Items"
      angular.log('bbb')
      //console.log('aaa')
        // var result= spBaseService.getRequest(query);
    }

    )

spNgTestSvc.$inject = ['spBaseService'] */

