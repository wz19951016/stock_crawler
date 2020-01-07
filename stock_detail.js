const cheerio = require('cheerio')
const superagent = require('superagent')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')


let result = []

async function getStock(){
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    let [arr1, arr2, arr3] = await Promise.all([thread1(browser),thread2(browser),thread3(browser)])
    outfile([...arr1,...arr2,...arr3])
}
async function thread1(browser){
    const page = await browser.newPage();
    const read_data = await readfile()
    result = read_data
    let n = 0, back_data = []
    while(3*n <= read_data.length-1){
        console.log(`线程1正在爬取${read_data[3*n].name}详细数据`)
        await page.goto(`http://stockpage.10jqka.com.cn/${read_data[3*n].code}/`,{timeout : 5000}).then(s=>{
        }).catch(s=>{
        })
        await page.waitForSelector('.m_header')
        let back = await page.evaluate(()=>{
            let obj = {}
            let company = document.querySelectorAll('#company_info table tbody tr')
            obj.zy = company&&company.length>0 ? company[1].querySelectorAll('td')[1].querySelector('span').innerText : '暂无主营介绍'
            obj.desc = company&&company.length>0 ? company[6].querySelectorAll('td')[0].querySelector('span').innerText : '暂无详细介绍'
            obj.score = document.querySelector('.analyze-num') ? document.querySelector('.analyze-num').innerText : '暂无机构评分'
            obj.jg_comment =document.querySelector('.jg-tips') ? document.querySelector('.jg-tips').innerText : '暂无买入评级'
            return obj
        })
        read_data[3*n] = {...read_data[3*n],...back}
        console.log(read_data[3*n])
        back_data.push(read_data[3*n])
        console.log(`线程1爬取${read_data[3*n].name}数据完毕`)
        page.goto("about:blank");
        n += 1
        await sleep()
    }
    return back_data
}
async function thread2(browser){
    const page = await browser.newPage();
    const read_data = await readfile()
    result = read_data
    let n = 0, back_data = []
    while((3*n)+1 <= read_data.length-1){
        console.log(`线程2正在爬取${read_data[(3*n)+1].name}详细数据`)
        await page.goto(`http://stockpage.10jqka.com.cn/${read_data[(3*n)+1].code}/`,{timeout : 5000}).then(s=>{
        }).catch(s=>{
        })
        await page.waitForSelector('.m_header')
        let back = await page.evaluate(()=>{
            let obj = {}
            let company = document.querySelectorAll('#company_info table tbody tr')
            obj.zy = company&&company.length>0 ? company[1].querySelectorAll('td')[1].querySelector('span').innerText : '暂无主营介绍'
            obj.desc = company&&company.length>0 ? company[6].querySelectorAll('td')[0].querySelector('span').innerText : '暂无详细介绍'
            obj.score = document.querySelector('.analyze-num') ? document.querySelector('.analyze-num').innerText : '暂无机构评分'
            obj.jg_comment =document.querySelector('.jg-tips') ? document.querySelector('.jg-tips').innerText : '暂无买入评级'
            return obj
        })
        read_data[(3*n)+1] = {...read_data[(3*n)+1],...back}
        console.log(read_data[(3*n)+1])
        back_data.push(read_data[(3*n)+1])
        console.log(`线程2爬取${read_data[(3*n)+1].name}数据完毕`)
        page.goto("about:blank");
        n += 1
        await sleep()
    }
    return back_data
}
async function thread3(browser){
    const page = await browser.newPage();
    const read_data = await readfile()
    result = read_data
    let n = 0, back_data = []
    while((3*n)+2 <= read_data.length-1){
        console.log(`线程3正在爬取${read_data[(3*n)+2].name}详细数据`)
        await page.goto(`http://stockpage.10jqka.com.cn/${read_data[(3*n)+2].code}/`,{timeout : 5000}).then(s=>{
        }).catch(s=>{
        })
        await page.waitForSelector('.m_header')
        let back = await page.evaluate(()=>{
            let obj = {}
            let company = document.querySelectorAll('#company_info table tbody tr')
            obj.zy = company&&company.length>0 ? company[1].querySelectorAll('td')[1].querySelector('span').innerText : '暂无主营介绍'
            obj.desc = company&&company.length>0 ? company[6].querySelectorAll('td')[0].querySelector('span').innerText : '暂无详细介绍'
            obj.score = document.querySelector('.analyze-num') ? document.querySelector('.analyze-num').innerText : '暂无机构评分'
            obj.jg_comment =document.querySelector('.jg-tips') ? document.querySelector('.jg-tips').innerText : '暂无买入评级'
            return obj
        })
        read_data[(3*n)+2] = {...read_data[(3*n)+2],...back}
        console.log(read_data[(3*n)+2])
        back_data.push(read_data[(3*n)+2])
        console.log(`线程3爬取${read_data[(3*n)+2].name}数据完毕`)
        page.goto("about:blank");
        n += 1
        await sleep()
    }
    return back_data
}
function outfile(data){
    fs.writeFile('./stock_detail.json', JSON.stringify(data, null, 4), (err) => {
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