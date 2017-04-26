    angular.module('app').component('rfiles', {
      templateUrl: '../SiteAssets/TradingJs/Public/files/rfiles.html',
      controller: ['$scope', 'dealsService', '$log', '$window', recentFilesCtrl]
    })

    angular.module('app').component('mfiles', {
      templateUrl: '../SiteAssets/TradingJs/Public/files/rfiles.html',
      controller: ['$scope', 'dealsService', '$log', '$window', myFilesCtrl]
    })

    function myFilesCtrl (scope, dealsService, log, $window) {
      log.info('scope', scope)
      getFiles(scope, dealsService, log, $window, _spPageContextInfo.userId)
    }

    function recentFilesCtrl (scope, dealsService, log, $window) {
      log.info('scope', scope)
      getFiles(scope, dealsService, log, $window, null)
    }

    function getFiles (scope, dealsService, log, $window, usernameId) {
      log.info('get files with filterbyUsernameId:' + usernameId)
      scope.caseFiles = []
      dealsService.getRecentlyModifiedFilesAllCases(usernameId).then(function (result) {
        scope.caseFiles = result
        scope.gridFiles = {
          bindingOptions: {dataSource: 'caseFiles'},
          editing: {
            mode: 'row',
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
          },
                // showLoadIndicator: true,
          allowColumnResizing: true,
          allowSorting: true,
          allowColumnReordering: true,
          columnChooser: {enabled: true},
          sorting: {mode: 'multiple'},
          groupPanel: {visible: true, emptyPanelText: 'Drag a column header here to group grid records'},
          filterRow: {visible: true},
          searchPanel: {visible: true},
          selection: {mode: 'single'},
          hoverStateEnabled: true,
          paging: {
            pageSize: 10,
            pageIndex: 1
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 30, 100]
          },

          stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storageFiles'
          },
          columns: [
            {
              dataField: 'Name',
              sortOrder: 'asc',
              width: '35%',
              cellTemplate: function (container, options) {
                $('<a/>').addClass('dx-link')
                                .text(options.data.Name)
                                .on('dxclick', function () {
                                  $window.location.href = options.data.Path
                                })
                                .appendTo(container)
              }
            }, {
              dataField: 'Folder',
              dataType: 'string',
              width: '30%',
              caption: 'Folder'
            },
            {
              dataField: 'Modified',
              width: '15%',
              dataType: 'date',
              caption: 'Modified At'

            },
            {
              dataField: 'ModifiedBy',
              dataType: 'string',
              width: '20%',
              caption: 'Modified By'
            }
          ]
        }
      }, function (errorData) {
        log.error('errorData', errorData)
      })
    }
