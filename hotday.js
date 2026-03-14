/*************************************

今日平台热榜（稳定版）
支持平台:
微博 知乎 微信 今日头条 百度 36氪 少数派 澎湃

argument:
platform=微信&count=5

*************************************/

let platform = "今日头条";
let count = 6;

// 读取参数
if (typeof $argument !== "undefined" && $argument !== "") {
  const params = getParams($argument);
  platform = params.platform || platform;
  count = parseInt(params.count) || count;
}

// 平台ID
const platformMap = {
  微博: "KqndgxeLl9",
  知乎: "mproPpoq6O",
  微信: "WnBe01o371",
  今日头条: "x9ozB4KoXb",
  澎湃: "wWmoO5Rd4E",
  百度: "Jb0vmloB1G",
  "36氪": "Q1Vd5Ko85R",
  少数派: "NaEdZZXdrO",
};

const platformValue = platformMap[platform];

if (!platformValue) {
  notify("热榜脚本错误", "", "不支持的平台：" + platform);
  done();
}

const url = `https://tophub.today/n/${platformValue}`;

const request = {
  url: url,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    Referer: "https://tophub.today/",
  },
};

// 请求
fetch(request)
  .then((body) => {
    const list = parseHotSearchList(body);

    if (!list.length) {
      notify(platform + "热榜", "", "未获取到数据");
      done();
      return;
    }

    const text = list
      .slice(0, count)
      .map((item, i) => `${i + 1} 🔥 ${item}`)
      .join("\n");

    notify(platform + "热榜", "", text);
    done();
  })
  .catch((err) => {
    notify("热榜获取失败", "", err);
    done();
  });

// 解析HTML
function parseHotSearchList(html) {
  const regex = /<td class="al">[\s\S]*?>(.*?)<\/a>/g;
  let result = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    result.push(match[1]);
  }

  return result;
}

// fetch兼容
function fetch(options) {
  return new Promise((resolve, reject) => {
    if (typeof $task !== "undefined") {
      $task.fetch(options).then(
        (res) => resolve(res.body),
        (err) => reject(err)
      );
    } else {
      $httpClient.get(options, (err, res, body) => {
        if (err) reject(err);
        else resolve(body);
      });
    }
  });
}

// 通知
function notify(title, sub, body) {
  if (typeof $notify !== "undefined") {
    $notify(title, sub, body);
  } else {
    $notification.post(title, sub, body);
  }
}

// done
function done() {
  if (typeof $done !== "undefined") $done();
}

// 参数解析
function getParams(str) {
  return Object.fromEntries(
    str.split("&").map((i) => {
      const [k, v] = i.split("=");
      return [k, decodeURIComponent(v)];
    })
  );
}