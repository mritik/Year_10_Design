//import needle
const needle = require('needle');
// import hhtp
var http = require('http');
// import url
var url = require('url');
// import FileServer
var fs = require('fs');  

// The code below sets the bearer token from the environment variables
// export BEARER_TOKEN='AAAAAAAAAAAAAAAAAAAAANqbJQEAAAAAkmiGNIRt6NWuqggaEB0sPwQRwks%3DwypmckVAlIgYUupnkhOcvdgCIUVHJZYDZxJv1FP6vhkeb5Pbmh' 
const token = process.env.BEARER_TOKEN; 
//const token = “AAAAAAAAAAAAAAAAAAAAANqbJQEAAAAAkmiGNIRt6NWuqggaEB0sPwQRwks%3DwypmckVAlIgYUupnkhOcvdgCIUVHJZYDZxJv1FP6vhkeb5Pbmh”; 

const twitterEndpointURL = "https://api.twitter.com/2/tweets/search/recent"
const newsEndpointURL = "https://newscatcher.p.rapidapi.com/v1/latest_headlines"

async function searchTweets(qs) {
    // parameters for getting tweets
    const params = {
        "query": qs, // Search String
        "tweet.fields": "created_at,author_id",
        "max_results": "10"
    }

    console.log("Searching Twitter using twitterEndpointURL=" + twitterEndpointURL + ", query="+ params["query"] + ", maxResults=" + params["max_results"]); 
    const twtrRes = await needle('get', twitterEndpointURL, params, { headers: {
        "authorization": `Bearer ${token}`
    }})

    if(twtrRes.body) {
        return twtrRes.body;
    } else {
        // TODO FIXME - Improve Error Logging
        console.log('Unsuccessful Twitter Request');
        return null;
    }
}

async function showTopNews() {
    // parameters for getting news
    const params = {
        "topic": "news",
        "lang": "en",
        "media": "True"
    }

    console.log("Searching News using newsEndpointURL=" + newsEndpointURL + ", topic="+ params["topic"]); 
    const newsRes = await needle('get', newsEndpointURL, params, { headers: {
        "x-rapidapi-key": "a00ad86ca6msh99ceae62c2a30acp19ce0fjsne1b976cab472",
        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
        "useQueryString": true
    }})

    if(newsRes.body) {
        return newsRes.body;
    } else {
        // TODO FIXME - Improve Error Logging
        console.log('Unsuccessful News Request');
        return null;
    }
}

async function showSportsNews() {
    // parameters for getting news
    const params = {
        "topic": "sport",
        "lang": "en",
        "media": "True"
    }

    console.log("Searching News using newsEndpointURL=" + newsEndpointURL + ", topic="+ params["topic"]); 
    const newsRes = await needle('get', newsEndpointURL, params, { headers: {
        "x-rapidapi-key": "a00ad86ca6msh99ceae62c2a30acp19ce0fjsne1b976cab472",
        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
        "useQueryString": true
    }})

    if(newsRes.body) {
        return newsRes.body;
    } else {
        // TODO FIXME - Improve Error Logging
        console.log('Unsuccessful News Request');
        return null;
    }
}

async function ShowPoliticalNews() {
    // parameters for getting news
    const params = {
        "topic": "politics",
        "lang": "en",
        "media": "True"
    }

    console.log("Searching News using newsEndpointURL=" + newsEndpointURL + ", topic="+ params["topic"]); 
    const newsRes = await needle('get', newsEndpointURL, params, { headers: {
        "x-rapidapi-key": "a00ad86ca6msh99ceae62c2a30acp19ce0fjsne1b976cab472",
        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
        "useQueryString": true
    }})

    if(newsRes.body) {
        return newsRes.body;
    } else {
        // TODO FIXME - Improve Error Logging
        console.log('Unsuccessful News Request');
        return null;
    }
}


var server= http.Server(function(req, res) {
    
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
    
    // Get the Requested Path and Server html files if requested
    // If Not html file Request then execute Backend Services and Render Html Response based on Command
    var path = url.parse(req.url).pathname;  
    
    console.log("path = " + path);
    console.log("__dirname +path = " + __dirname + path);
    
    var homePg = new RegExp("home");
    var indexPg = new RegExp("index.html");
    var pg1 = new RegExp("page1.html");
    var pg2 = new RegExp("page2.html");
    var pg3 = new RegExp("page3.html");
    var pg4 = new RegExp("page4.html");
    var pg5 = new RegExp("page5.html");
    var pg6 = new RegExp("page6.html");
    var mystyles = new RegExp("mystyles.css");
    var bgImg = new RegExp("bgimg2.jpg");
    var execCmd = new RegExp("ExecCommand");
    switch (true) {  
        case homePg.test(path): {
            fs.readFile(__dirname + "/index.html", function(error, data) {  
                if (error) {  
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            });  
            break;  
        }
        case indexPg.test(path):        
        case pg1.test(path):  
        case pg2.test(path):  
        case pg3.test(path):  
        case pg4.test(path):  
        case pg5.test(path):  
        case pg6.test(path):  
        case mystyles.test(path):  
        case bgImg.test(path):  {
            fs.readFile(__dirname + path, function(error, data) {  
                if (error) {  
                    res.writeHead(404);  
                    res.write(error);  
                    res.end();  
                } else {  
                    res.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    res.write(data);  
                    res.end();  
                }  
            });  
            break;  
        }
        case execCmd.test(path): {
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
                    console.log("twtrRespBody = " + twtrRespBody.data);
                    var tweetData = twtrRespBody.data;

                    res.write('<table id="searchResultsTable">');
                    res.write('<tr>');
                    //res.write('<th>Num</th>');
                    //res.write('<th>ID</th>');
                    //res.write('<th>Author ID</th>');
                    //res.write('<th>CreatedDateTime</th>');
                    res.write('<th>TweetText</th>');
                    res.write('</tr>');

                    for(var i=0; i< tweetData.length; i++) {
                        res.write('<tr>');
                        //res.write('<td>' + (i+1) + '</td>');
                        //res.write('<td>' + tweetData[i]['id'] + '</td>');
                        //res.write('<td>' + tweetData[i]['author_id'] + '</td>');
                        //res.write('<td>' + tweetData[i]['created_at'] + '</td>');
                        res.write('<td>' + tweetData[i]['text'] + '</td>');
                        res.write('</tr>');

                    }

                    res.write('</table>');
                    res.end();
                })()
            }  else if('ShowTopNews' == cmd) {
    
                    console.log("Invoking ShowTopNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showTopNews("news");
                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = newsRespBody.articles;

                            console.log("newsData sz = " + newsData.length);
                            
                            res.write('<caption><b>Top News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td>' + newsData[i]['link'] + '</td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
                
            } else if('ShowSportsNews' == cmd) {
    
                    console.log("Invoking ShowSportsNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showSportsNews("sport");
                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = newsRespBody.articles;

                            console.log("newsData sz = " + newsData.length);
                            
                            res.write('<caption><b>Sports News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td>' + newsData[i]['link'] + '</td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
            
             } else if('ShowPoliticalNews' == cmd) {
    
                    console.log("Invoking ShowPoliticalNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showPoliticalNews("politics");
                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = newsRespBody.articles;

                            console.log("newsData sz = " + newsData.length);
                            
                            res.write('<caption><b>Political News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td>' + newsData[i]['link'] + '</td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
            
            }else {
                    console.log("Unsupported cmd = " + cmd);
                    res.write("Unsupported cmd = " + cmd);
            }
        
        break; 
        }
        default:  {
            res.writeHead(404);  
            res.write("Oops this page doesn't exist - 404");  
            res.end();  
            break;  
        }
 
    }  
});


console.log("Starting SearchTweets Server on port 8080.")                     
server.listen(8080, 'localhost')
