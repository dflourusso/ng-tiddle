class KvStorage extends Service
  constructor: (@ngTiddleAuthProvider, @$cookies) ->
    # No cordova, utiliza localStorage se o browser suportar
    # caso contrário, $cookies do angular, já que não será persistente

  storageType: ->
    return 'localStorage' if window.cordova || window.NATIVE
    return 'localStorage' if window.localStorage && @ngTiddleAuthProvider.getKeepLoggedIn()
    'cookiesStorage'

  put: (key, value) ->
    if @storageType() is 'localStorage'
      window.localStorage[key] = JSON.stringify(value)
      return
    @$cookies.putObject key, value

  get: (key) ->
    if @storageType() is 'localStorage'
      return if p = window.localStorage[key] then JSON.parse(p) else undefined
    @$cookies.getObject key

  remove: (key) ->
    if @storageType() is 'localStorage'
      delete(window.localStorage[key])
      return
    @$cookies.remove key
