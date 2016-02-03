class NgTiddleStorage extends Service
  constructor: (@ngTiddleAuthProvider, @$cookies) ->

  isLocalStorage: ->
    return true if window.cordova || window.NATIVE
    return true if window.localStorage && @ngTiddleAuthProvider.getKeepLoggedIn()

  put: (key, value) ->
    if @isLocalStorage()
      window.localStorage[key] = JSON.stringify(value)
      return
    @$cookies.putObject key, value

  get: (key) ->
    if @isLocalStorage()
      return if p = window.localStorage[key] then JSON.parse(p) else undefined
    @$cookies.getObject key

  remove: (key) ->
    if @isLocalStorage()
      delete(window.localStorage[key])
      return
    @$cookies.remove key
