(function() {
  var KvStorage, NgTiddleApp, NgTiddleAuth, NgTiddleInterceptor, NgTiddleSession, PushInterceptors;

  NgTiddleApp = (function() {
    function NgTiddleApp() {
      return ['ngCookies'];
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
      return {
        request: function(config) {
          var model_name, strategy;
          if (ngTiddleSessionService.getResource()) {
            strategy = ngTiddleAuthProvider.getSignInStrategy();
            model_name = ngTiddleAuthProvider.getModelName();
            config.headers[("X-" + model_name + "-" + strategy).toUpperCase()] = ngTiddleSessionService.getResource()[strategy];
            config.headers[("X-" + model_name + "-TOKEN").toUpperCase()] = ngTiddleSessionService.getToken();
          }
          return config;
        },
        responseError: function(e) {
          if (e.status === 401) {
            ngTiddleSessionService.clear();
            ngTiddleAuthProvider.onUnauthorized();
          }
          return $q.reject(e);
        }
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
        api_resource_path: 'users',
        keep_logged_in: false
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
            return properties.sign_in_strategy;
          },
          setSignInStrategy: function(sign_in_strategy) {
            return properties.sign_in_strategy = sign_in_strategy;
          },
          getApiResourcePath: function() {
            return properties.api_resource_path;
          },
          setApiResourcePath: function(api_resource_path) {
            return properties.api_resource_path = api_resource_path;
          },
          getKeepLoggedIn: function() {
            return properties.keep_logged_in;
          },
          setKeepLoggedIn: function(keep_logged_in) {
            return properties.keep_logged_in = keep_logged_in;
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

    NgTiddleAuth.prototype.getResource = function() {
      return this.ngTiddleSessionService.getResource();
    };

    return NgTiddleAuth;

  })();

  angular.module('ng-tiddle').service('ngTiddleAuthService', ['$http', 'ngTiddleSessionService', 'ngTiddleAuthProvider', NgTiddleAuth]);

  NgTiddleSession = (function() {
    NgTiddleSession.prototype.token_prefix = 'tiddle_token';

    NgTiddleSession.prototype.resource_prefix = 'tiddle_resource';

    function NgTiddleSession(kvStorageService, ngTiddleAuthProvider1) {
      this.kvStorageService = kvStorageService;
      this.ngTiddleAuthProvider = ngTiddleAuthProvider1;
    }

    NgTiddleSession.prototype.setResource = function(resource, token) {
      if (!resource) {
        this.clear();
        return;
      }
      this.kvStorageService.put(this.token_prefix, token);
      this.kvStorageService.put(this.resource_prefix, resource);
      return this.resource = resource;
    };

    NgTiddleSession.prototype.getResource = function() {
      if (!this.kvStorageService.get(this.resource_prefix)) {
        this.ngTiddleAuthProvider.onUnauthorized();
        return;
      }
      return this.resource = this.kvStorageService.get(this.resource_prefix);
    };

    NgTiddleSession.prototype.getToken = function() {
      return this.kvStorageService.get(this.token_prefix);
    };

    NgTiddleSession.prototype.clear = function() {
      this.kvStorageService.remove(this.resource_prefix);
      this.kvStorageService.remove(this.token_prefix);
      return this.resource = null;
    };

    return NgTiddleSession;

  })();

  angular.module('ng-tiddle').service('ngTiddleSessionService', ['kvStorageService', 'ngTiddleAuthProvider', NgTiddleSession]);

  KvStorage = (function() {
    function KvStorage(ngTiddleAuthProvider1, $cookies) {
      this.ngTiddleAuthProvider = ngTiddleAuthProvider1;
      this.$cookies = $cookies;
    }

    KvStorage.prototype.storageType = function() {
      if (window.cordova || window.NATIVE) {
        return 'localStorage';
      }
      if (window.localStorage && this.ngTiddleAuthProvider.getKeepLoggedIn()) {
        return 'localStorage';
      }
      return 'cookiesStorage';
    };

    KvStorage.prototype.put = function(key, value) {
      if (this.storageType() === 'localStorage') {
        window.localStorage[key] = JSON.stringify(value);
        return;
      }
      return this.$cookies.putObject(key, value);
    };

    KvStorage.prototype.get = function(key) {
      var p;
      if (this.storageType() === 'localStorage') {
        if (p = window.localStorage[key]) {
          return JSON.parse(p);
        } else {
          return void 0;
        }
      }
      return this.$cookies.getObject(key);
    };

    KvStorage.prototype.remove = function(key) {
      if (this.storageType() === 'localStorage') {
        delete window.localStorage[key];
        return;
      }
      return this.$cookies.remove(key);
    };

    return KvStorage;

  })();

  angular.module('ng-tiddle').service('kvStorageService', ['ngTiddleAuthProvider', '$cookies', KvStorage]);

}).call(this);
