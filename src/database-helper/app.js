// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const ServerlessClient = require('serverless-postgres')

const client = new ServerlessClient({
    user: 'postgres',
    host: 'iotdatabase.cuxjnv65wifa.us-east-2.rds.amazonaws.com',
    database: 'postgres',
    password: '12345678',
    port: '5432',
    debug: true,
    delayMs: 3000,
});

async function get_detergent_amount(device_id) {
  
  console.log("--************sdf3333332--->>>");
  await client.connect();
  const result = await client.query("SELECT detergent_amount from logs where detergen_amount <> -1 and device_id = '${device_id}' ORDER BY record_id dec limit 1; ");
  await client.clean();
  console.log("-- 👉️ 👉️ 👉️ 👉️***sorun burda mı ?'?'?");

  if (result.rows.length == 0) {
    return -1;
  }
  return result.rows[0].detergent_amount;
}

async function get_softener_amount(device_id) {
   
  await client.connect();
  const result = await client.query("SELECT softener_amount from logs where softener_amount <> -1 and device_id = '${device_id}' ORDER BY record_id dec limit 1;");
  await client.clean();

  if (result.rows.length == 0) { 
    return -1;
  } 
  return result.rows[0].softener_amount;
}


exports.lambdaHandler = async (event, context) => { 
  console.log("/*/*/*/event", event);
    try { 
        // event.body is empty mean is request come from iot device
      let result; 
      if (event.body == null || event.body == '') { 
          // TODO: search get data from İOT RULE

          // await client.connect();
          // ????
          // const result = await client.query('INSERT INTO logs(device_id, softener_amount, detergent_amount, request_owner) * from logs VALUES(' + postrequest.device_id + ',' + postrequest.softener_amount + ',' + postrequest.detergent_amount + ', portal));)');
          // await client.clean();
          return
      }
    
      var postrequest = JSON.parse(event.body)
      if (postrequest.operation == "decrease") {
        // not given value will be retieved from database. ex: portal-url/WG_WM_1245… /softener?amount=200 request, detergent will be retieved from database as last value 
        postrequest.softener_amount == -1 ? postrequest.softener_amount =  get_softener_amount(postrequest.device_id) : postrequest.deterent_amount = get_detergent_amount(postrequest.device_id); 
        
        await client.connect();
        result = await client.query("INSERT INTO logs(device_id, softener_amount, detergent_amount, request_owner) VALUES('" + postrequest.device_id + "','" + postrequest.softener_amount + "','" + postrequest.detergent_amount + "', 'portal');");
        await client.clean();
      }
      else if (postrequest.operation == "retrieve") {
        await client.connect();
        result = await client.query(`SELECT * from logs`);
        await client.clean();
      } 
      return {
        body: JSON.stringify({message: "insert operation is successfull"}),
        statusCode: 200
      }
    } catch (err) {
        console.log(err);
        return err;
    }        
};

//function selec
