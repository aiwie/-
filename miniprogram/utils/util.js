const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const getWeekByDate = dates => {
  let show_day = new Array('星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}


function getfaciCategoryByName(name) {
  var dic = {
    monitor: "视频监控",
    envi: "环境监测",
    car: "车辆道闸",
    facedoor: "人脸门禁",
    elevator: "升降机监测",
    towercrane: "塔吊监测",
    dischargplat: "卸料平台监测",
    truckclean: "车辆清洗监测",
    spray: "喷淋"
  };
  for (var key in dic) {
    if (dic[key].indexOf(name) >= 0) {
      return key
    }
  }
  return '';
}

const getDate = formatTime(new Date());
module.exports = {
  formatTime: formatTime,
  getDate: getDate
}

function getData(url, param) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
        console.log("failed")
      }
    })
  })
}

function getPostData(url, param) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
        console.log("failed")
      }
    })
  })
}

function isEmpty(object) {
  if (Object.keys(object).length === 0) {
    return true;
  }
  return false;
}

function getData2() {
  return index.index;
}

function getNext() {
  return index_next.next;
}

function getDiscovery() {
  return discovery.discovery;
}

function discoveryNext() {
  return discovery_next.next;
}

String.prototype.replaceAll = function (FindText, RepText) {
  regExp = new RegExp(FindText, "g");
  return this.replace(regExp, RepText);
}


module.exports = {
  getData: getData,
  getPostData: getPostData,
  getData2: getData2,
  getNext: getNext,
  getDiscovery: getDiscovery,
  discoveryNext: discoveryNext,
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  getWeekByDate: getWeekByDate,
  isEmpty: isEmpty,
  getfaciCategoryByName: getfaciCategoryByName
}