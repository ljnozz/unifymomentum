# seafile-api

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

`seafile-api` is a small npm module for accessing the [Seafile Web API](http://manual.seafile.com/develop/web_api.html) and thus controlling a [Seafile](https://www.seafile.com/en/home/) instance from within a Node.js application.

> **Though there are quite many API methods, at the moment this module just implements a small subset of the available functions.**

# Documentation
## Installation
```
$ npm install seafile-api
```

## Initialization
You will need a valid access token to make API requests. See the API docs for further information on how to obtain a token: [Web API | Quick Start](http://manual.seafile.com/develop/web_api.html#quick-start).
At the moment, this module does not support obtainment of access tokens.

```js
var SeafileAPI = require('seafile-api');
var sf = new SeafileAPI('https://cloud.seafile.com', 'accesstoken123456789');
```

## Usage

See the official [API docs](http://manual.seafile.com/develop/web_api.html) for detailed information about the methods and used parameters.
Default values are used if optional parameters are not set.


### listAccounts(params, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#list-accounts)

```js
sf.listAccounts({
  start: 0,
  limit: 100,
  scope: 'DB'
}, function(err, accounts, httpcode){
  if(err) console.error('Error:', err);
  console.log(accounts);
});
```

* All parameters are optional


### getAccountInfo(email, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#get-account)

```js
sf.getAccountInfo('johndoe@example.com', function(err, body, httpcode){
    console.log(body);
});
```


### createAccount(params, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#create-account)

```js
sf.createAccount({
  email: 'johndoe@example.com',
  password: 'foobar123',
  is_staff: 0,
  is_active: 1
}, function(err, data, httpcode){
  console.log(data);
});
```

* `email`: required
* `password`: required
* `is_staff`: optional
* `is_active`: optional


### updateAccount(params, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#update-account)

```js
sf.updateAccount({
  email: 'johndoe@example.com',
  name: 'John Doe',
  is_staff: 0,
  is_active: 1
}, function(err, body, httpcode){
  console.log(body);
});
```

* `email`: required
* all other params are optional


### deleteAccount(email, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#delete-account)

```js
sf.deleteAccount('johndoe@example.com', function(err, body, httpcode){
  console.log(body);
});
```



### addGroupMember(options, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#add-a-group-member)

```js
sf.addGroupMember({
  user_name: 'johndoe@example.com',
  group_id: 1
}, function(err, body){
    console.log(body);
});
```

* `user_name`: required
* `group_id`: required

### deleteGroupMember(options, callback)
[Seafile API Docs](http://manual.seafile.com/develop/web_api.html#delete-a-group-member)

```js
sf.deleteGroupMember({
  user_name: 'johndoe@example.com',
  group_id: 1
}, function(err, body){
    console.log(body);
});
```

* `user_name`: required
* `group_id`: required


# License
[MIT](https://opensource.org/licenses/MIT)


[npm-image]: https://img.shields.io/npm/v/seafile-api.svg
[npm-url]: https://npmjs.org/package/seafile-api
[node-version-image]: http://img.shields.io/node/v/seafile-api.svg
[node-version-url]: http://nodejs.org/download/
[downloads-image]: https://img.shields.io/npm/dm/seafile-api.svg
[downloads-url]: https://npmjs.org/package/seafile-api
