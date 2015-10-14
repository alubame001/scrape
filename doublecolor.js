var http = require("http");
var cheerio = require("cheerio");

var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
//var url = "http://bbs.nju.edu.cn/bbstcon?board=S_Information&file=M.1367076046.A";
//var url = "http://www.ruten.com.tw";

//var url = "http://www.ts777.net/BALL/Page/Index/"	
//var url = "http://caipiao.163.com/order/jczq/#from=leftnav"
var url = "http://caipiao.163.com/order/ssq/#from=leftnav"	

//var url = "http://btc-dice.com/user/login"
function getFromURL(){
    var html='';
    var req = http.get(url,function(res){
       // res.setEncoding('binary');
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
           
        }).on('end',function(){
            var buf = buffer.toBuffer();
 
            //var buf = new Buffer(html,'binary');
           var str = iconv.decode(buf,'UTF-8');
           
            var $ = cheerio.load(str);
           // <table class="winningNumberlist">
            
		    $("span.drawNoticePeriod").each(function(i, content) {
		    	
		         $(content).each(function(i, html) {		        
		    	 console.log($(html).text().trim());      		        
		         });	   
	
		      });
		    
		      $("p.currenAward").each(function(i, content) {
		    	
		         $(content).each(function(i, html) {
		         var ems = $(content).find("em");
		    	 var em0 = $(ems[0]);
		    	 var em1 = $(ems[1]);	
		    	 var em2 = $(ems[2]);
		    	 var em3 = $(ems[3]);	
		    	 var em4 = $(ems[4]);
		    	 var em5 = $(ems[5]);			    	 
		    	 var em6 = $(ems[6]);		    	 
		    	 
		    	 console.log(em0.text().trim()); 
		    	 console.log(em1.text().trim()); 	
		    	 console.log(em2.text().trim()); 
		    	 console.log(em3.text().trim()); 			    	 
		    	 console.log(em4.text().trim()); 
		    	 console.log(em5.text().trim()); 		    	 
		    	 console.log(em6.text().trim()); 
		    	
		         
		        
		         });   
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



 /*
download_encode(url, function(data) {
  if (data) {
    console.log(data);
 //  <span class="co1">周二001</span>
    var $ = cheerio.load(data);
    $("dd").each(function(i, e) {
        console.log($(this).text());
      });
    console.log("done");
  }
  else console.log("error");  
});
*/
 /*


 
 <div class="artSplitter">        <img  src="http://i.dailymail.co.uk/i/pix/2013/03/22/article-2297585-18DB51C1000005DC-231_634x476.jpg" height="476" width="634" alt="One of the Squirrels pushes a pram with a little baby squirrel doll inside in one of  Nancy Rose's hilarious  photographs" class="blkBorder"/>
在目标网页，我注意到这些图片所在的div都有一个叫做 “artSplitter”的class, 而且这些图片本身都有一个叫做”blkBorderf”的class。 为了能将它们唯一的找到，我写了一条css选择器查询语句
1
$("div.artSplitter > img.blkBorder") 
  */
/*
var url = "http://www.dailymail.co.uk/news/article-2297585/Wild-squirrels-pose-charming-pictures-photographer-hides-nuts-miniature-props.html"
 
download(url, function(data) {
  if (data) {
    //console.log(data);
 
    var $ = cheerio.load(data);
    $("div.artSplitter > img.blkBorder").each(function(i, e) {
        console.log($(e).attr("src"));
      });
 
    console.log("done");
  }
  else console.log("error");  
});


var url = "http://www.echojs.com/";
 
download(url, function(data) {
  if (data) {
    // console.log(data);
    var $ = cheerio.load(data);
    $("article").each(function(i, e) {
      var link = $(e).find("h2>a");
      var poster = $(e).find("username").text();
      console.log(poster+": ["+link.html()+"]("+link.attr("href")+")");
    });
  }
});
  */