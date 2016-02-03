class NgTiddleInterceptor extends Factory
  constructor: ($q, ngTiddleSessionService, ngTiddleAuthProvider, ngTiddleStorageService) ->
    return {
      request: (config) ->
        api_regexp = new RegExp((new URL(ngTiddleAuthProvider.getApiRoot())).host)
        if api_regexp.test(config.url) && (resource = ngTiddleStorageService.get('tiddle_resource'))
          strategy = ngTiddleAuthProvider.getSignInStrategy()
          model_name = ngTiddleAuthProvider.getModelName()
          config.headers["X-#{model_name}-#{strategy}".toUpperCase()] = resource[strategy]
          config.headers["X-#{model_name}-TOKEN".toUpperCase()] = ngTiddleSessionService.getToken()
        config

      responseError: (e) ->
        if e.status is 401
          ngTiddleSessionService.clear()
          ngTiddleAuthProvider.onUnauthorized()
        $q.reject(e)
    }
