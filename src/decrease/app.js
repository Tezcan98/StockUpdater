let response;

const https = require('https');

function postRequest(body) {
  const options = {
    hostname: 'https://44jadrt1yj.execute-api.us-east-2.amazonaws.com',
    path: '/Stage/database',
    method: 'POST',
    port: 80, // 👈️ replace with 80 for HTTP requests  443
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
		//console.log("event", event);
		//console.log("context", context);
		
		parameters = event.queryStringParameters; 
		
		
		const result = await postRequest({
		  device_id: 'WG_WM_562',
		  softener_amount: 70,
		  detergent_amount : 150
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
