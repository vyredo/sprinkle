A very fast Webserver which has interface like springboot

<br/>

#### Background note
<p style="font-size:12px; ">
This project is based on https://github.com/lambdaAgent/typescript_express, which I created on end of  2018.
The idea is to have Springboot interfaces on top of express.
But I switch from express.js to <a href="https://github.com/uNetworking/uWebSockets">microwebsocket.js</a> by alex.hutman because of the extremely fast server that he created.
</p>

## Motivation:
I am impressed with the simplicity of springboot controllers.
With very little and readable configuration, programmer can define an Http endpoint, adding validation and even generate swagger with this simple configuration.

## Example

```

router
    .get("/hello")
    .QueryString('test', Joi.string().required())
    .Apply((RESULtT, req, res) => {
         res.json({'hello': 'vidy'})
    })

```