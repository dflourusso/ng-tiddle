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

* `SignInPath` -> Rota a ser redirecionado caso não esteja logado.
* `ReturnPath` -> Rota a ser redirecionado depois que o login for feito com sucesso.
* `ApiRoot` -> Host da API a ser utilizada para autenticação. Ex: **http://localhost:3000**
* `SignInStrategy` -> Nome da key utilizada pelo devise para realizar a autenticação. Default: **email**
* `ApiResourcePath` -> Path base para autenticação. Ex: **users**
* `onUnauthorized:` -> Método a ser executado quando for feita alguma requisição com usuário não logado. Por padrão ele redireciona para o **SignInPath**. Pode ser sobrescrito com uma função e abre um *pop pup* por exemplo
* `onAuthorize:` -> Método a ser executado quando login for realizado com sucesso. Por padrão ele redireciona para o **ReturnPath**. Também pode ser sobrescrito.


### Efetuar **signIn**

Utilize o service **ngTiddleAuthService**.

Ex: `ngTiddleAuthService.signIn({email: '', password: ''})`

### Efetuar **signOut**

Utilize o service **ngTiddleAuthService**.

Ex: `ngTiddleAuthService.signOut()`

### Obter usuário logado

Utilize o service **ngTiddleiSessionService**.

Ex: `ngTiddleiSessionService.getResource()`
