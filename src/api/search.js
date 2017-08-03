import express from 'express';
import { SearchHistory } from '../models/searchHistory';
// import Search from 'bing.search';
import Bing from 'node-bing-api';

// var search = new Search('be829f857d07453bb1b91ba9b1008f4d');
var bing = new Bing({accKey: 'be829f857d07453bb1b91ba9b1008f4d'});

export const searchApi = express.Router();
 
searchApi.get('/search/:query', (request, response) => {
  // Image search logic
  let query = request.params.query,
  	reqoffset = request.query.offset || 10, // gets the offset value from the search string
 	timestamp = Date.now();
 	console.log(query,reqoffset,timestamp);


  // BING SEARCH MAGIC WILL HAPPEN HERE //
  // search.images(query, {top: offset}, (error, results) => {
  bing.images(query, {offset: reqoffset, count: 10}, (error, results, body) => {
    // console.log(error);
    // console.log(body);
    console.log("this is inside bing search result code!");
    // console.log(results.statusCode, typeof body);
    // console.log(results);


    if (error) {
      console.log("Some error happened!")
      response.status(500).json(error); // We return an error code
    } else {
      console.log("Seach results from bing have been obtained!");
      // res.status(200).json(res.map(createResults)); // We return the results
      response.status(200).json(createResultsjson(results)); // We return the results
    }
  });

  // We save a new search history entry asynchronously
  console.log("Accessing mongodb to save the search string now!")
  let queryHistory = new SearchHistory({ query, timestamp });
  queryHistory.save();
});
 
searchApi.get('/latest', (req, res) => {
  // Last searches logic
  var searchfield = req.params.search;
  SearchHistory
  .find()
  .select({_id:0, query:1, timestamp:1})
  .sort({timestamp: -1})
  .limit(10)
  .then(results => {
  	res.status(200).json(results);
  })
});

function createResultsjson(results) {
	var resultjson = [];
	var resultbodyjson = JSON.parse(results.body)['value'];
	for (var i = 0; i<=9; i++) {
		// console.log(typeof results.body);
		// console.log(typeof JSON.parse(results.body));
		// console.log(typeof JSON.parse(results.body)['value']);
		// console.log(JSON.parse(results.body)['_type']);

		// if ("instrumentation" in results.body){
  //   		console.log("instrumentation property is present in results.body");
 	// 	}
		// resultjson[i].thumbnail = results.body.value[i].thumbnailUrl;
		// console.log(resultbodyjson[i].thumbnailUrl);
		resultjson[i] = {}
		console.log(typeof resultbodyjson[i].contentUrl.toString().split('&r='));
		var arr = resultbodyjson[i].contentUrl.toString().split('&r=');
		console.log(arr[1]);
		resultjson[i]['url'] = decodeURIComponent(resultbodyjson[i].contentUrl.toString().split('&r=')[1]).toString().split('&')[0];
		resultjson[i]['snippet'] = resultbodyjson[i].name;
		resultjson[i]['thumbnail'] = resultbodyjson[i].thumbnailUrl;
		resultjson[i]['context'] = resultbodyjson[i].webSearchUrl;
	}
	return resultjson;
}

function createResults(image) {
  return {
    url: image.url,
    title: image.title,
    thumbnail: image.thumbnail.url,
    source: image.sourceUrl,
    type: image.type
  }	
}