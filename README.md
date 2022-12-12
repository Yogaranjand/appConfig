


## About the task
I have set up an AWS AppConfig in my test AWS account.
As part of process I have uploaded a json file similar to src/config/config-data.json to s3 and took that as the configuration in App Config. 

In the helper/environment.ts, please find the parameters to invoke AWS API.Please modify that as per your App Config in AWS. For Instance, need to change the ApplicationIdentifier, ConfigurationProfileIdentifier and EnvironmentIdentifier property accordingly.

To test the API please trigger http://localhost:3000/config/


### Prerequisites
This project is set up with NodeJS LTS version 14 in mind https://nodejs.org/download/release/latest-v14.x with a
default packaged NPM

### Installation
1. Install the dependencies
   ```sh
   npm install
   ```
2. Run the service
   ```sh
   npm start
   ```
   
### Testing
1. Run the tests
   ```sh
   npm test
   ```
