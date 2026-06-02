# DeepFocus 背景图资源

## 快速开始

### 方法一：手动下载（推荐）

1. 访问以下任一链接，右键保存图片到本目录
2. 保留最喜欢的一张
3. 重命名为 `bg.jpg`

#### 推荐图片（暗色调、氛围感）

| 主题 | Unsplash 链接 |
|------|--------------|
| 星空雪山 | https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80 |
| 雪山云海 | https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80 |
| 雨夜窗景 | https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80 |
| 图书馆 | https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80 |
| 湖泊山脉 | https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80 |
| 夜景星空 | https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&q=80 |

### 方法二：脚本下载

```bash
node scripts/download-backgrounds.js
```

## 文件结构

```
pic/
├── bg.jpg          # 单图模式（推荐）
├── bg-01.jpg       # 多图轮播模式（可选）
├── bg-02.jpg
├── bg-03.jpg
└── README.md
```

## 使用说明

- **单图模式**：保留一张 `bg.jpg`，代码自动适配
- **多图模式**：保留多张 `bg-*.jpg`，启用轮播

## 图片要求

- **分辨率**：1920x1080 或更高
- **色调**：深色、暗调、蓝调时刻
- **风格**：Moody, Cinematic, Ethereal, Lo-fi
- **格式**：JPG（推荐）或 WebP

## 自定义

编辑 `src/config/backgrounds.ts` 修改配置：

```typescript
// 单图模式
export function getBackgroundImages(): string[] {
  return [`${LOCAL_PATH}/bg.jpg`]
}

// 多图轮播模式
export function getBackgroundImages(): string[] {
  return [
    `${LOCAL_PATH}/bg-01.jpg`,
    `${LOCAL_PATH}/bg-02.jpg`,
    `${LOCAL_PATH}/bg-03.jpg`,
  ]
}
```
