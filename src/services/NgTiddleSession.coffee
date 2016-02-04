class NgTiddleSession extends Service
  token_prefix: 'tiddle_token'
  resource_prefix: 'tiddle_resource'

  constructor: (@$timeout, @ngTiddleStorageService, @ngTiddleAuthProvider) ->

  setResource: (resource, token) ->
    unless resource
      @clear()
      return
    @ngTiddleStorageService.put @token_prefix, token
    @ngTiddleStorageService.put @resource_prefix, resource
    @resource = resource

  getResource: ->
    @resource = @ngTiddleStorageService.get(@resource_prefix)
    @$timeout((=> @ngTiddleAuthProvider.onUnauthorized()), 0) unless @resource
    @resource

  getToken: ->
    @ngTiddleStorageService.get @token_prefix

  clear: ->
    @ngTiddleStorageService.remove @resource_prefix
    @ngTiddleStorageService.remove @token_prefix
    @resource = null
