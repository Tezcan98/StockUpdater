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
  console.log("/*/*/*/event", event);
  console.log("//*/*/*/context", context);
  let result;
  try {
    // const ret = await axios(url);
		amount = event.queryStringParameters.amount;  
		paths = event.path.split('/');
		device_id = event.pathParameters.deviceID;
		detergent_amount = softener_amount = -1;  // -1 means data that not be given will be retieved from database as last value
		event.pathParameters.productType == 'softener' ? softener_amount = amount :  detergent_amount = amount // determine which one is given
		
		result = await postRequest({
		  operation : "decrease",
		  device_id: device_id,
		  softener_amount : softener_amount,
		  detergent_amount : detergent_amount
  });
	 
  
  response = {
      'statusCode': 200,
        body: JSON.stringify(result),
  }
  } catch (err) {
      console.log(err);
      return err;
  }

  return response
};
