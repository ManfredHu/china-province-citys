const fs = require('fs')
const fileRst = fs.readFileSync('./data/temp.json', 'utf-8')
const linesContent = fileRst.split('\n')
console.log(`linesContent`, linesContent.length)

// delete table title
if (linesContent[0].includes('省市编码')) {
  linesContent.splice(0, 1)
}
const count = {
  1: 0,
  2: 0,
  3: 0
}

const rstData = {}

for(const [idx,item] of linesContent.entries()) {
  const k = item.split('\t')
  k[1] = k[1].replace(/中国(,)+/g, '') // 北京有多个逗号
  
  const j = k[1].split(',')
  k[1] = j
  if (j.length) {
    count[j.length]++
  }
  
  if (!rstData[j[0]] && j.length === 1) {
    // 新建一级
    if (j[0] !== '台湾省') { // 展示不支持台湾的银行
      rstData[j[0]] = {
        id: k[0],
        label: j[0],
        value: j[0],
        options: []
      }
    }
    
  } else if (j.length === 2) {
    // 新建二级
    console.log(`二级`)
    console.log(`k`, k)
    console.log(`j`, j)
    if (!rstData[j[0]]) {
      console.error(`错误，没找到${j[0]}`)
    } else {
      const cityList = rstData[j[0]].options
      cityList.push({
        id: k[0],
        label: j[1],
        value: j[1],
      })
    }
  } else if (j.length === 3) {
    // 新建三级
    // console.log(`三级`)
    // console.log(`k`, k)
    // console.log(`j`, j)
  }
}
console.log(`级别统计`, count)


// 转化为数组
const tempArr = []
for (const i in rstData) {
  tempArr.push(rstData[i])
}

fs.writeFileSync('./output/二级省市数据.json', JSON.stringify(tempArr), 'utf-8')


