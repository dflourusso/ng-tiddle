# Ng Tiddle Auth

A simple implementation to integrate with the *Rails Gem [Tiddle](https://github.com/adamniedzielski/tiddle)*

---
### Installation

    $ bower install ng-tiddle --save

### Usage

Include the plugin in your application:

```html
<script src="../dist/ng-tiddle.js"></script>`
```

And then include the *AngularJs* module:

```javascript
angular.module('app', ['ng-tiddle']);
```

### Configuration

#### Provider

Create a AngularJs **run** to set `ngTiddleAuthProvider` configurations.

```javascript
angularApp.run(['ngTiddleAuthProvider', function(ngTiddleAuthProvider) {
    return ngTiddleAuthProvider.setApiRoot('http://localhost:3000');
  }
])
```

**Available options:**

* `ApiRoot` -> API url used to authentication:

  ```javascript
  ngTiddleAuthProvider.setApiRoot('http://localhost:3000');
  ```

* `SignInStrategy` -> Devise strategy used to authentication. Default: **email**:

  ```javascript
  ngTiddleAuthProvider.setSignInStrategy('email');
  ```

* `ApiResourcePath` -> Url path used to authentication:

  ```javascript
  ngTiddleAuthProvider.setApiResourcePath('users');
  ```

* `ModelName` -> Name of your model:

  ```javascript
  ngTiddleAuthProvider.setModelName('user');
  ```

* `onUnauthorized:` -> Callback to be called when the application receive some response with code *401 - Unauthorized* from the server:

  ```javascript
  ngTiddleAuthProvider.onUnauthorized = function(){$location.path('/auth/login');}
  ```

* `onAuthorize:` -> Callback a ser executado quando login for realizado com sucesso.

  ```javascript
  ngTiddleAuthProvider.onAuthorize = function(auth_data){
    $location.path('/app/home');
  }
  ```

### Using the services

#### `ngTiddleAuthService`

Do SignIn:

```javascript
ngTiddleAuthService.signIn({email: '', password: ''});
```

Do SignOut:

```javascript
ngTiddleAuthService.signOut();
```

#### `ngTiddleSessionService`

Get user logged:

```javascript
ngTiddleSessionService.getResource();
```

### Author

[Daniel Fernando Lourusso](http://dflourusso.com.br)
