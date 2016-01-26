class PushInterceptors extends Config
  constructor: ($httpProvider) ->
    $httpProvider.interceptors.push 'NgTiddleInterceptor'
