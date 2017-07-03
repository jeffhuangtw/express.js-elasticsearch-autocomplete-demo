var elasticsearch = require('elasticsearch');

if (!process.env.SEARCHBOX_SSL_URL) {
  console.error('SEARCHBOX_SSL_URL not found!!! please enable Heroku searchbox plugin!!!');
}

var elasticClient = new elasticsearch.Client({
  host: process.env.SEARCHBOX_SSL_URL,
  log: 'info'
});

var indexName = 'randomindex';

/**
* Delete an existing index
*/
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName
  });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
  return elasticClient.indices.create({
    index: indexName
  });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName
  });
}
exports.indexExists = indexExists;

function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: 'document',
    body: {
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        title_suggest: { type: 'completion' }
      }
    }
  });
}
exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: 'document',
    body: {
      title: document.title,
      content: document.content,
      title_suggest: {
        input: document.title.split(' ')
      }
    }
  });
}
exports.addDocument = addDocument;

function getSuggestions(input) {
  return elasticClient.suggest({
    index: indexName,
    body: {
      suggest_title: {
        text: input,
        completion: {
          field: 'title_suggest'
        }
      }
    }
  });
}
exports.getSuggestions = getSuggestions;