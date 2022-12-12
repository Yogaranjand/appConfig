import { API_PARAMETER } from './helper/environment';
import { Store, StartConfigSession, LatestConfig, ConfigInformation } from './interfaces/configModel';
const fs = require('fs-extra')
const AWS = require('aws-sdk');
const path = require('path');
const appconfig = new AWS.AppConfigData({apiVersion: '2021-11-11', region: 'us-east-1'});

const getLatestConfig = Symbol('getLatestConfig');
const getInitialConfigToken = Symbol('getInitialConfigToken');
const readConfigFile = Symbol('readConfigFile');
const validateFrequentRequest = Symbol('validateFrequentRequest');

const store:Store = {
  token : "",
  lastinvoketime : 0
};
const configFilePath:string = path.join(process.cwd(), './src/config/config-data.json');

export class ConfigHelper {
  constructor() {}

  //This method will create the initial session token and invoke the getLatestConfig
  async [getInitialConfigToken]():Promise<LatestConfig> {
    store.token = 'some Value';
    console.log("orinting once");
    const response:StartConfigSession = await appconfig.startConfigurationSession(API_PARAMETER).promise();
    store.token = response.InitialConfigurationToken;
    console.log("store.token insidie getInitialConfigToken ===" , store.token);
    const config:LatestConfig = await this[getLatestConfig]();
    return config;
  }

  async [getLatestConfig]():Promise<LatestConfig> {
    console.log("this is main method");
    const params = {
      ConfigurationToken: store.token
    };
    const response:LatestConfig = await appconfig.getLatestConfiguration(params).promise();
    console.log("response.NextPollConfigurationToken ===", response.NextPollConfigurationToken)
    store.token = response.NextPollConfigurationToken;
    return response;
  }

  async [readConfigFile](filepath):Promise<ConfigInformation> {
    return await fs.readJSON(filepath);
  }

  [validateFrequentRequest]():Boolean {
    let lastInvoked:number = store.lastinvoketime;
    if (store.lastinvoketime) {
      let currentTime:number = new Date().getTime();
      let timeDiff:number = (currentTime - lastInvoked)/1000;
      if (timeDiff < API_PARAMETER.RequiredMinimumPollIntervalInSeconds) {
        return true;
      }
    }
    return false;
  }

  async getAppConfigInformation():Promise<ConfigInformation> {
    let configInformation:ConfigInformation;
    try {
      // if we receive multiple call within a minute which is the configured value
      const isTooManyRequest = this[validateFrequentRequest]();
      if (isTooManyRequest) {
        return await this[readConfigFile](configFilePath);
      }
      console.log("store.token insidie getAppConfigInformation ===",store.token);
      const response = (!store.token) ? await this[getInitialConfigToken]() : await this[getLatestConfig]();
      store.lastinvoketime = new Date().getTime();

      //As per the AWS documentaion response sometimes can be blank
      if (response.Configuration.toString()) {
        configInformation = JSON.parse(response.Configuration.toString())
      } else {
        configInformation = await this[readConfigFile](configFilePath);
      }

    } catch(error) {
      console.log(error);
      // if any error in the API we should read from the local file
      configInformation = await this[readConfigFile](configFilePath);
    }
    return configInformation;
  }

}