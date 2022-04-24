sam build 
sam deploy --guided

package name = serverless-postgres

psql --host=iotdatabase.cuxjnv65wifa.us-east-2.rds.amazonaws.com --port=5432  --username=postgres --password=12345678 --dbname=postgres

product_code VARCHAR(50) NOT NULL,


CREATE TABLE IF NOT EXISTS decrease_logs (
   record_id SERIAL  PRIMARY KEY,
   device_id VARCHAR(40) NOT NULL, 
   softener_amount INT NOT NULL,
   detergent_amount INT NOT NULL,
   time DATETIME DEFAULT now(),
   request_owner VARCHAR(12) NOT NULL
);
\dt
\d logs

INSERT INTO decrease_logs(device_id, softener_amount, detergent_amount, request_owner) VALUES ('WG_WM_562', 70, 150, 'PORTAL')

