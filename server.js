//import needle
const needle = require('needle');
// import hhtp
var http = require('http');
// import url
var url = require('url');

// The code below sets the bearer token from the environment variables
// export BEARER_TOKEN='AAAAAAAAAAAAAAAAAAAAANqbJQEAAAAAkmiGNIRt6NWuqggaEB0sPwQRwks%3DwypmckVAlIgYUupnkhOcvdgCIUVHJZYDZxJv1FP6vhkeb5Pbmh' 
const token = process.env.BEARER_TOKEN; 
//const token = “AAAAAAAAAAAAAAAAAAAAANqbJQEAAAAAkmiGNIRt6NWuqggaEB0sPwQRwks%3DwypmckVAlIgYUupnkhOcvdgCIUVHJZYDZxJv1FP6vhkeb5Pbmh”; 

const endpointURL = "https://api.twitter.com/2/tweets/search/recent"

async function searchTweets(qs) {
    // parameters for getting tweets
    const params = {
        "query": qs, // Search String
        "tweet.fields": "created_at,author_id",
        "max_results": "10"
    }

    console.log("Searching Twitter using endpointURL=" + endpointURL + ", query="+ params["query"] + ", maxResults=" + params["max_results"]); 
    const twtrRes = await needle('get', endpointURL, params, { headers: {
        "authorization": `Bearer ${token}`
    }})

    if(twtrRes.body) {
        return twtrRes.body;
    } else {
        throw new Error ('Unsuccessful request')
    }
}

var server= http.Server(function(req,res) {
    
    // Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}
    
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
    
    // Cmd Values = {'SearchTweets', 'ShowTopNews', 'ShowPersonalNews', 'ShowSportsNews', ''ShowCrimeNews', 'ShowPoliticsNews', 'ShowWorldNews', ShowInnovationNews', 'ShowLocalNews'}
    
    var queryExpr = 'Joe Biden';
    var queryObject = url.parse(req.url,true).query;
    var cmd = queryObject['command'];
    if(null == cmd || cmd.trim().length <=0) {
        cmd = 'SearchTweets';
        console.log("Default cmd = " + cmd);
    } else {
        console.log("cmd = " + cmd);
    }
    
    if('SearchTweets' == cmd) {
        if(null != queryObject && null != queryObject['queryExpr']) {
            queryExpr = queryObject['queryExpr'];
        }
        console.log("queryExpr = " + queryExpr);


        //res.write('<p>Searching Tweets for queryExpr = "' + queryExpr + '"</p>');

        console.log("Invoking searchTweets for queryExpr = " + queryExpr);

        (async() => {
            const twtrRespBody = await searchTweets(queryExpr);
            console.log("twtrRespBody jsonData = " + twtrRespBody.data);
            var jsonData = twtrRespBody.data;

            res.write('<table id="searchResultsTable">');
            res.write('<tr>');
            //res.write('<th>Num</th>');
            //res.write('<th>ID</th>');
            //res.write('<th>Author ID</th>');
            //res.write('<th>CreatedDateTime</th>');
            res.write('<th>TweetText</th>');
            res.write('</tr>');

            for(var i=0; i< jsonData.length; i++) {
                res.write('<tr>');
                //res.write('<td>' + (i+1) + '</td>');
                //res.write('<td>' + jsonData[i]['id'] + '</td>');
                //res.write('<td>' + jsonData[i]['author_id'] + '</td>');
                //res.write('<td>' + jsonData[i]['created_at'] + '</td>');
                res.write('<td>' + jsonData[i]['text'] + '</td>');
                res.write('</tr>');

            }

            res.write('</table>');
            res.end();
        })()
    } else {
        console.log("Unsupported cmd = " + cmd);
        res.write("Unsupported cmd = " + cmd);
    }
    
});


console.log("Starting SearchTweets Server on port 8080.")                     
server.listen(8080, 'localhost')
