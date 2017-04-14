angular.module('app').component('logout', {
  controller: function (auth, $location) {
    auth.$unauth()
    $location.path('/login')
  }
})
