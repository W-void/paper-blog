#!/usr/bin/env python3
"""
重新提取 2025 年的 21 篇文章（之前因等待时间不足导致内容错误）
通过 JS 直接点击 ant-list-item[index]，不依赖 snapshot ref
"""

import subprocess
import json
import os
import re
import time
from pathlib import Path

BLOG_DIR = Path("/Users/wangshuli03/Agent/paper-blog/blog-wechat")
IMG_DIR = Path("/Users/wangshuli03/Agent/paper-blog/static/img/wechat")
IMG_PUBLIC_PATH = "/img/wechat"
MDNICE_PATTERN = re.compile(r'https://files\.mdnice\.com/[^\s\)\"\'\]]+')

# (列表索引, 标题, 日期, 文件名)
# 索引来自 ant-list-item 的顺序（0-based）
ARTICLES_2025 = [
    (39, "cikm'25「快手」语义ID对齐｜DAS: Dual-Aligned Semantic IDs Empowered", "2025-08-17",
     "2025-08-17-cikm'25-快手-语义ID对齐-DAS-Dual-Aligned-Semantic-IDs-Empowered.md"),
    (38, "onerec v2 技术报告", "2025-08-31",
     "2025-08-31-onerec-v2-技术报告.md"),
    (37, "「快手」OneSearch: A Preliminary Exploration of the Unified End-to-End", "2025-09-05",
     "2025-09-05-快手-OneSearch-A-Preliminary-Exploration-of-the-Unified-End-to-End.md"),
    (36, "cikm'25「美团」重排｜You Only evaLuate Once: A Tree-based Rerank Method", "2025-09-13",
     "2025-09-13-cikm'25-美团-重排-You-Only-evaLuate-Once-A-Tree-based-Rerank-Method.md"),
    (35, "「谷歌」PLUM: Adapting Pre-trained Language Models for Industrial", "2025-10-15",
     "2025-10-15-谷歌-PLUM-Adapting-Pre-trained-Language-Models-for-Industrial.md"),
    (34, "「快手」ONEREC-THINK: In-Text Reasoning for Generative Recommendation", "2025-10-15",
     "2025-10-15-快手-ONEREC-THINK-In-Text-Reasoning-for-Generative-Recommendation.md"),
    (33, "「美团」HoMer: 面向大模型的CTR预测新范式——统一建模序列与请求上下文", "2025-10-20",
     "2025-10-20-美团-HoMer-面向大模型的CTR预测新范式——统一建模序列与请求上下文.md"),
    (32, "「快手」目标感知的生成式检索范式｜GRank: Towards Target-Aware", "2025-10-21",
     "2025-10-21-快手-目标感知的生成式检索范式-GRank-Towards-Target-Aware.md"),
    (31, "随笔——通俗理解生成式", "2025-10-22",
     "2025-10-22-随笔——通俗理解生成式.md"),
    (30, "「阿里」全站出价：同时考虑一价与二价｜HOB", "2025-10-24",
     "2025-10-24-阿里-全站出价：同时考虑一价与二价-HOB.md"),
    (29, "「meta」Massive Memorization with Hundreds of Trillions of Parameters", "2025-11-01",
     "2025-11-01-meta-Massive-Memorization-with-Hundreds-of-Trillions-of-Parameters.md"),
    (28, "「小红书」搜广推统一LLM｜CROSS-SCENARIO UNIFIED MODELING OF USER INTERESTS", "2025-11-03",
     "2025-11-03-小红书-搜广推统一LLM-CROSS-SCENARIO-UNIFIED-MODELING-OF-USER-INTERESTS.md"),
    (27, "cikm'25「快手」生成式重排｜GReF: A Unified Generative Framework", "2025-11-03",
     "2025-11-03-cikm'25-快手-生成式重排-GReF-A-Unified-Generative-Framework.md"),
    (26, "wsdm'26「美团」SID｜CAT-ID2: Category-Tree Integrated Document", "2025-11-04",
     "2025-11-04-wsdm'26-美团-SID-CAT-ID2-Category-Tree-Integrated-Document.md"),
    (25, "个性化SID｜PCTX: TOKENIZING PERSONALIZED CONTEXT FOR GENERATIVE", "2025-11-04",
     "2025-11-04-个性化SID-PCTX-TOKENIZING-PERSONALIZED-CONTEXT-FOR-GENERATIVE.md"),
    (24, "「字节」OneTrans: Unified Feature Interaction and Sequence Modeling", "2025-11-06",
     "2025-11-06-字节-OneTrans-Unified-Feature-Interaction-and-Sequence-Modeling.md"),
    (23, "「快手」decoder增强｜DualGR: Generative Retrieval with Long and Short", "2025-11-20",
     "2025-11-20-快手-decoder增强-DualGR-Generative-Retrieval-with-Long-and-Short.md"),
    (22, "「腾讯」商业化one model｜GPR", "2025-11-21",
     "2025-11-21-腾讯-商业化one-model-GPR.md"),
    (21, "「美团」重排｜RIA: A Ranking-Infused Approach for Optimized listwise", "2025-12-08",
     "2025-12-08-美团-重排-RIA-A-Ranking-Infused-Approach-for-Optimized-listwise.md"),
    (20, "AAAI'26「快手」llm as rec｜Align3GR: Unified Multi-Level Alignment", "2025-12-08",
     "2025-12-08-AAAI'26-快手-llm-as-rec-Align3GR-Unified-Multi-Level-Alignment.md"),
    (19, "SID attention 两篇", "2025-12-16",
     "2025-12-16-SID-attention-两篇.md"),
]


def run_browser_action(action_json):
    cmd = ["catdesk", "browser-action", action_json]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return None


def click_article_by_index(idx: int) -> bool:
    """通过 JS 点击第 idx 个 ant-list-item 内部的 container 子元素"""
    script = (
        f"var items=document.querySelectorAll('.ant-list-item');"
        f"var item=items[{idx}];"
        f"if(item){{var c=item.querySelector('.nice-article-sidebar-list-item-container');if(c){{c.click();true}}else{{item.click();true}}}}else{{false}}"
    )
    result = run_browser_action(f'{{"action":"evaluate","script":"{script}"}}')
    return result and result.get("success") and result["data"].get("result") is True


def get_editor_content():
    result = run_browser_action(
        '{"action":"evaluate","script":"document.querySelector(\\".CodeMirror\\") ? document.querySelector(\\".CodeMirror\\").CodeMirror.getValue() : \\"NOT_FOUND\\""}'
    )
    if result and result.get("success"):
        content = result["data"].get("result", "")
        if content and content != "NOT_FOUND":
            return content
    return None


def url_to_filename(url: str) -> str:
    import hashlib
    basename = url.rstrip('/').split('/')[-1]
    if '.' not in basename:
        h = hashlib.md5(url.encode()).hexdigest()[:8]
        basename = f"{h}.png"
    else:
        h = hashlib.md5(url.encode()).hexdigest()[:6]
        name, ext = os.path.splitext(basename)
        basename = f"{name}-{h}{ext}"
    return basename


def download_image(url: str, dest: Path) -> bool:
    import urllib.request
    if dest.exists():
        return True
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    图片下载失败: {url} -> {e}")
        return False


def localize_images(content: str) -> str:
    urls = MDNICE_PATTERN.findall(content)
    for url in urls:
        filename = url_to_filename(url)
        dest = IMG_DIR / filename
        local_path = f"{IMG_PUBLIC_PATH}/{filename}"
        download_image(url, dest)
        content = content.replace(url, local_path)
    return content


def make_frontmatter(title, date):
    safe_title = title.replace('"', '\\"')
    return f'---\ntitle: "{safe_title}"\ndate: {date}\ntags: [公众号]\n---\n\n'


def main():
    print(f"重新提取 {len(ARTICLES_2025)} 篇 2025 年文章\n")

    success = 0
    fail = 0

    for i, (idx, title, date, filename) in enumerate(ARTICLES_2025):
        print(f"[{i+1:02d}/{len(ARTICLES_2025)}] [{idx}] {title[:45]}...")

        # 用 JS 点击
        if not click_article_by_index(idx):
            print(f"  ✗ 点击失败（索引 {idx}）")
            fail += 1
            continue

        # 轮询等待内容切换，最多等 9 秒（每次 1s，共 9 次）
        content = None
        keyword = title[:12].replace('「', '').replace('」', '').replace('｜', '').replace("'", "")
        for attempt in range(9):
            time.sleep(1.0)
            c = get_editor_content()
            if c and keyword.lower() in c[:800].lower():
                content = c
                break
            if attempt == 8:
                # 最后一次，不管是否匹配都用
                content = c

        if not content:
            print(f"  ✗ 内容提取失败")
            fail += 1
            continue

        matched = keyword.lower() in content[:800].lower()
        if not matched:
            print(f"  ⚠ 标题未匹配（关键词: {keyword!r}），前100字: {content[:100]!r}")

        # 本地化图片
        content = localize_images(content)

        # 覆盖写入
        filepath = BLOG_DIR / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(make_frontmatter(title, date))
            f.write(content)

        lines = content.count('\n')
        status = "✓ 标题匹配" if matched else "⚠ 请核查"
        print(f"  ✓ 已保存（{lines} 行）{status}")
        success += 1

    print(f"\n完成！成功: {success}，失败: {fail}")


if __name__ == "__main__":
    main()
