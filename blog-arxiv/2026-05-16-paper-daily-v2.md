---
title: "【推荐系统 Paper 日报】2026-05-16"
date: 2026-05-16
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2762711775"
---


# 【推荐系统 Paper 日报】2026-05-16

【推荐系统 Paper 日报】2026-05-16

📅 采集自 arxiv.org/list/cs.IR/recent（Fri, 15 May 2026）
🔬 今日 cs.IR 新论文共 **14 篇**，其中推荐系统深度解读 **4 篇**，其余 10 篇速览

### 

📊 今日概览

今天的 cs.IR 论文以"**生成式推荐与检索统一**"为核心主题，三篇论文（AsymRec、DIG、阿里电商）各自从不同角度探索如何让大模型的生成能力真正服务于推荐/检索，并且都有详细的工业数据验证。此外有一篇来自 NYU 的 Off-Policy Evaluation 日志策略理论工作，填补了推荐系统评估基础设施的理论空白。其余论文集中在 Agentic 检索、多模态 RAG、图神经网络等前沿方向。

### 

🏆 今日推荐系统论文深度解读

#### 

1. Discrimination Is Generation: Unifying Ranking and Retrieval from a Tokenizer Perspective

[arXiv:2605.14853](https://arxiv.org/abs/2605.14853) | **美团（成都 + 北京）**

**🌟 大白话解读：**
这篇论文的核心洞察是：推荐系统中的"排序"和"检索"本质上是同一个问题——只是在不同粒度上求最大值。作者提出 DIG，把分词器（Tokenizer）直接嵌入到排序模型内部一起训练，让排序模型天然成为检索模型。一次训练同时获得两个模型，在公开基准和美团工业数据集上全面提升效果。

**🔬 专业讲解：**

- **研究背景：** 生成式推荐依赖语义 ID（SID）定义生成空间，但现有的分词器是独立训练的，使用检索目标，导致个性化信号与 SID 构建过程完全脱节——这是根本性缺陷，使生成式检索始终落后于判别式排序。
- **问题定义：** 传统方法将分词器和推荐模型分开训练，user-item 交互没有参与到 SID 的构建过程，导致生成式检索无法达到判别式排序的个性化水平。
- **核心方法：** 提出 **DIG**（Discrimination Is Generation），围绕"特征分配分类法"组织：物品固有静态特征→编码进 SID；用户-物品交叉特征（u2i）→隐式驱动 codebook 边界；MLP_u2t 蒸馏模块→推理时近似 u2i 在 token 级别的作用。关键创新：将分词器嵌入判别式排序模型进行端到端训练，一次训练产出"排序+检索"两个模型。
- **实验结果：** 在 3 个公开基准 + 2 个美团工业数据集上，DIG 同时提升排序、检索及统一检索-排序性能。
- **与推荐系统关联度：** ⭐⭐⭐⭐⭐

📎 资源：[arXiv](https://arxiv.org/abs/2605.14853) | [PDF](https://arxiv.org/pdf/2605.14853)

#### 

1. Asymmetric Generative Recommendation via Multi-Expert Projection and Multi-Faceted Hierarchical Quantization

[arXiv:2605.14512](https://arxiv.org/abs/2605.14512) | **清华大学 · 腾讯**

**🌟 大白话解读：**
现在主流"生成式推荐"系统存在一个根本问题：把物品 ID 既当输入又当输出，导致语义信息被压缩损失（输入瓶颈）和训练目标不够精确（输出瓶颈）。作者提出 AsymRec，把输入和输出解耦——输入用连续向量保留丰富语义，输出用多层量化构建高精度的离散目标，最终在多个数据集上平均提升 **15.8%** 的推荐效果。

**🔬 专业讲解：**

- **研究背景：** 生成式推荐（GenRec）将推荐建模为序列生成任务，用离散的"语义 ID"表示物品。当前方法对称地将语义 ID 用作输入和预测目标，存在两个核心缺陷。
- **问题定义：** 输入瓶颈（有损量化丢失细粒度语义信息；流行度偏差）+ 输出瓶颈（不精确的离散目标限制监督信号质量）
- **核心方法：** AsymRec 不对称连续-离散架构：MSP（多专家投影层，保留语义丰富性）+ MHQ（多视角多层级量化，配合语义正则化防止维度坍塌）
- **实验结果：** 在 Amazon 公开数据集上，AsymRec 持续超越当前最优生成式推荐模型，平均提升 **15.8%**。
- **与推荐系统关联度：** ⭐⭐⭐⭐⭐

📎 资源：[arXiv](https://arxiv.org/abs/2605.14512) | [PDF](https://arxiv.org/pdf/2605.14512)

#### 

1. Efficient Generative Retrieval for E-commerce Search with Semantic Cluster IDs and Expert-Guided RL

[arXiv:2605.14434](https://arxiv.org/abs/2605.14434) | **阿里巴巴（天猫 App）**

**🌟 大白话解读：**
传统电商搜索需要经历向量召回→粗排→精排多个阶段，流程复杂且容易错过好商品。这篇论文提出了一个生成式召回模块，通过给每个商品分配"层级语义编号"，让模型可以直接用 Beam Search 生成相关商品 ID，并配合强化学习让召回结果更贴近最终购买目标。天猫 App 实际上线后，**GMV 提升 1.15%**，生成式召回渠道占了超过 **72%** 的购买量！

**🔬 专业讲解：**

- **研究背景：** 生成式检索理论上能突破传统 ANN 向量检索的上限，但工业级电商面临商品量巨大、实时更新、延迟敏感等挑战。
- **问题定义：** 如何解决：(1) Semantic ID 质量导致 Beam Search 空间过大；(2) 生成召回与下游排序目标不对齐。
- **核心方法：** CQ-SID（类目感知 + 查询-商品对比学习 + RQ-VAE，层级化语义簇 ID，beam size 减半）+ EG-GRPO（专家注入 GRPO，解决稀疏奖励不稳定，对齐 CTR/CVR 多目标）。整体定位为对传统向量召回的补充通道。
- **实验结果：** 语义点击命中率 +26.76%，个性化点击命中率 +11.11%；线上 GMV +1.15%，UCTCVR +0.40%；生成式通道购买占比 **72.63%**！
- **与推荐系统关联度：** ⭐⭐⭐⭐⭐

📎 资源：[arXiv](https://arxiv.org/abs/2605.14434) | [PDF](https://arxiv.org/pdf/2605.14434)

#### 

1. Logging Policy Design for Off-Policy Evaluation

[arXiv:2605.15109](https://arxiv.org/abs/2605.15109) | **NYU Stern / 工业界合作 · stat.ML / cs.IR**

**🌟 大白话解读：**
在推荐系统中，我们常用历史数据来"估计"一个新推荐策略会有多好（即 Off-Policy Evaluation，OPE），但估计精度高度依赖当初收集数据用的"日志策略"质量。这篇论文系统研究了"应该设计什么样的日志策略来最小化 OPE 误差"，得出可操作的理论最优方案，并揭示了一个关键权衡：收集高收益动作的数据 vs. 保证对目标策略的覆盖。

**🔬 专业讲解：**

- **研究背景：** OPE 是推荐/广告系统"无需 A/B 测试就能评估新策略"的核心技术，现有工作主要聚焦估计方法，很少研究日志策略设计。
- **问题定义：** 给定目标策略，如何设计日志策略最小化 OPE 误差？在目标策略已知/未知/部分已知三种场景下各有什么最优解？
- **核心方法：** 识别并形式化 reward-coverage tradeoff；构建统一框架推导三种典型场景下的最优日志策略；提炼运营约束下的实用设计原则。
- **实验结果：** 理论推导 + 受控实验，量化展示不同日志策略设计对 OPE 均方误差的影响。
- **与推荐系统关联度：** ⭐⭐⭐⭐⭐

📎 资源：[arXiv](https://arxiv.org/abs/2605.15109) | [PDF](https://arxiv.org/pdf/2605.15109)

### 

🔭 其他论文速览

- [Stop Overthinking: Unlocking Efficient Listwise Reranking with Minimal Reasoning](https://arxiv.org/abs/2605.14450) — LLM listwise 重排序中 CoT"过度推理"问题，长度正则化自蒸馏框架在保持排序效果的同时将推理 token 消耗减少 34-37%
- [Towards Self-Evolving Agentic Literature Retrieval](https://arxiv.org/abs/2605.14306) — 提出自进化的 Agentic 文献检索框架，使 Agent 通过与环境交互持续迭代优化文献搜索与综合能力
- [Thinking Ahead: Prospection-Guided Retrieval of Memory with Language Models](https://arxiv.org/abs/2605.14177) — 将人类"前瞻性思维"引入 LLM 记忆检索，通过预测未来需要什么信息主动引导记忆召回，而非被动响应查询
- [MemEye: A Visual-Centric Evaluation Framework for Multimodal Agent Memory](https://arxiv.org/abs/2605.15128) — 面向多模态 Agent 提出以视觉为中心的记忆评估框架，系统评估 Agent 视觉记忆的存储、召回和推理能力
- [Why Neighborhoods Matter: Traversal Context and Provenance in Agentic GraphRAG](https://arxiv.org/abs/2605.15108) — 研究 Agentic GraphRAG 中图遍历上下文对引用忠实性的影响，倡导轨迹级别的溯源评估
- [Croissant Baker: Metadata Generation for Discoverable ML Datasets](https://arxiv.org/abs/2605.15079) — 自动生成符合 Croissant 规范的 ML 数据集元数据，提升机器学习数据集的可发现性和互操作性
- [A Deterministic Agentic Workflow for HS Tariff Classification](https://arxiv.org/abs/2605.14857) — 面向海关 HS 税则编号分类任务，设计多维度规则推理的确定性 Agent 工作流，产出可解释的决策
- [Falkor-IRAC: Graph-Constrained Generation for Verified Legal Reasoning in Indian Judicial AI](https://arxiv.org/abs/2605.14665) — 利用知识图谱约束的生成式推理系统，提升印度司法 AI 在法律文书中的可验证推理能力
- [A Picture is Worth a Thousand Words? Visual Financial Document Retrieval](https://arxiv.org/abs/2605.14581) — 实证研究多种视觉-文本聚合策略在金融文档检索中的效果，揭示纯视觉方法与文本方法的性能差距（ACL 2026 Findings）
- [Think When Needed: Adaptive Reasoning-Driven Multimodal Embeddings with a Dual-LoRA Architecture](https://arxiv.org/abs/2605.14448) — 提出双 LoRA 架构，让多模态嵌入模型按需启用 CoT 推理，在不增加推理开销的情况下提升复杂视觉-语言匹配效果

---

📁 本地 PDF 已下载至 ~/.openclaw/arxiv_papers/2026-05-16/
🕐 采集时间：2026-05-16 08:00 AM CST | 数据来源：arxiv.org/list/cs.IR/recent