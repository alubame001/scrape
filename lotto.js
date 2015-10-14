// http://ts7777.tw/
//KG62816

/*
加拿大KENO:
夏時令週一至周日 約20:20 - 19:00，每4分鐘一期，開出期數以官網公佈為準。
冬時令週一至周日 約21:20 - 20:00，每4分鐘一期，開出期數以官網公佈為準。

一天有 24*15 -20 -2 = 338 期
                                                                                                                                                                                                                   
*/

var http = require("http");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var async = require('async');
var db = require("mongoose");
var conn = db.connect('mongodb://localhost/rest'); 

var moment = require('moment-timezone');//http://momentjs.com/timezone/  



//[{"drawNbr":1754705,"drawDate":"Jul 31, 2014","drawTime":"11:04:00 AM","drawNbrs":[8,9,13,14,16,25,32,33,36,38,45,46,61,62,69,71,72,73,78,79],"drawBonus":2.0}]
var lottoSchema = new db.Schema({
  kind: String,
  id:  String,
  drawNbr:   Number,   
  drawDate :String,   
  drawTime:   String,
  drawNbrs:[],
  result:{},
  order:Number,
  updDateTime:Number  
});
var lotto = db.model('lotto', lottoSchema);

var lottoScheduleSchema = new db.Schema({
  kind: String,
  id:  String,
  drawNbr:   Number,   
  drawDate :String,   
  drawTime:   String,
  drawNbrs:[],

  updDateTime:Number  
});
var lottoSchedule = db.model('lottoSchedule', lottoScheduleSchema);

/*
var util = require('util');
//var moment = require('moment-timezone');//http://momentjs.com/timezone/
var db = require("mongoose");
var conn = db.connect('mongodb://localhost/rest');   

*/
var sleepTime = 5000;

var CanadaKeno = {kind:'lotto',
				  id:'CanadaKeno',
				  url:"http://lotto.bclc.com/services2/keno/draw/#DRAWNBR#/1?_=1406829487474",
				  latestUrl:"http://lotto.bclc.com/services2/keno/lastest",
				  todayUrl:"http://lotto.bclc.com/services2/keno/draw/latest/today?_=#TODAY#", //http://lotto.bclc.com/services2/keno/draw/latest/today?_=1407079503715
				  urlreview:"http://lotto.bclc.com/winning-numbers/keno-and-keno-bonus.html",
				  sn:1750000,
				  drawtime : 4,				  
				  timezone:'America/Whitehorse',
				  summerStartTime:"05:20",
				 // summerStartTime:"05:36:00 AM",
				  summerEndTime:"04:00:00 AM",
				  winterStartTime:"06:36:00 AM",
				  winterEndTime:"05:00:00 AM"				  
				  };
				  
var WestCanadaKeno = {
				  kind:'lotto',
				  id:'WestCanadaKeno',
				 // url:"http://www.wclc.com/winning-numbers/keno.htm?drawNum=#DRAWNBR#",
				  url:"http://www.wclc.com/winning-numbers/keno.htm",
				  sn:1750000,
				  drawtime : 5,
				  timezone:'America/Sitka',
				  summerStartDate:1406829487474,
				  summerEndDate:1406829487474
				  };				  
//var CanadaKenoUrl = "http://caipiao.163.com/order/jczq-dcjs/"
var SPFUrl = "http://caipiao.163.com/order/jczq-dcjs/"


function loop(){
	async.forEach([0], function(val, cb) {
	//async.forEach([1, 2,3,4,5,6], function(val, cb) {
	//async.forEach([1, 2,3,4,5], function(val, cb) {
	  setTimeout(function() {
		//if (val===1){GetTwoXOne()};	  
		console.log(val);
		switch(val){

		case 0: GetDataFromTarget(CanadaKeno);
		//case 1: GetDataFromTarget(WestCanadaKeno);



		} 
				

		cb();
	  }, 1 / 1 * sleepTime);
	}, function() {
	 //var s='loop finished';
	// console.log(s.green);
	  loop();
	});
}
loop();
function GetDataFromTarget(target){
    var html='';
		//console.log(targetURL);  	
		
		switch(target){

			case CanadaKeno: {
					//GetDate(target);	
					//var LastDrawNbr = GetDrawNbr(target);	
					//var LastDrawNbr2 = GetDrawNbr2(target);	
					//console.log('LastDrawNbr2:'+LastDrawNbr2);
					var arr =getArrayFromURL(target);
					/*
					var newurl = target.url.replace('#DRAWNBR#',LastDrawNbr);

					var obj = getFromURL(target,newurl);
					*/
					/*
					if (obj){
						obj[0].kind=target.kind;
						obj[0].id=target.id;
						obj[0].drawNbr=LastDrawNbr;
						var  data = new lotto(obj[0]);
					    
						IfLottoNullThenSave(data);
					}
					*/
					//if (s) {ParseCanadaKeno(target,s);}			
				};
			/*	
			case WestCanadaKeno:{
		
					GetDate(target);	
					var LastDrawNbr = GetDrawNbr(target);	
					var url = target.url.replace('#DRAWNBR#',LastDrawNbr);

					var s = getFromURL(url);
					if (s) {ParseWestCanadaKeno(WestCanadaKeno,s);}		
				};
			*/


		} 		


	
};

function IfLottoNullThenSave(data){
	data.updDateTime = Date.now();


	lotto.findOne({kind:data.kind,id:data.id,drawNbr:data.drawNbr}, function(err, doc) {	
		  if (!doc){
				data = SetResult(data);
				data.save(function (err) {
				  console.log('IfLottoNullThenSave:'+data);
				  console.log('saved');
				 });		 
		  }else {
			// console.log('existed');
		  }
	});

}
function SetResult(data){
	var total = 0;
	var upTotal = 0;
	var oddTotal = 0;
	data.result ={};
	for (var i=0; i<data.drawNbrs.length; i++){
		total = total+data.drawNbrs[i];	
		if (data.drawNbrs[i]<41){
			upTotal = upTotal+1;
		}
		
		if (data.drawNbrs[i] %2 === 0){
			oddTotal = oddTotal+1;
		}		
	};
	data.result.totalNumber = total;
	data.result.total = total;
	if (total>810){ 
		data.result.total = 'BIG';
	}else{
		data.result.total = 'SMALL';
	}
	if (total%2===0){ 
		data.result.totalOddEven = 'ODD'; //总数单
	}else{
		data.result.totalOddEven = 'EVEN';//总数双
	}	
	if (upTotal>10){ 
		data.result.upTotal = 'UP';
	}else if(upTotal<10) {
		data.result.upTotal = 'DOWN';
	}else if(upTotal=10) {
		data.result.upTotal = 'MIDDLE';
	}
	


	if (oddTotal>10){ 
		data.result.oddTotal = 'ODD';
	}else if(oddTotal<10) {
		data.result.oddTotal = 'EVEN';
	}else if(oddTotal=10) {
		data.result.oddTotal = 'DRAW';
	}	
	if (total>=210 && total<=695){ 
		data.result.fiveElement = 'Y';//金
	}else if (total>=696 && total<=763){ 
		data.result.fiveElement = 'T';//木
	}else if (total>=764 && total<=855){ 
		data.result.fiveElement = 'LB';//水
	}else if (total>=856 && total<=923){ 
		data.result.fiveElement = 'R';//火
	}else if (total>=924 && total<=1410){ 
		data.result.fiveElement = 'BR';//土
	}		
	return data;
}


function ParseWestCanadaKeno(target,str){
	var $ = cheerio.load(str);
	console.log('str:'+str);
	$("table").each(function(i, e) {

			console.log('-----------+-----------+-----------+-----------');	
		if ($(e).hasClass('kenoTable')){
		    
			var data={};
			var spans = $(e).find("td");
	
							
			console.log('odd0:'+spans[0]);					
			console.log('odd1:'+spans[1]);					
			console.log('odd2:'+spans[2]);					
			

		};
	});
}

function ParseCanadaKeno(target,str){
	var $ = cheerio.load(str);
	//console.log('str:'+str);
	$("div").each(function(i, e) {
	console.log('e:'+$(e).text());
			console.log('-----------+-----------+-----------+-----------');	
		
		if ($(e).hasClass('draw-num')){
		    console.log('draw-num:'+$(e).text());	
			var data={};
			var spans = $(e).find("td");
	
							
			console.log('odd0:'+spans[0]);					
			console.log('odd1:'+spans[1]);					
			console.log('odd2:'+spans[2]);					
			

		};
	});
}

function getFromURL(target,newurl){
    var html='';
	console.log('getFromURL:'+newurl);
    var req = http.get(newurl,function(res){
	//console.log('res:'+res);       
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
          
        }).on('end',function(){
            var buf = buffer.toBuffer();
 
          
           var str = iconv.decode(buf,'UTF-8');

            
			console.log("str:"+str);
			return str;
			/*
			if (str.indexOf("Error")>0){ return false};
			if (str.indexOf("error")>0){ return false};				
			var obj = JSON.parse(str);
	
			if (obj){
				console.log("obj[0].drawNbr:"+obj[0].drawNbr);
				//console.log(" getFromURL done");
				
						var LastDrawNbr = GetDrawNbr(target);	
						obj[0].kind=target.kind;
						obj[0].id=target.id;
						obj[0].drawNbr=LastDrawNbr;
						var  data = new lotto(obj[0]);
					    
						IfLottoNullThenSave(data);
								
				
				return obj;
			}
			*/
        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
	   console.log(error);
        //fs.appendFile('error.log',new Date().getTime()+' '
        //    +error+'\r\n','UTF-8');
    });
};

function getArrayFromURL(target){
    var html='';
	//var s =target.todayurl;
    var today = GetTargetToday(target);	
	var newUrl = target.todayUrl.replace('#TODAY#',today.getTime());
	console.log('getFromURL:'+newUrl);
    var req = http.get(newUrl,function(res){
	//console.log('res:'+res);       
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
          
        }).on('end',function(){
            var buf = buffer.toBuffer();
 
          
           var str = iconv.decode(buf,'UTF-8');

            

			
			if (str.indexOf("Error")>0){ return false};
			if (str.indexOf("error")>0){ return false};				
			var obj = JSON.parse(str);
	
			if (obj){
			    var s1 = obj[0].drawNbr;
				var s2 = obj[0].drawTime;
				console.log("lastest:"+s1+','+obj[0].drawTime);
				//console.log(" getFromURL done");
				
						//var LastDrawNbr = GetDrawNbr(target);	
						/*
						for (var i = 0; i < obj.length; ++i) {	
							obj[i].kind=target.kind;
							obj[i].id=target.id;
							//obj[i].drawNbr=LastDrawNbr;
							var  data = new lotto(obj[i]);
							
							IfLottoNullThenSave(data);
						}
						*/
						var found =false;
						var j = 1;
						for (var i = obj.length-1; i >=0; --i) {	
							obj[i].kind=target.kind;
							obj[i].id=target.id;
							if (found){j=j+1;};
							var sdate = GetTargetTodayStartTime(target);
							//console.log('sdate:'+sdate);
							var compareDate = ParseDate(obj[i].drawDate,obj[i].drawTime);
							if (compareDate.getTime()> sdate.getTime()){
								if (found ===false){
									found = true;
									console.log('found:'+compareDate);
								}
							}
							obj[i].order=j;
							//obj[i].drawNbr=LastDrawNbr;
							var  data = new lotto(obj[i]);
							
							IfLottoNullThenSave(data);
						}						
						
								
				
				return obj;
			}
			
        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
	   console.log(error);
        //fs.appendFile('error.log',new Date().getTime()+' '
        //    +error+'\r\n','UTF-8');
    });
};

function FindArrayWithTwoClass(str,firstClass,secondClass){
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

function FindArrayWithOneClass(str,firstClass){
	//console.log('findTextWithClass:'+str);
    var buffer = new BufferHelper();
	buffer.concat(str);
	var buf = buffer.toBuffer();
	var str = iconv.decode(buf,'UTF-8');
	var $ = cheerio.load(str);
	var data =[];
	
	$(firstClass).each(function(i, e) {
		data.push($(e).text());		
	});
	return data;


};
function FindArrayWithClass(str,firstClass,isResultText){
	//console.log('findTextWithClass:'+str);
    var buffer = new BufferHelper();
	buffer.concat(str);
	var buf = buffer.toBuffer();
	var str = iconv.decode(buf,'UTF-8');
	var $ = cheerio.load(str);
	var data =[];
	
	$(firstClass).each(function(i, e) {
		if (isResultText){
			data.push($(e).text());	
		}{
			data.push($(e));	
		}
		
	});
	return data;
};

function doit(x){
		for (var i = 0; i < x; ++i) {	
			btn_roll_low.click();
			$(#clientSeedModal).click();
			SOCKET.emit('coin', 'DogeCoin')			
		}
		
}
function doith(x){
		for (var i = 0; i < x; ++i) {	
			//btn_roll_low.click();
			$('.bet').click()
		}
		
}
function sleep(sleepTime) {
       for(var start = Date.now(); Date.now() - start <= sleepTime; ) { } 
}

function GetDate(target){

	var now = Date.now();
		
	var result    = moment.tz(now, target.timezone);
	console.log(target.id+':'+result.format('MM DD,YYYY HH:mm'));
	var tdate = new Date(result.format('MM DD,YYYY HH:mm'));

	return result.format('MM DD,YYYY HH:mm');
}
function GetTargetToday(target){

	var now = Date.now();
		
	var result    = moment.tz(now, target.timezone);
	console.log(target.id+':'+result.format('MM DD,YYYY HH:mm'));
	var tdate = new Date(result.format('MM DD,YYYY HH:mm'));

	console.log(tdate.getTime());
	return  tdate;
}
function isSummer(target){
	return true;
}
function GetTargetTodayStartTime(target){

	var now = Date.now();
	
	var result    = moment.tz(now, target.timezone);
	//console.log(target.id+':'+result.format('MM DD,YYYY HH:mm'));
	if (isSummer(target)){
		var tdate = new Date(result.format('MM DD,YYYY '+target.summerStartTime));

		//console.log(tdate.getTime());
		return  tdate;
	}
}
function ParseDate(date,time){
	if (date&&time){
	   var pdate =  new Date(date+' '+time);
	   //console.log('pdate:'+pdate);
	   return pdate;
	}
}
function GetDrawNbr2(target){


	var html='';
	console.log('getFromURL:'+target.urlreview);
    var req = http.get(target.urlreview,function(res){
	//console.log('res:'+res);       
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
          
        }).on('end',function(){
            var buf = buffer.toBuffer();          
            var str = iconv.decode(buf,'UTF-8');

            
			//console.log("str:"+str);
			ParseCanadaKeno(target,str)

        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
	   console.log(error);
        //fs.appendFile('error.log',new Date().getTime()+' '
        //    +error+'\r\n','UTF-8');
    });	
	
	
}

function GetDrawNbr(target){

	var now = Date.now();
		
	var targetTimeZoneNow    = moment.tz(now, target.timezone);
	console.log(target.id+':'+targetTimeZoneNow.format('MM DD,YYYY HH:mm:ss'));
	var targetDate = new Date(targetTimeZoneNow.format('MM DD,YYYY HH:mm:ss'));
	//先算出和20140801相差的日数
	var startDate = new Date(2014,07,02);
	//console.log('startDate:'+startDate);	
	var daydiff =DateDiff('d',startDate,targetDate); //加拿大一天有388期
	console.log('daydiff:'+daydiff);
	//算出此时到本日第一次开奖过了多久分钟
	var isSummer = true;//待改
	if (isSummer){
		var targetYY = targetDate.getFullYear();
		var targetMM = targetDate.getMonth();
		var targetDD = targetDate.getDate();
		var targetHH = targetDate.getHours();
		var targetNN = targetDate.getMinutes();
		var targetSS = targetDate.getSeconds();

		console.log(targetHH);
		console.log(targetNN);
		console.log(targetSS);
		/*
		var  targetDate = new Date(targetYY,targetMM,targetDD,targetHH,targetNN,targetSS);
		var  startDate  = new Date(targetYY,targetMM,targetDD,5,20,0);
		var timediff =DateDiff('n',startDate,targetDate); 
		console.log('timediff:'+timediff);
		var  drawNbrDiff= Math.floor(timediff/4) ;
		console.log('drawNbrDiff:'+drawNbrDiff);
		//var startTime = new Date(2014,07,01,05,20,0);	
		*/
		
		switch(target){

			case CanadaKeno: {
				var  targetDate = new Date(targetYY,targetMM,targetDD,targetHH,targetNN,targetSS);
				var  startDate  = new Date(targetYY,targetMM,targetDD,5,40,0);
				console.log('targetDate:'+targetDate);		
				console.log('startDate:'+startDate);		
				var timediff =DateDiff('n',startDate,targetDate); 
				console.log('timediff:'+timediff);
				var  drawNbrDiff= Math.floor(timediff/ target.drawtime) +1;
				console.log('drawNbrDiff:'+drawNbrDiff);
				console.log('daydiff:'+daydiff);
				var baseDrawNbr = 1755298;
				var lastDrawNbr = daydiff * 388 +baseDrawNbr+  drawNbrDiff;
				var nextDrawNbr = lastDrawNbr+1;
					console.log('lastDrawNbr:'+lastDrawNbr);	
					console.log('nextDrawNbr:'+nextDrawNbr);	
				//var startTime = new Date(2014,07,01,05,20,0);	
				return	lastDrawNbr;		
			};
			case WestCanadaKeno:{
				var  targetDate = new Date(targetYY,targetMM,targetDD,targetHH,targetNN,targetSS);
				var  startDate  = new Date(targetYY,targetMM,targetDD,3,30,0);
				console.log('targetDate:'+targetDate);		
				console.log('startDate:'+startDate);		
				var timediff =DateDiff('n',startDate,targetDate); 
				console.log('timediff:'+timediff);
				var  drawNbrDiff= Math.floor(timediff/5) +1;
				console.log('drawNbrDiff:'+drawNbrDiff);
				console.log('daydiff:'+daydiff);
				var baseDrawNbr = 924931;
				var lastDrawNbr = daydiff * 229 +baseDrawNbr+  drawNbrDiff;
				var nextDrawNbr = lastDrawNbr+1;
					console.log('lastDrawNbr:'+lastDrawNbr);	
					console.log('nextDrawNbr:'+nextDrawNbr);	
				//var startTime = new Date(2014,07,01,05,20,0);	
				return	lastDrawNbr;		
			};



		} 				
		
		
	
	}
	
	
	
}

function DateAdd(interval,number,date){
	switch(interval.toLowerCase()){
		case "y": return new Date(date.setFullYear(date.getFullYear()+number));
		case "m": return new Date(date.setMonth(date.getMonth()+number));
		case "d": return new Date(date.setDate(date.getDate()+number));
		case "w": return new Date(date.setDate(date.getDate()+7*number));
		case "h": return new Date(date.setHours(date.getHours()+number));
		case "n": return new Date(date.setMinutes(date.getMinutes()+number));
		case "s": return new Date(date.setSeconds(date.getSeconds()+number));
		case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number));
	} 
}
function DateDiff(interval,date1,date2){
	var long = date2.getTime() - date1.getTime(); //相差毫秒
	switch(interval.toLowerCase()){
		case "y": return parseInt(date2.getFullYear() - date1.getFullYear());
		case "m": return parseInt((date2.getFullYear() - date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth()));
		case "d": return parseInt(long/1000/60/60/24);
		case "w": return parseInt(long/1000/60/60/24/7);
		case "h": return parseInt(long/1000/60/60);//小时
		case "n": return parseInt(long/1000/60);//分
		case "s": return parseInt(long/1000);
		case "l": return parseInt(long);
	}
}
/*
new Date("month dd,yyyy hh:mm:ss");
   new  Date("month dd,yyyy");
   new  Date(yyyy,mth,dd,hh,mm,ss);
   new Date(yyyy,mth,dd);
   new Date(ms);
   
   
   
*/
/*
KG62816
*/
//加拿大KENO:  
//夏時令週一至周日 約20:20 - 19:00，每4分鐘一期，開出期數以官網公佈為準。
//冬時令週一至周日 約21:20 - 20:00，每4分鐘一期，開出期數以官網公佈為準。//
//自2007年起延長夏令時間，从3月的第二個星期日，到11月的第一個星期日。
// 2014/03/09 ~  2014/11/02
//moment(1369266934311).tz('America/Phoenix').format('YYYY-MM-DD HH:mm')
/*
北京快8: 週一至週日 09:05 - 23:55，5分鐘一期，每天開出179期。
台灣賓果: 週一至週日 07:05 - 23:55，5分鐘一期，每天開出203期。
斯洛伐克KENO:
夏時令週一至周日 11:00 - 05:50，每5分鐘一期，共開出227期。
冬時令週一至周日 12:00 - 06:50，每5分鐘一期，共開出227期。
加拿大西部KENO:
夏時令週一至周日 19:30 - 14:30，每5分鐘一期，共開出229期。
冬時令週一至周日 20:30 - 15:30，每5分鐘一期，共開出229期。
加拿大KENO:
08/02  1755297+1
夏時令週一至周日 約20:36 - 19:00，每4分鐘一期，開出期數以官網公佈為準。
冬時令週一至周日 約21:20 - 20:00，每4分鐘一期，開出期數以官網公佈為準。
俄亥俄KENO:
夏時令週一至周日 18:05 - 14:28，每4分鐘一期，共開出307期。
冬時令週一至周日 19:05 - 15:28，每4分鐘一期，共開出307期。
服务器ip： 60.249.122.25
账号：ray
密码: hI31XLDI29sYrd5B
*/