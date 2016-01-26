class NgTiddleSession extends Service
  constructor: (@kvStorageService) ->

  setResource: (resource, token) ->
    unless resource
      @clear()
      return
    try @kvStorageService.token = token
    @kvStorageService.resource = JSON.stringify resource
    @resource = resource

  getResource: ->
    @resource = JSON.parse(@kvStorageService.resource) if @kvStorageService.resource

  getToken: ->
    @kvStorageService.token

  clear: ->
    try
      delete @kvStorageService.resource
      delete @kvStorageService.token
      @resource = undefined
