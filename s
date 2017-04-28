[1mdiff --git a/contenteditor.html b/contenteditor.html[m
[1mindex ad63814..d55973a 100644[m
[1m--- a/contenteditor.html[m
[1m+++ b/contenteditor.html[m
[36m@@ -20,6 +20,8 @@[m
 <script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/app.js"></script>[m
 <script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/nav/nav.js"></script>[m
 <script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/home/home.js"></script>[m
[32m+[m[32m<script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/home/tree.js"></script>[m
[32m+[m
 <script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/data/data.js"></script>[m
 <script src="/teamsites/trading/Deals/SiteAssets/TradingJs/Public/data/dataService.js"></script>[m
 [m
[1mdiff --git a/public/app.js b/public/app.js[m
[1mindex 71e4fa9..d31d4b4 100644[m
[1m--- a/public/app.js[m
[1m+++ b/public/app.js[m
[36m@@ -31,7 +31,7 @@[m
 //[m
 angular.module('app', ['ngRoute', 'dx'])[m
     .controller('mainCtrl', function ($scope) {[m
[31m-        $scope.name = 'Case site'[m
[32m+[m[32m      $scope.name = 'Case site'[m
     })[m
     .run(function ($rootScope, $location) {[m
         // $location.path('/data')[m
[36m@@ -61,9 +61,12 @@[m [mangular.module('app', ['ngRoute', 'dx'])[m
             .when('/mfiles', {[m
               template: '<mfiles></mfiles>'[m
             })[m
[31m-            .when('/cases', {[m
[31m-              template: '<deals></deals>'[m
[32m+[m[32m            .when('/treeFolder', {[m
[32m+[m[32m              template: '<tree></tree>'[m
             })[m
[32m+[m[32m            // .when('/gridView', {[m
[32m+[m[32m            //   template: '<deals></deals>'[m
[32m+[m[32m            // })[m
             .otherwise('/cases')[m
     })[m
 /*    .constant('IS_APP_WEB', false)[m
[1mdiff --git a/public/deals/dealsService.js b/public/deals/dealsService.js[m
[1mindex 15973c2..1458422 100644[m
[1m--- a/public/deals/dealsService.js[m
[1m+++ b/public/deals/dealsService.js[m
[36m@@ -54,7 +54,7 @@[m
             })[m
           }[m
 [m
[31m-          var getRecentlyModifiedFiles = function (folderName) {[m
[32m+[m[32m          var getFolderFiles = function (folderName) {[m
             var query = "/_api/Web/GetFolderByServerRelativeUrl('DealsLibrary/" + folderName +[m
                     "')?$expand=Folders/Files/ModifiedBy,Files/ModifiedBy"[m
 [m
[36m@@ -169,7 +169,7 @@[m
           return {[m
             getAllCases: getAllCases,[m
             dealRecord: dealRecord,[m
[31m-            getRecentlyModifiedFiles: getRecentlyModifiedFiles,[m
[32m+[m[32m            getFolderFiles: getFolderFiles,[m
             getRecentlyModifiedFilesAllCases: getRecentlyModifiedFilesAllCases[m
           }[m
         }])[m
[1mdiff --git a/public/home/home.css b/public/home/home.css[m
[1mindex 0a43b01..c32ffe0 100644[m
[1m--- a/public/home/home.css[m
[1m+++ b/public/home/home.css[m
[36m@@ -6,5 +6,14 @@[m
     font-size: 18px;[m
     font-weight: bold;[m
     float: left;[m
[32m+[m[32m}[m
 [m
[32m+[m[32m.dx-treeview{[m
[32m+[m[32m    margin: auto;[m
[32m+[m[32m    width: 200px;[m
[32m+[m[32m}[m
[32m+[m[32m.wrapper{[m
[32m+[m[32m    height:400px;[m
[32m+[m[32m    max-width:750px;[m
[32m+[m[32m    margin: 0 auto;[m
 }[m
[1mdiff --git a/public/home/home.js b/public/home/home.js[m
[1mindex 33fa1dc..ed0d326 100644[m
[1m--- a/public/home/home.js[m
[1m+++ b/public/home/home.js[m
[36m@@ -2,13 +2,14 @@[m [mangular.module('app').component('home', {[m
   templateUrl: '../SiteAssets/TradingJs/Public/home/home.html',[m
   controller: ['$scope', 'dealsService', '$log', '$window', homeCtrl][m
 })[m
[32m+[m
 function homeCtrl (scope, dealsService, log, $window) {[m
   scope.caseName = dealsService.dealRecord.DealName[m
   log.info('scope', scope)[m
   // var searchData = { }[m
   scope.caseFiles = [][m
 [m
[31m-  dealsService.getRecentlyModifiedFiles(dealsService.dealRecord.DealName).then(function (result) {[m
[32m+[m[32m  dealsService.getFolderFiles(dealsService.dealRecord.DealName).then(function (result) {[m
     scope.caseFiles = result[m
     scope.gridFiles = {[m
       bindingOptions: {dataSource: 'caseFiles'},[m
