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
    database: 'iotstokdata',
    password: '12345678',
    port: '5432',
    debug: true,
    delayMs: 3000,
});

exports.lambdaHandler = async (event, context) => {
    try {
		await client.connect();
		const result = await client.query(`SELECT 1+1 AS result`);
		await client.clean();
		return {
		  body: JSON.stringify({message: result.rows[0]}),
		  statusCode: 200
		}
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
