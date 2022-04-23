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
  try {
    // const ret = await axios(url);
		console.log("event", event);
		console.log("context", context);
		
		amount = event.queryStringParameters; 
		paths = event.path.split('/');
		device_id = paths[2];
		detergent_amount = softener_amount = -1;  // -1 means data that not be given will be retieved from database as last value
		paths[3] == 'softener' ? softener_amount = amount :  detergent_amount = amount 
		
		const result = await postRequest({
		  operation : 'insert' ,
		  device_id: device_id,
		  softener_amount : softener_amount,
		  detergent_amount : detergent_amount
  });
	
  console.log('result is: 👉️', result);
  
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
