---
title: "【推荐系统 Paper 日报】2026-06-01"
date: 2026-06-01
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2765487541"
---


# 【推荐系统 Paper 日报】2026-06-01

### 📊 今日概览

arXiv cs.IR 频道于 **Mon, 1 Jun 2026** 更新，今日共 **19 篇**新论文。其中与推荐系统直接相关的论文 **3 篇**，检索/RAG 相关论文 **4 篇**。本期亮点：协同过滤领域出现了一篇从语义因子视角打破"假负例"魔咒的新方法 SaFeAU；公共媒体多目标推荐有了新的 contextual bandit 方案；序列推荐在数据集蒸馏方向也有重要突破。

---

### 🔥 推荐系统论文深度解读

#### 1. Beyond Instance-Level Alignment and Uniformity: Semantic Factor Learning for Collaborative Filtering

📄 [arXiv:2605.31414](https://arxiv.org/abs/2605.31414) | 作者：Yajie Yu, Chenzhong Bin, Zhoubo Xu et al.

**🗣️ 大白话：** 协同过滤最头疼的两个老问题：一是用户没点击的东西不一定就是"不喜欢"（假负例问题）；二是 GCN 太重、容易过平滑。这篇论文提出 SaFeAU，把 item 的语义拆成独立的"语义因子"，通过因子匹配找出"虽然没交互、但语义相似"的潜在正样本，不用图神经网络就搞定了高阶协同信号。

**🔬 专业讲解：** 现有 CF 方法依赖实例级学习范式，大量未交互的 user-item 对被错误标记为负样本（假负例），严重损害泛化性。GCN 虽能捕获高阶连接性，但计算开销高、过平滑问题突出。SaFeAU 提出三个关键模块：

1. **Semantic Factor Routing (SFR)**：将 item 表示解耦为独立的全局语义因子
2. **Semantic Factor Matching (SFM)**：找到与已交互 item 共享相同语义因子的未交互 item，视为潜在正样本，丰富稀疏监督信号
3. **Semantic Pairs Alignment (SPA)**：对观测正对和潜在正对同时做 alignment，同时保持 uniformity

在四个稀疏真实数据集上，SaFeAU 在推荐精度和计算效率上均超越 GCN-based 和 MF-based 的 SOTA 方法。**与 SID 研究的潜在联系**：语义因子解耦思路与 RQ-VAE 码本语义分层有一定共鸣——都在试图让表示的不同维度对应不同粒度的语义。

---

#### 2. Contextual Scalarisation Thompson Sampling for Multi-Objective Decisions in Public Media

📄 [arXiv:2605.31291](https://arxiv.org/abs/2605.31291) | 作者：Théo Maëtz, Luc Guillet, Andrea Cavallaro

**🗣️ 大白话：** 公共媒体（比如国家电视台、广播电台）在做节目推荐时，不能只看点击率，还要顾及文化价值、公共服务义务、运营约束……这些目标经常互相打架。这篇论文提出 CSTS——一种能**随上下文动态调整目标权重**的多目标 Bandit 方法，比固定权重方法更智能。

**🔬 专业讲解：** 现有多目标推荐方法主要有两类：固定权重组合（简单但不灵活）和 Pareto 优化（理论上好但实践中难以对接具体业务优先级）。CSTS（Contextual Scalarisation Thompson Sampler）是一种**多目标 contextual bandit** 方法，核心创新是让 scalarization 权重成为上下文的函数，通过学习来匹配不同情境下的编辑决策偏好。

在瑞士国家广播电台（RTS，Radio Télévision Suisse）的真实节目数据上实验，相比固定权重和标准 contextual bandit，CSTS 在上下文相关性和与专家策略对齐方面都有提升。**工业价值**：美团这种场景（本地生活推荐需平衡 GMV、用户满意度、商家利益等多目标）可以借鉴 contextual 权重学习框架。

---

#### 3. FOSTER: First-order Dataset Distillation for Text-based Sequential Recommendation

📄 [arXiv:2605.30772](https://arxiv.org/abs/2605.30772) | 作者：Hung Vinh Tran, Tong Chen, Xinyi Gao, Junliang Yu, Julien Monteil, Hongzhi Yin

**🗣️ 大白话：** 基于文本的序列推荐系统效果好，但训练贵。能不能把大数据集"压缩"成一个小的合成数据集，用这个小数据集训练出差不多效果的模型？这就是数据集蒸馏（Dataset Distillation）。FOSTER 专门针对文本序列推荐场景做了三项优化，只需 20 条合成序列就能逼近全量数据集的性能。

**🔬 专业讲解：** 文本序列推荐中数据集蒸馏面临两大挑战：(1) item 是离散的，候选池很大；(2) 语言模型做 item encoding，导致双层优化代价极高。FOSTER 提出三项针对性创新：

1. **随机 item 子集采样**：每步蒸馏只抽一个子集提取 embedding，避免全量编码的高计算开销
2. **一阶优化 + 轨迹锚点参数重置**：用一阶近似代替昂贵的双层梯度计算
3. **语义相似 item 共现正则化**：显式鼓励合成序列里语义相似的 item 一起出现，保持语义一致性

在三个 benchmark 上，仅用 **20 条**合成交互序列就能超越现有数据集蒸馏和 coreset selection baseline。**对于美团场景**：训练数据集大、item 文本 embedding 成本高，这类轻量化训练技术有很强的工程实用价值。

---

### 📋 其他论文速览（检索/RAG 方向）

- **DynaTree**（[arXiv:2605.31377](https://arxiv.org/abs/2605.31377)）：两阶段动态新闻检索框架，离线构建语义检索树 + 在线轻量子树选择，Syft 生产系统 A/B 测试存活率从 0.32~0.53 提升到 0.59~0.73。

- **MIMO: Multilingual Information Retrieval via Monolingual Objectives**（[arXiv:2605.31171](https://arxiv.org/abs/2605.31171)）：用英文语义空间作锚点，通过知识蒸馏 + 跨语言对比学习解决多语言信息检索中的语言聚类和 alignment-uniformity 权衡问题。

- **V-SPLADE: Inference-Free Multimodal Learned Sparse Retrieval**（[arXiv:2605.30917](https://arxiv.org/abs/2605.30917)）：面向大规模视觉文档搜索（PDF/论文）的无推理稀疏检索系统，引入 caption-gated token 监督解决词汇接地问题，18.7M 文档语料上 R@5 较 dense baseline 翻倍以上。

- **On the impact of retrieved content representations in RAG Pipelines**（[arXiv:2605.30790](https://arxiv.org/abs/2605.30790)）：探讨 RAG 中当消费者是 LLM 而非人类时，检索内容的表示方式（原文 vs 摘要等）对生成质量的影响。

- **Graph-GRPO: Dependency-Aware Credit Assignment for Generative E-commerce Search Relevance**（[arXiv:2605.31003](https://arxiv.org/abs/2605.31003)）：电商搜索相关性建模中，通过有向无环图建模 query-product 推理依赖，做更精准的信用分配以提升生成式相关性模型。

---

*日报由 AI 自动生成，覆盖 arXiv cs.IR 当日全部 19 篇论文，精选推荐系统相关论文 3 篇深度解读，检索/RAG 相关 4 篇速览。*