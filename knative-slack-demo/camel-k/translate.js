/* kc create secret generic translate-config --from-file=camel-k/application.properties */ 
/* kamel run camel-k/translate.js --name translate-service --secret=translate-config */
rest('/').post().to('direct:translate')

from('direct:translate')
    .unmarshal().json()
    .log('Translating: ${body[text]}')
    .removeHeaders('*')
    .setHeader('username', simple('${body[user]}'))
    .setHeader('CamelHttpMethod').constant('POST')
    .setBody().simple('{"q":"${body[text]}","source":"{{translate.source}}","target":"{{translate.target}}"}')
    .to('https://translation.googleapis.com:443/language/translate/v2?key={{api.key}}')
    .unmarshal().json()
    .log('Translation: ${body[data][translations][0][translatedText]}')
    .setBody().simple('<@${headers.username}> dijo "${body[data][translations][0][translatedText]}"')
    .to('slack:#general-{{translate.target}}?iconEmoji=:camel:&username=CamelTest')