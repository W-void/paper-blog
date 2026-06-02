#!/usr/bin/env python3
"""
批量从 mdnice 提取文章 Markdown 内容
通过 catdesk browser-action 逐篇点击并提取
"""

import subprocess
import json
import os
import re
import time

BLOG_DIR = "/Users/wangshuli03/Agent/paper-blog/blog-wechat"
os.makedirs(BLOG_DIR, exist_ok=True)

# 文章列表：(ref, 标题, 日期)
ARTICLES = [
    ("e148", "生成式重排的进化：从相对 Reward 到稠密监督", "2026-05-27"),
    ("e149", "有效秩：一把可锤万物的锤子", "2026-05-26"),
    ("e150", "CPT", "2026-05-15"),
    ("e151", "从长序列到 Semantic ID：召回与精排技术路线的分化、收敛与统一", "2026-05-12"),
    ("e152", "week1", "2026-05-09"),
    ("e153", "广告生成式推荐应该怎么做：融合三篇的系统设计观", "2026-05-09"),
    ("e154", "Discrimination Is Generation｜SID的道与术", "2026-05-07"),
    ("e155", "LLM 思维链：从零到前沿", "2026-04-10"),
    ("e156", "LLM 上下文压缩方法汇总（2025.09 ~ 2026.03）", "2026-04-06"),
    ("e157", "「快手」SID异质性感知｜Stop Treating Collisions Equally", "2026-04-01"),
    ("e158", "「字节」粗排异质性感知｜Not All Candidates are Created Equal", "2026-04-01"),
    ("e159", "「字节」SID｜TRM：Farewell to Item IDs", "2026-03-24"),
    ("e160", "「meta」SID｜How Well Does Generative Recommendation Generalize?", "2026-03-24"),
    ("e161", "「阿里」SID｜Differentiable Geometric Indexing for End-to-End Generative Recommendation", "2026-03-19"),
    ("e162", "arXiv Agent 论文近三个月总结", "2026-03-15"),
    ("e163", "cikm'25「阿里」多归因建模｜See Beyond a Single View: Multi-Attribution Learning", "2026-03-12"),
    ("e164", "SID随笔", "2026-03-09"),
    ("e165", "「快手」电商生成式｜OneMall: One Architecture, More Scenarios", "2026-03-03"),
    ("e166", "「快手」广告的生成式模型｜Generative Recommendation for Large-Scale Advertising", "2026-03-02"),
    ("e167", "SID attention 两篇", "2025-12-16"),
    ("e168", "AAAI'26「快手」llm as rec｜Align3GR: Unified Multi-Level Alignment", "2025-12-08"),
    ("e169", "「美团」重排｜RIA: A Ranking-Infused Approach for Optimized listwise", "2025-12-08"),
    ("e170", "「腾讯」商业化one model｜GPR", "2025-11-21"),
    ("e171", "「快手」decoder增强｜DualGR: Generative Retrieval with Long and Short", "2025-11-20"),
    ("e172", "「字节」OneTrans: Unified Feature Interaction and Sequence Modeling", "2025-11-06"),
    ("e173", "个性化SID｜PCTX: TOKENIZING PERSONALIZED CONTEXT FOR GENERATIVE", "2025-11-04"),
    ("e174", "wsdm'26「美团」SID｜CAT-ID2: Category-Tree Integrated Document", "2025-11-04"),
    ("e175", "cikm'25「快手」生成式重排｜GReF: A Unified Generative Framework", "2025-11-03"),
    ("e176", "「小红书」搜广推统一LLM｜CROSS-SCENARIO UNIFIED MODELING OF USER INTERESTS", "2025-11-03"),
    ("e177", "「meta」Massive Memorization with Hundreds of Trillions of Parameters", "2025-11-01"),
    ("e178", "「阿里」全站出价：同时考虑一价与二价｜HOB", "2025-10-24"),
    ("e179", "随笔——通俗理解生成式", "2025-10-22"),
    ("e180", "「快手」目标感知的生成式检索范式｜GRank: Towards Target-Aware", "2025-10-21"),
    ("e181", "「美团」HoMer: 面向大模型的CTR预测新范式——统一建模序列与请求上下文", "2025-10-20"),
    ("e182", "「快手」ONEREC-THINK: In-Text Reasoning for Generative Recommendation", "2025-10-15"),
    ("e183", "「谷歌」PLUM: Adapting Pre-trained Language Models for Industrial", "2025-10-15"),
    ("e184", "cikm'25「美团」重排｜You Only evaLuate Once: A Tree-based Rerank Method", "2025-09-13"),
    ("e185", "「快手」OneSearch: A Preliminary Exploration of the Unified End-to-End", "2025-09-05"),
    ("e186", "onerec v2 技术报告", "2025-08-31"),
    ("e187", "cikm'25「快手」语义ID对齐｜DAS: Dual-Aligned Semantic IDs Empowered", "2025-08-17"),
]


def run_browser_action(action_json):
    """执行 catdesk browser-action 命令"""
    cmd = ["catdesk", "browser-action", action_json]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr}")
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  JSON parse error: {result.stdout[:200]}")
        return None


def title_to_filename(title, date):
    """将标题转换为合法的文件名"""
    # 移除或替换不合法字符
    safe = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '-', title)
    safe = re.sub(r'[｜「」『』【】]', '-', safe)
    safe = re.sub(r'\s+', '-', safe.strip())
    safe = re.sub(r'-+', '-', safe)
    safe = safe.strip('-')
    # 截断过长的文件名
    if len(safe) > 80:
        safe = safe[:80]
    return f"{date}-{safe}.md"


def extract_content():
    """提取编辑器中当前文章的 Markdown 内容"""
    result = run_browser_action(
        '{"action":"evaluate","script":"document.querySelector(\\".CodeMirror\\") ? document.querySelector(\\".CodeMirror\\").CodeMirror.getValue() : \\"NOT_FOUND\\""}'
    )
    if result and result.get("success") and result["data"].get("result") != "NOT_FOUND":
        return result["data"]["result"]
    return None


def make_frontmatter(title, date):
    """生成 Docusaurus blog frontmatter"""
    # 在双引号 YAML 字符串中，只需转义双引号，单引号不需要转义
    safe_title = title.replace('"', '\\"')
    return f"""---
title: "{safe_title}"
date: {date}
tags: [公众号]
---

"""


def save_article(title, date, content):
    """保存文章到 blog-wechat 目录"""
    filename = title_to_filename(title, date)
    filepath = os.path.join(BLOG_DIR, filename)
    
    # 检查是否已存在
    if os.path.exists(filepath):
        print(f"  已存在，跳过: {filename}")
        return filepath
    
    frontmatter = make_frontmatter(title, date)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter)
        f.write(content)
    
    print(f"  已保存: {filename}")
    return filepath


def main():
    print(f"开始批量提取 mdnice 文章，共 {len(ARTICLES)} 篇")
    print(f"输出目录: {BLOG_DIR}\n")
    
    success_count = 0
    fail_count = 0
    
    for i, (ref, title, date) in enumerate(ARTICLES):
        print(f"[{i+1}/{len(ARTICLES)}] {title[:40]}...")
        
        # 第一篇已经在编辑器中打开，直接提取
        if i > 0:
            # 点击左侧文章列表项
            click_result = run_browser_action(
                f'{{"action":"click","selector":"@{ref}"}}'
            )
            if not click_result or not click_result.get("success"):
                print(f"  点击失败，跳过")
                fail_count += 1
                continue
            
            # 等待内容加载
            time.sleep(0.8)
        
        # 提取内容
        content = extract_content()
        if not content:
            print(f"  内容提取失败，跳过")
            fail_count += 1
            continue
        
        # 保存文件
        save_article(title, date, content)
        success_count += 1
        
        # 短暂延迟避免过快
        if i < len(ARTICLES) - 1:
            time.sleep(0.3)
    
    print(f"\n完成！成功: {success_count}，失败: {fail_count}")
    print(f"文件保存在: {BLOG_DIR}")


if __name__ == "__main__":
    main()
