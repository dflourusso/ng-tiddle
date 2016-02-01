class NgTiddleAuth extends Provider
  constructor: ->
    @api_root = 'http://localhost:3000/'
    @model_name = 'user'
    @sign_in_strategy = 'email'
    @api_resource_path = 'users'

    @$get = ->
      getApiRoot: => @api_root
      setApiRoot: (api_root) => @api_root = api_root

      getModelName: => @model_name
      setModelName: (model_name) => @model_name = model_name

      getSignInStrategy: => @sign_in_strategy
      setSignInStrategy: (sign_in_strategy) => @sign_in_strategy = sign_in_strategy

      getApiResourcePath: => @api_resource_path
      setApiResourcePath: (api_resource_path) => @api_resource_path = api_resource_path

      onUnauthorized: -> console.warn 'No unauthorized callback was defined'
      onAuthorize: (auth_data) -> console.info 'No authorize callback was defined', auth_data
