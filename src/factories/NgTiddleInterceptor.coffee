class NgTiddleInterceptor extends Factory
  constructor: ($q, $timeout, ngTiddleSessionService, ngTiddleAuthProvider, ngTiddleStorageService) ->
    return {
      request: (config) ->
        _api_regexp = new RegExp(ngTiddleAuthProvider.getApiRoot().match('^(?:https?:)?(?:\/\/)?([^\/\?]+)')[1])
        _resource = ngTiddleStorageService.get('tiddle_resource')
        if _api_regexp.test(config.url) && _resource
          strategy = ngTiddleAuthProvider.getSignInStrategy()
          model_name = ngTiddleAuthProvider.getModelName()
          config.headers["X-#{model_name}-#{strategy}".toUpperCase()] = _resource[strategy]
          config.headers["X-#{model_name}-TOKEN".toUpperCase()] = ngTiddleSessionService.getToken()
        config

      responseError: (e) ->
        if e.status is 401
          ngTiddleSessionService.clear()
          $timeout((=> ngTiddleAuthProvider.onUnauthorized()), 0)
        $q.reject(e)
    }
