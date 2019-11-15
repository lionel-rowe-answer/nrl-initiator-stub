const uuid = require('uuid');
const {utilsHelper} = require('./utilsHelper');

let collectionHelper = {
    
    buildCollection: function(baseCollection, clientConfig, jwt){

        for(let i = 0, len = baseCollection.item.length; i< len; i++)
        {
            let headers = [];

            let traceId = utilsHelper.validString(clientConfig.sspTraceId) ? clientConfig.sspTraceId : uuid.v4();

            headers.push({"key":"Authorization", "value": "Bearer " + jwt, "type": "text"});
            headers.push({"key":"Ssp-From", "value": clientConfig.fromAsid, "type": "text"});
            headers.push({"key":"Ssp-To", "value": clientConfig.toAsid, "type": "text"});
            headers.push({"key":"Ssp-InteractionID", "value": clientConfig.sspInteractionId, "type": "text"});
            headers.push({"key":"Ssp-TraceID", "value": traceId, "type": "text"});

            baseCollection.item[i].request.header = headers;
        }

        return baseCollection;
    }
}

module.exports.collectionHelper = collectionHelper;