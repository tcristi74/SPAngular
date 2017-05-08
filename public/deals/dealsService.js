(function () {
  angular.module('app')
        .factory('dealsService', ['baseSvc', '$log', '$q', function (baseService, log, $q) {
          var listEndPoint = '/_api/web/lists'

          var dealList = []
          var expirationDate = null

          var dealRecord = []

          var useCache = function () {
            if (dealList !== null && angular.isDefined(dealList) && dealList.length > 0 && Date.now() < expirationDate) {
              return true
            } else {
              return false
            }
          }
          var getAllCases = function () {
            if (useCache()) {
              log.info('read cases from cache')
              var deferred = $q.defer()
              deferred.resolve(dealList)
              return deferred.promise
            }

            var query = listEndPoint + "/GetByTitle('Deals%20Library')/Items?" +
                    '$select=LinkFilename,Id,Case_x0020_Type,Deal_x0020_Status,TNUMs,Modified,Editor/Title&$expand=Editor/ID' +
                    "&$filter=ContentType eq 'Deal File Folder'" +
                    '&$orderby=Modified desc&' +
                    '$top=5000'
            var responseDataPromise = baseService.getRequest(query)
            return responseDataPromise.then(function (data) {
              log.info('rest ok', data)
              dealList = []
                    // console.log('start loop', data)
              angular.forEach(data.results, function (record) {
                        // console.log('loop', record)
                dealList.push({
                  CaseType: record.Case_x0020_Type,
                  DealName: record.LinkFilename,
                  DealStatus: record.Deal_x0020_Status,
                  Modified: record.Modified,
                  Editor: record.Editor.Title,
                  Id: record.Id,
                  Tnums: record.TNUMs
                })
              })
              // expire in 10 minute
              expirationDate = Date.now() + 600000
              return dealList
            }, function (error) {
              log.error('error', error)
            })
          }

          var getFolderFiles = function (folderName) {
            var query = "/_api/Web/GetFolderByServerRelativeUrl('DealsLibrary/" + folderName +
                    "')?$expand=Folders/Folders/Files/ModifiedBy,Folders/Files/ModifiedBy,Files/ModifiedBy"

            var promise1 = baseService.getRequest(query)
            return promise1.then(function (data) {
              var obj = []

              if (angular.isUndefined(data)) {
                log.error('no folders or files for foldername:' + folderName)
                return obj
              }

              analyseFolderRec(obj, data)
                        // look first for files in the root
              // getFileInfo(data.Files.results, obj)
              //
              // angular.forEach(data.Folders.results, function (record) {
              //   getFileInfo(record.Files.results, obj)
              // })

                        // sort this by modified descending
              obj.sort(function (a, b) {
                return new Date(b.Modified) - new Date(a.Modified)
              }
                        )

              return obj
            },
                    function (error) {
                      log.error(error)
                    })
          }

          var getRecentlyModifiedFilesAllCases = function (usernameId) {
            var filter = ''
            if (angular.isUndefined(usernameId) || usernameId === null) {
              filter = "&$filter=ContentType%20eq 'Deal Document' "
            } else {
              filter = "&$filter=((ContentType%20eq 'Deal Document' ) and (Editor/Id eq " + usernameId + '))'
            }

            var query = "/_api/web/lists/GetByTitle('Deals%20Library')/Items?$select=FileRef,LinkFilename,iD,Modified,Editor/Title" +
                    '&$expand=Editor/ID' +
                    filter +
                    '&$orderby=Modified%20desc&$top=100'
            var promise1 = baseService.getRequest(query)
            return promise1.then(function (data) {
              var files = []

              if (angular.isUndefined(data)) {
                log.error('no files have been identified')
                return files
              }

              angular.forEach(data.results, function (record) {
                            // getFileInfo(record.Files.results, obj, folderName)

                var arr = record.FileRef.split('/')
                var folder = ''
                var startFolderName = false
                for (var i = 0; i < arr.length - 1; i++) {
                  var rec = arr[i]
                  if (startFolderName) {
                    folder += rec + '/'
                  } else {
                    if (rec === 'DealsLibrary') {
                      startFolderName = true
                    }
                  }
                }

                files.push({
                  Folder: folder,
                  Path: record.FileRef,
                  Name: record.LinkFilename,
                  Modified: record.Modified,
                  ModifiedBy: record.Editor.Title,
                  Extension: (record.LinkFilename.lastIndexOf('.') > 0 ? record.LinkFilename.substring(record.LinkFilename.lastIndexOf('.') + 1) : '')
                })
              })

                        // sort this by modified descending
              files.sort(function (a, b) {
                return new Date(b.Modified) - new Date(a.Modified)
              })

              return files
            },
                    function (error) {
                      log.error(error)
                    })
          }

          var analyseFolderRec = function (obj, data) {
            if (angular.isDefined(data.Folders)) {
              angular.forEach(data.Folders.results, function (record) {
                analyseFolderRec(obj, record)
              })
            }
            if (angular.isDefined(data.Files)) {
              getFileInfo(data.Files.results, obj)
            }
          }

          function getFileInfo (nodes, files) {
            angular.forEach(nodes, function (node) {
              var arr = node.ServerRelativeUrl.split('/')
              var newarr = []
              // cut stuff we don't need from array
              var startAdd = false
              for (var i = 0; i < arr.length - 1; i++) {
                if (startAdd) {
                  newarr.push(arr[i])
                } else {
                    // get the bibraryName
                  if (arr[i] === 'DealsLibrary') {
                    startAdd = true
                  }
                }
              }
              var folder = ''
              arr = newarr
              for (i = 1; i < arr.length; i++) {
                folder += arr[i] + '/'
              }
              if (folder.endsWith('/')) {
                folder = folder.substr(0, folder.length - 1)
              }

              files.push({
                Folder: folder,
                Path: arr,
                Name: node.Name,
                Modified: node.TimeLastModified,
                ModifiedBy: node.ModifiedBy.Title,
                Url: node.ServerRelativeUrl,
                Extension: (node.Name.lastIndexOf('.') > 0 ? node.Name.substring(node.Name.lastIndexOf('.') + 1) : '')
              })
            })
          }

          return {
            getAllCases: getAllCases,
            dealRecord: dealRecord,
            getFolderFiles: getFolderFiles,
            getRecentlyModifiedFilesAllCases: getRecentlyModifiedFilesAllCases
          }
        }])
})()

