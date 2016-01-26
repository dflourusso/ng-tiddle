class NgTiddleInterceptor extends Factory
  constructor: ($q, ngTiddleSessionService, ngTiddleAuthProvider)->
    strategy = ngTiddleAuthProvider.getSignInStrategy()
    return {
      request: (config) ->
        if ngTiddleSessionService.getResource()
          model_name = ngTiddleAuthProvider.getModelName()
          config.headers["X-#{model_name}-#{strategy}".toUpperCase()] = ngTiddleSessionService.getResource()[strategy]
          config.headers["X-#{model_name}-TOKEN".toUpperCase()] = ngTiddleSessionService.getToken()
        config

      responseError: (e) =>
        if e.status is 401
          ngTiddleAuthProvider.onUnauthorized()
        $q.reject(e)
    }
