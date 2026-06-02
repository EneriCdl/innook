/**
 * DeepFocus - 背景图下载脚本
 *
 * 使用方法：
 * 1. 访问 https://unsplash.com/developers 创建应用获取 Access Key
 * 2. 设置环境变量：export UNSPLASH_ACCESS_KEY=your_key
 * 3. 运行：node scripts/download-backgrounds.js
 *
 * 或手动下载：
 * - 访问以下链接，右键保存到 pic/ 目录
 * - 保留最喜欢的一张，重命名为 bg.jpg
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// ============================================
// 配置
// ============================================

const PIC_DIR = path.join(__dirname, '..', 'pic')

// Unsplash 图片 ID 列表（暗色调、氛围感、学习场景）
const IMAGE_IDS = [
  // Moody study room / rainy window
  'photo-1519681393784-d120267933ba', // 星空雪山
  'photo-1506905925346-21bda4d32df4', // 雪山云海
  'photo-1428592953211-077101b2021b', // 雨夜窗景
  'photo-1507842217343-583bb7270b66', // 图书馆
  'photo-1501785888041-af3ef285b470', // 湖泊山脉
  'photo-1470252649378-9c29740c9fa8', // 夜景星空
  'photo-1516483638261-f4dbaf036963', // 意大利夜景
  'photo-1493246507139-91e8fad9978e', // 雾中山峦
]

// 下载链接模板
const BASE_URL = 'https://images.unsplash.com/'

// ============================================
// 下载函数
// ============================================

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(PIC_DIR, filename)

    // 检查文件是否已存在
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  跳过已存在: ${filename}`)
      resolve()
      return
    }

    console.log(`⬇️  下载中: ${filename}`)

    https.get(`${url}?w=1920&q=80&fm=jpg`, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`))
        return
      }

      const fileStream = fs.createWriteStream(filepath)
      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`✅ 完成: ${filename}`)
        resolve()
      })

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {})
        reject(err)
      })
    }).on('error', reject)
  })
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.log('🖼️  DeepFocus 背景图下载工具')
  console.log('================================\n')

  // 确保目录存在
  if (!fs.existsSync(PIC_DIR)) {
    fs.mkdirSync(PIC_DIR, { recursive: true })
  }

  console.log(`📁 保存目录: ${PIC_DIR}\n`)

  // 下载所有图片
  for (let i = 0; i < IMAGE_IDS.length; i++) {
    const id = IMAGE_IDS[i]
    const filename = `bg-${String(i + 1).padStart(2, '0')}.jpg`
    const url = `${BASE_URL}${id}`

    try {
      await downloadImage(url, filename)
    } catch (err) {
      console.error(`❌ 下载失败 ${filename}: ${err.message}`)
    }
  }

  console.log('\n================================')
  console.log('📋 下载完成！\n')
  console.log('请按以下步骤操作：')
  console.log('1. 打开文件夹查看下载的图片')
  console.log('2. 保留你最喜欢的一张')
  console.log('3. 删除其余图片')
  console.log('4. 将保留的图片重命名为 bg.jpg')
  console.log('\n代码将自动适配单张图片模式。')
}

main().catch(console.error)
