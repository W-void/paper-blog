---
title: "【推荐系统 Paper 日报】2026-05-11"
date: 2026-05-11
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2761397527"
---


# 【推荐系统 Paper 日报】2026-05-11

> 📅 2026年5月11日（周一）| 📝 小美 整理 | 📄 共 15 篇论文

---

### 今日概览

今天的 cs.IR 共有 **15 篇论文**，研究方向分布如下：

1. **推荐系统相关（核心）**：6 篇 — 涵盖知识图谱推荐、LLM推荐、序列推荐、电商搜索、个性化建模、生成式推荐
2. **检索增强生成 RAG**：4 篇 — 链接感知检索、多模态检索、检索评估、检索架构
3. **信息检索基础**：3 篇 — ANNS向量搜索、多语言检索评估、Embedding质量审计
4. **学术/应用工具**：2 篇 — Agent技能综述、学术文献提取系统

**一句话总结**：今天的核心看点是推荐系统与LLM的深度融合——从知识图谱的双通道图学习、到电商搜索中偏好-相关性的交互建模、再到序列推荐的基准审计，LLM正在重塑推荐系统的知识注入、行为理解和评估方式。同时，RAG方向的论文也在从"检索什么"转向"如何更智能地检索"。

---

### 今日推荐系统论文解读

#### 🔴 重点推荐

---

[DCGL: Dual-Channel Graph Learning with Large Language Models for Knowledge-Aware Recommendation](https://arxiv.org/abs/2605.07314)

> 机构：清华大学/北京智源人工智能研究院 | Accepted by SIGIR 2026

**动机**：知识图谱（KG）+ 大语言模型（LLM）做推荐，已经是大趋势了。但现有方法有三个痛点：一是知识图谱里只建模了显式关系，隐式语义关系没被充分利用；二是"用户ID嵌入"和"LLM语义嵌入"一股脑儿混在一起，互相干扰；三是高频用户和低频用户的交互模式差异很大，一刀切的融合策略不好使。

**核心思想**：把"语义"和"行为"拆成**两条独立的通道**，各自学习、各自优化，最后根据用户活跃程度动态融合。听起来思路很简单，但关键是拆得干净、合得灵活。

**解决方法**：DCGL 框架三个创新点：

- **双通道架构**：一条通道专注知识图谱的语义结构，另一条专注用户行为序列，结构上完全解耦，避免早期信号干扰；
- **多层次对比学习**：通道内做自对比增强鲁棒性，通道间做对齐学习弥合语义鸿沟；
- **动态融合门控**：根据用户交互频次自适应调节语义和行为信号的权重，低频用户偏语义（冷启动友好），高频用户偏行为（精确度高）。

**专业点评**：SIGIR 2026 的论文，质量有保障。双通道+动态融合的思路在"稀疏场景表现提升"上有实际意义，但要注意对比学习的设计是否真的解决了噪声问题，而不是在更干净的数据上刷指标。实验在4个真实数据集上跑，稀疏场景提升明显，这是亮点。

---

[PRISM: Refracting the Entangled User Behavior Space for E-Commerce Search](https://arxiv.org/abs/2605.07296)

> 机构：阿里巴巴（推测）| 电商搜索行为建模

**动机**：电商搜索里，用户点一个商品，这个行为不完全是"我喜欢"，还受"系统展示了什么"和"其他商品语义匹配度"的影响。简单说，用户行为和商品相关度是纠缠在一起的，传统方法把它们当独立信号建模，结果就偏了。

**核心思想**：把偏好建模和相关度建模从"独立"变成"交互"——偏好会修正相关度，相关度也反过来影响偏好的估计。用大白话说就是：先猜你大概喜欢什么，再看这个商品跟你猜的有多近，反过来再修正你的偏好。

**解决方法**：

- **偏好矫正模块**：迭代式地用"相关度感知约束"修正用户偏好估计，对抗行为混杂效应；
- **LLM驱动的语义锚定**：用正负原型校准相关度表示，确保语义一致性；
- **偏好条件化证据路由**：根据偏好状态自适应聚合多源行为信号。

**专业点评**：电商搜索场景很务实。偏好-相关度交互建模和去混杂方向是当前工业界的重点，这篇论文把这个问题显式建模出来，比传统独立建模有理论优势。LLM语义锚定的思路也值得关注——用LLM生成的原型做校准，比纯数据驱动的方法更有可解释性。

---

[An Embarrassingly Simple Graph Heuristic Reveals Shortcut-Solvable Benchmarks for Sequential Recommendation](https://arxiv.org/abs/2605.07125)

> 机构：JHU / LinkedIn / 密歇根州立大学 | 序列推荐基准审计

**动机**：这是一个**发人深省**的论文。序列推荐领域这些年模型越来越复杂——Transformer、生成式模型、各种花哨的架构——但问题是：我们常用的 benchmark 数据集（Amazon、MovieLens 等）真的需要这么复杂的模型吗？也许一个简单的启发式方法就能达到类似效果？

**核心思想**：用**一个极其简单的图启发式方法**（从最后1-2个交互项出发，在物品转移图上走几跳，按特征相似度排序）去挑战现有基准。

**实验结果**：令人震惊——这个零训练的简单方法在 Amazon Sports 和 CDs 数据集上，NDCG@10 分别超越最佳 baseline 38% 和 44%。

**三种"捷径"被发现**：

1. **低分支局部转移**：物品的转移图太简单，几跳就能找到答案
2. **特征平滑转移**：相邻物品的特征几乎一样，相似度排序就够用了
3. **短历史依赖**：不需要考虑很长的用户历史，最近几项就够了

**专业点评**：这是那种"越简单越有力"的论文，跟 2021 年那篇"Are We Really Making Much Progress?"异曲同工。核心观点是：**标准 benchmark 上表现好 ≠ 模型真的学到了序列模式**。作者呼吁更谨慎地选择数据集，以及做数据集级别的诊断分析。对做序列推荐的同学来说，这篇论文值得认真读。

---

#### 🟡 值得关注

---

[RRCM: Ranking-Driven Retrieval over Collaborative and Meta Memories for LLM Recommendation](https://arxiv.org/abs/2605.07129)

> 机构：UT Austin | LLM 推荐系统

**动机**：LLM 做推荐，核心问题是"怎么把用户历史、协同行为、商品元数据这些信息喂给 LLM"。现有方法要么固定套路（先检索再推荐），要么手工设计注入机制，缺乏灵活性。

**核心思想**：让 LLM 自己"决定"什么时候需要协同记忆、什么时候需要元数据记忆，用最终推荐质量来驱动这个决策过程。

**解决方法**：从轻量用户历史出发，通过强化学习（Group Relative Policy Optimization）学习一个"记忆读取策略"——直接/检索协同证据/检索元数据/交错两者。检索决策完全由最终 top-k 推荐质量驱动。

**点评**：将 RL 引入 LLM 推荐系统的记忆管理是一个有趣的思路。Outcome-only ranking reward 的设计避免了需要人工标注检索相关性标签的问题。

---

[Bridging Textual Profiles and Latent User Embeddings for Personalization](https://arxiv.org/abs/2605.06981)

> 机构：雪城大学 | 个性化用户建模

**动机**：用户表示要么是"可解释但难训练"的文本画像，要么是"有效但黑盒"的嵌入向量。能不能两者兼顾？

**核心思想**：用强化学习对齐文本画像和嵌入空间——让 LLM 生成的文本画像"靠近"正样本、"远离"负样本在嵌入空间中的位置。

**解决方法**：BLUE 框架，用 LLM profiler 生成文本画像，用嵌入模型提供奖励信号，同时引入 text-space 监督确保画像语义有意义。

**点评**：跨域迁移表现好，说明学到的文本画像有泛化能力。这对需要可解释推荐的应用场景（比如向用户展示"为什么推荐这个"）很有价值。

---

[FAVOR: Efficient Filter-Agnostic Vector ANNS Based on Selectivity-Aware Exclusion Distances](https://arxiv.org/abs/2605.07770)

> 机构：新加坡国立大学 | 向量搜索

**动机**：推荐系统和 RAG 里经常需要"先过滤属性，再做向量搜索"（比如"价格低于100且评分高于4的相似商品"）。现有 ANNS 方法在低选择率场景下性能下降严重。

**核心思想**：引入"排除距离"机制——在 HNSW 图上动态重塑向量距离分布，把不符合条件的向量"推开"，把符合条件的向量"拉近"。

**解决方法**：三件套：(1) 统一的选择率估计+过滤 ANNS 架构；(2) 排除距离机制动态调整搜索空间；(3) 选择率驱动的搜索路由（低选择率走暴力预过滤，其他走 HNSW）。

**点评**：QPS 提升 1.3-5x，对实际部署很有意义。排除距离这个概念挺有新意的。

---

### 其他论文速览

---

[TRACE: Tourism Recommendation with Accountable Citation Evidence](https://arxiv.org/abs/2605.07677) — 旅游领域的多轮对话推荐 benchmark，核心特色是要求每个推荐都附带真实的用户评价证据（verbatim citation），并支持拒绝恢复。发现"Grounding Gap"：Retriever 能引用但准确率低，LLM 准确但引用不密。

[LARAG: Link-Aware Retrieval Strategy for RAG Systems in Hyperlinked Technical Documentation](https://arxiv.org/abs/2605.07517) — 技术文档 RAG 里利用文档已有的超链接结构做图式检索，不需要额外建图，效果好且成本低。

[A Comprehensive Survey on Agent Skills: Taxonomy, Techniques, and Applications](https://arxiv.org/abs/2605.07358) — Agent 技能综述，按"表示→获取→检索→进化"四阶段组织，对 Agent 系统设计有参考价值。

[MLAIRE: Multilingual Language-Aware Information Retrieval Evaluation Protocol](https://arxiv.org/abs/2605.07249) — 多语言检索评估协议，核心洞察：语义强的检索器可能返回内容正确但语言错误的文档，需要同时衡量语义准确性和查询语言偏好。

[DiffRetriever: Parallel Representative Tokens for Retrieval with Diffusion Language Models](https://arxiv.org/abs/2605.07210) — 用扩散语言模型做检索，关键创新：并行生成多个代表 token（而 auto-regressive 模型必须串行），在 BEIR-7 上表现最强。

[Topic Is Not Agenda: A Citation-Community Audit of Text Embeddings](https://arxiv.org/abs/2605.07158) — 对文本嵌入质量的严厉审计：在科学论文检索场景，最先进的嵌入（Gemini、Qwen3、SPECTER2）在"研究领域"级别勉强可用，但在"研究议程"级别几乎完全失效——80%的 top-10 结果偏离目标议程。

[InterLV-Search: Benchmarking Interleaved Multimodal Agentic Search](https://arxiv.org/abs/2605.07510) — 交错语言-视觉 Agent 搜索 benchmark，当前最佳模型准确率不到 50%，揭示了视觉证据获取和搜索控制方面的重大挑战。

[TCMIIES: A Browser-Based LLM-Powered Intelligent Information Extraction System](https://arxiv.org/abs/2605.07507) — 浏览器端零安装的学术文献结构化提取工具，支持自定义 schema，对中医文献提取准确率超过 94%。

---

### 📎 本地 PDF

所有 15 篇论文的 PDF 已下载到本地：

| # | 论文 | PDF |
| --- | --- | --- |
| 1 | FAVOR | `2605.07770.pdf` |
| 2 | TRACE | `2605.07677.pdf` |
| 3 | LARAG | `2605.07517.pdf` |
| 4 | Agent Skills Survey | `2605.07358.pdf` |
| 5 | DCGL | `2605.07314.pdf` |
| 6 | PRISM | `2605.07296.pdf` |
| 7 | MLAIRE | `2605.07249.pdf` |
| 8 | DiffRetriever | `2605.07210.pdf` |
| 9 | Topic Is Not Agenda | `2605.07158.pdf` |
| 10 | RRCM | `2605.07129.pdf` |
| 11 | Graph Heuristic | `2605.07125.pdf` |
| 12 | BLUE (Textual Profiles) | `2605.06981.pdf` |
| 13 | InterLV-Search | `2605.07510.pdf` |
| 14 | TCMIIES | `2605.07507.pdf` |
| 15 | AI Teaching Assistant | `2605.06963.pdf` |

---

*小美 🌸 | 2026-05-11 | arXiv cs.IR 每日论文速递*