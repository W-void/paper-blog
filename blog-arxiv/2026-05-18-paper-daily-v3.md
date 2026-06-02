---
title: "【推荐系统 Paper 日报】2026-05-18"
date: 2026-05-18
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2763212406"
---


# 【推荐系统 Paper 日报】2026-05-18

【推荐系统 Paper 日报】2026-05-18

📅 **论文来源：** arxiv cs.IR，最新发布日期 2026-05-15（周五）
🔢 **cs.IR 本周总收录：** 113 篇 | **推荐系统相关：** 5 篇深度解读 + 9 篇速览

### 一、今日概览

本周五（2026-05-15）cs.IR 共收录 **14 篇**论文。从方向分布来看，**生成式推荐/检索**继续是最热门的赛道，多篇论文围绕 Semantic ID（语义 ID）的构建与优化展开竞争；**LLM + Reranking** 方向关注推理效率，试图在不牺牲效果的前提下降低 CoT 的计算成本；**离线策略评估（OPE）** 也有理论新作，对实际推荐系统的 A/B 前评估具有重要意义。另外，检索 Agent、多模态嵌入等方向各有新进展。

### 二、推荐系统论文深度解读

#### 🔥 1. AsymRec：打破生成推荐的信息瓶颈

**标题：** Asymmetric Generative Recommendation via Multi-Expert Projection and Multi-Faceted Hierarchical Quantization

**arXiv：** https://arxiv.org/abs/2605.14512 | **机构：** Tencent PCG / 清华大学（Wenwu Zhu 组）

**🗣 大白话版：** 传统生成式推荐系统在"输入"和"输出"两端都像是走了独木桥——输入丢精度，输出也不准。这篇论文把两端解耦，输入用连续向量保留语义，输出用更精细的离散码本，推荐效果平均提升 15.8%，打赢了所有 SOTA 对手。

**研究背景：** 生成式推荐（GenRec）把推荐问题重构为序列生成任务，用离散的 Semantic ID（SID）同时作为输入和预测目标。这种对称设计简洁优雅，但在实际应用中性能往往不如判别式排序模型。

**核心问题：** 存在"双阶段信息瓶颈"：① **输入瓶颈**——量化有损，流行度偏置使高频商品表示质量远好于长尾商品；② **输出瓶颈**——离散目标精度不足，监督信号质量差。

**核心方法：** 提出 **AsymRec**，打破输入/输出对称假设。MSP（多专家语义投影）将连续 Embedding 通过多专家门控映射到 Transformer 隐空间，保留细粒度语义，改善长尾物品泛化能力；MHQ（多视角分层量化）从多角度和多层级构建高容量结构化离散目标，使用语义正则化防止维度坍塌。

**实验结果：** 在多个公开 Benchmark 上平均超越 SOTA 生成推荐方法 **15.8%**，代码将开源。

**推荐系统关联度：** ⭐⭐⭐ 高 — 直接针对生成式推荐场景，对工业界部署 GenRec 系统有直接参考价值。

---

#### 🔥 2. DIG：让生成式检索追上判别式排序

**标题：** Discrimination Is Generation: Unifying Ranking and Retrieval from a Tokenizer Perspective

**arXiv：** https://arxiv.org/abs/2605.14853 | **机构：** 工业界（含工业数据集验证）

**🗣 大白话版：** 推荐系统里"召回"和"排序"一直是两套人马，互不干涉。这篇论文发现它们本质上在干同一件事（只是粒度不同），于是把 tokenizer 塞进了排序模型一起训练，一次训练同时得到召回模型和排序模型，两个都比原来更好。

**研究背景：** 生成式推荐中，Semantic ID（SID）的质量直接决定了个性化上限。现有 tokenizer 独立训练，不包含个性化信号——这是生成式检索长期跑不过判别式排序的根本原因。

**核心洞察：** 排序 = item space 中的 argmax；检索 = token space 中的 argmax——两者本质相同，只是粒度不同。

**核心方法：** **DIG（Discrimination Is Generation）** 将 tokenizer 内嵌到判别式排序模型中进行端到端训练，设计特征分配分类法：item 内在静态特征编码为 SID；user-item 交叉特征（u2i）在训练时隐式驱动 codebook 边界向推荐决策边界靠拢；推理时用 MLP_u2t 蒸馏模块近似 u2i 特征，一次训练得到两个模型（排序 + 检索）。

**实验结果：** 在 3 个公开 Benchmark + 2 个工业数据集上，同时提升排序、检索和联合检索-排序质量。

**推荐系统关联度：** ⭐⭐⭐ 高 — 对生成式推荐全链路（召回+排序统一）有重要意义，工业落地价值高。

---

#### ⚡ 3. Stop Overthinking：让 LLM Reranker 减少"思考"

**标题：** Stop Overthinking: Unlocking Efficient Listwise Reranking with Minimal Reasoning

**arXiv：** https://arxiv.org/abs/2605.14450 | **机构：** 北京理工大学

**🗣 大白话版：** 让大模型做重排序，效果很好，但大模型喜欢"思考"半天才给答案——推理 token 太多，上线太慢。这篇论文用知识蒸馏教会小模型"想够了就别再想了"，把推理 token 减少 34-37%，效果几乎不变。

**研究背景：** LLM Listwise Reranking 目前是信息检索中最强的重排序方式。推理增强模型（如使用 CoT）进一步提升效果，但代价是产生大量推理 token。

**核心问题：** 存在"过度思考"现象——扩展推理长度收益递减，大量额外 token 没有带来等比例的质量提升，在延迟敏感的线上系统中不可接受。

**核心方法：** **Length-Regularized Self-Distillation 框架**：从教师模型（Rank-K）采样多样化推理轨迹，用 Pareto 启发式过滤器筛选出在最小 token 消耗下达到高排序性能的"高效轨迹"，学生模型在这些简洁高质量 rationale 上微调，内化高效推理模式。

**实验结果：** 在 TREC Deep Learning 和 NeuCLIR Benchmark 上，推理 token 减少 **34%-37%**，效果持平教师模型。

**推荐系统关联度：** ⭐⭐ 中 — 适用于推荐系统的 LLM 重排阶段，对减少在线推理成本有参考价值。

---

#### 🛒 4. CQ-SID：电商生成式召回的工业实践

**标题：** Efficient Generative Retrieval for E-commerce Search with Semantic Cluster IDs and Expert-Guided RL

**arXiv：** https://arxiv.org/abs/2605.14434 | **机构：** 阿里巴巴 Tmall（天猫）

**🗣 大白话版：** 电商搜索里要从上亿商品里快速找到你可能想买的，这篇论文设计了一套聪明的"商品编码 + 强化学习"系统，让生成式召回不再只是"实验室玩具"，真正在双十一流量级的系统上跑起来了，GMV 提升 1.15%。

**研究背景：** 生成式检索在学术界效果令人期待，但工业电商落地面临三大挑战：超大规模动态商品目录、严苛延迟要求、与下游排序目标对齐。

**核心方法：** CQ-SID 使用类目感知和 Query-Item 对比学习 + Residual Quantized VAE 将商品编码为分层语义聚类标识，大幅降低 Beam Search 复杂度；EG-GRPO 在稀疏奖励下通过注入 ground-truth 样本稳定训练，将生成式召回与下游排序目标对齐。

**实验结果：** 相比 RQ-VAE 基线，语义命中率提升 **26.76%**，个性化点击命中率提升 **11.11%**。线上 A/B：GMV **+1.15%**，UCTCVR **+0.40%**，现已成为天猫生产系统重要召回通道。

**推荐系统关联度：** ⭐⭐⭐ 高 — 电商搜索与推荐高度相关，工业级验证，参考价值极高。

---

#### 📊 5. OPE Logging Policy：让离线评估更可信

**标题：** Logging Policy Design for Off-Policy Evaluation

**arXiv：** https://arxiv.org/abs/2605.15108 | **机构：** NYU Stern

**🗣 大白话版：** 想在不真正上线的情况下预判一套新推荐策略效果怎样，就需要"离线评估"——但评估结果的准确性严重依赖历史数据是怎么采集的。这篇论文告诉你：如果公司有多套候选推荐系统待选，该怎么设计数据采集策略才能让离线评估最准。

**研究背景：** 离线策略评估（OPE）用历史日志数据估计目标推荐策略的价值，是高风险 A/B 测试的替代方案，被广泛用于推荐系统的预评估。

**核心问题：** OPE 精度高度依赖 Logging Policy，但如何选择 Logging Policy 缺乏理论指导。

**核心方法：** 刻画**奖励-覆盖权衡**（reward-coverage tradeoff）——集中概率在高奖励动作上降低方差，但可能错过目标策略关注的动作；提出统一框架，在三种信息可知状态（目标策略已知/未知/部分已知）下推导最优 Logging Policy，给出实际可操作的设计原则。

**推荐系统关联度：** ⭐⭐ 中-高 — 对需要在多套推荐系统候选中做 A/B 前筛选的团队有直接指导价值。

### 三、其他论文速览（Fri 2026-05-15）

| 序号 | 论文标题 | 简介 |
| --- | --- | --- |
| 1 | [Towards Self-Evolving Agentic Literature Retrieval](https://arxiv.org/abs/2605.14306) | 文献检索 Agent 的自进化框架，支持自主更新检索策略 |
| 2 | [Thinking Ahead: Prospection-Guided Retrieval of Memory with LLMs](https://arxiv.org/abs/2605.14177) | 用"预期未来需求"指导记忆检索，类似人类前瞻性思维 |
| 3 | [MemEye: A Visual-Centric Evaluation Framework for Multimodal Agent Memory](https://arxiv.org/abs/2605.15128) | 多模态 Agent 记忆的视觉评估框架，46页 15图大作 |
| 4 | [Why Neighborhoods Matter: Traversal Context and Provenance in Agentic GraphRAG](https://arxiv.org/abs/2605.15109) | GraphRAG 中邻居节点上下文对检索质量的影响分析 |
| 5 | [Croissant Baker: Metadata Generation for ML Datasets](https://arxiv.org/abs/2605.15079) | 自动为 ML 数据集生成结构化元数据，提升数据可发现性 |
| 6 | [A Deterministic Agentic Workflow for HS Tariff Classification](https://arxiv.org/abs/2605.14857) | 确定性多维规则推理工作流，用于海关关税分类 |
| 7 | [Falkor-IRAC: Graph-Constrained Generation for Legal Reasoning](https://arxiv.org/abs/2605.14665) | 图约束生成式推理用于印度司法 AI 的法律推断 |
| 8 | [A Picture is Worth a Thousand Words? Visual Financial Document Retrieval](https://arxiv.org/abs/2605.14581) | 金融文档的视觉检索聚合策略实证研究，ACL 2026 Findings |
| 9 | [Think When Needed: Adaptive Reasoning Multimodal Embeddings with Dual-LoRA](https://arxiv.org/abs/2605.14448) | 双 LoRA 架构的自适应推理多模态嵌入，30页预印本 |

---

📝 生成时间：2026-05-18 08:00 | 数据来源：https://arxiv.org/list/cs.IR/recent