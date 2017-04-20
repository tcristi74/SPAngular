   angular.module('app')
         .factory('baseSvc', ['$http', '$log', '$document', '$timeout', '$q', function ($http, log, $document, timeout, q) {
           var baseUrl = _spPageContextInfo.webAbsoluteUrl
           var siteCollectionUrl = baseUrl + '/trading'
           var listEndPoint = '/_api/web/lists'

           var getRequest = function (query) {
             log.debug('start get baseSvc')
             return $http({
               url: baseUrl + query,
               method: 'GET',
               headers: {
                 'accept': 'application/json;odata=verbose',
                 'content-Type': 'application/json;odata=verbose'
               }
             }).then(function success (response) {
               log.info('GET succeeded', response) // supposed to have: data, status, headers, config, statusText
               return response.data.d
             }, function (data) {
               log.error('GET error', data)
             })
           }

           var postRequest = function (data, query) {
             log.info('start POST baseSvc', data)
             // this is how you get the ListItemEntityTypeFullName
             // baseUrl+'/_api/lists/getbytitle('Caseinfo')?$select=ListItemEntityTypeFullName

             var dataAsJson = angular.toJson(data)
             var digest = $document[0].getElementById('__REQUESTDIGEST').value

             return $http({
               url: baseUrl + query,
               method: 'POST',
               headers: {
                 'accept': 'application/json;odata=verbose',
                 'X-RequestDigest': digest,
                 'content-Type': 'application/json;odata=verbose'
               },
               data: dataAsJson
             }).then(function success (response) {
               log.debug('POST succeeded', response)
               return response.data.d
             }, function (data) {
               log.error('POST error', data)
               return 'ERROR post'
             })
           }

           var deleteRequest = function (query) {
             log.info('start DELETE baseSvc')
             var digest = $document[0].getElementById('__REQUESTDIGEST').value
             return $http({
               url: baseUrl + query,
               method: 'DELETE',
               headers: {
                 'accept': 'application/json;odata=verbose',
                 'X-RequestDigest': digest,
                 'IF-MATCH': '*'
               }
             }).then(function success (response) {
               log.info('delete success')
               return response.data.d
             }, function (data) {
               log.error('DELETE error', data)
               return 'ERROR DELETE'
             })
           }

           var updateRequest = function (data, query) {
             log.info('start update baseSvc')
             var dataAsJson = angular.toJson(data)
             var digest = $document[0].getElementById('__REQUESTDIGEST').value
             return $http({
               url: baseUrl + query,
               method: 'PATCH',
               headers: {
                 'accept': 'application/json;odata=verbose',
                 'X-RequestDigest': digest,
                 'content-Type': 'application/json;odata=verbose',
                 'X-Http-Method': 'PATCH',
                 'IF-MATCH': '*'
               },
               data: dataAsJson
             }).then(function success (response) {
               return response.data.d
             }, function (data) {
               log.error('update error', data)
               return 'ERROR update'
             })
           }

           function newRemoteContextInstance (appUrl) {
               // for jsom use. Return an object with new instances for clear async requests
             var returnObj = {},
               context,
               factory,
               appContextSite
             if (!SP.ClientContext) {
               log.error('SP.ClientContext not loaded')
               return null
             }
               // Make sure taxonomy library is registered
             SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'))

               // context = new SP.ClientContext(appUrl)
             context = SP.ClientContext.get_current()
             // factory = new SP.ProxyWebRequestExecutorFactory(appUrl)
             // context.set_webRequestExecutorFactory(factory)
             // appContextSite = new SP.AppContextSite(context, baseUrl)

             returnObj.context = context
             returnObj.factory = factory
             returnObj.appContextSite = appContextSite
             return returnObj
           }

           function getJsom (camlString) {
             var defer = q.defer()

               // SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'))

               // context = new SP.ClientContext(appUrl)
             var ctx = SP.ClientContext.get_current()

             // var list = ctx.context.get_web().get_lists().getByTitle('Deals Library')
             // var camlQuery = new SP.CamlQuery()
             // camlQuery.set_viewXml(
             //        '<View><Query><Where><Eq><FieldRef Name=\'Deal_x0020_ID\'/>' +
             //        '<Value Type=\'Text\'>201703CT001</Value></Eq></Where></Query></View>')
             //        // '<ViewFields>' +
             //        //   '<FieldRef Name="FileRef" />' +
             //        //   '<FieldRef Name=\'Deal_x0020_Descriptor\'/>' +
             //        //   '<FieldRef Name=\'Deal_x0020_ID\'/>'+
             //        // '</ViewFields>' +
             //        // '</View>')
             // var resultItems = list.getItems(camlQuery)
             // ctx.context.load(resultItems, 'Include(Title,DealName,Modified,Editor,Author,Deal_x0020_Start_x0020_Date,Deal_x0020_End_x0020_Date,Counterparty_x0020_Common_x0020_Name,Deal_x0020_ID)')
             // ctx.context.executeQueryAsync(success, fail)

             // var resultItems = list.getItemById(1)
             // var resultItems = list.getItems(SP.CamlQuery.createAllItemsQuery())
           //  ctx.context.load(resultItems, 'Include(Title,DealName,Modified,Editor,Author,Deal_x0020_Start_x0020_Date,Deal_x0020_End_x0020_Date)')

             // settings table

             var list = ctx.get_web().get_lists().getByTitle('Triggers')
            // var camlQuery = new SP.CamlQuery()
             // camlQuery.set_viewXml('<View><Query></Query><ViewFields><FieldRef Name=\'Deal_x0020_ID\' />' +
             //      '<FieldRef Name=\'Counterparty_x0020_Common_x0020_Name\' />' +
             //      '<FieldRef Name=\'Deal_x0020_Status\' /><FieldRef Name=\'Deal_x0020_Owner\' /><FieldRef Name=\'FileRef\' />' +
             //      '<FieldRef Name=\'Case_x0020_Type\' /><FieldRef Name=\'ID\' />' +
             //      '<FieldRef Name=\'Counterparty_x0020_Legal_x0020_Name\' /></ViewFields><RowLimit Paged="TRUE">2147483647</RowLimit></View>')
             // camlQuery.set_viewXml(
             //       '<View><Query><Where><Eq><FieldRef Name=\'ID\'/>' +
             //       '<Value Type=\'Number\'>1</Value></Eq></Where></Query>' +
             //          '<ViewFields>' +
             //            '<FieldRef Name="FileRef" />' +
             //            '<FieldRef Name="Parameters" />' +
             //            '<FieldRef ID=\'f980f9e7-cfdb-4b6d-a088-2aeb09c9b43e\'/>' +
             //          '</ViewFields>' +
             //          '</View>')
             // var resultItems = list.getItems(camlQuery)
             var resultItems = list.getItems(SP.CamlQuery.createAllItemsQuery())
             ctx.load(resultItems)
                 //, 'Include(Title,testCol)')
             ctx.executeQueryAsync(success, fail)

             // end settings

             function success () {
               log.info('jsom success')
               var listItems = []
               var listEnum = resultItems.getEnumerator()

               while (listEnum.moveNext()) {
                 var item = listEnum.get_current()
                 listItems.push('ID: ' + item.get_id() + ' Title: ' + item.get_item('Title') + item.get_item('testCol').get_label())
               }

              // defer.resolve(resultItems)
             }

             function fail (sender, args) {
               log.error('jsom failure', ctx)
               var error = {
                 sender: sender,
                 args: args
               }
               defer.reject(error)
             }

             return defer.promise
           }

           function checkList (c) {
             var web
             var collectionList
            // var defer = new $.Deferred()
             var defer = q.defer()

             if (!c) {
                     // SP.ClientContext not loaded, c is null
               var args = {
                 get_message: function () {
                   return 'SP.ClientContext not loaded'
                 },
                 get_stackTrace: function () {
                   return null
                 }
               }
               timeout(fail(null, args), 500)
               return defer.promise
             }

             web = c.context.get_web()
             collectionList = web.get_lists()
             // this will only load Title, no other list properties
             c.context.load(collectionList, 'Include(Title)')
             c.context.executeQueryAsync(success, fail)

             function success () {
               log.info('jsom success')
               defer.resolve(collectionList)
             }

             function fail (sender, args) {
               log.error('jsom failure', c)
               var error = {
                 sender: sender,
                 args: args
               }
               defer.reject(error)
             }

             return defer.promise
           }

           // this uses post to get Json rest API
           function getListItems (listTitle, queryViewXml) {
             var queryPayload = {
               'query': {
                 '__metadata': { 'type': 'SP.CamlQuery' },
                 'ViewXml': queryViewXml
               }
             }

             var endpointUrl = listEndPoint + "/getbytitle('" + listTitle + "')/getitems"

             var postPromise = postRequest(queryPayload, endpointUrl)
             return postPromise
           }

           function getTaxonomyLabel (termGuidId) {
             log.debug('start get taxonomy')

             return $http({
               url: siteCollectionUrl + listEndPoint +
                    "/GetByTitle('TaxonomyHiddenList')/Items?$select=ID,IdForTerm,Term&$filter=IdForTerm eq '" +
                    termGuidId + "'",
               method: 'GET',
               headers: {
                 'accept': 'application/json;odata=verbose',
                 'content-Type': 'application/json;odata=verbose'
               }
             }).then(function success (response) {
               log.info('getTaxonomyLabel succeeded', response) // supposed to have: data, status, headers, config, statusText
               return response.data.d
             }, function (data) {
               log.error('GET error', data)
             })
           }

           return {
             getRequest: getRequest,
             getUsingCAMLAndRest: getListItems,
             postRequest: postRequest,
             deleteRequest: deleteRequest,
             updateRequest: updateRequest,
             checkHostList: function () {
                   // This function checks if list.Title exists.
                 /* syntax example:
                  spyreqs.jsom.checkHostList( "listTitle" ).then(
                  function(listExistsBool) { alert(listExistsBool); // true or false },
                  function(error) { alert('checkHostList request failed. ' +  error.args.get_message() + '\n' + error.args.get_stackTrace() ); }
                  );
                  */
               var c = newRemoteContextInstance()
                   // if SP.ClientContext is not loaded, c will be null.
                   // But, send the promise and let disolve there
               return checkList(c)
             },
             getJSom: function (caseId) {
              // var c = newRemoteContextInstance()
               return getJsom(caseId)
             },
             getTaxonomyLabel: getTaxonomyLabel

           }
         }])

