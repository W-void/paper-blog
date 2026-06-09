#!/usr/bin/env python3
"""
将 blog-wechat Markdown 文件导出为微信公众号友好的 HTML 格式
- 图片转 base64 嵌入
- 代码块样式化
- 表格样式化
- 公式用文字替代（微信不支持 LaTeX）
- 引用块样式化
用法: python3 scripts/export_wechat_html.py blog-wechat/xxx.md [output.html]
"""

import sys
import os
import re
import base64
from pathlib import Path
from typing import Optional

BLOG_ROOT = Path(__file__).parent.parent
IMG_DIR = BLOG_ROOT / "static" / "img" / "wechat"


def load_image_base64(img_path: str) -> Optional[str]:
    """将图片文件读取为 base64 data URI"""
    full_path = IMG_DIR / img_path.split("/")[-1]
    if not full_path.exists():
        # 尝试从文章路径解析
        alt_path = BLOG_ROOT / img_path.lstrip("../")
        if alt_path.exists():
            full_path = alt_path
        else:
            return None
    ext = full_path.suffix.lower().lstrip(".")
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp"}.get(ext, "image/png")
    data = base64.b64encode(full_path.read_bytes()).decode()
    return f"data:{mime};base64,{data}"


def md_to_wechat_html(md_content: str, title: str = "") -> str:
    """将 Markdown 转换为微信公众号 HTML"""
    lines = md_content.split("\n")
    output = []
    i = 0
    in_code_block = False
    code_lang = ""
    code_lines = []
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal table_rows, in_table
        if not table_rows:
            return
        html = ['<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">']
        for row_idx, row in enumerate(table_rows):
            if row_idx == 1 and all(re.match(r"^[-: ]+$", c.strip()) for c in row):
                continue  # 分隔行
            tag = "th" if row_idx == 0 else "td"
            bg = "#f0f7ff" if row_idx == 0 else ("#fafafa" if row_idx % 2 == 0 else "#ffffff")
            html.append("<tr>")
            for cell in row:
                html.append(
                    f'<{tag} style="border:1px solid #ddd;padding:8px 12px;text-align:left;background:{bg};font-weight:{"bold" if tag=="th" else "normal"}">{inline_format(cell.strip())}</{tag}>'
                )
            html.append("</tr>")
        html.append("</table>")
        output.append("\n".join(html))
        table_rows = []
        in_table = False

    def inline_format(text: str) -> str:
        """处理行内格式"""
        # Bold
        text = re.sub(r"\*\*(.+?)\*\*", r'<strong style="font-weight:bold">\1</strong>', text)
        # Italic
        text = re.sub(r"\*(.+?)\*", r'<em>\1</em>', text)
        # Code
        text = re.sub(r"`([^`]+)`", r'<code style="background:#f4f4f4;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:13px;color:#c7254e">\1</code>', text)
        # Links (remove, keep text)
        text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r'\1', text)
        return text

    while i < len(lines):
        line = lines[i]

        # ---- 代码块 ----
        if line.startswith("```"):
            if not in_code_block:
                in_code_block = True
                code_lang = line[3:].strip()
                code_lines = []
            else:
                in_code_block = False
                code_text = "\n".join(code_lines)
                # HTML 转义
                code_text = code_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                lang_label = f'<span style="position:absolute;top:8px;right:12px;font-size:11px;color:#888;font-family:sans-serif">{code_lang}</span>' if code_lang else ""
                output.append(
                    f'<pre style="position:relative;background:#1e1e1e;color:#d4d4d4;padding:16px 20px;border-radius:8px;overflow-x:auto;font-family:\'Courier New\',monospace;font-size:13px;line-height:1.6;margin:16px 0">{lang_label}<code>{code_text}</code></pre>'
                )
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # ---- 表格 ----
        if line.strip().startswith("|") and line.strip().endswith("|"):
            in_table = True
            row = [c for c in line.strip().split("|")[1:-1]]
            table_rows.append(row)
            i += 1
            continue
        else:
            if in_table:
                flush_table()

        # ---- 空行 ----
        if line.strip() == "":
            output.append("")
            i += 1
            continue

        # ---- 水平分割线 ----
        if re.match(r"^---+$", line.strip()):
            output.append('<hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0">')
            i += 1
            continue

        # ---- 图片 ----
        img_match = re.match(r"!\[([^\]]*)\]\(([^\)]+)\)", line.strip())
        if img_match:
            alt = img_match.group(1)
            src = img_match.group(2)
            b64 = load_image_base64(src)
            if b64:
                output.append(
                    f'<figure style="margin:20px 0;text-align:center"><img src="{b64}" alt="{alt}" style="max-width:100%;border-radius:4px;display:block;margin:0 auto"><figcaption style="margin-top:8px;font-size:13px;color:#888;line-height:1.5">{alt}</figcaption></figure>'
                )
            else:
                output.append(
                    f'<figure style="margin:20px 0;text-align:center"><img src="{src}" alt="{alt}" style="max-width:100%;border-radius:4px;display:block;margin:0 auto"><figcaption style="margin-top:8px;font-size:13px;color:#888;line-height:1.5">{alt}</figcaption></figure>'
                )
            i += 1
            continue

        # ---- 标题 ----
        h_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if h_match:
            level = len(h_match.group(1))
            text = inline_format(h_match.group(2))
            styles = {
                1: 'font-size:24px;font-weight:bold;color:#1a1a1a;margin:32px 0 16px;padding-bottom:8px;border-bottom:2px solid #0066cc',
                2: 'font-size:20px;font-weight:bold;color:#1a1a1a;margin:28px 0 12px;padding-left:10px;border-left:4px solid #0066cc',
                3: 'font-size:17px;font-weight:bold;color:#333;margin:20px 0 10px',
                4: 'font-size:15px;font-weight:bold;color:#444;margin:16px 0 8px',
            }
            style = styles.get(level, 'font-size:14px;font-weight:bold;color:#555;margin:12px 0 6px')
            output.append(f'<h{level} style="{style}">{text}</h{level}>')
            i += 1
            continue

        # ---- 引用块 ----
        if line.startswith(">"):
            # 收集连续的引用行
            blockquote_lines = []
            while i < len(lines) and lines[i].startswith(">"):
                blockquote_lines.append(lines[i][1:].strip())
                i += 1
            content = "<br>".join(inline_format(l) for l in blockquote_lines if l)
            output.append(
                f'<blockquote style="margin:16px 0;padding:12px 16px;background:#f0f7ff;border-left:4px solid #0066cc;border-radius:0 4px 4px 0;color:#444;font-size:14px;line-height:1.8">{content}</blockquote>'
            )
            continue

        # ---- 无序列表 ----
        if re.match(r"^[\*\-\+]\s+", line):
            list_lines = []
            while i < len(lines) and re.match(r"^[\*\-\+]\s+", lines[i]):
                list_lines.append(inline_format(lines[i][2:].strip()))
                i += 1
            items = "".join(f'<li style="margin:6px 0;line-height:1.8">{l}</li>' for l in list_lines)
            output.append(f'<ul style="padding-left:24px;margin:12px 0">{items}</ul>')
            continue

        # ---- 有序列表 ----
        if re.match(r"^\d+\.\s+", line):
            list_lines = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i]):
                list_lines.append(inline_format(re.sub(r"^\d+\.\s+", "", lines[i])))
                i += 1
            items = "".join(f'<li style="margin:6px 0;line-height:1.8">{l}</li>' for l in list_lines)
            output.append(f'<ol style="padding-left:24px;margin:12px 0">{items}</ol>')
            continue

        # ---- 普通段落 ----
        output.append(f'<p style="margin:12px 0;line-height:1.8;color:#333;font-size:15px">{inline_format(line)}</p>')
        i += 1

    if in_table:
        flush_table()

    body = "\n".join(output)
    return body


def convert_file(md_path: str, out_path: Optional[str] = None):
    md_file = Path(md_path)
    if not md_file.exists():
        print(f"错误：文件不存在 {md_path}")
        sys.exit(1)

    content = md_file.read_text(encoding="utf-8")

    # 解析 frontmatter
    title = md_file.stem
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if fm_match:
        fm = fm_match.group(1)
        t_match = re.search(r'title:\s*["\']?(.+?)["\']?\s*$', fm, re.MULTILINE)
        if t_match:
            title = t_match.group(1).strip().strip('"\'')
        content = fm_match.group(2)

    body_html = md_to_wechat_html(content, title)

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif; max-width: 740px; margin: 0 auto; padding: 20px; background: #fff; }}
  * {{ box-sizing: border-box; }}
</style>
</head>
<body>
<div id="article" style="padding:10px 0">
{body_html}
</div>
<!-- 微信公众号复制提示 -->
<p style="margin-top:40px;font-size:12px;color:#aaa;text-align:center">— 复制以上内容粘贴到微信公众号编辑器 —</p>
</body>
</html>"""

    if out_path is None:
        out_path = str(md_file.with_suffix(".html"))

    Path(out_path).write_text(html, encoding="utf-8")
    print(f"✅ 已导出: {out_path}")
    print(f"   文章标题: {title}")
    size_kb = Path(out_path).stat().st_size // 1024
    print(f"   文件大小: {size_kb} KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 scripts/export_wechat_html.py <markdown文件> [输出HTML路径]")
        sys.exit(1)
    md_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else None
    convert_file(md_path, out)
