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
      this.api_root = 'http://localhost:3000/';
      this.model_name = 'user';
      this.sign_in_strategy = 'email';
      this.sign_in_path = '/auth/sign_in';
      this.return_path = '/';
      this.api_resource_path = 'users';
      this.$get = function($location) {
        return {
          getApiRoot: (function(_this) {
            return function() {
              return _this.api_root;
            };
          })(this),
          setApiRoot: (function(_this) {
            return function(api_root) {
              return _this.api_root = api_root;
            };
          })(this),
          getModelName: (function(_this) {
            return function() {
              return _this.model_name;
            };
          })(this),
          setModelName: (function(_this) {
            return function(model_name) {
              return _this.model_name = model_name;
            };
          })(this),
          getSignInStrategy: (function(_this) {
            return function() {
              return _this.sign_in_strategy;
            };
          })(this),
          setSignInStrategy: (function(_this) {
            return function(sign_in_strategy) {
              return _this.sign_in_strategy = sign_in_strategy;
            };
          })(this),
          getSignInPath: (function(_this) {
            return function() {
              return _this.sign_in_path;
            };
          })(this),
          setSignInPath: (function(_this) {
            return function(sign_in_path) {
              return _this.sign_in_path = sign_in_path;
            };
          })(this),
          getReturnPath: (function(_this) {
            return function() {
              return _this.return_path;
            };
          })(this),
          setReturnPath: (function(_this) {
            return function(return_path) {
              return _this.return_path = return_path;
            };
          })(this),
          getApiResourcePath: (function(_this) {
            return function() {
              return _this.api_resource_path;
            };
          })(this),
          setApiResourcePath: (function(_this) {
            return function(api_resource_path) {
              return _this.api_resource_path = api_resource_path;
            };
          })(this),
          onUnauthorized: (function(_this) {
            return function() {
              return $location.path(_this.sign_in_path);
            };
          })(this),
          onAuthorize: (function(_this) {
            return function() {
              return $location.path(_this.return_path);
            };
          })(this)
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
          return _this.tap.onAuthorize();
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
    function NgTiddleSession(kvStorageService) {
      this.kvStorageService = kvStorageService;
    }

    NgTiddleSession.prototype.setResource = function(resource, token) {
      if (!resource) {
        this.clear();
        return;
      }
      try {
        this.kvStorageService.token = token;
      } catch (undefined) {}
      this.kvStorageService.resource = JSON.stringify(resource);
      return this.resource = resource;
    };

    NgTiddleSession.prototype.getResource = function() {
      if (this.kvStorageService.resource) {
        return this.resource = JSON.parse(this.kvStorageService.resource);
      }
    };

    NgTiddleSession.prototype.getToken = function() {
      return this.kvStorageService.token;
    };

    NgTiddleSession.prototype.clear = function() {
      try {
        delete this.kvStorageService.resource;
        delete this.kvStorageService.token;
        return this.resource = void 0;
      } catch (undefined) {}
    };

    return NgTiddleSession;

  })();

  angular.module('ng-tiddle').service('ngTiddleSessionService', ['kvStorageService', NgTiddleSession]);

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
