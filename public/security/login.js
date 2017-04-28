// angular.module('app').component('login', {
//   templateUrl: 'security/login.html',
//   bindings: {
//     currentAuth: '='
//   },
//   controller: function (auth, $location) {
//     this.loggedIn = !!this.currentAuth
//
//     this.anonLogin = function () {
//       'use strict'
//       var ref = new Firebase('https://paymentsonfire.firebaseio.com')
//       ref.authAnonymously(function (error, authData) {
//         if (error) {
//           console.log('Login Failed!', error)
//         } else {
//           console.log('Authenticated successfully with payload:', authData)
//         }
//       })
//     }
//
//     this.fbLogin = function () {
//       auth.$authWithOAuthPopup('facebook').then(function () {
//         $location.path('/home')
//       }).catch(function (err) {
//         this.errorMessage = err.code
//       }.bind(this))
//     }
//   }
// })
