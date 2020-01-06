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
        await page.goto(`http://stockpage.10jqka.com.cn/${item.code}/`,{timeout : 5000}).then(s=>{
            console.log('资源请求成功')
        }).catch(s=>{
            console.log('资源请求超时')
        })
        await page.waitForSelector('#footer')
        console.log('准备开始')
        let back = await page.evaluate(()=>{
            let obj = {}
            let company = document.querySelectorAll('#company_info table tbody tr')
            obj.zy = company&&company.length>0 ? company[1].querySelectorAll('td')[1].querySelector('span').innerText : '暂无主营介绍'
            obj.desc = company&&company.length>0 ? company[6].querySelectorAll('td')[0].querySelector('span').innerText : '暂无详细介绍'
            obj.score = document.querySelector('.analyze-num') ? document.querySelector('.analyze-num').innerText : '暂无机构评分'
            obj.jg_comment =document.querySelector('.jg-tips') ? document.querySelector('.jg-tips').innerText : '暂无买入评级'
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