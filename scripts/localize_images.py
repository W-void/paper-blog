#!/usr/bin/env python3
"""
将 blog-wechat/ 中所有文章的 mdnice 图片下载到本地
并将 Markdown 中的图片链接替换为本地路径
"""

import os
import re
import hashlib
import urllib.request
import urllib.error
from pathlib import Path

BLOG_DIR = Path("/Users/wangshuli03/Agent/paper-blog/blog-wechat")
IMG_DIR = Path("/Users/wangshuli03/Agent/paper-blog/static/img/wechat")
IMG_PUBLIC_PATH = "/img/wechat"  # Docusaurus static 目录对应的公共路径

IMG_DIR.mkdir(parents=True, exist_ok=True)

MDNICE_PATTERN = re.compile(r'https://files\.mdnice\.com/[^\s\)\"\'\]]+')

def url_to_filename(url: str) -> str:
    """将 URL 转换为本地文件名，保留原始文件名 + 短 hash 避免冲突"""
    # 取 URL 最后一段作为文件名
    basename = url.rstrip('/').split('/')[-1]
    # 如果没有扩展名，根据 URL hash 补一个
    if '.' not in basename:
        h = hashlib.md5(url.encode()).hexdigest()[:8]
        basename = f"{h}.png"
    else:
        # 加短 hash 前缀避免同名冲突
        h = hashlib.md5(url.encode()).hexdigest()[:6]
        name, ext = os.path.splitext(basename)
        basename = f"{name}-{h}{ext}"
    return basename


def download_image(url: str, dest: Path) -> bool:
    """下载图片到 dest，返回是否成功"""
    if dest.exists():
        return True  # 已存在，跳过
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    ✗ 下载失败: {url}\n      原因: {e}")
        return False


def process_file(md_path: Path, url_map: dict) -> int:
    """处理单个 Markdown 文件，替换图片链接，返回替换数量"""
    content = md_path.read_text(encoding='utf-8')
    new_content = content
    count = 0
    for url, local_path in url_map.items():
        if url in new_content:
            new_content = new_content.replace(url, local_path)
            count += 1
    if count > 0:
        md_path.write_text(new_content, encoding='utf-8')
    return count


def main():
    # 第一步：收集所有图片 URL
    print("第一步：扫描所有文章中的图片链接...")
    all_urls = set()
    md_files = list(BLOG_DIR.glob("*.md"))
    for md_path in md_files:
        content = md_path.read_text(encoding='utf-8')
        urls = MDNICE_PATTERN.findall(content)
        all_urls.update(urls)

    print(f"  共发现 {len(all_urls)} 个唯一图片 URL，来自 {len(md_files)} 篇文章\n")

    # 第二步：下载所有图片
    print("第二步：下载图片...")
    url_to_local = {}  # url -> 公共路径（用于替换 Markdown）
    success = 0
    fail = 0

    for i, url in enumerate(sorted(all_urls), 1):
        filename = url_to_filename(url)
        dest = IMG_DIR / filename
        local_public = f"{IMG_PUBLIC_PATH}/{filename}"
        url_to_local[url] = local_public

        print(f"  [{i:02d}/{len(all_urls)}] {filename}", end=" ")
        if dest.exists():
            print("(已存在，跳过)")
            success += 1
        elif download_image(url, dest):
            size_kb = dest.stat().st_size / 1024
            print(f"✓ ({size_kb:.1f} KB)")
            success += 1
        else:
            fail += 1

    print(f"\n  下载完成：成功 {success}，失败 {fail}\n")

    # 第三步：替换 Markdown 中的链接
    print("第三步：替换文章中的图片链接...")
    total_replaced = 0
    for md_path in md_files:
        n = process_file(md_path, url_to_local)
        if n > 0:
            print(f"  {md_path.name}: 替换了 {n} 处")
            total_replaced += n

    print(f"\n  共替换 {total_replaced} 处图片链接")
    print(f"\n完成！图片保存在: {IMG_DIR}")
    print(f"文章已更新，图片路径已替换为本地路径")


if __name__ == "__main__":
    main()
