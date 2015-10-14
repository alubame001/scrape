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
var sleepTime = 1000;
var url = "http://caipiao.163.com/order/jczq/spfmixp.html"
var SPFUrl = "http://caipiao.163.com/order/jczq-dcjs/"
var TwoXOneUrl = "http://caipiao.163.com/order/jczq-dcjs/"
var BiFenUrl = "http://caipiao.163.com/order/jczq-bifen/"
var JinQiuUrl = "http://caipiao.163.com/order/jczq-jinqiu/"
var BanQuanUrl = "http://caipiao.163.com/order/jczq-banquan/"
var AiCaiUrl = "http://jc.aicai.com/"
var JcSscUrl ="http://caipiao.163.com/order/cqssc/#from=leftnav"

function loop(){
	async.forEach([0], function(val, cb) {
	//async.forEach([1, 2,3,4,5,6], function(val, cb) {
	//async.forEach([1, 2,3,4,5], function(val, cb) {
	  setTimeout(function() {
		//if (val===1){GetTwoXOne()};	  
		console.log(val);
		switch(val){

		case 0: GetDataFromUrl(AiCaiUrl);
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

	//request.post('http://localhost/race', {form:{key:'value'}})
	//request.post('http://localhost/race').form({key:'value'})




    var jsondata = {
        address: 'test@test.com',
        subject: "test"
    };

    data = require('querystring').stringify(data);
    console.log(data);
    var opt = {
        method: "POST",
        host: "localhost",
        port: 80,
        path: "/race",
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
/*
			<div class="jcmodule jcmodule-start" id="j_race_id_13287" name="j_race_zone" jraceid="13287" jracetype="0" jmin="0" jleague="43" jtopchannel="1,2,3,4" jmatchtime="10-04 23:00" jshow="1" style="display:block">
				<div class="jcmodhead" name="j_head" jraceid="13287">
					<div class="jmhleft">
						<i class="ictag"></i>
					             <span class="jcstate" id="j_race_status_13287" jracestatus="1">可竞猜</span>
                          	     <span class="jctime" id="j_match_status_13287" jmatchstatus="0">10-04 23:00开赛</span>
					</div>
					<div class="jmhright">
						<a href="/race/detail?mId=13287" target="_blank" class="jcmore">全部竞猜项&gt;&gt;</a>
						<span class="xinbo" name="j_race_expand_area" jraceid="13287"><i id="j_race_expand_13287" jraceid="13287" class="jxin active"></i></span>
					</div>
					<div class="jmhvs">
						<span class="jmhteaml" id="j_left_team_13287">阿森纳</span>
						   <span id="j_score_13287" class="jmhnon">--:--</span>
						<span class="jmhteamr" id="j_right_team_13287">曼联</span>
					</div>
				</div>
				<div id="j_race_body_13287" class="jcmodtopic clearfix" style="display: block;">
				      <div class="matchGuessMod" sd="1" id="j_sub_103039_div">
				      <div class="mgmTitle" id="j_sub_name_103039">1.阿森纳vs曼联比赛的胜平负？</div>
						<input id="j_sub_status_103039" type="hidden" value="1">
						<div class="mgmDataBo clearfix">
							<div class="mgmDataLis" id="j_opt_div_593485" name="j_opt_div">
								<div id="j_opt_isright_593485" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103039" jraceid="13287" sd="1" id="j_opt_area_593485" name="j_opt_area" quizoptid="593485">
								        <div class="justify">
										<span id="j_opt_name_593485">阿森纳胜</span>
										<span id="j_opt_odds_593485">1.78</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    30%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:30%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593485" name="j_bet_area" style="display:block;"></div>
							</div>
							<div class="mgmDataLis" id="j_opt_div_593487" name="j_opt_div">
								<div id="j_opt_isright_593487" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103039" jraceid="13287" sd="1" id="j_opt_area_593487" name="j_opt_area" quizoptid="593487">
								        <div class="justify">
										<span id="j_opt_name_593487">阿森纳平</span>
										<span id="j_opt_odds_593487">3.35</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    20%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:20%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593487" name="j_bet_area" style="display:block;"></div>
							</div>
							<div class="mgmDataLis" id="j_opt_div_593489" name="j_opt_div">
								<div id="j_opt_isright_593489" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103039" jraceid="13287" sd="1" id="j_opt_area_593489" name="j_opt_area" quizoptid="593489">
								        <div class="justify">
										<span id="j_opt_name_593489">阿森纳负</span>
										<span id="j_opt_odds_593489">3.80</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    49%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:49%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593489" name="j_bet_area" style="display:block;"></div>
							</div>
						</div>
					</div><!-- .matchGuessMod end -->
				         <div class="matchGuessMod" sd="1" id="j_sub_103041_div">
				         <div class="mgmTitle" id="j_sub_name_103041">2.阿森纳vs曼联比赛的总进球数？</div>
						<input id="j_sub_status_103041" type="hidden" value="1">
						<div class="mgmDataBo clearfix">
							 <div class="mgmDataLis" id="j_opt_div_593491" name="j_opt_div">
							 	<div id="j_opt_isright_593491" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593491" name="j_opt_area" quizoptid="593491">
								        <div class="justify">
										<span id="j_opt_name_593491">0个</span>
										<span id="j_opt_odds_593491">10.50</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    4%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:4%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593491" name="j_bet_area" style="display:block;"></div>
							</div>
							 <div class="mgmDataLis" id="j_opt_div_593493" name="j_opt_div">
							 	<div id="j_opt_isright_593493" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593493" name="j_opt_area" quizoptid="593493">
								        <div class="justify">
										<span id="j_opt_name_593493">1个</span>
										<span id="j_opt_odds_593493">4.50</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    9%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:9%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593493" name="j_bet_area" style="display:block;"></div>
							</div>
							 <div class="mgmDataLis" id="j_opt_div_593495" name="j_opt_div">
							 	<div id="j_opt_isright_593495" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593495" name="j_opt_area" quizoptid="593495">
								        <div class="justify">
										<span id="j_opt_name_593495">2个</span>
										<span id="j_opt_odds_593495">3.20</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    17%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:17%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593495" name="j_bet_area" style="display:block;"></div>
							</div>
							 <div class="mgmDataLis" id="j_opt_div_593497" name="j_opt_div">
							 	<div id="j_opt_isright_593497" jisright="1" style="display:block"></div>
								<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593497" name="j_opt_area" quizoptid="593497">
								        <div class="justify">
										<span id="j_opt_name_593497">3个</span>
										<span id="j_opt_odds_593497">3.60</span>
									</div>
								</div>
								  <div class="mgmPercentum">
								    20%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:20%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593497" name="j_bet_area" style="display:block;"></div>
							</div>
							<div class="mgmDataLis allDataLis">
								<div class="mgmbtn">
									<span class="jcmore">更多选项&gt;&gt;</span>
								</div>
								<div class="allShowLis" id="j_opt_more_103041" style="display: none;">
									<div class="mgmDataLis" id="j_opt_div_593499" name="j_opt_div">
										<div id="j_opt_isright_593499" jisright="1" style="display:block"></div>
										<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593499" name="j_opt_area" quizoptid="593499">
								               <div class="justify">
												<span id="j_opt_name_593499">4个</span>
									        	<span id="j_opt_odds_593499">5.30</span>
									        </div>
										</div>
								  <div class="mgmPercentum">
								    7%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:7%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593499" name="j_bet_area" style="display:block;"></div>
							   </div>
									<div class="mgmDataLis" id="j_opt_div_593501" name="j_opt_div">
										<div id="j_opt_isright_593501" jisright="1" style="display:block"></div>
										<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593501" name="j_opt_area" quizoptid="593501">
								               <div class="justify">
												<span id="j_opt_name_593501">5个</span>
									        	<span id="j_opt_odds_593501">9.00</span>
									        </div>
										</div>
								  <div class="mgmPercentum">
								    13%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:13%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593501" name="j_bet_area" style="display:block;"></div>
							   </div>
									<div class="mgmDataLis" id="j_opt_div_593503" name="j_opt_div">
										<div id="j_opt_isright_593503" jisright="1" style="display:block"></div>
										<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593503" name="j_opt_area" quizoptid="593503">
								               <div class="justify">
												<span id="j_opt_name_593503">6个</span>
									        	<span id="j_opt_odds_593503">17.00</span>
									        </div>
										</div>
								  <div class="mgmPercentum">
								    11%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:11%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593503" name="j_bet_area" style="display:block;"></div>
							   </div>
									<div class="mgmDataLis" id="j_opt_div_593505" name="j_opt_div">
										<div id="j_opt_isright_593505" jisright="1" style="display:block"></div>
										<div class="mgmbtn btnopen" subid="103041" jraceid="13287" sd="1" id="j_opt_area_593505" name="j_opt_area" quizoptid="593505">
								               <div class="justify">
												<span id="j_opt_name_593505">7+个</span>
									        	<span id="j_opt_odds_593505">26.00</span>
									        </div>
										</div>
								  <div class="mgmPercentum">
								    15%
								  </div>
								  <div class="mgmPlanBox">
									<div class="mgmPlan">
										<div class="mgmPlanShow" style="width:15%;"></div>
									</div>
								  </div>
								  <div id="j_bet_area_593505" name="j_bet_area" style="display:block;"></div>
							   </div>
							  </div>
							</div>
						</div>
					</div><!-- .matchGuessMod end -->
				</div>
				<i class="ypj"></i>
			</div>
*/

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


