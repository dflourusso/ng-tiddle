class NgTiddleAuth extends Provider
  constructor: ->
    @properties =
      api_root: 'http://localhost:3000/'
      model_name: 'user'
      sign_in_strategy: 'email'
      api_resource_path: 'users'

    @$get = ->
      properties = @properties

      getApiRoot: -> properties.api_root
      setApiRoot: (api_root) -> properties.api_root = api_root

      getModelName: -> properties.model_name
      setModelName: (model_name) -> properties.model_name = model_name

      getSignInStrategy: -> properties.ign_in_strategy
      setSignInStrategy: (sign_in_strategy) -> properties.ign_in_strategy = sign_in_strategy

      getApiResourcePath: -> properties.api_resource_path
      setApiResourcePath: (api_resource_path) -> properties.api_resource_path = api_resource_path

      onUnauthorized: -> console.warn 'No unauthorized callback was defined'
      onAuthorize: (auth_data) -> console.info 'No authorize callback was defined', auth_data
