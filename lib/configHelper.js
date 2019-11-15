const {utilsHelper} = require('./utilsHelper');

let configHelper = {

    config: function() {

        const _coreConfig = require('./core.configuration.json');

        const _clientConfig = require('../client.configuration.json');

        let _urpSystemUrl = "https://fhir.nhs.uk/Id/sds-role-profile-id|";
        let _asidSystemUrl = "https://fhir.nhs.uk/Id/accredited-system|";
        let _orgSystemUrl = "https://fhir.nhs.uk/Id/ods-organization-code|";


        const _jwtDefault = {
            "iss":"https://data.developer.nhs.uk/nrls-ri/",
            "sub":"https://fhir.nhs.uk/Id/sds-role-profile-id|testRoleProfileId",
            "aud":"https://nrls.digital.nhs.uk/",
            "exp":1565035652,
            "iat":1565035352,
            "reason_for_request":"directcare",
            "scope":"patient/*.read",
            "requesting_system":"https://fhir.nhs.uk/Id/accredited-system|200000000116",
            "requesting_organization":"https://fhir.nhs.uk/Id/ods-organization-code|AMS01",
            "requesting_user": "https://fhir.nhs.uk/Id/sds-role-profile-id|testRoleProfileId"
        };


        let _configuration = {
            collectionPath: _coreConfig.collectionPath,
            htmlReportTemplatePath: _coreConfig.htmlReportTemplatePath,
            htmlReportExportPath: setReportFileName(),
            successEndpoint: _clientConfig.successEndpoint,
            errorEndpoint: _clientConfig.errorEndpoint,
            fromAsid: _clientConfig.fromAsid,
            sspInteractionId: _clientConfig.sspInteractionId,
            toAsid: _clientConfig.toAsid,
            odsCode: _clientConfig.odsCode,
            userProfileId: _clientConfig.userProfileId,
            sspTraceId: _clientConfig.sspTraceId,
            sslClientCert: _clientConfig.sslClientCert,
            sslClientKey: _clientConfig.sslClientKey,
            sslClientPassphrase: _clientConfig.sslClientPassphrase,
            sslCACert: _clientConfig.sslCACert,
            sslInsecure: _clientConfig.sslInsecure,
            jwtClaims: generateJwtOptions(_jwtDefault, _clientConfig)
        };

        return _configuration;

        function setReportFileName(){
            let dt = new Date();
            let template = _coreConfig.htmlReportExportPath
                .replace("%ods", _clientConfig.odsCode)
                .replace("%asid", _clientConfig.fromAsid)
                .replace("%dt", dt.toISOString().replace(/:/g,"__").replace(".","_"));

            return template;
        }

        function generateJwtOptions(jwtDefault, clientConfig)
        {
            if(typeof clientConfig.jwtOverride != "object")
            {
                if(utilsHelper.validString(clientConfig.odsCode))
                {
                    jwtDefault["requesting_organization"] = _orgSystemUrl + clientConfig.odsCode;
                }
    
                if(utilsHelper.validString(clientConfig.fromAsid))
                {
                    jwtDefault["requesting_system"] = _asidSystemUrl + clientConfig.fromAsid;
                }

                return jwtDefault;
            }
            
            for(let key in jwtDefault)
            {
                if(!jwtDefault.hasOwnProperty(key))
                {
                    continue;
                }
                    
                if(utilsHelper.validString(clientConfig.jwtOverride[key]))
                {
                    jwtDefault[key] = clientConfig.jwtOverride[key];

                    continue;
                }


                if(key == "requesting_organization" && utilsHelper.validString(clientConfig.odsCode))
                {
                    jwtDefault[key] = _orgSystemUrl + clientConfig.odsCode;
                }
    
                if(key == "requesting_system" && utilsHelper.validString(clientConfig.fromAsid))
                {
                    jwtDefault[key] = _asidSystemUrl + clientConfig.fromAsid;
                }
    
                if((key == "sub" || key == "requesting_user") && utilsHelper.validString(clientConfig.userProfileId))
                {
                    jwtDefault[key] = _urpSystemUrl + clientConfig.userProfileId;
                }
                                
            }

            return jwtDefault;
        }
    } 
}

module.exports.configHelper = configHelper;
