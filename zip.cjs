
const fs = require('fs')
const archiver = require('archiver')

// 创建输出流
const output = fs.createWriteStream(__dirname + '/qlfy-af.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
})

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes')
  console.log('Archiver has been finalized and the output file descriptor has closed.')
})

archive.on('error', function (err) {
  throw err
});

// 开始压缩
archive.pipe(output)

// 确保先打包目录
archive.directory('dist/', false)

// 完成压缩
archive.finalize()