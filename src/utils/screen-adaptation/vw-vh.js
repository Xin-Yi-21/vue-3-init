// 定义设计稿的宽高
const designWidth = 1920;
const designHeight = 1080;

// px转vw
export const px2vw = (_px) => {
    return (_px * 100.0) / designWidth + 'vw';
}
// px转vh
export const px2vh = (_px) => {
    return (_px * 100.0) / designHeight + 'vh';
}
// // px文字转vh
// export const px2font = (_px) => {
//     return (_px * 100.0) / designHeight + 'vh';
// }

// Echarts图表字体、间距自适应
// 背景：echarts字体大小只支持px，不能使用百分比或vw等，屏幕宽高比例和UI设计稿出入太大时会出现文字和图标重叠等情况
export const pxFitChart = (size, defaultLength = 1920) => {
    // pxFitChartByHeight(size, defaultHeight = 1080)
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    if (!clientWidth) return size
    let scale = 1
    if (clientWidth >= 1322) {
        scale = (clientHeight / 1080)
    } else {
        scale = (clientWidth / 1920)
    }
    return Number((size * scale).toFixed(3))
}

export const pxFitChartByWidth = (size, defaultWidth = 1920) => {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return size
    let scale = (clientWidth / defaultWidth)
    return Number((size * scale).toFixed(3))
}

export const pxFitChartByHeight = (size, defaultHeight = 1080) => {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    if (!clientHeight) return size
    let scale = (clientHeight / defaultHeight)
    return Number((size * scale).toFixed(3))
}