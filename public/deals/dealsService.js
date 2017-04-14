(function () {
  angular.module('app')
        .factory('dealsService', ['baseSvc', '$log', function (baseService, log) {
          var listEndPoint = '/_api/web/lists'
            // "GetByTitle('Deals%20Library')/Items?$select=LinkFilename,Case_x0020_Type,Deal_x0020_Status,Modified,Editor/Title&$expand=Editor/ID&$filter=ContentType eq 'Deal File Folder'&$orderby=Modified desc&$top=50"
          // get all cases order by modified
          var getAllCases = function () {
            var query = listEndPoint + "/GetByTitle('Deals%20Library')/Items?" +
                '$select=LinkFilename,Case_x0020_Type,Deal_x0020_Status,Modified,Editor/Title&$expand=Editor/ID' +
                "&$filter=ContentType eq 'Deal File Folder'" +
                '&$orderby=Modified desc&$top=5000'
            var responseDataPromise = baseService.getRequest(query)
            return responseDataPromise.then(function (data) {
              log.info('rest ok', data)
              var obj = []
                  // console.log('start loop', data)
              angular.forEach(data.results, function (record) {
                      // console.log('loop', record)
                obj.push({
                  CaseType: record.Case_x0020_Type,
                  DealName: record.LinkFilename,
                  DealStatus: record.Deal_x0020_Status,
                  Modified: record.Modified,
                  Editor: record.Editor.Title
                })
              })
              return obj
            }, function (error) {
              log.error('error', error)
            })
          }

          return {
            getAllCases: getAllCases
          }
        }])
})()

