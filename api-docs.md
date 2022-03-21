
# API LIST

### rabbit/login
```js
  fetch("http://localhost:8080/rabbit/login/", { method: 'POST', headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },  body: JSON.stringify( { emailField: "zlatnaspirala@gmail.com",
                                passwordField: '123123123'}) }).
   then(response => response.json()).
   then(data => console.log(data)).
   catch(err => console.log(err));
```

### Response
```json
{
    "message": "User logged",
    "rabbitStatus": "USER_LOGGED",
    "flag": {
        "status": "USER_LOGGED",
        "email": "zlatnaspirala@gmail.com",
        "nickname": "no0",
        "points": 100,
        "rank": "junior",
        "token": "1GNTM4"
    }
}
```
