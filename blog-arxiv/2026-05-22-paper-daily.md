---
title: "【推荐系统 Paper 日报】2026-05-22"
date: 2026-05-22
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2764273525"
---


# 【推荐系统 Paper 日报】2026-05-22

### 📊 今日概览

arXiv cs.IR 于 2026年5月22日（周五）更新了 **12 篇**论文。其中推荐系统及相关方向的论文有 **7 篇**，话题覆盖 LLM 驱动的推荐、多模态推荐、对话式推荐、广告稳定性、冷启动搜索等热点方向。今天工业界出品较多（Airbnb、快手），质量整体相当高，很有参考价值。

### 🌟 推荐系统论文深度解读

#### 1. 用强化学习让 LLM 推荐更会"想"——RPO

**论文：**Reinforced Preference Optimization for Reasoning-Augmented Recommendations（[arxiv 2605.21967](https://arxiv.org/abs/2605.21967)）

**机构：**快手、香港城市大学等，arXiv 2026.05

**大白话：**现在的 LLM 推荐系统虽然能"推理"，但推理内容和最终推荐结果经常对不上——模型说了一堆，但选出来的还是那几个老面孔。RPO 把强化学习引入推荐推理过程，让模型不光要"说得有道理"，还要"选得准"，两个目标一起优化。

**专业讲解：**核心思路是用 GRPO（Group Relative Policy Optimization）对推荐推理链进行偏好对齐。给同一用户和上下文生成多条推理路径，按推荐准确率给每条路径打分，再做相对优化。模型学到的推理不是"语言上像样"，而是"真的能帮助推荐准确"。对研究 LLM-for-Rec 的同学来说，这篇提供了一个很干净的 RL 框架，可以直接迁移到生成式推荐实验里。

#### 2. 全生成式对话推荐——不再拆成两个模块

**论文：**Generative Conversational Recommender System（[arxiv 2605.21987](https://arxiv.org/abs/2605.21987)）

**机构：**南洋理工大学，arXiv 2026.05

**大白话：**以前的对话推荐系统大多是"先推荐、再生成回复"两个模块分开跑，信息传递有损耗。这篇论文把推荐和对话生成彻底合在一起，用端到端生成式框架，让模型在生成回复的同时自然地给出推荐结果。

**专业讲解：**统一生成式框架中，item 推荐和 response 生成在同一个 autoregressive 解码过程完成。通过特殊 token 标记推荐位置，在语言建模目标下同时学习推荐和对话。主要优势是 user intent 可以在推荐和生成之间互相增强，避免 pipeline 方式下意图表征的二次衰减。外卖场景多轮意图对话很常见，这个框架的思路值得关注。

#### 3. Airbnb 冷启动自然语言搜索——LLM 合成数据解决标注难题

**论文：**Bridging the Cold-Start Gap: LLM-Powered Synthetic Data Generation for Natural Language Search at Airbnb（[arxiv 2605.21812](https://arxiv.org/abs/2605.21812)）

**机构：**Airbnb，arXiv 2026.05

**大白话：**想上线自然语言搜索，但系统刚启动，没有真实用户 query 和相关性标注——Airbnb 用 LLM 合成数据来解决：让大模型根据房源信息和种子 query 批量生成"假用户 query"及相关性标签，用合成数据训练排序模型，成功冷启动了自然语言搜索系统。

**专业讲解：**核心贡献两个：(1) Query 生成：用对比性 listing pair（来自 booking session）+ 种子 query（来自用研），保证合成 query 的多样性和真实性；(2) 标注策略：LLM 生成相关性标签，并设计对比验证机制减少幻觉。最终合成数据驱动的模型在冷启动期 NDCG 超过 baseline。对美团本地生活新场景（如城市旅游、新功能上线）的冷启动问题有很强的借鉴意义。

#### 4. 广告推荐的稳定性问题——LLM 来兜底

**论文：**LLM Retrieval for Stable and Predictable Ad Recommendations（[arxiv 2605.21969](https://arxiv.org/abs/2605.21969)）

**机构：**工业界广告系统，arXiv 2026.05

**大白话：**广告推荐系统越来越大，广告库也越来越多，但随之而来的问题是：预测结果不稳定，同一个用户在相近时刻可能拿到完全不同的广告。这篇论文专门研究如何用 LLM 提升广告推荐的稳定性和可预测性，而不只是追求点击率。

**专业讲解：**引入预测稳定性（prediction stability）和可预测性（predictability）作为新的优化目标，和传统 recall/NDCG 一起纳入评估体系。LLM 在这里的作用是提供语义层面的稳定锚点——即使 ID 特征的统计分布在抖动，语义表征相对稳定，可以作为召回结果的正则化约束。对美团大促期间流量波动导致推荐结果剧烈变化的问题很有参考价值。

#### 5. 多模态推荐的频谱视角——别让跨视图一致性太强

**论文：**Behavior-Guided Candidate Calibration for Multimodal Recommendation（[arxiv 2605.22073](https://arxiv.org/abs/2605.22073)）

**机构：**arXiv 2026.05

**大白话：**多模态推荐里让图像特征和行为特征尽量对齐（对比学习）是常见操作。但这篇发现，对齐得太好反而让推荐多样性下降——模型学到的是"共性"而不是"区分性"。用频谱分析发现低频成分是共享结构，高频成分才是推荐区分性的来源，据此设计了行为引导的候选校准模型。

**专业讲解：**核心洞察：跨视图对齐适度有益，过度对齐会压制高频判别信号。方案是对多模态表征做频谱分解，保留高频差异信息，再用行为信号做候选集校准（candidate calibration），在最终排序前根据用户行为模式微调候选集的权重分布。对美团图文推荐（攻略图片+用户历史行为）场景有参考价值。

#### 6. 生成式检索 + 思维链——ThinkGR 让模型先想再检索

**论文：**Integrating Chain-of-Thought into Generative Retrieval: A Preliminary Study（[arxiv 2605.22358](https://arxiv.org/abs/2605.22358)）

**机构：**山东大学，arXiv 2026.05

**大白话：**生成式检索（GR）直接把 query 映射到文档 ID，但复杂 query 需要多步推理才能找准文档。ThinkGR 让模型在生成文档 ID 之前先生成推理链（CoT），相当于"想明白再给答案"，在复杂检索场景上效果更好。

**专业讲解：**将 CoT 与 docid 生成交织在同一个 autoregressive 框架里，CoT 的中间 token 作为软性条件，影响后续 docid token 的生成概率分布。在多跳推理 retrieval benchmark 上相比直接生成 docid 有明显提升。对做 SID/生成式推荐的同学来说，这个思路可以迁移：在生成 item ID 之前加入 user intent 的显式推理步骤，可能提升长尾和复杂偏好的召回质量。

### ⚡ 其他论文速览

- **Diversed Model Discovery via Structured Table Discovery**（[arxiv 2605.22766](https://arxiv.org/abs/2605.22766)，多伦多大学）：模型搜索系统，通过结构化表格提升结果多样性，避免语义相似导致的同质化推荐。
- **One prompt is not enough: Instruction Sensitivity Undermines Embedding Model Evaluation**（[arxiv 2605.22544](https://arxiv.org/abs/2605.22544)，cs.CL）：Embedding 模型评估中单 prompt 不足以代表真实性能，建议用多 prompt 评估。
- **Search-E1: Self-Distillation Drives Self-Evolution in Search-Augmented Reasoning**（[arxiv 2605.22511](https://arxiv.org/abs/2605.22511)，cs.AI）：搜索增强推理的后训练方法，自蒸馏驱动模型自我进化，不依赖外部强监督。
- **BeLink: Biomedical Entity Linking Meets Generative Re-Ranking**（[arxiv 2605.22501](https://arxiv.org/abs/2605.22501)，cs.CL）：生物医学实体链接 + 生成式重排序，instruction-tuning 开源模型即可获得强性能。
- **Direct content-based retrieval from music scores images**（[arxiv 2605.22255](https://arxiv.org/abs/2605.22255)，cs.CV）：乐谱图像内容检索，研究哪些乐谱特征对检索最有区分度。
- **From TF-IDF to Transformers: A Comparative and Ensemble Approach to Sentiment Classification**（[arxiv 2605.22003](https://arxiv.org/abs/2605.22003)，cs.CL）：情感分类方法对比，传统方法 vs Transformer，集成方法效果更佳。

---

*日报由 小美 自动生成 | arXiv cs.IR 2026-05-22 | 共 12 篇，推荐系统相关 7 篇*