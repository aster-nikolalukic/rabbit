
# Rabbit
### version 0.0.1
### Fullstack web platform based on node.js and mongoDB.


![rabbit api](https://github.com/aster-nikolalukic/rabbit/blob/main/astermedia.net.png)

## Installation Prerequisites

### 1) Install npm modules:
```js
npm i
```
### 2) Goto:
https://www.mongodb.com/try/download/community
and select best fix installer for your system. Install it on yor system.
(For windows: it is by default mongod will be installed like services)

### 3) Setup database:

Running `MongoDB`:
```bash
mongod --dbpath database/data --bind_ip <DOMAIN>
```

Running terminal connection:
[optimal] If you wanna see it. Attach to mongoDB service.
```js
  mongo --host IP-ADDRESS-OF-MONGODB-SERVER --port PORT_NUMBER
```

### For localhost no need port specification.

Running `MongoDB`:
```
mongod --dbpath data --bind_ip localhost
```

Running terminal connection:
[optimal] If you wanna see it. Attach to mongoDB service.
```
  mongo --host localhost
```


## Running Rabbit Api Server

```js
npm run dev.api
```


## Test API:
#### Always use chrome or any other browser console debugger for testing your api calls.
#### Because web app works only on browsers not on `other` help tools.

### Test from browser console:

  From http://localhost/
- ### Login:

```js
  fetch("http://localhost:8080/rocket/login/", { method: 'POST', headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },  body: JSON.stringify( { emailField: "zlatnaspirala@gmail.com",
                                passwordField: 'sifra123'})  } ).
   then(response => response.json()).
   then(data => console.log(data)).
   catch(err => console.log(err));
```


## Frontend

### Comming in different solution vanillajs, vue, reactjs.

### Web Client [frontend]

   Project Stored at `frontend\web`.

   ```
   npm i
   ```

   ```
   npm run build.web
   ```

