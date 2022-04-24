let response;
const https = require('https');


function postRequest(body) {
    const options = {
      hostname: 'hk0aff9ydd.execute-api.us-east-2.amazonaws.com',
      path: '/Stage/database',
      method: 'POST',
      port: 443, 
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let rawData = '';
  
        res.on('data', chunk => {
          rawData += chunk;
        });
  
        res.on('end', () => {
          try {
            resolve(JSON.parse(rawData));
          } catch (err) {
            reject(new Error(err));
          }
        });
      });
  
      req.on('error', err => {
        reject(new Error(err));
      });
  
      // 👇️ write the body to the Request object
      req.write(JSON.stringify(body));
      req.end();
    });
} 

exports.lambdaHandler = async (event, context) => {
    let device_id, detergent_amount, softener_amount, request_owner;
    try {
        // event.device_id is not empty's mean is request come from iot device
        if (event.device_id != null || event.device_id != '') {
            device_id =  event.device_id;
            product_code = event.product_code;
            product_type = event.product_type;
            product_id = event.product_id;
            vendor_id = event.vendor_id;
            request_owner = "DEVICE";
        } 
        else {
            amount = event.queryStringParameters.amount;   
            device_id = event.pathParameters.deviceID;
            productInfos = event.pathParameters.productInfos.split('-');
            product_code = productInfos[0];
            product_type = productInfos[1];
            product_id  = productInfos[2];
            vendor_id = event.queryStringParameters.vendorId;
            request_owner = "PORTAL";
        }
        let result = await postRequest({
            operation : "increase",
            device_id : device_id,
            product_code : product_code,
            product_type : product_type,
            product_id : product_id,
            vendor_id : vendor_id,
            request_owner : request_owner
        });
        response = {
            'statusCode': 200,
                body: JSON.stringify(result),
        }
        return response
        } catch (err) {
            console.log(err);
            return err;
        }
};
