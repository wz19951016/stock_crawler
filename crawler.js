const { Wechaty } = require('wechaty')
const Qrcode = require('qrcode-terminal')
const schedule = require('node-schedule')
const superagent = require('superagent')
const cheerio = require('cheerio')

const bot = new Wechaty()

function getCurrentTime(){
    var dtCur = new Date();
    var yearCur = dtCur.getFullYear();
    var monCur = dtCur.getMonth() + 1;
    var dayCur = dtCur.getDate();
    var hCur = dtCur.getHours();
    var mCur = dtCur.getMinutes();
    var sCur = dtCur.getSeconds();
    timeCur = yearCur + "年" + (monCur < 10 ? "" + monCur : monCur) + "月"
            + (dayCur < 10 ? "" + dayCur : dayCur) + "日 " + (hCur < 10 ? "0" + hCur : hCur)
            + ":" + (mCur < 10 ? "0" + mCur : mCur) + ":" + (sCur < 10 ? "0" + sCur : sCur);
    return timeCur;
}
function scan(qrcode){
    Qrcode.generate(qrcode)
    let ewm = ['https://api.qrserver.com/v1/create-qr-code/?data=',encodeURIComponent(qrcode),'&size=220x220&margin=20',].join('')
    console.log(ewm)
}
function getdaynum(){
    let starttime = new Date(`2019-3-31`).getTime()
    let nowtime = new Date().getTime()
    let num = Math.floor((nowtime-starttime)/(1000*60*60*24))+1
    console.log(num)
    return num
}
async function sendmes(){
    // let str1 = await get_songs()
    let str1 = `春天喜欢花草<br/>夏天喜欢树荫<br/>秋天喜欢落叶<br/>冬天喜欢冰雪<br/>我喜欢你<br/><br/>所以想和你<br/>春天看花草<br/>夏天躲树荫<br/>秋天赏落叶<br/>冬天观冰雪<br/>度过四季`
    let str2 = await get_weather()
    let dt = `${getCurrentTime()} 在一起第${getdaynum()}天`
    let nickname = '水湄而有桥'//设置要发送的收信人的微信昵称
    let contact = await bot.Contact.find({name:nickname})
    let str = `${dt}<br/><br/>林深时见鹿，海蓝时见鲸，梦醒时见你。<br/><br/>${str2}<br/><br/>${str1}<br/><br/>晚安 好梦~`
    // let str = `${dt}<br/><br/>${special}`
    await contact.say(str)
}
function get_songs(){
    return new Promise((resolve,reject) => {
        let page = Math.floor(Math.random()*100)+1
        superagent.get(`https://so.gushiwen.org/mingju/default.aspx?p=${page}&c=&t=`).end((err,pres)=>{
            let $ = cheerio.load(pres.text)
            let item_array = [].slice.apply($('.sons .cont'))
            let item_index = Math.floor(Math.random()*item_array.length)
            let songs = `${$(item_array).eq(item_index).find('a').eq(0).text()} —— ${$(item_array).eq(item_index).find('a').eq(1).text()}`
            console.log(songs)
            resolve(songs)
        })
    })
}
function get_weather(){
    return new Promise((resolve,reject)=>{
        superagent.get(`https://tianqi.moji.com/weather/china/beijing/chaoyang-district`).end((err,pres)=>{
            let $ = cheerio.load(pres.text)
            let tomorrow_item = $('.forecast .days').eq(1)
            let weather = $(tomorrow_item).find('li').eq(1).text().trim()
            let tem = $(tomorrow_item).find('li').eq(2).text().trim()
            let air = $(tomorrow_item).find('li').eq(4).find('strong').text().trim()
            console.log(weather)
            console.log(tem)
            console.log(air)
            let weather_str = `明日天气：${weather}<br/>温度：${tem}<br/>空气质量:${air}`
            resolve(weather_str)
        })
    })
}

bot.on('scan',    (qrcode, status) => {scan(qrcode)})
bot.on('login',   user => { 
    console.log(`User ${user} logined`)
    var j = schedule.scheduleJob('00 22 * * *', function(){
        sendmes()
    });
})
bot.start()