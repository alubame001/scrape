// http://ts7777.tw/
//KG62816
var request = require('request');
var http = require("http");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var async = require('async');
/*
var util = require('util');
//var moment = require('moment-timezone');//http://momentjs.com/timezone/
var db = require("mongoose");
var conn = db.connect('mongodb://localhost/rest');   

*/
var sleepTime = 30000;
var url = "http://caipiao.163.com/order/jczq/spfmixp.html"
var SPFUrl = "http://caipiao.163.com/order/jczq-dcjs/"
var TwoXOneUrl = "http://caipiao.163.com/order/jczq-dcjs/"
var BiFenUrl = "http://caipiao.163.com/order/jczq-bifen/"
var JinQiuUrl = "http://caipiao.163.com/order/jczq-jinqiu/"
var BanQuanUrl = "http://caipiao.163.com/order/jczq-banquan/"
var AiCaiUrl = "http://jc.aicai.com/"
var CqSscUrl ="http://caipiao.163.com/award/cqssc/"  //重庆时时彩
var Kl8Url ="http://caipiao.163.com/award/kl8/"  //快乐8时时彩
var JxSScUrl ="http://caipiao.163.com/award/kl8/"  //新时时彩
//var ShSScUrl ="http://cp.swlc.sh.cn/notice/ssl/index.html"  //上海时时彩
var kl8sn = 0
function loop(){

	async.forEach([0], function(val, cb) {
	//async.forEach([1, 2,3,4,5,6], function(val, cb) {
	//async.forEach([1, 2,3,4,5], function(val, cb) {
	  setTimeout(function() {
		//if (val===1){GetTwoXOne()};	  
		console.log(val);
		switch(val){

		case 0: GetDataFromUrl(Kl8Url);
		//case 1: GetDataFromUrl(AiCaiUrl);
		//case 2: GetDataFromUrl(JxSScUrl);
		//case 1: GetDataFromUrl(SPFUrl);
		//case 2: GetDataFromUrl(JinQiuUrl);
		//case 3: GetDataFromUrl(BanQuanUrl);
		//case 4: GetDataFromUrl(BiFenUrl);


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
function GetDataFromUrl(targetURL){
    console.log("GetDataFromUrl:",targetURL)
    var html='';
	
	
    var req = http.get(targetURL,function(res){
       
        var buffer = new BufferHelper();
        res.on('data',function(data){
            
            buffer.concat(data);
           
        }).on('end',function(){
            var buf = buffer.toBuffer();
			var str ='';
         
            str = iconv.decode(buf,'UTF-8');
 	//console.log(str);          

		switch(targetURL){

			case SPFUrl	   : ParseSPF(str);
			case BiFenUrl  : ParseBiFen(str);
			case JinQiuUrl : ParseJinQiu(str);
			case BanQuanUrl: ParseBanQuan(str);
			case AiCaiUrl  : ParseAiCaiUrl(str);
			case CqSscUrl  : ParseCqSsc(str,"cq");
			case Kl8Url  : ParseKl8(str);
			case JxSScUrl  : ParseCqSsc(str,"jx");


		}                   

			console.log("done");
			
        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
        //fs.appendFile('error.log',new Date().getTime()+' '      +error+'\r\n','UTF-8');
    });
};

function SendForm(data){
    data = require('querystring').stringify(data);
    console.log(data);
    var opt = {
        method: "POST",
        host: "localhost",
        port: 80,
        path: "/race/incoming",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }
    };

    var req = http.request(opt, function (serverFeedback) {
    	/*
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) { body += data; })
                          .on('end', function () { res.send(200, body); });
        }
        else {
            res.send(500, "error");
        }
        */
    });
    req.write(data + "\n");
    req.end();
}

function SendDataTo(data,router){
    data = require('querystring').stringify(data);
    console.log(data);
    var opt = {
        method: "POST",
        host: "localhost",
        port: 80,
        path: "/"+router+"/incoming",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }
    };

    var req = http.request(opt, function (serverFeedback) {
    	/*
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) { body += data; })
                          .on('end', function () { res.send(200, body); });
        }
        else {
            res.send(500, "error");
        }
        */
    });
    req.write(data + "\n");
    req.end();
}



function SendJson(data){
	/*
    var data = {
        address: 'test@test.com',
        subject: "test"
    };
	*/
    data = JSON.stringify(data);
    console.log(data);
    var opt = {
        method: "POST",
        host: "localhost",
        port: 80,
        path: "/race",
        headers: {
            "Content-Type": 'application/json',
           // "Content-Type": 'text/html',
            "Content-Length": data.length
        }
    };

    var req = http.request(opt, function (serverFeedback) {
    	/*
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) { body += data; })
                          .on('end', function () {
                          	 
                          	 res.send(200, body); 
                       	});
        }
        else {
           // res.send(500, "error");
        }
        */
    });
    req.write(data + "\n");
    req.end();


}
/*
function GetTwoXOne(){
	var str =GetDataFromUrl(TwoXOneUrl);
	//console.log(str);
}
*/
function ParseSPF(str){
	var $ = cheerio.load(str);

	$("dd").each(function(i, e) {
		if ($(this).attr('matchid')){
			var data={};
			var spans = $(e).find("span");
			console.log('matchid:'+ $(this).attr('matchid'));
			console.log('league:'+ $(spans[1]).text().trim());
			console.log('isstop:'+$(this).attr('isstop'));
			console.log('matchcode:'+$(this).attr('matchcode'));
			console.log('matchnumcn:'+$(this).attr('matchnumcn'));
			console.log('starttime:'+$(this).attr('starttime'));
			console.log('endtime:'+$(this).attr('endtime'));
			console.log('isattention:'+$(this).attr('isattention'));
			data.matchid=$(this).attr('matchid');
			data.league=$(this).attr('league');
			data.isstop=$(this).attr('isstop');
			data.matchcode=$(this).attr('matchcode');
			data.matchnumcn=$(this).attr('matchnumcn');
			data.starttime=$(this).attr('starttime');
			data.endtime=$(this).attr('endtime');
			data.isattention=$(this).attr('isattention');

			var teamData=FindArrayWithTwoClass($(spans[3]),'em','b');						
			var teamRankData=FindArrayWithTwoClass($(spans[3]),'em','i');						
			data.hostname  = teamRankData[0]+teamData[0];
			data.guestname = teamRankData[1]+teamData[1];			
			console.log('hostname:'+data.hostname);
			console.log('guestname:'+data.guestname);
			
			var oddData=FindArrayWithOneClass($(spans[4]),'em');	
							
			console.log('odd0:'+oddData[0]);					
			console.log('odd1:'+oddData[1]);					
			console.log('odd2:'+oddData[2]);					
			
			console.log('-----------');
		};
	});
}
function ParseBiFen(str){
	var $ = cheerio.load(str);
	var data={};
	var bf=[];
	$("dd").each(function(i, e) {
		if ($(this).attr('matchid')){
			
			var spans = $(e).find("span");
			console.log('matchid:'+ $(this).attr('matchid'));
			console.log('league:'+ $(spans[1]).text().trim());
			console.log('isstop:'+$(this).attr('isstop'));
			console.log('matchcode:'+$(this).attr('matchcode'));
			console.log('matchnumcn:'+$(this).attr('matchnumcn'));
			console.log('starttime:'+$(this).attr('starttime'));
			console.log('endtime:'+$(this).attr('endtime'));
			console.log('isattention:'+$(this).attr('isattention'));
			data.matchid=$(this).attr('matchid');
			data.league=$(this).attr('league');
			data.isstop=$(this).attr('isstop');
			data.matchcode=$(this).attr('matchcode');
			data.matchnumcn=$(this).attr('matchnumcn');
			data.starttime=$(this).attr('starttime');
			data.endtime=$(this).attr('endtime');
			data.isattention=$(this).attr('isattention');

			var teamData=FindArrayWithTwoClass($(spans[3]),'em','b');						
			var teamRankData=FindArrayWithTwoClass($(spans[3]),'em','i');						
			data.hostname  = teamRankData[0]+teamData[0];
			data.guestname = teamRankData[1]+teamData[1];			
			console.log('hostname:'+data.hostname);
			console.log('guestname:'+data.guestname);
			
			var oddData=FindArrayWithOneClass($(spans[4]),'em');	
							
				
			
			
		};
		if ($(this).attr('relation')){	
			var datas = FindArrayWithClass($(e),'td',false);
			var scoreData=FindArrayWithClass(datas[0],'td',true);	
			var oddData=FindArrayWithClass(datas[0],'div',true);	
			data.bf = [];
			//console.log('spans[0]:'+datas[0]);
			//console.log('spans[1]:'+datas[1]);
			for (var i=0; i<datas.length; i++){			
				if ($(datas[i]).attr('sp') && $(datas[i]).attr('gametype')==='bf'  ){
					//console.log('spans['+i+']:'+datas[i]);
					data.bf.push($(datas[i]).attr('sp')); 
					
				}
			
			}
			
			//console.log('bfodd0:'+data.bf[0]);
			//console.log('bfodd1:'+data.bf[1]);

		}		
		
	console.log('-----------');	
	});
	
}


function ParseAiCaiUrl(str){
	var $ = cheerio.load(str);
	var data={};
	var jinqui=[];
	var printed = false
	$(".jcmodule").each(function(i, e) {
		if ($(this).attr('jraceid')){
			// <span class="jctime" id="j_match_status_13287" jmatchstatus="0">10-04 23:00开赛</span>
			var datas = FindArrayWithClass($(e),'span',true);
			var json= {}
			var str = datas[2]
			var jc_time_index = str.indexOf("开赛")
				//if (jc_time_index>0) {
				if (true) {
					str = str.substr(0,str.length-2)
					//str.replace("/开赛/n", "")
					json.sn = $(this).attr('jraceid')
					json.jc_time= str
					json.mteam= datas[6]
					json.steam= datas[10]
					json.mteam_odd = datas[14]
					json.even_odd  = datas[18]
					json.steam_odd = datas[22]
					json.zero_ball_odd = datas[26]
					json.one_ball_odd = datas[30]
					json.two_ball_odd = datas[34]
					json.three_ball_odd = datas[38]
					json.four_ball_odd = datas[44]
					json.five_ball_odd = datas[48]
					json.six_ball_odd = datas[52]
					json.seven_ball_odd = datas[56]

				   	console.log("json:",json)
				   	//SendJson(json)					
				   	SendForm(json)					
				}

		}
/*
0 ="可竟猜" AbleToBet = true
2  JcTime
6  主队
8  比分 '--:--'
10 客队
14  主队胜赔率
18 平赔率
22 客队胜赔率 
26 0球赔率 
30 1球赔率
34 2球赔率
38 3球赔率 
44 4球赔率
48 5球赔率
52 6球赔率
56 7球以上赔率 

type Race struct {
	Id      int	
	Symbol string    `orm:"size(10)"`
	Sn string    `orm:"size(20)"` //期号
	JcTime string    `orm:"size(20)"` //开赛时间
	Mteam string    `orm:"size(40)"` //主队
	Steam string    `orm:"size(40)"` //客队	
	AbleToBet bool 
	MteamScore int  
	SteamScore int  
	TotalScore int  
	MteamOdd  float64 `orm:"digits(12);decimals(4);null"` 
	SteamOdd  float64 `orm:"digits(12);decimals(4);null"` 
	EvenOdd  float64 `orm:"digits(12);decimals(4);null"` 
	OneBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	TwoBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	ThreeBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	FourBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	FiveBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	SixBallOdd  float64 `orm:"digits(12);decimals(4);null"` 
	SevenBallOdd  float64 `orm:"digits(12);decimals(4);null"` //七球以上赔率
	Created time.Time `orm:"auto_now_add"`
}

*/
			
	
		
		console.log('-----------');	
	});
}

/*
<dd isstop="0" matchcode="201510047012" matchnumcn="周日012" starttime="1443952800000" endtime="1443952620000" isattention="0" isdg="0" hostname="岐阜FC" guestname="德岛漩涡" leagueid="533" hostteamid="41121" visitteamid="19606" matchid="1093762" leaguename="J2联赛" class="league_533  even" ishot="0">    
	<span class="co1"><i class="jtip" inf="周日012">012</i></span>
    <span class="co2"><a href="http://zx.caipiao.163.com/football/league/533.html?mid=1093762" target="_blank">J2联赛</a></span>
    <span class="co3 gameTime"><i class="jtip" inf="截止时间：2015-10-04 17:57<br/>开赛时间：2015-10-04 18:00">17:57</i></span>
    <span class="co4">
        <a href="http://zx.caipiao.163.com/library/football/match.html?mId=1093762&amp;hId=41121&amp;vId=19606" target="_blank">
        <em class="hostTeam" title="岐阜FC"><i class="c_939393">[18]</i><b>岐阜FC</b></em>        
        <em class="guestTeam" title="德岛漩涡"><b>德岛漩涡</b><i class="c_939393">[11]</i></em>
        </a>
    </span>
    <span class="co6 btnBox  ">
        <div class="line1">
			<em index="0" gametype="bqc" sp="4.40" class="">4.40</em><em index="1" gametype="bqc" sp="15.00" class="">15.00</em><em index="2" gametype="bqc" sp="31.00" class="">31.00</em><em index="3" gametype="bqc" sp="5.30" class="">5.30</em><em index="4" gametype="bqc" sp="3.75" class="">3.75</em><em index="5" gametype="bqc" sp="5.10" class="">5.10</em><em index="6" gametype="bqc" sp="34.00" class="">34.00</em><em index="7" gametype="bqc" sp="15.00" class="">15.00</em><em index="8" gametype="bqc" sp="4.25" class="lastOne">4.25</em>
                    
        </div>
    </span>
    <span class="co8">
    	<a href="javascript:;" class="ico_square moreData">简</a><a href="http://zx.caipiao.163.com/library/football/match.html?mId=1093762&amp;hId=41121&amp;vId=19606" target="_blank" class="ico_square">析</a>
    </span>
</dd>

*/

function ParseBanQuan(str){
	var $ = cheerio.load(str);
	var data={};
	var jinqui=[];
	$("dd").each(function(i, e) {
		if ($(this).attr('matchid')){
			
			var spans = $(e).find("span");
			console.log('matchid:'+ $(this).attr('matchid'));
			console.log('league:'+ $(spans[1]).text().trim());
			console.log('isstop:'+$(this).attr('isstop'));
			console.log('matchcode:'+$(this).attr('matchcode'));
			console.log('matchnumcn:'+$(this).attr('matchnumcn'));
			console.log('starttime:'+$(this).attr('starttime'));
			console.log('endtime:'+$(this).attr('endtime'));
			console.log('isattention:'+$(this).attr('isattention'));
			data.matchid=$(this).attr('matchid');
			data.league=$(this).attr('league');
			data.isstop=$(this).attr('isstop');
			data.matchcode=$(this).attr('matchcode');
			data.matchnumcn=$(this).attr('matchnumcn');
			data.starttime=$(this).attr('starttime');
			data.endtime=$(this).attr('endtime');
			data.isattention=$(this).attr('isattention');
			
			var teamData=FindArrayWithTwoClass($(spans[3]),'em','b');						
			var teamRankData=FindArrayWithTwoClass($(spans[3]),'em','i');						
			data.hostname  = teamRankData[0]+teamData[0];
			data.guestname = teamRankData[1]+teamData[1];			
			console.log('hostname:'+data.hostname);
			console.log('guestname:'+data.guestname);
			
			var datas=FindArrayWithOneClass($(spans[4]),'em');	
							
			//console.log('odd0:'+datas[0]);					
			//console.log('odd1:'+datas[1]);					
			//console.log('odd2:'+datas[2]);	
			data.bq = [];			
			for (var i=0; i<datas.length; i++){	
				data.bq.push(datas[i]);
				console.log('bq['+i+']:'+datas[i]);
			}
			
		};
	
		
		console.log('-----------');	
	});
}
/*
<tr class="">
        <td class="start" data-win-number="1 9 6 3 9" data-period="151007001">001</td>
            <td class="award-winNum">1 9 6 3 9</td>
            <td>小单</td>
            <td>大单</td>
<td class="color-state-">组六</td>    <td class="td-countDown js-award" colspan="4" style="display:none;"><span class="js-text">等待开奖中...&nbsp;&nbsp;</span> <strong class="residue-time">-:-</strong>
    </td><td class="td-countDown js-bet" colspan="4" style="display:none;">投注剩余时间 <strong class="residue-time">-:-</strong> <a href="/order/cqssc/" target="_blank" class="lot-bt">投注</a></td>
        <td class="start" data-win-number="6 7 7 4 5" data-period="151007041">041</td>
            <td class="award-winNum">6 7 7 4 5</td>
            <td>小双</td>
            <td>大单</td>
<td class="color-state-">组六</td>    <td class="td-countDown js-award" colspan="4" style="display:none;"><span class="js-text">等待开奖中...&nbsp;&nbsp;</span> <strong class="residue-time">-:-</strong>
    </td><td class="td-countDown js-bet" colspan="4" style="display:none;">投注剩余时间 <strong class="residue-time">-:-</strong> <a href="/order/cqssc/" target="_blank" class="lot-bt">投注</a></td>
        <td class="start" data-period="151007081">081</td>
        <td>- -</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
    <td class="td-countDown js-award" colspan="4" style="display:none;"><span class="js-text">等待开奖中...&nbsp;&nbsp;</span> <strong class="residue-time">-:-</strong>
    </td><td class="td-countDown js-bet" colspan="4" style="display:none;">投注剩余时间 <strong class="residue-time">-:-</strong> <a href="/order/cqssc/" target="_blank" class="lot-bt">投注</a></td>
            </tr>
*/
function ParseCqSsc(str,symbol){
	var $ = cheerio.load(str);
	var data={};
	var jinqui=[];
	$("td").each(function(i, e) {
		if ($(this).attr('data-period')){
			if ($(this).attr('data-win-number')){
		//if (true){
		//	var tds = $(e).find("td");
				console.log('data-period:',$(this).attr('data-period'));	
				var s = $(this).attr('data-win-number')
				s = s.trim();
				console.log('data-win-number:',s);
				var json={};
				json.symbol= symbol
				json.sn = $(this).attr('data-period')
				json.win_number=$(this).attr('data-win-number')

				console.log("json:",json)
				SendDataTo(json,"ssc")	


			}
			
			
		};
	
		
		console.log('-----------');	
	});
	
}
function ParseKl8(str){
	var $ = cheerio.load(str);
	
	var jinqui=[];
	$("a").each(function(i, e) {
		//console.log($(this))
		if ($(this).attr('matchball')){			

			console.log('data-period:',$(this).text());	
			console.log('data-win-number:',$(this).attr('matchball'));

			var json={};

			json.symbol= "kl8"
			json.sn = $(this).text()
			json.win_number= $(this).attr('matchball')

			console.log("json:",json)
			SendDataTo(json,"ssc")				
			
		};
	
		
		console.log('-----------');	
	});
	
}
function ParseJxSSc(str){
	var $ = cheerio.load(str);
	
	var jinqui=[];
	$("a").each(function(i, e) {
		//console.log($(this))
		if ($(this).attr('matchball')){			

			console.log('data-period:',$(this).text());	
			console.log('data-win-number:',$(this).attr('matchball'));

			var json={};
			json.symbol= "kl8"
			json.sn = $(this).text()
			json.win_number= $(this).attr('matchball')

			console.log("json:",json)
			SendDataTo(json,"ssc")				

		};
	
		
		console.log('-----------');	
	});
	
}
function ParseJinQiu(str){
	var $ = cheerio.load(str);
	var data={};
	var jinqui=[];
	$("dd").each(function(i, e) {
		if ($(this).attr('matchid')){
			
			var spans = $(e).find("span");
			console.log('matchid:'+ $(this).attr('matchid'));
			console.log('league:'+ $(spans[1]).text().trim());
			console.log('isstop:'+$(this).attr('isstop'));
			console.log('matchcode:'+$(this).attr('matchcode'));
			console.log('matchnumcn:'+$(this).attr('matchnumcn'));
			console.log('starttime:'+$(this).attr('starttime'));
			console.log('endtime:'+$(this).attr('endtime'));
			console.log('isattention:'+$(this).attr('isattention'));
			data.matchid=$(this).attr('matchid');
			data.league=$(this).attr('league');
			data.isstop=$(this).attr('isstop');
			data.matchcode=$(this).attr('matchcode');
			data.matchnumcn=$(this).attr('matchnumcn');
			data.starttime=$(this).attr('starttime');
			data.endtime=$(this).attr('endtime');
			data.isattention=$(this).attr('isattention');
			
			var teamData=FindArrayWithTwoClass($(spans[3]),'em','b');						
			var teamRankData=FindArrayWithTwoClass($(spans[3]),'em','i');						
			data.hostname  = teamRankData[0]+teamData[0];
			data.guestname = teamRankData[1]+teamData[1];			
			console.log('hostname:'+data.hostname);
			console.log('guestname:'+data.guestname);
			
			var datas=FindArrayWithOneClass($(spans[4]),'em');	
							
			//console.log('odd0:'+datas[0]);					
			//console.log('odd1:'+datas[1]);					
			//console.log('odd2:'+datas[2]);	
			data.jq = [];			
			for (var i=0; i<datas.length; i++){	
				data.jq.push(datas[i]);
				console.log('odd'+i+':'+datas[i]);
			}
			
		};
	
		
		console.log('-----------');	
	});
	
}
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
				if ($(this).attr('matchid')){
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
				 var teamData=FindArrayWithTwoClass(span3,'em','b');						
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
		        }
			});
			console.log("done");
			return false;
			
        }).on('close',function(){
            console.log('Close recevied!');
        });
    });
    req.on('error',function(error){
        fs.appendFile('error.log',new Date().getTime()+' '
            +error+'\r\n','UTF-8');
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
//getFromURL()


