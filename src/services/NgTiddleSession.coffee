class NgTiddleSession extends Service
  token_prefix: 'tiddle_token'
  resource_prefix: 'tiddle_resource'

  constructor: (@kvStorageService, @ngTiddleAuthProvider) ->

  setResource: (resource, token) ->
    unless resource
      @clear()
      return
    @kvStorageService.put @token_prefix, token
    @kvStorageService.put @resource_prefix, resource
    @resource = resource

  getResource: ->
    unless @kvStorageService.get(@resource_prefix)
      @ngTiddleAuthProvider.onUnauthorized()
      return
    @resource = @kvStorageService.get @resource_prefix

  getToken: ->
    @kvStorageService.get @token_prefix

  clear: ->
    @kvStorageService.remove @resource_prefix
    @kvStorageService.remove @token_prefix
    @resource = null
