(function() {
  angular.module('app', ['ng-tiddle']).run([
    'ngTiddleAuthProvider', function(ngTiddleAuthProvider) {
      ngTiddleAuthProvider.setModelName('usuario');
      return ngTiddleAuthProvider.setApiRoot('http://localhost:3000');
    }
  ]).controller('ctrl', [
    '$scope', 'ngTiddleAuthService', function($scope, ngTiddleAuthService) {
      $scope.usuario = {
        email: '',
        password: ''
      };
      $scope.signIn = function() {
        return ngTiddleAuthService.signIn($scope.usuario)["catch"](function(e) {});
      };
      return $scope.signOut = function() {
        return ngTiddleAuthService.signOut();
      };
    }
  ]);

}).call(this);
