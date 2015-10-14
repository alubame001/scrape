var http = require("http");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var async = require('async');
var util = require('util');
//var moment = require('moment-timezone');//http://momentjs.com/timezone/
var db = require("mongoose");
var conn = db.connect('mongodb://localhost/rest');   
var sleepTime = 3000;

var url = "http://caipiao.163.com/order/jczq/spfmixp.html"

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
         
		    $("dd").each(function(i, e) {
			     var data={};
				 		console.log('-----------');
				console.log($(this).attr('matchid'));
				console.log('-----------');
				/*
	    	  	 var spans = $(e).find("span");
		    	 var span0 = $(spans[0]);
		    	 	console.log('gid:'+span0.text().trim());
					data.gid =	span0.text().trim();				
		    	 var span1 = $(spans[1]);
		    	 	console.log(span1.text().trim());	
					data.lid =	span1.text().trim();			
		    	 var span2 = $(spans[2]);
		    	 	console.log(span2.text().trim());
					data.gdatetime =span2.text().trim();					
		    	 var span3 = $(spans[3]);
		    	 	//console.log(span3);
				 var teamData=findArrayWithClass(span3,'em','b');						
					data.hostTeam  = teamData[0];
					data.guestTeam = teamData[1];
					
		    	 var span4 = $(spans[4]);
				    data.concede= span4.text().trim();					
		    	 	console.log(span4.text().trim());	
		    	 var span5 = $(spans[5]);
				 data.concede2= span5.text().trim();		
		    	 	console.log(span5.text().trim());	
		    	 var span6 = $(spans[6]);
		    	 	console.log(span6.text().trim());
		    	 var span7 = $(spans[7]);
		    	 	console.log(span7.text().trim());		    	 	
		    	 var span8 = $(spans[8]);
		    	 	console.log(span8.text().trim());		 
			        
		         console.log('...........................................');
		         console.log('gid:'+data.gid);
		         console.log('lid:'+data.lid);
		         console.log('gdatetime:'+data.gdatetime);
		         console.log('guestTeam:'+data.guestTeam);
		         console.log('host:'+data.hostTeam);
		         console.log('concede:'+data.concede);
		         //console.log('concede2:'+data.concede2);
				 */
		        
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

function findArrayWithClass(str,firstClass,secondClass){
	//console.log('findTextWithClass:'+str);
    var buffer = new BufferHelper();
	buffer.concat(str);
	var buf = buffer.toBuffer();
	var str = iconv.decode(buf,'UTF-8');
	var $ = cheerio.load(str);
	var data =[];
	$(firstClass).each(function(i, e) {

		var datas = $(e).find(secondClass);
		var dataDetail = $(datas[0]);
		var dataDetail =dataDetail.text().trim();
		//console.log('findArrayWithClass:'+dataDetail);
		data.push(dataDetail);		
	});
	return data;


};

getFromURL();


