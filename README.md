
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


[If you already have running mongoDB services no need fot this line]
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

[If you already have running mongoDB services no need fot this line]
Running `MongoDB`:
```
mongod --dbpath data --bind_ip localhost
```

Running terminal connection:
[optimal] If you wanna see it. Attach to mongoDB service.
```
  mongo --host localhost
```

If everything is allright after command `mongo --host localhost`
you will be promted to the `MongoDB shell version v4.4.2`
 Then run this:
```bash
 show dbs
```

#### Output:
```
> show dbs
admin         0.000GB
config        0.000GB
local         0.000GB
rabbit-base1  0.000GB
```

```
use rabbit-base1
```

#### Output:
```
switched to db rabbit-base1
```

And let list out users: 
```
db.users.find({})

or use filters:

db.users.find({email:'zlatnaspirala@gmail.com'})
```

It means your mongo server is ready for operate.

## Optimal but great to have

 Download Compass GUI:
 https://www.mongodb.com/try/download/compass

 To get visual database preview!

![](https://github.com/aster-nikolalukic/rabbit/blob/main/documentation/compassHelp.jpg)

## Running Rabbit Api Server

```js
npm run dev.api
```

After this command by default you run RabbitAPI also own Host server on default port 80 [http].

In folder `frontend\web` you can find web client part.For this web client part no need for builds in dev regime.
Only for final production you will need to run 



## Test API:
#### Always use chrome or any other browser console debugger for testing your api calls.
#### Because web app works only on browsers not on `other` help tools.

### Test from browser console:

  From http://localhost/
- ### Login:

```js
  fetch("http://localhost:8080/rabbit/login/", { method: 'POST', headers: {
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

This only build package for production.
[No need for dev]
```
npm run build.web
```

### Performance 