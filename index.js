const express= require("express")
const crypto = require('crypto');
const cors= require("cors")
const https = require('https');
const app= express()
app.use(cors())

//parameters
var accessKey = 'klm05TvNBzhg7h7j';
var secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMOBKUN20180529';
var redirectUrl = 'https://webhook.site/55e5a535-be72-4e2f-bf5e-0ca957939dcf';
var ipnUrl = 'https://webhook.site/55e5a535-be72-4e2f-bf5e-0ca957939dcf';
var requestType = "payWithMethod";
var amount = '50000';   
var orderId = partnerCode + new Date().getTime();
var requestId = orderId;
var extraData ='';
var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
var orderGroupId ='';
var autoCapture =true;
var lang = 'vi';

//before sign HMAC SHA256 with format
//accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//puts raw signature
// console.log("--------------------RAW SIGNATURE----------------")
// console.log(rawSignature)
//signature
var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
// console.log("--------------------SIGNATURE----------------")
// console.log(signature)

//json object send to MoMo endpoint

//Create the HTTPS objects
const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
    }
}

app.post("/payment-momo", (request, response)=> {
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    //Send the request and get the response
    const req = https.request(options, res => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body: ');
            response.json(JSON.parse(body))
            console.log('resultCode: ');
            console.log(JSON.parse(body).resultCode);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    })
    
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....")
    req.write(requestBody);
    req.end();
})

app.listen(4000, ()=> console.log("Server run on port ..."))