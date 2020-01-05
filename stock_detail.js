const cheerio = require('cheerio')
const superagent = require('superagent')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')


let result = []

async function getStock(){
    const browser = await puppeteer.launch({
        defaultViewport:{
            width: 1920,
            height: 10000
        }
    });
    const page = await browser.newPage();
    const read_data = await readfile()
    result = read_data
    for(let item of result){
        console.log(`正在爬取${item.name}详细数据`)
        await page.goto(`http://stockpage.10jqka.com.cn/${item.code}/`)
        await page.waitForSelector('.sub_cont_5')
        console.log('准备开始')
        let back = await page.evaluate(()=>{
            let obj = {}
            let company = document.querySelectorAll('#company_info table tbody tr')
            obj.zy = company[1].querySelector('td')[1].querySelector('span').innerText
            obj.desc = company[6].querySelector('td')[0].querySelector('span').innerText
            obj.score = document.querySelector('.analyze-num').innerText
            obj.jg_comment = document.querySelector('.jg-tips').innerText
            return obj
        })
        console.log(back)
        item = {...item,...back}
        sleep()
    }
    outfile(result)
}
function outfile(data){
    fs.writeFile('./stock.json', JSON.stringify(data, null, 4), (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved suc! ");
        }
    });
}
function sleep(){
    return new Promise((resolve,reject)=>{
        let time = Math.floor(Math.random()*500)+500
        console.log(`等待${time}毫秒后开始爬取下一页...`)
        setTimeout(() => {
            resolve('sleep over!')
        }, time);
    })
}
function readfile(){
    return new Promise((resolve,reject)=>{
        fs.readFile(path.join(__dirname,'stock.json'),'utf-8',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(JSON.parse(data).length)
                resolve(JSON.parse(data))
            }
        })
    })
}
getStock()