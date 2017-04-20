(function () {
  angular.module('app')
        .factory('flagsService', ['baseSvc', '$log', function (baseSvc, log) {
          var listEndPoint = '/_api/web/lists'

          var getFlags = function () {
            var query = listEndPoint + "/GetByTitle('Flags')/Items?$select=Category,Flag,Id,Created,Modified"
            var responseDataPromise = baseSvc.getRequest(query)
            return responseDataPromise.then(function (data) {
              var obj = []
                    // console.log('start loop', data)
              angular.forEach(data.results, function (record) {
                        // console.log('loop', record)
                obj.push({
                  Flag: record.Flag,
                  FlagId: record.Id,
                  Category: record.Category
                })
              })
              return obj
            })
          }

          var getCaseDetail = function (id) {
            var query = '<View><Query><Where><Eq><FieldRef Name=\'ID\'/>' +
                  '<Value Type=\'Text\'>' + id + '</Value></Eq></Where>' +
                  // filed don't work '<ViewFields><FieldRef Name=\'FileLeafRef\' /><FieldRef Name=\'Title\' /></ViewFields>' +
                  '</Query></View>'
            var promise1 = baseSvc.getUsingCAMLAndRest('Deals Library', query)
            return promise1.then(function (data) {
              var obj = []

              if (angular.isUndefined(data) ||
                    angular.isUndefined(data.results)) {
                log.error('no record for:' + id)
                return obj
              }

              var result = data.results[0]

              var dealtype = ''
              if (!angular.isUndefined(result.Deal_x0020_Type.results)) {
                angular.forEach(result.Deal_x0020_Type.results, function (value, key) {
                  dealtype += value.Label + ';'
                  log.info('DealType:' + value.Label)
                })
              }
              var region = ''
              if (!angular.isUndefined(result.Region)) {
                angular.forEach(result.Region.results, function (value, key) {
                  region += value.Label + ';'
                  log.info('Region:' + value.Label)
                })
              }

              var relatedParties = ''
              if (!angular.isUndefined(result.Related_x0020_Parties.results)) {
                angular.forEach(result.Related_x0020_Parties.results, function (value, key) {
                  relatedParties += value.Label + ';'
                  log.info('relatedParties:' + value.Label)
                })
              }

              obj.push({
                DealName: result.DealName,
                Counterparty: result.Counterparty_x0020_Common_x0020_Name.Label,
                CaseID: result.Deal_x0020_ID.Label,
                DealDate: result.Deal_x0020_Conception_x0020_Date,
                CaseType: result.Case_x0020_Type,
                DealType: dealtype,
                TermStartDate: result.Deal_x0020_Start_x0020_Date,
                TermEndDate: result.Deal_x0020_End_x0020_Date,
                DealStatus: result.Deal_x0020_Status,
                Modified: result.Modified,
                CrossReferences: result.TNUMs,
                RelatedParties: relatedParties,
                Region: region
              })

              return obj
            }, function (error) {
              log.error(error)
            })
          }

          var getCaseFlags = function (id) {
            var query = listEndPoint + "/GetByTitle('CaseInfo')/Items?$filter=CaseId eq '" +
                id + "'&$select=Id, Description,RequiredAction,LinkAgreementCitation,FlagId,Flag/Flag&$expand=Flag"
            var responseDataPromise = baseSvc.getRequest(query)
            return responseDataPromise.then(function (data) {
              var obj = []
                    // console.log('start loop', data)
              angular.forEach(data.results, function (record) {
                        // console.log('loop', record)
                obj.push({
                  Description: record.Description,
                  Flag: record.Flag.Flag,
                  FlagId: record.FlagId,
                  RequiredAction: record.RequiredAction,
                  LinkAgreementCitation: record.LinkAgreementCitation,
                  IsEdited: false,
                  ID: record.Id

                })
              })
              return obj
            })
          }

          var upsertCaseInfo = function (caseRecords, itemId, flagRecords) {
            angular.forEach(caseRecords, function (record) {
              var flagId = null
              angular.forEach(flagRecords, function (flag) {
                if (record.Flag === flag.Flag) {
                  flagId = flag.FlagId
                }
              })

              if (record.ID === 0) {
                // insert
                var url1 = listEndPoint + "/GetByTitle('Caseinfo')/Items"
                // get flagId

                var insertData = {
                  __metadata: { type: 'SP.Data.CaseInfoListItem' },
                  Title: record.Description,
                  Description: record.Description,
                 // Flag: record.Flag,
                  FlagId: flagId,
                  RequiredAction: record.RequiredAction,
                  LinkAgreementCitation: record.LinkAgreementCitation,
                  CaseId: itemId
                }
                baseSvc.postRequest(insertData, url1).then(function (data) {
                  log.info('data inserted')
                }, function (error) {
                  log.error('error inserted', error)
                })
              } else if (record.IsEdited) {
                    // updated
                var url = listEndPoint + "/GetByTitle('Caseinfo')/GetItemById(" + record.ID + ')'
                var updateData = {
                  __metadata: { type: 'SP.Data.CaseInfoListItem' },
                  Title: record.Description,
                  Description: record.Description,
                  FlagId: flagId,
                  RequiredAction: record.RequiredAction,
                  LinkAgreementCitation: record.LinkAgreementCitation
                }

                baseSvc.updateRequest(updateData, url).then(function (data) {
                  log.info('data updated')
                }, function (error) {
                  log.error('error updated', error)
                })
              }
              log.info(record.ID + '   edit: ' + String(record.IsEdited))
            })
          }

          var deleteCaseInfo = function (itemId) {
            var url = listEndPoint + "/GetByTitle('CaseInfo')/GetItemById(" + itemId + ')'
            baseSvc.deleteRequest(url).then(function (data) {
              log.info('caseinfo with id=' + String(itemId) + ' was deleted.')
            })
          }

          var isDate = function isDateTime (dateStr) {
            var dateTry = new Date(dateStr)

            if (!dateTry.getTime()) {
              return false
            }

            var tz = dateStr.trim().match(/(Z)|([+-](\d{2})\:?(\d{2}))$/)

            if (!tz) {
              var newTzOffset = dateTry.getTimezoneOffset() / 60
              var newSignStr = (newTzOffset >= 0) ? '-' : '+'
              var newTz = newSignStr + ('0' + Math.abs(newTzOffset)).slice(-2) + ':00'

              dateStr = dateStr.trim() + newTz
              dateTry = new Date(dateStr)

              if (!dateTry.getTime()) {
                return false
              }
            }

            return true
          }

          return {
            getCaseDetail: getCaseDetail,
            getFlags: getFlags,
            getCaseFlags: getCaseFlags,
            isDate: isDate,
            upsertCaseInfo: upsertCaseInfo,
            deleteCaseInfo: deleteCaseInfo
          }
        }])
})()

