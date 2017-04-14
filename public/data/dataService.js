(function () {
  angular.module('app')
         .factory('dataService', ['baseSvc', function (baseService) {
           var listEndPoint = '/_api/web/lists'

           var getAll = function () {
             var query = listEndPoint + "/GetByTitle('Settings')/Items?$select=ID,Title,Value"
             var responseDataPromise = baseService.getRequest(query)
             return responseDataPromise.then(function (data) {
               var obj = []
               // console.log('start loop', data)
               angular.forEach(data.results, function (record) {
                 // console.log('loop', record)
                 obj.push({
                   Title: record.Title,
                   Id: record.Id,
                   Value: record.Value
                 })
               })
               return obj
             })
           }

           var postRec = function (data) {
             var url = listEndPoint + "/GetByTitle('Settings')/Items"
           //  baseService.postRequest(data, url)
             var postPromise = baseService.postRequest(data, url)
             return postPromise
           }

           var getSelectedCasesFromServer = function () {
             var testPromise = baseService.checkHostList('Settingseee')
             return testPromise
           }

           var deleteRecById = function (id) {
             var url = listEndPoint + "/GetByTitle('Settings')/GetItemById(" + id + ')'
             var deletePromise = baseService.deleteRequest(url)
             return deletePromise
           }

           var updateTitleById = function (data, id) {
             var url = listEndPoint + "/GetByTitle('Settings')/GetItemById(" + id + ')'
             var updatePromise = baseService.updateRequest(data, url)
             return updatePromise
           }

           return {
             getAll: getAll,
             postRec: postRec,
             deleteRecById: deleteRecById,
             updateTitleById: updateTitleById,
             getSelectedCases2: getSelectedCasesFromServer
           }
         }])
})()

