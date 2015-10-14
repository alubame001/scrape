var http = require("http");
var cheerio = require("cheerio");


var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var url = "http://odds.gooooal.com/index_new.html"

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
		   var body = $('#mm_content')
		    console.log('body:'+body);
           var teamData=findArrayWithClass(body,'tr','input');	
            
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
	console.log('findArrayWithClass:'+str);
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
		console.log('findArrayWithClass:'+dataDetail);
	//	data.push(dataDetail);		
	});
	//return data;


};

getFromURL()


