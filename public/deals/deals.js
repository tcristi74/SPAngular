    angular.module('app').component('deals', {
      templateUrl: '../SiteAssets/TradingJs/Public/deals/deals.html',
      controller: ['$scope', 'dealsService', '$log', '$window', dealsCtrl]
    })

    function dealsCtrl (scope, dealsService, log, $window) {
      log.info('scope', scope)

      scope.cases = []
      scope.IsVisible = true

      dealsService.getAllCases().then(function (results) {
        scope.cases = results
        scope.IsVisible = false
        scope.gridOptions = {
          bindingOptions: { dataSource: 'cases' },
          editing: {
            mode: 'row',
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
          },
          allowColumnResizing: true,
          allowColumnReordering: true,
          columnChooser: { enabled: true },
          sorting: { mode: 'multiple' },
          groupPanel: { visible: true, emptyPanelText: 'Drag a column header here to group grid records' },
          filterRow: { visible: true },
          searchPanel: { visible: true },
          selection: { mode: 'single' },
          hoverStateEnabled: true,
          paging: {
            pageSize: 20,
            pageIndex: 1
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [20, 50, 100]
          },

          stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storage'
          },
          columns: [
            {
              dataField: 'DealName',
              dataType: 'string',
              width: '30%',
              cellTemplate: function (container, options) {
                $('<a/>').addClass('dx-link')
                          .text(options.data.DealName)
                          .on('dxclick', function () {
                            dealsService.dealRecord = options.data
                            $window.location.href = '#!/treeFolder'
                          })
                          .appendTo(container)
              }
            }, {
              dataField: 'DealStatus',
              dataType: 'string',
              width: '10%',
              caption: 'Deal Status'
            }, {
              dataField: 'CaseType',
              dataType: 'string',
              width: '15%',
              caption: 'Case Type'
            },
            {
              dataField: 'Modified',
              width: '15%',
              dataType: 'date',
              caption: 'Modified At'
            },
            {
              dataField: 'Editor',
              dataType: 'string',
              width: '20%',
              caption: 'Modified By'
            },
            {
              width: '10%',
              dataType: 'string',
              cellTemplate: function (container, options) {
                $('<a/>').addClass('dx-link')
                          .text('Flags')
                          .on('dxclick', function () {
                            $window.location.href = '#!/flags?itemId=' + options.data.Id
                          })
                          .appendTo(container)
              }
            },
            {
              dataField: 'Tnums',
              dataType: 'string',
              width: '10%',
              caption: 'Cross References',
              visible: false
            }
          ]
        }

      }, function (error) {
        log.error('error getting deals', error)
        DevExpress.ui.notify('There were errors loading the case grid')
      })
    }

