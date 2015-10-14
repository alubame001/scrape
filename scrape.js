var request = require('request')//,
var jsdom = require("jsdom");
var zlib = require("zlib");
var url_lib = require("url");
var Parse = require('../index').Parse;

var MongoClient = require('mongodb').MongoClient
var format = require('util').format;    

var application_id = '0X2EluugLVARSvIXWgcyZsxx47DPXM6bWHDdnqPT';
var master_key = 'n1kTTlLQfVkDdVh5PbkE6yczpt73qs42PRSukO3M';

// require the environment variables, or exit with explanation
if (!application_id || !master_key) {
  console.log('Set the following environment variables for the test Parse app');
  console.log('  export APPLICATION_ID=...');
  console.log('  export MASTER_KEY=...');
  process.exit(1);
}

var host = "http://hg0088.com/",
	user = "KA61297",
	passwd = "justtest",
	mongo_url = 'mongodb://127.0.0.1:27017/test'

var global_url 

default_headers = {
	'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Language': 'en-us,en;q=0.5',
	'Accept-Encoding': 'identity',
	'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
	// 'Connection': 'keep-alive',
	'Cache-Control': 'max-age=0'
};

function write_data_to_mongo(db_collection, data){

	MongoClient.connect(mongo_url, 
		function(err, db) {
		    if(err) throw err;

		    var collection = db.collection(db_collection);
		    collection.insert(data, 
		    	function(err, docs) {
		    		if(err){
		    			console.log("write to db faild")
		    		}
			    	db.close();      
			    }
		    );
		  }
  	)
}
/*
	
function write_data_to_mongo(db_collection, data){



		    var collection = db.collection(db_collection);
		    collection.insert(data, 
		    	function(err, docs) {
		    		if(err){
		    			console.log("write to db faild")
		    		}
			    	
			    }
		    );
		  
  	
}

function connect_to_mongo(){

	MongoClient.connect(mongo_url, 
		function(err, db) {
    		if(err){
    			console.log("connect to db faild")
    		}
		  }
  	)
}
*/

var request_with_encoding = function(options, callback) {
  var req = request.get(options);
 
  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
 
    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        })
      } else {
        callback(null, buffer.toString());
      }
    });
  });
 
  req.on('error', function(err) {
    callback(err);
  });
}



function get_body_var(url, referer, uid, type, page){
	var local_headers = {}
	var org_url = url
	url = url + "?uid=" + uid + "&rtype=" + type + "&langx=zh-cn&mtype=3&league_id=&hot_game=&page_no=" + page

	for(var key in default_headers){
		local_headers[key] = default_headers[key]
	}

	local_headers["Referer"] = referer

	request_with_encoding(
		{
			url: url,
			headers: local_headers,
			method: 'GET'
		},
		function (err, body) {
			if (!err) {
				console.log("get_body_var", url)

				var doc   = jsdom.jsdom(body, null, {
				          features: {
				            FetchExternalResources   : ['script'],
				            ProcessExternalResources : ['script'],
				            MutationEvents           : '2.0'
				        }
				    });

				var window = doc.createWindow();
				jsdom.jQueryify(window, "http://code.jquery.com/jquery-1.6.min.js", function() {
				    //console.log(window.pg, );
				    //console.log(window.$().jquery); //jquery version

				    for(var key in  window.GameFT){
				    	var ret = {}
				    	for(var i in window.GameFT[key]){
				    		ret[window.GameHead[i]] = window.GameFT[key][i]
				    	}
				    	console.log(ret)

				    	write_data_to_mongo("data"+type, ret)
				    }

				    if (page == 0){
					    for (var i = 1; i < window.parent.t_page; i++) {
					    	get_body_var(org_url, referer, uid, type, i)
					    };
				    }
				});
				
			} else {
				console.log("Error on get_body_var", err, res);
			}
		}
	)
}



function enter_home(url, form) {
	global_url = url
	console.log("enter_home:", url, form)
	request(
		{
			url: url,
			headers: default_headers,
			method: 'POST',
			form: form
		},
		function (err, res, body) {
			if (!err && res.statusCode == 200) {
				console.log(body)
				jsdom.env(
					body,
                    ['http://code.jquery.com/jquery-1.6.min.js'],

					function (errors, window) {

						var rtype = ["r", "pd", "t", "f", "p3"]

						for(var key in rtype){
							get_body_var(url + "/app/member/FT_browse/body_var.php", url, form.uid, rtype[key], 0)
						}
						
						
					}
		        );
			} else {
				console.log("Error on enter_home", err, res.statusCode);
			}
		}
	)
}


function login(usr, name) {
	request(
		{
			url: host + '/app/member/login.php',
			headers: default_headers,
			method: 'POST',
			form: {uid:"", langx:"zh-cn", mac:"", ver:"", JE:"", username:user, passwd: passwd}
		},
		function (err, res, body) {
			if (!err && res.statusCode == 200) {
				jsdom.env(
					body,
                    ['http://code.jquery.com/jquery-1.6.min.js'],

					function (errors, window) {
						var form = {}

						var allInputs = window.$( ":input" );
						var url = window.$('#newdomain').attr('action');


						window.$(allInputs).each(function(idx, obj)
						{
							var name, value
							window.$(obj.attributes).each(
								function(idx, attr){
									if (attr.name == "value"){
										value = attr.value
									}else if(attr.name == "name"){
										name = attr.value
									}
								}
							)

							form[name] = value
						});

						enter_home(url, form)
					}
		        );
			}else{
				console.log("Error on login", err, res.statusCode);
			}
		}
	);
}

function main(){
//	connect_to_mongo;
	login(user, passwd)
}

main();