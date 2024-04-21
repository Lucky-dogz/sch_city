export default function loadAMap() {
  //设置你的安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: '412b273ef8bbfdbc2bb772b3797334b0',
  };
  //声明异步加载回调函数
  // window.onLoad = function () {
  // var map = new AMap.Map('container'); //"container"为<div>容器的id
  // };
  // var url =
  //   'https://webapi.amap.com/maps?v=2.0&key=4fce8ea5d61ec05e6080b9cf6e477710&callback=initAMap';
  // var jsapi = document.createElement('script');
  // jsapi.charset = 'utf-8';
  // jsapi.src = url;
  // document.head.appendChild(jsapi);

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src =
    'https://webapi.amap.com/maps?v=2.0&key=4fce8ea5d61ec05e6080b9cf6e477710&callback=initAMap';
  document.body.appendChild(script);
}
