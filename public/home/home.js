angular.module('app').component('home', {
  templateUrl: '../SiteAssets/TradingJs/Public/home/home.html',
  controller: ['$scope', 'dealsService', '$log', '$window', homeCtrl]
})
function homeCtrl (scope, dealsService, log, $window) {
  scope.caseName = dealsService.dealRecord.DealName
  log.info('scope', scope)
  // var searchData = { }
  scope.caseFiles = []

  dealsService.getRecentlyModifiedFiles(dealsService.dealRecord.DealName).then(function (result) {
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
          width: '50%',
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
          width: '15%',
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
