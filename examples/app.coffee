angular.module('app', ['ng-tiddle'])

.run( ['ngTiddleAuthProvider', (ngTiddleAuthProvider) ->
  ngTiddleAuthProvider.setModelName 'usuario'
  ngTiddleAuthProvider.setApiRoot 'http://localhost:3000'
])

.controller 'ctrl', ['$scope', 'ngTiddleAuthService', ($scope, ngTiddleAuthService) ->
  $scope.usuario = {email: '', password: ''}

  $scope.signIn = ->
    ngTiddleAuthService.signIn $scope.usuario
    .catch (e) ->
      # Handle the error

  $scope.signOut = ->
    ngTiddleAuthService.signOut()
]
