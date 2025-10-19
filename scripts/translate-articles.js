/**
 * 自动翻译文章脚本（兼容 OpenRouter）
 *
 * 环境变量:
 *   - OPENROUTER_API_KEY: OpenRouter API密钥（必需）
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'
import process from 'node:process'
import dotenv from 'dotenv'
import fg from 'fast-glob'
import OpenAI from 'openai'

// 加载环境变量
dotenv.config()

// 获取目标语言参数
const targetLangSuffix = process.argv[2]
const targetLang = process.argv[3]
if (!targetLangSuffix || !targetLang) {
  console.error('❌ 用法: node scripts/translate-articles.js <语言后缀> <语言名称>')
  process.exit(1)
}

// ✅ 初始化 OpenRouter 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // ✅ OpenRouter 统一 API 地址
  // defaultHeaders: {
  //   'HTTP-Referer': 'https://your-site-or-github-link', // 可选但推荐：填你的项目主页
  //   'X-Title': 'Astro Translation Script', // 可选：标识请求来源
  // },
})

console.log(`🔌 使用 OpenRouter API BaseURL: https://openrouter.ai/api/v1`)

// 分割 frontmatter
function splitContent(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match)
    return { frontmatter: '', body: content, hasFrontmatter: false }
  return { frontmatter: match[1], body: match[2], hasFrontmatter: true }
}

// 解析 frontmatter
function parseFrontmatter(frontmatter) {
  const lines = frontmatter.split('\n')
  const result = {}
  let currentKey = null
  let currentValue = []

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      if (currentKey)
        result[currentKey] = currentValue.join('\n').trim()
      currentKey = match[1]
      currentValue = [match[2]]
    }
    else if (currentKey) {
      currentValue.push(line)
    }
  }
  if (currentKey)
    result[currentKey] = currentValue.join('\n').trim()
  return result
}

// 调用 OpenRouter 模型翻译
async function translateArticle(content) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto', // ✅ 自动选择最优模型；也可指定如 "anthropic/claude-3.5-sonnet" 或 "gpt-4o-mini"
      messages: [
        {
          role: 'system',
          content: `将这篇 astro 博客从中文翻译到${targetLang}，保持原意、语气自然、风格优雅，并翻译 frontmatter。`,
        },
        { role: 'user', content },
      ],
      temperature: 0.3,
    })
    return completion.choices[0].message.content.trim()
  }
  catch (error) {
    console.error(`翻译出错: ${error.message}`)
    return ''
  }
}

async function main() {
  const files = await fg(['src/content/**/*.md'])
  console.log(`📦 找到 ${files.length} 个Markdown文件`)

  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const { frontmatter, hasFrontmatter } = splitContent(content)
    if (!hasFrontmatter)
      continue

    const data = parseFrontmatter(frontmatter)
    if (data.lang !== 'zh')
      continue

    const { dir, name, ext } = parse(file)
    const outPath = join(dir, `${name}-${targetLangSuffix}${ext}`)
    try {
      await readFile(outPath, 'utf8')
      console.log(`⏩ 跳过 ${file}: 已有翻译`)
      continue
    }
    catch {}

    console.log(`🤖 正在翻译 ${file}...`)
    const translated = await translateArticle(content.replace('lang: zh', `lang: ${targetLangSuffix}`))
    if (translated) {
      await writeFile(outPath, translated, 'utf8')
      console.log(`✅ 已保存 ${outPath}`)
    }
  }
}

main().catch((err) => {
  console.error('❌ 执行失败:', err.message)
  process.exit(1)
})
