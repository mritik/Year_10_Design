//import needle
const needle = require('needle');
// import hhtp
var http = require('http');
// import url
var url = require('url');
// import FileSystem
var fs = require('fs');  

// The code below sets the bearer token from the environment variables
const token = process.env.BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAANqbJQEAAAAAkmiGNIRt6NWuqggaEB0sPwQRwks%3DwypmckVAlIgYUupnkhOcvdgCIUVHJZYDZxJv1FP6vhkeb5Pbmh'; 
// The code below sets the HTTP Server Default Port & Host
const PORT = process.env.PORT || 8080;
const MYSERVERHOST = process.env.MYSERVERHOST || '0.0.0.0';

// Twitter and NewsCatcher EndPoint URLs
const twitterEndpointURL = "https://api.twitter.com/2/tweets/search/recent"
const newsEndpointURL = "https://newscatcher.p.rapidapi.com/v1/latest_headlines"

// Function to Load a File and Serve Up as HTTP Response with specific Mime(Multipurpose Internet Mail Extensions) Type
function serveResource(res, mimeType, path) {
    fs.readFile(__dirname + path, function(error, data) {  
        if (error) {  
            res.writeHead(404);  
            res.write(error);  
            res.end();  
        } else {  
            res.writeHead(200, {  
                'Content-Type': mimeType  
            });  
            res.write(data);  
            res.end();  
        }  
    });  
}

// Function to ilter Out Duplicate News Articles and returns Unique Results
// First we add the data to a Map with News Article Title as the Key and NewsData as the Value and then return the Unique Values
function uniqueResults(newsData) {
    
    // NewsData Map with Key as Title and NewsData Article as Value
    var uniqueNewsMap = new Map();
    for(var i=0; i< newsData.length; i++) {
        var newsDataItem = newsData[i];
        uniqueNewsMap.set(newsDataItem['title'], newsDataItem);
    }
    
    console.log("Filtered newsData from records: " + newsData.length + " to unique records: " + uniqueNewsMap.size);
    return Array.from(uniqueNewsMap.values()); 
}

// Async Function to Search Tweets based on specified Query String
async function searchTweets(qs) {
    // parameters for getting tweets
    const params = {
        "query": qs, // Search String
        "tweet.fields": "created_at,author_id",
        "max_results": "10"
    }

    console.log("Searching Twitter using twitterEndpointURL=" + twitterEndpointURL + ", query="+ params["query"] + ", maxResults=" + params["max_results"]); 
    //Sending a get request with the endpoint url, the parameters, and the authorization (Bearer Token)
    const twtrRes = await needle('get', twitterEndpointURL, params, { headers: {
        "authorization": `Bearer ${token}`
    }})
    //If we get a response then return the response otherwise return null
    if(twtrRes.body) {
        return twtrRes.body;
    } else {
        console.log('Unsuccessful Twitter Request');
        return null;
    }
}

// Async Function to get News based on specified topic
async function showNews(topic) {
    // parameters for getting news
    const params = {
        "topic": topic,
        "lang": "en",
        "media": "True"
    }

    console.log("Searching News using newsEndpointURL=" + newsEndpointURL + ", topic="+ params["topic"]); 
    //Sending a get request with the endpoint url, the parameters, and the authorization
    const newsRes = await needle('get', newsEndpointURL, params, { headers: {
        "x-rapidapi-key": "a00ad86ca6msh99ceae62c2a30acp19ce0fjsne1b976cab472",
        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
        "useQueryString": true
    }})
    //If we get a response then return the response otherwise return null
    if(newsRes.body) {
        return newsRes.body;
    } else {
        console.log('Unsuccessful Get News Request');
        return null;
    }
}

// Async Function to get News based on country
async function showLocalNews(country) {
    // parameters for getting news
    const params = {
        "country": country,
        "lang": "en",
        "media": "True"
    }

    console.log("Searching News using newsEndpointURL=" + newsEndpointURL + ", country="+ params["country"]); 
    //Sending a get request with the endpoint url, the parameters, and the authorization
    const newsRes = await needle('get', newsEndpointURL, params, { headers: {
        "x-rapidapi-key": "a00ad86ca6msh99ceae62c2a30acp19ce0fjsne1b976cab472",
        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
        "useQueryString": true
    }})

    if(newsRes.body) {
        return newsRes.body;
    } else {
        console.log('Unsuccessful Get Local News Request');
        return null;
    }
}

//Defining a HTTP server and the function to receive HTTP requests and send HTTP responses
var server= http.Server(function(req, res) {
    
    // Set CORS headers in order to not run into a CORS Error
    // Cross-Origin Resource Sharing (CORS) is used by browsers — used to restrict HTTP and HTTPS requests made from scripts to resources in a different origin for security reasons, mainly to protect your user's data and prevent attacks that would compromise your app.
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
    // First we resolve the path
    var path = url.parse(req.url).pathname;  
    console.log("path = " + path);
    console.log("__dirname +path = " + __dirname + path);
    
    // If there is no path, default it to index.html
    if(path == "/") {
        path = "/index.html";
        console.log("Redirecting path = / to path= " + path);
        console.log("__dirname +path = " + __dirname + path);
    }
    // Path variables for regular expression matching
    var indexPg = new RegExp("index.html");
    var pg1 = new RegExp("page1.html");
    var pg2 = new RegExp("page2.html");
    var pg3 = new RegExp("page3.html");
    var pg4 = new RegExp("page4.html");
    var pg5 = new RegExp("page5.html");
    var pg6 = new RegExp("page6.html");
    var header = new RegExp("header.html");
    var footer = new RegExp("footer.html");
    var jQuery = new RegExp("jquery-3.3.1.js");
    var mystyles = new RegExp("mystyles.css");
    var logoImg = new RegExp("logo.png");
    var showTweetImg = new RegExp("showTweet.png");
    var breakingNewsImg = new RegExp("Breaking_News.jpeg");
    var sportsImg = new RegExp("sports.jpeg");
    var entertainmentImg = new RegExp("Entertainment.jpg");
    var politicsImg = new RegExp("politics.jpg");
    var scienceImg = new RegExp("Science.jpeg");
    var worldImg = new RegExp("World.jpeg");
    var countryImg = new RegExp("Country.jpeg");
    var bgImg = new RegExp("bgimg2.jpg");
    var execCmd = new RegExp("ExecCommand");
    
    // Using a switch statement and handling all path requests including serving HTTP/Images/JavaScript and handling News Search and Twitter Search requests 
    switch (true) {
        
        // Case statement for handling png files
        case bgImg.test(path): {
            serveResource(res, 'image/png', path);
            break;  
        }    
        
        // Case statement for handling jpeg files    
        case logoImg.test(path):
        case showTweetImg.test(path):
        case breakingNewsImg.test(path):
        case sportsImg.test(path):
        case entertainmentImg.test(path):
        case politicsImg.test(path):
        case worldImg.test(path):
        case scienceImg.test(path):
        case countryImg.test(path):  {
            serveResource(res, 'image/jpeg', path);
            break;  
        }    
            
        // Case statement for handling html files      
        case indexPg.test(path):        
        case pg1.test(path):  
        case pg2.test(path):  
        case pg3.test(path):  
        case pg4.test(path):  
        case pg5.test(path):  
        case pg6.test(path):  
        case header.test(path):  
        case footer.test(path): {
            serveResource(res, 'text/html', path);
            break;  
        }
            
        // Case statement for handling css files      
        case mystyles.test(path):  {
            serveResource(res, 'text/css', path);
            break;  
        }    
            
        // Case statement for handling javascript files  
        case jQuery.test(path): {
            serveResource(res, 'text/javascript', path);
            break;  
        }        
        
        // Case statement for handling Twitter and News Search Requests  
        case execCmd.test(path): {
             res.writeHead(200, { 'Content-Type': 'text/html' }); 
    
            // Cmd Values = {'SearchTweets', 'ShowTopNews', 'ShowSportsNews', 'ShowEntertainmentNews', 'ShowPoliticsNews', 'ShowWorldNews', ShowInnovationNews', 'ShowLocalNews'}

            // Resolving the query command
            var queryObject = url.parse(req.url,true).query;
            var cmd = queryObject['command'];
            if(null == cmd || cmd.trim().length <=0) {
                cmd = 'SearchTweets';
                console.log("Default cmd = " + cmd);
            } else {
                console.log("cmd = " + cmd);
            }

            if('SearchTweets' == cmd) {
                
                // Handle SearchTweets Command
                
                var queryExpr = '';
                if(null != queryObject && null != queryObject['queryExpr']) {
                    queryExpr = queryObject['queryExpr'].trim();
                }

                console.log("Invoking searchTweets for queryExpr = " + queryExpr);

                // Invoking an asynchronous function
                (async() => {
                    const twtrRespBody = await searchTweets(queryExpr);
                    console.log("twtrRespBody = " + twtrRespBody.data);
                    var tweetData = twtrRespBody.data;
                    //Write the data I want in the table
                    res.write('<table id="searchResultsTable">');
                    res.write('<tr>');
                    res.write('<th>Tweet Text</th>');
                    res.write('<th>Show</th>');
                    res.write('</tr>');

                    for(var i=0; i< tweetData.length; i++) {
                        res.write('<tr>');
                        res.write('<td>' + tweetData[i]['text'] + '</td>');
                        var tweetUrl = "https://twitter.com/i/web/status/" + tweetData[i]['id'];
                        res.write('<td><a href="' + tweetUrl + '" target="_blank">' + '<img src="/images/showTweet.png" alt="ShowTweet" width=20" height="20"></img>' + '</a></td>');
                        res.write('</tr>');
                    }

                    res.write('</table>');
                    res.end();
                })()
            }  else if('ShowTopNews' == cmd) {
    
                    // Handle ShowTopNews Command
                
                    console.log("Invoking ShowTopNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("news");
                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
                            res.write('<h1><b>Top News</b></h1>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
                
            } else if('ShowSportsNews' == cmd) {
                
                    // Handle ShowSportsNews Command
    
                    console.log("Invoking ShowSportsNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("sport");
                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
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
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }
                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
            
            
             } else if('ShowEntertainmentNews' == cmd) {
                 
                    // Handle ShowEntertainmentNews Command
    
                    console.log("Invoking ShowEntertainmentNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("entertainment");

                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
                            res.write('<caption><b>Entertainment News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
                 
               } else if('ShowPoliticalNews' == cmd) {
                   
                    // Handle ShowPoliticalNews Command
    
                    console.log("Invoking ShowPoliticalNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("politics");

                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
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
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()
   
               } else if('ShowWorldNews' == cmd) {
                   
                    // Handle ShowWorldNews Command
    
                    console.log("Invoking ShowWorldNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("world");

                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
                            res.write('<caption><b>World News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }
                
                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()   
               } else if('ShowScienceNews' == cmd) {
                   
                    // Handle ShowScienceNews Command
    
                    console.log("Invoking ShowScienceNews");
                   
                    (async() => {
                        
                        const newsRespBody = await showNews("science");

                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);

                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
                            res.write('<caption><b>Science News</b></caption>')
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })() 
               } else if('ShowLocalNews' == cmd) {
                   
                    // Handle ShowLocalNews Command (Country News)
                    //
                    var queryCountry = 'Canada';
                    if(null != queryObject && null != queryObject['queryCountry'] && queryObject['queryCountry'].trim().length > 0) {
                        queryCountry = queryObject['queryCountry'].trim();
                    } else {
                        console.log("Defaulting  queryCountry = " + queryCountry);
                    }
    
                    console.log("Invoking ShowLocalNews with queryCountry = " + queryCountry);
                   
                    (async() => {
                        
                        const newsRespBody = await showLocalNews(queryCountry);

                        console.log("newsRespBody = " + newsRespBody);
                        if(null != newsRespBody) {
                            var newsData = uniqueResults(newsRespBody.articles);
                            
                            console.log("newsData = " + newsData);
                            console.log("newsData sz = " + newsData.length);
                            //Write the data I want in the table
                            res.write('\n')
                            res.write('<table id="newsResultsTable">');
                            res.write('<tr>');
                            res.write('<th>Headline</th>');
                            res.write('<th>Link</th>');
                            res.write('</tr>');

                            for(var i=0; i< newsData.length; i++) {
                                res.write('<tr>');
                                res.write('<td>' + newsData[i]['title'] + '</td>');
                                res.write('<td><a href="' + newsData[i]['link'] + '" target="_blank">' + '<i class="fa fa-external-link" aria-hidden="true"></i>' + '</a></td>');
                                res.write('</tr>');
                            }

                            res.write('</table>');
                        } else {
                            res.write('Unable to Fetch News! Check Server Logs for Error.');
                        }
                        
                        res.end();
                    })()          
            } else {

                    console.log("Unsupported cmd = " + cmd);
                    res.write("Unsupported cmd = " + cmd);
            }
        
            break; 
        }
        default:  {
            
            // Handle Unexpected path requests by sending 404 Error 
            console.log("Unresolved path = " + path);
            res.writeHead(404);  
            res.write("Oops this page doesn't exist - 404");  
            res.end();  
            break;  
        }
 
    }  
});
      
// Creating HTTP Server with variables PORT and MYSERVERHOST

console.log(`Starting SearchTweets Server on host ${ MYSERVERHOST } port ${ PORT }`);
server.listen(PORT, MYSERVERHOST)
