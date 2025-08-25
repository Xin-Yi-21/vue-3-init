import html2canvas from 'html2canvas';

/**
 * 导出单个echarts图表
 * @param {dom} initChart echart.init(dom) 的值
 * @param {string} pngName 图片名称
 */
export function exportSingleChart(initChart, pngName) {
  let img = new Image()
  img.src = initChart.getDataURL({
    type: "png",
    pixelRatio: 1,
    backgroundColor: "#fff",
  });
  img.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.download = `${pngName}.png`;
    a.href = dataURL;
    a.dispatchEvent(event);
    a.remove();
  };
}


/**
 * 导出ant-design-vue的table为图片
 * @param {String} pngName 图片名称
 */
export function elTableExportToImage(pngName) {
  let headerDom
  let bodyDom
  headerDom = document.querySelector(
    `.ant-table-thead`
  );
  bodyDom = document.querySelector(
    `.ant-table-tbody`
  );
  let headerCanvas = null;
  let bodyCanvas = null;
  html2canvas(headerDom)
    .then((canvas) => {
      headerCanvas = canvas;
      return html2canvas(bodyDom);
    })
    .then((canvas) => {
      bodyCanvas = canvas;
      const imageCanvas = _mergeCanvases(headerCanvas, bodyCanvas);
      _downloadCanvasAsImage(imageCanvas, pngName);
    });
}

/**
 * 合并两个 Canvas
 * @param {HTMLCanvasElement} canvasOne
 * @param {HTMLCanvasElement} canvasTwo
 * @returns {HTMLCanvasElement} 合并后的 Canvas
 */
function _mergeCanvases(canvasOne, canvasTwo) {
  const mergedCanvas = document.createElement('canvas');
  const ctx = mergedCanvas.getContext('2d');

  // 设置合并后的 Canvas 大小
  mergedCanvas.width = Math.max(canvasOne.width, canvasTwo.width);
  mergedCanvas.height = canvasOne.height + canvasTwo.height;

  // 将第一个 Canvas 内容绘制到合并的 Canvas
  ctx.drawImage(canvasOne, 0, 0);

  // 将第二个 Canvas 内容绘制到合并的 Canvas，紧接着第一个 Canvas
  ctx.drawImage(canvasTwo, 0, canvasOne.height);
  return mergedCanvas;
}

/**
 * 下载 canvas 为图片
 * @param {HTMLCanvasElement} canvas
 * @param {String} fileName 文件名，默认为时间戳
 */
function _downloadCanvasAsImage(canvas, fileName = Date.now()) {
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = fileName + '.png';
  link.href = image;
  link.click();
  link.remove();
}