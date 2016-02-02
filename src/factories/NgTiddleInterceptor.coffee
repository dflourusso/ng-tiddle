class NgTiddleInterceptor extends Factory
  constructor: ($q, ngTiddleSessionService, ngTiddleAuthProvider) ->
    return {
      request: (config) ->
        if ngTiddleSessionService.getResource()
          strategy = ngTiddleAuthProvider.getSignInStrategy()
          model_name = ngTiddleAuthProvider.getModelName()
          config.headers["X-#{model_name}-#{strategy}".toUpperCase()] = ngTiddleSessionService.getResource()[strategy]
          config.headers["X-#{model_name}-TOKEN".toUpperCase()] = ngTiddleSessionService.getToken()
        config

      responseError: (e) ->
        if e.status is 401
          ngTiddleSessionService.clear()
          ngTiddleAuthProvider.onUnauthorized()
        $q.reject(e)
    }
