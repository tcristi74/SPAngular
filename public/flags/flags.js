angular.module('app')
.component('flags', {
  templateUrl: '../SiteAssets/TradingJs/Public/flags/flags.html',
  controller: ['$scope', 'flagsService', '$log', '$routeParams', flagsCtrl]
})

function flagsCtrl (scope, flagsService, log, routeParams) {
  log.info('scope', scope)

  if (angular.isUndefined(routeParams) || angular.isUndefined(routeParams.itemId)) {
    log.warn('itemId is missing')
    DevExpress.ui.notify('itemId parameter must be in included in the Url.')
    return
  }

  var itemId = routeParams.itemId
  // var caseId = ''

  scope.spLists = []
  scope.caseFlags = []
  var searchData = { }
  scope.data1 = []

    // get flag from Flags list
  flagsService.getFlags().then(function (result) {
    angular.forEach(result, function (record) {
      scope.caseFlags.push({
        Flag: record.Flag,
        FlagId: record.FlagId
      })
    })

    // define the grid
    scope.gridFlagsOptions = {
      bindingOptions: { dataSource: 'data1' },
      onRowInserting: function (e) {
        if (angular.isUndefined(e.data) ||
              angular.isUndefined(e.data.Flag) ||
              angular.isUndefined(e.data.Description)) {
          e.cancel = true
          return
        }
        if (e.data.Flag.indexOf('Date') !== -1) {
          if (!flagsService.isDate(e.data.Description)) {
            e.cancel = true
            DevExpress.ui.notify('Invalid date value (' + e.data.Description + ')')
          }
        }
        e.data.IsEdited = true
        e.data.ID = 0
      },
      onRowRemoved: function (e) {
        log.info('remove the caseInfo with id:' + String(e.data.ID))
        if (e.data.ID > 0) {
          flagsService.deleteCaseInfo(e.data.ID)
        }
      },
      onRowUpdating: function (e) {
        var flag = e.oldData.Flag
        if (angular.isDefined(e.newData) &&
            angular.isDefined(e.newData.Flag)) {
          flag = e.newData.Flag
        }
        if (flag.indexOf('Date') !== -1 &&
            angular.isDefined(e.newData.Description)) {
          var dateStr = e.newData.Description
          // verify if is a date
          if (!flagsService.isDate(dateStr)) {
            e.cancel = true
            DevExpress.ui.notify('Invalid date value (' + dateStr + ')')
          }
        }
        e.newData.IsEdited = true
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true
      },
      columns: [
        {
          dataField: 'Flag',
          caption: 'Flag',
          width: '25%',
          lookup: {
            dataSource: scope.caseFlags,
            displayExpr: 'Flag',
            valueExpr: 'Flag'
          }
        }, {
          dataField: 'Description',
          caption: 'Value',
          width: '18%',
          allowEditing: true,
          validationRules: [{
            type: 'required',
            message: 'Please, insert a value!'
          }]
        }, {
          dataField: 'RequiredAction',
          caption: 'RequiredAction',
          width: '18%',
          allowEditing: true
        },
        {
          dataField: 'LinkAgreementCitation',
          caption: 'Links Agreement',
          width: '39%',
          allowEditing: true
        }
      ]
    }
  }, function (errorData) {
    log.error('errorData', errorData)
  })

  var grid = null
  scope.onGridReady = function (e) {
    log.info('grid ready')
    grid = e.component
  }

  scope.$watchCollection('data1', function (datanew, dataold, scope) {
    log.info('store watch')
    if (grid) grid.refresh()
  })

  flagsService.getCaseDetail(itemId).then(function (result) {
   // caseId = result[0].CaseID
    searchData.CaseID = result[0].CaseID
    searchData.DealName = result[0].DealName
    searchData.DealDate = result[0].DealDate
    searchData.DealType = result[0].DealType
    searchData.CaseType = result[0].CaseType
    searchData.Counterparty = result[0].Counterparty
    searchData.TermStartDate = result[0].TermStartDate
    searchData.TermEndDate = result[0].TermEndDate
    searchData.Region = result[0].Region
    searchData.RelatedParties = result[0].RelatedParties
    searchData.CrossReferences = result[0].CrossReferences
    searchData.DealStatus = result[0].DealStatus
    searchData.Modified = result[0].Modified
  }, function (errorData) {
    log.error('errorData', errorData)
  })

  flagsService.getCaseFlags(itemId).then(function (result) {
    scope.data1.length = 0
    angular.forEach(result, function (record) {
      scope.data1.push(record)
    })
  }, function (errorData) {
    log.error('errorData', errorData)
  })

  scope.textBox = {
    simple: {
      value: 'Cristian tudose'
    } }

  scope.formOptions = {
    // width: 240,
    colCount: 1,
    formData: searchData,
    items: [

      { dataField: 'CaseID', editorOptions: {disabled: true}
      }, {
        dataField: 'Counterparty', editorOptions: {disabled: true}
      }, {
        dataField: 'DealName', editorOptions: {disabled: false}
      }, {
        dataField: 'CaseType', editorOptions: {disabled: false}
      }, {
        dataField: 'DealType', editorOptions: {disabled: true}
      }, {
        dataField: 'DealStatus', editorOptions: {disabled: false}
      }, {
        dataField: 'Region', editorOptions: {disabled: true}
      }, {
        dataField: 'RelatedParties', editorOptions: {disabled: true}
      }, {
        dataField: 'CrossReferences', editorOptions: {disabled: true}
      }, {
        dataField: 'DealDate', editorType: 'dxDateBox', editorOptions: {disabled: false}
      }, {
        dataField: 'TermStartDate', editorType: 'dxDateBox', editorOptions: {disabled: false, value: null}
      }, {
        dataField: 'TermEndDate', editorType: 'dxDateBox', editorOptions: {value: null}
      }, {dataField: 'Modified', editorType: 'dxDateBox', editorOptions: {value: null}
      }
    ]}

  function saveGrid () {
    var newRecs = 0
    var editedRecs = 0
    var newtnums = ''
    angular.forEach(scope.data1, function (record) {
      newtnums = addTnum(newtnums, record.Flag)
      if (record.ID === 0) {
        newRecs++
      } else if (record.IsEdited) {
        // check if the tag is there, if not add it
        editedRecs++
      }
    })

    newtnums = cleanTnum(newtnums)
      // create a new
    var saved = false
    if (newRecs + editedRecs > 0) {
      DevExpress.ui.notify('Saving Case Info...')
      flagsService.upsertCaseInfo(scope.data1, itemId, scope.caseFlags)
      saved = true
    }
        // update the Tnums
    if (newtnums !== '' && searchData.CrossReferences !== newtnums) {
      DevExpress.ui.notify('Saving Cross Reference...')
      flagsService.updateTnums(itemId, newtnums)
      saved = true
    }

    if (!saved) {
      DevExpress.ui.notify('No records have been modified.')
    } else {
      DevExpress.ui.notify('Saved!')
    }
  }

  var addTnum = function (tnums, tnum) {
    if (tnums === null) {
      tnums = ''
    }
    if (tnums.indexOf(tnum) < 0) {
      tnums += tnum + ';'
    }
    return tnums
  }

  var cleanTnum = function (tnum) {
    if (tnum.lastIndexOf(';') === tnum.length - 1) {
      return tnum.substr(0, tnum.length - 1)
    }
    return tnum
  }

  scope.saveButtonOptions = {
    text: 'Save',
    type: 'default',
    onClick: function (e) {
      saveGrid()
    }
  }
}

