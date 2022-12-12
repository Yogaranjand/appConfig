const _ = require('lodash');
const path = require('path');
const expect = require('chai').use(require('chai-as-promised')).expect;
const proxyquire = require('proxyquire');
import { classicNameResolver } from 'typescript';
import { API_PARAMETER } from '../src/helper/environment';
import { StubModel } from '../src/interfaces/configModel';

describe("App Config Unit Test cases", function () {

    const filePath:string = path.join(process.cwd(), './src/configHelper.ts');
    let appConfig;
    let proxquiredModulesForAppConfig;
    const stub:StubModel = {
      startConfigurationSession : 0,
      getLatestConfiguration: 0
    };
    let appConfigData:any;

    before('configure proxyquire', function () {
        proxyquire.noCallThru();
    });

    before('setup proxyquired modules for appconfig', function () {
      proxquiredModulesForAppConfig = {
            'aws-sdk': {
                config: {
                    setPromisesDependency: _.noop,
                    update: _.noop
                },
                AppConfigData: AppConfigProviderMock
            }
        };
    });

    before('proxquire cognito', function () {
        appConfig = proxyquire(filePath, proxquiredModulesForAppConfig);
        appConfigData = new appConfig.ConfigHelper();
    });

    after('undo stubbing', function () {
        if (appConfig) {
            delete require.cache[filePath];
        }
        proxyquire.callThru();
        stub.startConfigurationSession = 0;
        stub.getLatestConfiguration = 0;
    });
    describe('ConfigHelper verify data', function () {
      it("should receive the dummy response", async() => {
        const config = await appConfigData.getAppConfigInformation();
        expect(config).to.deep.equal({name: "Yoga"});
      });
      it("should return file data when too many request", async() => {
        await appConfigData.getAppConfigInformation();
        const config = await appConfigData.getAppConfigInformation();
        expect(config).to.deep.equal({
          "Coding Challenge": true,
          "Company Name": "Invenco",
          "Name": "Sample Application"
      });
      })

      it('should return file data when there is  any error as it will read the file', async() => {
          delete API_PARAMETER?.EnvironmentIdentifier;
          const appConfigData = new appConfig.ConfigHelper();
          const config = await appConfigData.getAppConfigInformation();
          expect(config).to.deep.equal({
              "Coding Challenge": true,
              "Company Name": "Invenco",
              "Name": "Sample Application"
          });
      })
    });

    describe('ConfigHelper dependency invocation', function () {
      it('should invoke startConfigurationSession and getLatestConfiguration', async() => {
          await appConfigData.getAppConfigInformation();
          expect(stub.startConfigurationSession).to.equal(1);
          expect(stub.getLatestConfiguration).to.equal(1);
      });
      it('On second run should only invoke getLatestConfiguration', async() => {
        await appConfigData.getAppConfigInformation();
        expect(stub.startConfigurationSession).to.equal(1);
      });
    });
   

    class AppConfigProviderMock {
      constructor() {
      }
      startConfigurationSession(API_PARAMETER) {
          if (!API_PARAMETER.EnvironmentIdentifier) {
            return Promise.reject("Incorrect Param");
          } else {
            stub.startConfigurationSession = stub.startConfigurationSession + 1;
            return {
                promise: function () {
                    return {
                      InitialConfigurationToken: "some sample token"
                    };
                }
            };
      }
        }

        getLatestConfiguration(token) {
          stub.getLatestConfiguration = stub.getLatestConfiguration + 1;
            return {
                promise: function () {
                    return {
                      NextPollConfigurationToken: 'new token',
                      NextPollIntervalInSeconds: 60,
                      ContentType: "dummy content",
                      Configuration: JSON.stringify({name: "Yoga"})
                    };
                }
            };
        }


    }
});
