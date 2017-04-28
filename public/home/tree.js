angular.module('app').component('tree', {
  templateUrl: '../SiteAssets/TradingJs/Public/home/tree.html',
  controller: ['$scope', 'dealsService', '$log', '$window', treeCtrl]
})

function treeCtrl (scope, dealsService, log, $window) {
  scope.caseName = dealsService.dealRecord.DealName
  log.info('scope', scope)
    // var searchData = { }
  scope.caseFiles = []
  scope.treeObject = []

  dealsService.getFolderFiles(dealsService.dealRecord.DealName).then(function (result) {
    scope.caseFiles = result

    buildTree()
    scope.gridFiles = {
      bindingOptions: {
        dataSource: 'caseFiles'
      },
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
                              // $window.location.href = options.data.Folder + '/' + options.data.Name
                              // $window.location.href = '/teamsites/trading/Deals/DealsLibrary/' +  options.data.Path + '/' + options.data.Name
                                $window.location.href = options.data.Url
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

    scope.treeViewOptions = {
      // items: treeItem,
      bindingOptions: {dataSource: 'treeObject'},
      width: 320,
      expandedExpr: 'expanded',
      hoverStateEnabled: true,
      // showCheckBoxesMode: 'normal',
      onItemClick: function (e) {
        var item = e.itemData
        var foldername = item.id
        log.info('clocked on:' + foldername)
        if (foldername === 'root') {
          $('#gridRecentlyModified').dxDataGrid('instance').clearFilter()
        } else {
          $('#gridRecentlyModified').dxDataGrid('instance').filter('Folder', 'startswith', foldername)
        }
      }
    }
  }, function (errorData) {
    log.error('errorData', errorData)
  })
  scope.checkedItems = []

  function buildTree () {
    scope.treeObject = [
      {
        id: 'root',
        text: dealsService.dealRecord.DealName,
        items: []
      }
    ]

    // var x
    angular.forEach(scope.caseFiles, function (record) {
     // x++
     // var idx = '1_' + x
      var p = 0
      var s = 0
      for (var i = 1; i < record.Path.length; i++) {
        if (i === 1) {
          p = checkAddRec(record, i, scope.treeObject[0].items)
        } else if (i === 2) {
          s = checkAddRec(record, i, scope.treeObject[0].items[p].items)
        } else if (i === 3) {
          checkAddRec(record, i, scope.treeObject[0].items[p].items[s].items)
        }
      }
    })
  }

  function checkAddRec (sourceArr, y, arr) {
    var found = false
    var val = sourceArr.Path[y]
    if (angular.isDefined(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].text === val) {
          found = true
          break
        }
      }
    } else {
      arr = []
    }
    if (!found) {
      // get unique id
      var idx = ''
      for (var x = 1; x <= y; x++) {
        idx += sourceArr.Path[x] + '/'
      }

      arr.push({
        id: idx.substr(0, idx.length - 1),
        text: val,
        items: []
      })
    }
    return i
  }
}
