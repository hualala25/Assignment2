import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 作品集合。
 *
 * 分类完全由 frontmatter 的 category / type / tags 驱动，
 * 新增作品或新增分类都不需要改动任何页面代码。
 */
const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** 一句话简介，用于卡片与列表摘要 */
    summary: z.string(),
    /** 分类名，决定作品归属哪个分区 */
    category: z.string(),
    /** 作品或论文 */
    type: z.enum(['showcase', 'paper']).default('showcase'),
    /** 排序权重，数字越小越靠前 */
    order: z.number().default(99),
    /** 完成日期 */
    date: z.coerce.date(),
    year: z.number().optional(),
    /** 标签 */
    tags: z.array(z.string()).default([]),
    /** 封面图地址（PicGo 图床链接） */
    cover: z.string().optional(),
    /** 在线预览地址，可为同站作品或外部作品 */
    preview: z.string().optional(),
    /** 是否用 iframe 嵌入预览 */
    embed: z.boolean().default(false),
    /** 原文件下载（相对 public/downloads 下的路径） */
    download: z.string().optional(),
    /** 源文件体积描述 */
    downloadSize: z.string().optional(),
    /** 论文专属字段 */
    venue: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    /** 论文 PDF 相对路径 */
    pdf: z.string().optional(),
    /** 外部链接，如 GitHub 仓库 */
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { works };

/** 全站统一的分类顺序，未列出的分类按字母排到后面。 */
export const CATEGORY_ORDER = ['交互作品', '影像作品', '视觉设计', '学术论文'];

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, 'zh');
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
