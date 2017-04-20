(function () {
  angular.module('app')
        .factory('dealsService', ['baseSvc', '$log', function (baseService, log) {
          var listEndPoint = '/_api/web/lists'
            // "GetByTitle('Deals%20Library')/Items?$select=LinkFilename,Case_x0020_Type,Deal_x0020_Status,Modified,Editor/Title&$expand=Editor/ID&$filter=ContentType eq 'Deal File Folder'&$orderby=Modified desc&$top=50"
          // get all cases order by modified
          var getAllCases = function () {
            var query = listEndPoint + "/GetByTitle('Deals%20Library')/Items?" +
                '$select=LinkFilename,Id,Case_x0020_Type,Deal_x0020_Status,Modified,Editor/Title&$expand=Editor/ID' +
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
                  Editor: record.Editor.Title,
                  Id: record.Id
                })
              })
              return obj
            }, function (error) {
              log.error('error', error)
            })
          }

          // var getAllCasesCaml = function () {
          //   var query = '<View><Query></Query></View>'
          //   var promise1 = baseService.getUsingCAMLAndRest('Deals Library', query)
          //   return promise1.then(function (data) {
          //     var obj = []
          //
          //     if (angular.isUndefined(data) ||
          //             angular.isUndefined(data.results)) {
          //       log.error('no record for:' + id)
          //       return obj
          //     }

              // var result = data.results[0]

              // var dealtype = ''
              // if (!angular.isUndefined(result.Deal_x0020_Type.results)) {
              //   angular.forEach(result.Deal_x0020_Type.results, function (value, key) {
              //     dealtype += value.Label + ';'
              //     log.info('DealType:' + value.Label)
              //   })
              // }
              // var region = ''
              // if (!angular.isUndefined(result.Region)) {
              //   angular.forEach(result.Region.results, function (value, key) {
              //     region += value.Label + ';'
              //     log.info('Region:' + value.Label)
              //   })
              // }
              //
              // var relatedParties = ''
              // if (!angular.isUndefined(result.Related_x0020_Parties.results)) {
              //   angular.forEach(result.Related_x0020_Parties.results, function (value, key) {
              //     relatedParties += value.Label + ';'
              //     log.info('relatedParties:' + value.Label)
              //   })
              // }

              // obj.push({
              //   CaseType: record.Case_x0020_Type,
              //   DealName: record.LinkFilename,
              //   DealStatus: record.Deal_x0020_Status,
              //   Modified: record.Modified,
              //   Editor: record.Editor.Title,
              //   Id: record.Id
              // })

          //     angular.forEach(data.results, function (result) {
          //       obj.push({
          //         CaseType: result.Case_x0020_Type,
          //         DealName: result.DealName,
          //         DealStatus: result.Deal_x0020_Status,
          //         Modified: result.Modified,
          //         Counterparty: result.Counterparty_x0020_Common_x0020_Name.Label,
          //         CaseID: result.Deal_x0020_ID.Label,
          //         Editor: result.Editor.Title,
          //         Id: result.ID
          //               // DealDate: result.Deal_x0020_Conception_x0020_Date,
          //               // DealType: dealtype,
          //               // TermStartDate: result.Deal_x0020_Start_x0020_Date,
          //               // TermEndDate: result.Deal_x0020_End_x0020_Date,
          //               // CrossReferences: result.TNUMs,
          //               // RelatedParties: relatedParties,
          //               // Region: region
          //       })
          //     })
          //
          //     return obj
          //   }, function (error) {
          //     log.error(error)
          //   })
          // }

          return {
            getAllCases: getAllCases
           // getAllCases2: getAllCasesCaml
          }
        }])
})()

