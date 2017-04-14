angular.module('app').component('data', {
  templateUrl: '../SiteAssets/TradingJs/Public/data/data.html',
  controller: ['$scope', 'dataService', '$log', dataCtrl]
})

function dataCtrl (scope, dataService, log) {
  log.info('scope', scope)
  scope.cnt = 0
  scope.recId = 0
  scope.recTitle = 'new title'
  scope.jsomMessage = 'ttt'

  log.error('data control init')

  dataService.getAll().then(function (data) {
    log.info('data get all')
    scope.recs = data
    scope.spLists = []
  })

  scope.testJSOM = function () {
    scope.cnt++
    scope.message = 'clicks :' + parseInt(scope.cnt)
    dataService.getSelectedCases2().then(function (result) {
      scope.message = 'post data'
      scope.spLists.push({
        Title: 'demo' + scope.cnt
      })

/*
      var listEnumerator = result.getEnumerator()
      while (listEnumerator.moveNext()) {
        var oList = listEnumerator.get_current()

        scope.spLists.push({
          Title: oList.get_title()
        })
      }
 */
      log.info('done2.1', scope.spLists)
    //  scope.$digest()
    }, function (errorData) {
      log.error('errorData', errorData)
    })

/*    p.done(function (result) {
          // result is an SP.List because that is what we passed to resolve()!
          // do something with the list
      var listEnumerator = result.getEnumerator()
      while (listEnumerator.moveNext()) {
        var oList = listEnumerator.get_current()

        data1.push({
          Title: oList.get_title()
        })
      }
      scope.spLists = data1
      log.info('done2.1')
      scope.jsomMessage = 'test'
    })
    p.fail(function (result) {
          // result is a string because that is what we passed to reject()!
      var error = result
      log.error('err')
      log.error(error)
    })
*/
  }

  scope.insertRow = function () {
    scope.cnt++
    scope.message = 'clicks :' + parseInt(scope.cnt)
    var insertData = {
      __metadata: { type: 'SP.Data.SettingsListItem' },
      Title: 'demo2',
      Value: '100'
    }

   // dataService.postRec(insertData)

    dataService.postRec(insertData).then(function (data) {
      scope.message = 'post data'

      scope.spLists.push({
        Title: 'demo' + scope.cnt
      })
      scope.recs.push({
        Title: insertData.Title,
        Value: insertData.Value
      })
    }, function (errorData) {
      log.error('errorData', errorData)
    })
  }

  scope.deleteRow = function () {
    scope.cnt--
    var recToDelete = parseInt(scope.recId)
    dataService.deleteRecById(recToDelete).then(function (data) {
      scope.message = 'removed'
      log.info('record has been removed', scope.recs)
      // remove it from list
      var i = 0
      for (i = scope.recs.length - 1; i >= 0; i--) {
        if (scope.recs[i].Id === recToDelete) scope.recs.splice(i, 1)
      }
    }, function (errorData) {
      log.error('errorData', errorData)
    })
  }

  scope.updateRow = function () {
    var recToUpdate = parseInt(scope.recId)
    var newTitle = scope.recTitle
    var updateData = {
      __metadata: { type: 'SP.Data.SettingsListItem' },
      Title: newTitle,
      Value: '100'
    }

    dataService.updateTitleById(updateData, recToUpdate).then(function (data) {
      scope.message = 'updated'
      log.info('record has been updated', scope.recs)
      var i
      for (i = scope.recs.length - 1; i >= 0; i--) {
        if (scope.recs[i].Id === recToUpdate) scope.recs[i].Title = newTitle
      }
    }, function (errorData) {
      log.error('errorData', errorData)
    })
  }
}

