class KvStorage extends Service
  constructor: (ngTiddleAuthProvider) ->
    # No cordova, utiliza localStorage ou sessionStorage se o browser suportar,
    # caso contrário, um objeto em memória, já que não será persistente
    return window.localStorage if window.cordova || window.NATIVE
    return window.localStorage if window.localStorage && ngTiddleAuthProvider.getKeepLoggedIn()
    return window.sessionStorage if window.sessionStorage
    return clear: ->
