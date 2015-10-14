var http = require("http");
var cheerio = require("cheerio");

var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

//var url = "http://finance.yahoo.com/q?s=^NDX";
var url = "http://stock.finance.sina.com.cn/usstock/api/json.php/US_MinlineNService.getMinline?symbol=.ixic&day=5";

function getFromURL(){
    var html='';
    var req = http.get(url,function(res){
       
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
           
        }).on('end',function(){
            var buf = buffer.toBuffer();
 
          
           var str = iconv.decode(buf,'UTF-8');
           
            var $ = cheerio.load(str);
 console.log(str);        
		    $("dd").each(function(i, e) {
	    	  	 var spans = $(e).find("span");
		    	 var span0 = $(spans[0]);
		    	 	console.log(span0.text().trim());			    	 	
		    	 var span1 = $(spans[1]);
		    	 	console.log(span1.text().trim());	
		    	 var span2 = $(spans[2]);
		    	 	console.log(span2.text().trim());			    	 	
		    	 var span3 = $(spans[3]);
		    	 	console.log(span3.text().trim());			    	 	
		    	 var span4 = $(spans[4]);
		    	 	console.log(span4.text().trim());	
		    	 var span5 = $(spans[5]);
		    	 	console.log(span5.text().trim());	
		    	 var span6 = $(spans[6]);
		    	 	console.log(span6.text().trim());
		    	 var span7 = $(spans[7]);
		    	 	console.log(span7.text().trim());		    	 	
		    	 var span8 = $(spans[8]);
		    	 	console.log(span8.text().trim());		 
			        
		         console.log('...........................................');
		      });
		    console.log("done");
         
        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
        fs.appendFile('error.log',new Date().getTime()+' '
            +error+'\r\n','UTF-8');
    });
};

getFromURL()


