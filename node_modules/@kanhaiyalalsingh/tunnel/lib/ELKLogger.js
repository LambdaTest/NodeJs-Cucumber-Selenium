var elasticsearch = require('elasticsearch'),
  ELK_HOST = 'https://search-kinesis-ingestion-stage-temp-wlmuadurdfgvyhvjjvhlfzr36u.us-east-1.es.amazonaws.com',
  ELK_INDEX = 'tunnel_log',
  ELK_TYPE = 'logger';

module.exports = function (username, key, meta, bodyObj) {
  try {
    var client = new elasticsearch.Client({ host: ELK_HOST });
    if (typeof bodyObj !== 'string') {
      bodyObj = JSON.stringify(bodyObj);
    }
    if (typeof meta === 'object') {
      meta.platform = process.platform;
      meta.arch = process.arch
    }
    client.index({
      index: ELK_INDEX,
      type: ELK_TYPE,
      body: {
        "username": username,
        "key": key,
        "meta": meta,
        "bodyObj": bodyObj
      }
    });
  } catch (e) {

  }
};
