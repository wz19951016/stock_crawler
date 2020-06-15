const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const Table = require('tty-table')
const chalk = require("chalk")

let header = [
  {
    value: "股票名称",
    headerColor: "cyan",
    color: "white",
    align: "left",
    paddingLeft: 5,
    width: 20,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    value: "股票代码",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "成本",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "数量",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "现价",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "涨跌(今)",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "涨跌比(今)",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "盈亏(今)",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "盈亏(总)",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
  {
    alias: "涨跌比(总)",
    value: "organic",
    headerColor: "cyan",
    color: "white",
    width: 15,
    formatter: (value) => {
      let [data,flag] = value.split('#')
      if((flag - 0) > 0) {
        data = chalk.red(data)
      }else if((flag - 0) < 0){
        data = chalk.green(data)
      }
      return data
    }
  },
]
const footer = [
  "TOTAL",
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    return '/'
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    let num = rowData.reduce((init,cur)=>{
      return init + (cur[2].split('#')[0]*cur[3].split('#')[0])
    },0)
    return `${num.toFixed(2)}`
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    return '/'
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    return '/'
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    return '/'
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    return '/'
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    let num = rowData.reduce((init,cur)=>{
      return init + (cur[columnIndex].split('#')[0] - 0)
    },0)
    return `${num.toFixed(2)}`
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    let num = rowData.reduce((init,cur)=>{
      return init + (cur[columnIndex].split('#')[0] - 0)
    },0)
    return `${num.toFixed(2)}`
  },
  (cellValue, columnIndex, rowIndex, rowData, inputData) => {
    let cb = rowData.reduce((init,cur)=>{
      return init + (cur[2].split('#')[0]*cur[3].split('#')[0])
    },0)
    let yl = rowData.reduce((init,cur)=>{
      return init + (cur[8].split('#')[0] - 0)
    },0)
    return `${((yl/cb)*100).toFixed(2)}%`
  }
]




async function f(){
  let data = await readfile()
  let result = [], pages = [], rows = [], pages_arr = []
  data.forEach(item=>{
    item.stock.forEach(item2=>{
      !result.includes(item2.code) ? result.push(item2.code) : ''
    })
  })
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  for(let index in result){
    let page = await browser.newPage()
    pages.push(page)
  }
  for(let index in result){
    let url = result[index].split('')[0] == 6 || result[index].split('')[0] == 5 ? `https://xueqiu.com/S/SH${result[index]}` : `https://xueqiu.com/S/SZ${result[index]}`
    await pages[index].goto(url).then(s=>{
      console.log(`页面${Number(index)+1}打开成功`)
    }).catch(s=>{
      console.log(`页面${Number(index)+1}资源超时`)
    })
  }
  while(true){
    let pages_mes = pages.map((item,index)=>{
      return getmes(item,result[index])
    })
    let time_data = await Promise.all(pages_mes)
    time_data = time_data.reduce((init,cur)=>{
      return {...init,[cur.code]:{
        price : cur.price,
        zd : cur.zd,
        zd_per : cur.zd_per,
        name : cur.name
      }}
    },{})
    data.forEach((item,index)=>{
      rows[index] = []
      item.stock.forEach(tem=>{
        tem.name = time_data[tem.code].name,
        tem.zd = time_data[tem.code].zd,
        tem.zd_per = time_data[tem.code].zd_per,
        tem.price = time_data[tem.code].price,
        tem.yk_tody = (time_data[tem.code].zd * tem.num).toFixed(2)
        tem.yk_total = ((parseFloat(time_data[tem.code].price.split('¥')[1]) - parseFloat(tem.cb)) * tem.num).toFixed(2)
        tem.zd_per_total = `${(((time_data[tem.code].price.split('¥')[1] - tem.cb) / tem.cb) * 100).toFixed(2)}%`
        rows[index].push([
          `${tem.name}#${tem.zd}`,
          `${tem.code}#${tem.zd}`,
          `${tem.cb}#${tem.zd}`,
          `${tem.num}#${tem.zd}`,
          `${tem.price}#${tem.zd}`,
          `${tem.zd}#${tem.zd}`,
          `${tem.zd_per}#${tem.zd}`,
          `${tem.yk_tody}#${tem.zd}`,
          `${tem.yk_total}#${tem.zd}`,
          `${tem.zd_per_total}#${tem.zd}`
        ])
      })
    })

    let t1 = Table(header, rows[0], footer, {
      borderStyle: 1,
      borderColor: "blue",
      paddingBottom: 0,
      headerAlign: "center",
      align: "center",
      color: "white",
      truncate: "..."
    })
    let t2 = Table(header, rows[1], footer, {
      borderStyle: 1,
      borderColor: "blue",
      paddingBottom: 0,
      headerAlign: "center",
      align: "center",
      color: "white",
      truncate: "..."
    })
    // console.log(t1.render())
    // console.log(t2.render())
    let data1 = t1.render()
    let data2 = t2.render()
    console.log(typeof data1)
    console.log(typeof data2)
    process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')
    process.stdout.write('王忠持仓:')
    process.stdout.write(`\r${data1}`)
    process.stdout.write('\n代亚婷持仓:')
    process.stdout.write(`\r${data2}`)
    await sleep()

  }
}
async function getmes(page,code){
  await page.waitForSelector('.stock-change')
  const back = await page.evaluate(()=>{
    let obj = {}
    obj.price = document.querySelector('.stock-current strong') ? document.querySelector('.stock-current strong').innerText : ''
    obj.zd = document.querySelector('.stock-change') ? document.querySelector('.stock-change').innerText.split(' ')[0] : ''
    obj.zd_per = document.querySelector('.stock-change') ? document.querySelector('.stock-change').innerText.split(' ')[1] : ''
    obj.name = document.querySelector('.stock-name') ? document.querySelector('.stock-name').innerText.split('(')[0] : ''
    return obj
  })
  back.code = code
  // console.log(back)
  return back
}

function readfile(){
  return new Promise((resolve,reject)=>{
    fs.readFile(path.join(__dirname,'user_stock.json'),'utf-8',(err,data)=>{
      if(err){
          console.log(err)
      }else{
          resolve(JSON.parse(data))
      }
    })
  })
}
function sleep(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('over')
    },2000)
  })
}
f()
