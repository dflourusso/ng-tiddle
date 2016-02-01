(function() {
  var KvStorage, NgTiddleApp, NgTiddleAuth, NgTiddleInterceptor, NgTiddleSession, PushInterceptors;

  NgTiddleApp = (function() {
    function NgTiddleApp() {
      return [];
    }

    return NgTiddleApp;

  })();

  angular.module('ng-tiddle', new NgTiddleApp());

  PushInterceptors = (function() {
    function PushInterceptors($httpProvider) {
      $httpProvider.interceptors.push('NgTiddleInterceptor');
    }

    return PushInterceptors;

  })();

  angular.module('ng-tiddle').config(['$httpProvider', PushInterceptors]);

  NgTiddleInterceptor = (function() {
    function NgTiddleInterceptor($q, ngTiddleSessionService, ngTiddleAuthProvider) {
      var strategy;
      strategy = ngTiddleAuthProvider.getSignInStrategy();
      return {
        request: function(config) {
          var model_name;
          if (ngTiddleSessionService.getResource()) {
            model_name = ngTiddleAuthProvider.getModelName();
            config.headers[("X-" + model_name + "-" + strategy).toUpperCase()] = ngTiddleSessionService.getResource()[strategy];
            config.headers[("X-" + model_name + "-TOKEN").toUpperCase()] = ngTiddleSessionService.getToken();
          }
          return config;
        },
        responseError: (function(_this) {
          return function(e) {
            if (e.status === 401) {
              ngTiddleAuthProvider.onUnauthorized();
            }
            return $q.reject(e);
          };
        })(this)
      };
    }

    return NgTiddleInterceptor;

  })();

  angular.module('ng-tiddle').factory('NgTiddleInterceptor', ['$q', 'ngTiddleSessionService', 'ngTiddleAuthProvider', NgTiddleInterceptor]);

  NgTiddleAuth = (function() {
    function NgTiddleAuth() {
      this.properties = {
        api_root: 'http://localhost:3000/',
        model_name: 'user',
        sign_in_strategy: 'email',
        api_resource_path: 'users'
      };
      this.$get = function() {
        var properties;
        properties = this.properties;
        return {
          getApiRoot: function() {
            return properties.api_root;
          },
          setApiRoot: function(api_root) {
            return properties.api_root = api_root;
          },
          getModelName: function() {
            return properties.model_name;
          },
          setModelName: function(model_name) {
            return properties.model_name = model_name;
          },
          getSignInStrategy: function() {
            return properties.ign_in_strategy;
          },
          setSignInStrategy: function(sign_in_strategy) {
            return properties.ign_in_strategy = sign_in_strategy;
          },
          getApiResourcePath: function() {
            return properties.api_resource_path;
          },
          setApiResourcePath: function(api_resource_path) {
            return properties.api_resource_path = api_resource_path;
          },
          onUnauthorized: function() {
            return console.warn('No unauthorized callback was defined');
          },
          onAuthorize: function(auth_data) {
            return console.info('No authorize callback was defined', auth_data);
          }
        };
      };
    }

    return NgTiddleAuth;

  })();

  angular.module('ng-tiddle').provider('ngTiddleAuthProvider', [NgTiddleAuth]);

  NgTiddleAuth = (function() {
    function NgTiddleAuth($http, ngTiddleSessionService, ngTiddleAuthProvider) {
      this.$http = $http;
      this.ngTiddleSessionService = ngTiddleSessionService;
      this.tap = ngTiddleAuthProvider;
      this.sign_in_params = {};
    }

    NgTiddleAuth.prototype.signIn = function(resource) {
      var path, ret;
      path = (this.tap.getApiRoot()) + "/" + (this.tap.getApiResourcePath()) + "/sign_in";
      this.sign_in_params[this.tap.getModelName()] = resource;
      ret = this.$http.post(path, this.sign_in_params);
      ret.then((function(_this) {
        return function(response) {
          _this.ngTiddleSessionService.setResource(response.data[_this.tap.getModelName()], response.data.authentication_token);
          return _this.tap.onAuthorize(response.data);
        };
      })(this));
      return ret;
    };

    NgTiddleAuth.prototype.signOut = function() {
      return this.$http["delete"]((this.tap.getApiRoot()) + "/" + (this.tap.getApiResourcePath()) + "/sign_out").then((function(_this) {
        return function() {
          _this.ngTiddleSessionService.clear();
          return _this.tap.onUnauthorized();
        };
      })(this));
    };

    return NgTiddleAuth;

  })();

  angular.module('ng-tiddle').service('ngTiddleAuthService', ['$http', 'ngTiddleSessionService', 'ngTiddleAuthProvider', NgTiddleAuth]);

  NgTiddleSession = (function() {
    function NgTiddleSession(kvStorageService, ngTiddleAuthProvider1) {
      this.kvStorageService = kvStorageService;
      this.ngTiddleAuthProvider = ngTiddleAuthProvider1;
    }

    NgTiddleSession.prototype.setResource = function(resource, token) {
      if (!resource) {
        this.clear();
        return;
      }
      try {
        this.kvStorageService.tiddle_token = token;
      } catch (undefined) {}
      this.kvStorageService.tiddle_resource = JSON.stringify(resource);
      return this.resource = resource;
    };

    NgTiddleSession.prototype.getResource = function() {
      if (!this.kvStorageService.tiddle_resource) {
        this.ngTiddleAuthProvider.onUnauthorized();
        return;
      }
      return this.resource = JSON.parse(this.kvStorageService.tiddle_resource);
    };

    NgTiddleSession.prototype.getToken = function() {
      return this.kvStorageService.tiddle_token;
    };

    NgTiddleSession.prototype.clear = function() {
      try {
        delete this.kvStorageService.tiddle_resource;
        delete this.kvStorageService.tiddle_token;
        return this.resource = void 0;
      } catch (undefined) {}
    };

    return NgTiddleSession;

  })();

  angular.module('ng-tiddle').service('ngTiddleSessionService', ['kvStorageService', 'ngTiddleAuthProvider', NgTiddleSession]);

  KvStorage = (function() {
    function KvStorage() {
      if (window.cordova || window.NATIVE) {
        return window.localStorage;
      }
      if (window.localStorage) {
        return window.localStorage;
      }
      if (window.sessionStorage) {
        return window.sessionStorage;
      }
      return {
        clear: function() {}
      };
    }

    return KvStorage;

  })();

  angular.module('ng-tiddle').service('kvStorageService', [KvStorage]);

}).call(this);
