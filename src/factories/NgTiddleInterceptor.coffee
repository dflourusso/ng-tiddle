class NgTiddleInterceptor extends Factory
  constructor: ($q, ngTiddleSessionService, ngTiddleAuthProvider) ->
    return {
      request: (config) ->
        is_api = new RegExp("^#{ngTiddleAuthProvider.getApiRoot().match('^(?:https?:)?(?:\/\/)?([^\/\?]+)')[0]}")
        if is_api.test(config.url) && ngTiddleSessionService.getResource()
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
