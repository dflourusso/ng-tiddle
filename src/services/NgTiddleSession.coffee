class NgTiddleSession extends Service
  constructor: (@kvStorageService, @ngTiddleAuthProvider) ->

  setResource: (resource, token) ->
    unless resource
      @clear()
      return
    try @kvStorageService.tiddle_token = token
    @kvStorageService.tiddle_resource = JSON.stringify resource
    @resource = resource

  getResource: ->
    unless @kvStorageService.tiddle_resource
      @ngTiddleAuthProvider.onUnauthorized()
      return
    @resource = JSON.parse(@kvStorageService.tiddle_resource)

  getToken: ->
    @kvStorageService.tiddle_token

  clear: ->
    try
      delete @kvStorageService.tiddle_resource
      delete @kvStorageService.tiddle_token
      @resource = undefined
