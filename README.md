# Ng Tiddle Auth

---
## Instalação

`bower install ng-tiddle --save`

## Como usar

### Inclua o *Javascript* no seu projeto.

    <script src="../dist/ng-tiddle.js"></script>`


### Adicione em seu módulo angular:

    angular.module('app', ['ng-tiddle'])

### Configure as rotas e callbacks para a diretiva utilizando o *ngTiddleAuthProvider*:
> Altere de acordo com sua aplicação.
 Exemplo para alterar uma configuração: `ngTiddleAuthProvider.setApiRoot('http://localhost:3001')`

**Configurações disponíveis:**

* `ApiRoot` -> Host da API a ser utilizada para autenticação. Ex: **http://localhost:3000**
* `SignInStrategy` -> Nome da key utilizada pelo devise para realizar a autenticação. Default: **email**
* `ApiResourcePath` -> Path base para autenticação. Ex: **users**
* `onUnauthorized:` -> Callback a ser executado quando for feita alguma requisição com usuário não logado.

 * Example:

    `ngTiddleAuthProvider.onUnauthorized = function(){console.log('Faça alguma coisa');}`

* `onAuthorize:` -> Callback a ser executado quando login for realizado com sucesso.

 * Example:

    `ngTiddleAuthProvider.onAuthorize = function(auth_data){console.log(auth_data);}`


### Efetuar **signIn**

Utilize o service **ngTiddleAuthService**.

Ex: `ngTiddleAuthService.signIn({email: '', password: ''})`

### Efetuar **signOut**

Utilize o service **ngTiddleAuthService**.

Ex: `ngTiddleAuthService.signOut()`

### Obter usuário logado

Utilize o service **ngTiddleSessionService**.

Ex: `ngTiddleSessionService.getResource()`
