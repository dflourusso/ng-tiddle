class NgTiddleAuth extends Service
  constructor: ($http, $timeout, ngTiddleSessionService, ngTiddleAuthProvider) ->
    @$http = $http
    @ngTiddleSessionService = ngTiddleSessionService
    @tap = ngTiddleAuthProvider
    @sign_in_params = {}

  signIn: (resource) ->
    path = "#{@tap.getApiRoot()}/#{@tap.getApiResourcePath()}/sign_in"
    @sign_in_params[@tap.getModelName()] = resource
    ret = @$http.post(path, @sign_in_params)
    ret.then (response) =>
      @ngTiddleSessionService.setResource response.data[@tap.getModelName()], response.data.authentication_token
      @tap.onAuthorize response.data
    ret

  signOut: ->
    @$http.delete("#{@tap.getApiRoot()}/#{@tap.getApiResourcePath()}/sign_out")
    .then =>
      @ngTiddleSessionService.clear()
      $timeout((-> @tap.onUnauthorized()), 0)

  getResource: ->
    @ngTiddleSessionService.getResource()
