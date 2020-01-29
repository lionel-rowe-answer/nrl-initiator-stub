const uuid = require('uuid');

const collectionHelper = {
    buildCollection: (baseCollection, clientConfig, jwt) => {
        baseCollection.item.forEach(item => {
            const traceId = clientConfig.sspTraceId || uuid.v4();

            const headers = [
                { key: 'Authorization', value: 'Bearer ' + jwt, type: 'text' },
                { key: 'Ssp-From', value: clientConfig.fromAsid, type: 'text' },
                { key: 'Ssp-To', value: clientConfig.toAsid, type: 'text' },
                { key: 'Ssp-InteractionID', value: clientConfig.sspInteractionId, type: 'text' },
                { key: 'Ssp-TraceID', value: traceId, type: 'text' },
            ];

            item.request.header = headers;
        });

        baseCollection.info.description = JSON.stringify({ config: clientConfig }, null, 4);

        return baseCollection;
    }
}

module.exports = {
    collectionHelper,
};
