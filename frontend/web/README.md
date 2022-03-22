
# Rabbit WebClient
### HTML/CSS/JS VanillaJS

Navigate to the `frontend\web` and run:
```
npm i
```

 - No need for build when you work on localhost.
 - No need for hosting if you use default rabbit api config:

```js
  /**
   * @description
   * Run web app host or not.
   */
  get ownHosting() {
    return true;
  }

  /**
   * @description
   * Keep it simple,
   * It is recommended to use standard ports.
   * [80, 443] to avoid cors and other problems.
   */
    get ownHttpHostPort() {
    return 80;
  }
```
