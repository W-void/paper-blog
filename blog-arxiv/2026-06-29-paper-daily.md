---
title: "【推荐系统 Paper 日报】2026-06-29"
date: 2026-06-29
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2771792601"
---

# 【推荐系统 Paper 日报】2026-06-29

## 📊 今日概览

arXiv 公告日期：**Mon, 29 Jun 2026**。今日 cs.IR 子领域共收录 **13 篇**论文，其中推荐系统相关 **4 篇**。本期亮点：两篇来自工业界（快手、Avito），分别展示了序列建模在个性化落地页导航和置换重排在大规模电商搜索中的实战效果；学术界则贡献了 LLM 在推荐推理中的"直觉引导"新思路，以及一个零样本的期刊推荐框架。

## 🔥 推荐系统论文深度解读

### 1. Intuition-Guided Latent Reasoning for LLM-Based Recommendation

📄 [arXiv:2606.27684](https://arxiv.org/abs/2606.27684) | 待发表 | Chang Liu, Yimeng Bai, Xiaoyan Zhao, Yang Zhang, Qifan Wang, Fuli Feng, Wenge Rong

**🗣️ 大白话：** 大模型做推荐的时候，推理的起点如果太随意，很容易跑偏。这篇论文说：既然人类做复杂推理时常常靠"直觉"作为起点，那模型也应该先有个靠谱的直觉。具体做法是两步走：先用一个 LLM-based 推荐器给出一个 top-K 候选集，把这个候选集当作"直觉"，通过一个注意力机制把它变成嵌入向量，用这个嵌入去初始化推理的起点。这样一来，模型就不是从"漫无目的"的地方开始推理，而是从一个已经跟用户偏好对齐的位置出发，后续推理轨迹自然更准确。

**🔬 专业讲解：** 该工作提出了 **IntuRec**，一个两阶段框架，将认知神经科学中"直觉引导多步推理"的思想引入 LLM-based 推荐。第一阶段（Extraction）：LLM-based 推荐器基于用户历史生成 top-K 候选集，作为直觉的来源；第二阶段（Injection）：通过自注意力与交叉注意力机制将候选集转化为偏好对齐的直觉嵌入（Intuition Embedding），用于初始化隐空间推理的起点。这一直觉嵌入为后续 latent reasoning 提供了一个语义锚定的起点，使模型能沿更准确的推理轨迹探索偏好空间。在多个真实数据集上的实验表明，IntuRec 一致优于 SOTA 基线。代码已开源：github.com/Ten-Mao/IntuRec。

---

### 2. From Bootstrapping to Sequence Modeling: A Unified Generative Framework for Personalized Landing-Page Modeling

📄 [arXiv:2606.27865](https://arxiv.org/abs/2606.27865) | 待发表 | Fan Li, Chang Meng, Jiaqi Fu, Shuchang Liu, Tianke Zhang, Xueliang Wang, Xiaoqiang Feng, Yongqi Liu, Kaiqiao Zhan

**🗣️ 大白话：** 像快手这种多页 App，用户打开时该把他导向哪个页面（落地页）是个非常关键的问题。之前的做法用 CQL（保守 Q 学习）来做强化学习，但有两个硬伤：一是马尔可夫假设在现实世界里太弱，用户行为有强烈的长程依赖；二是 bootstrapping 的累积误差在长程延迟奖励下很致命。这篇论文直接用 Decision Transformer 把问题变成序列建模，从"全局-局部"两个角度统一解决。全局上，用 L-RTG 模块捕捉用户跨天的消费动态，给一天的页面分配提供宏观指导；局部上，用 HRM 模块把会话级反馈拆成细粒度信号，精确监督每一次页面分配。快手线上实验 DAU +0.158%、LT +0.108%。

**🔬 专业讲解：** 本文提出 **GLAN（Generative Landing-page Adaptive Navigator）**，基于 Decision Transformer 将 PLPM（Personalized Landing-Page Modeling）从 bootstrapping 范式转变为序列建模范式。核心创新：
- **L-RTG 模块**：捕捉用户跨日消费动态，为单日所有页面分配提供全局回报指导（Long-horizon Return-to-Go）；
- **HRM 模块**：将会话级反馈分解为细粒度信号，实现每一次页面分配的精确局部监督。
在快手平台的在线实验验证了有效性，DAU 和 LT 分别提升 0.158% 和 0.108%。

---

### 3. An LLM-Powered Semantic Alignment Framework for Journal Recommendation

📄 [arXiv:2606.27930](https://arxiv.org/abs/2606.27930) | 待发表 | Yanglin Yan, Zicheng Xie, Tianchen Gao, Rui Pan, Hansheng Wang

**🗣️ 大白话：** 投稿选期刊是个头疼的事。以前的做法要么用监督学习模型，需要大量标注数据；要么手工设计特征，费劲又不通用。这篇论文换了个思路：用 LLM 直接做语义对齐——把论文标题、摘要、关键词和候选期刊的 scope 描述放在一起，让 LLM 自己判断匹不匹配。零样本，不需要针对任务训练。在 23,609 篇统计类论文、49 个期刊上的实验，Top-3 准确率 40.23%，Top-5 达 53.67%，Top-10 达 70.05%。而且稳定性很好，重复运行 Top-5 Jaccard 相似度平均 84%。

**🔬 专业讲解：** 本文提出一种基于 LLM 的语义对齐框架，将期刊推荐重新定义为**稿件内容与期刊 scope 描述之间的语义匹配问题**。框架利用 LLM（DeepSeek-V3）直接从论文标题、摘要、关键词及候选期刊信息推断期刊适配度，无需任务特定训练。在包含 23,609 篇文章和 49 个期刊的数据集上，框架在 Top-3/5/10 准确率上分别达到 40.23%、53.67% 和 70.05%。附加分析表明：引入参考文献信息通常能提升推荐性能；重复运行稳定性高，Top-5 Jaccard 相似度平均 84%。框架同时生成可解释的推理输出，展示了 LLM 作为零样本、可扩展的学术决策支持范式的潜力。

---

### 4. Fast and Feasible: Permutation-based Constrained Reranking for Revenue Maximization

📄 [arXiv:2606.28059](https://arxiv.org/abs/2606.28059) | 待发表 | Svetlana Shirokovskikh, Anastasiia Soboleva, Ekaterina Solodneva, Aleksandr Katrutsa, Roman Loginov, Egor Samosvat

**🗣️ 大白话：** 电商搜索结果重排时，如果只看收入最大化，用户体验就会下降（比如全是广告）。这篇论文把它建模成一个带约束的整数线性规划（ILP）问题：在满足相关性等指标约束的前提下最大化收入。但 ILP 精确求解太慢，没法上线。于是他们提出了 PermR——一种轻量级的置换算法：每一步找相邻的一对物品，如果交换能提升目标或修复违反的约束，就交换。实验在 Avito 分类广告平台上做了离线+线上测试，PermR 在保持所有约束的前提下，达到了 ILP 约 63% 的收入提升，14 天线上 A/B 测试覆盖 5600 万次查询，收入提升 2%。

**🔬 专业讲解：** 本文提出 **PermR**，一种基于置换的约束重排近似算法，用于电商搜索/推荐系统中的收益最大化问题。核心思路：将收益最大化重排建模为带约束的整数线性规划（ILP），通过局部置换（相邻物品对交换）逐步优化目标函数或修复约束违反。算法轻量、可解释，满足在线服务延迟要求。在 Avito 分类广告平台的评估中，离线实验达到 ILP 约 63% 的收入提升且全部约束被保留；14 天线上 A/B 测试（5600 万+ 查询）实现收入提升 2%。

## 📋 其他论文速览

- **Recall Before Rerank: Benchmarking Deep Learning Models for Large-Scale Code-to-Code Retrieval**（arXiv:2606.27401）：对当代深度学习模型在 TB 级代码库上的召回阶段进行了全面基准测试，发现现有代码专用 LLM 的精度与可扩展性存在显著瓶颈，并提出基于 LLM 的代码归一化与查询改写方案。

- **A Sensitivity-Aware Test Collection for Search Among Personal Information**（arXiv:2606.27559）：基于 Enron 邮件语料构建了一个包含敏感信息标签的测试集，包含 150 个查询和 11,471 条相关性标注，用于评估敏感信息检索（SAS）模型的有效性。

- **DysLexLens: A Low-Resource LLM Framework for Analysing Dyslexic Learners Insights from Online Forums**（arXiv:2606.27619）：提出 DysLexLens 框架，通过知识图谱辅助的 LLM 推理，将低质量论坛数据转化为结构化洞察，用于分析阅读障碍学习者的 AI 使用体验。

- **Bifocal Diffusion Language Models: Asymmetric Bidirectional Context for Parallel Generation**（arXiv:2606.27732）：提出 R2LM 架构，通过反向 Mamba SSM 提供右侧压缩上下文，结合因果注意力实现 KV 缓存兼容的并行解码，在 batch serving 场景下比双向 dLLM 快 2.4–12.9 倍。

- **End-to-End Dynamic Sparsity for Resource-Adaptive LLM Inference**（arXiv:2606.27743）：提出 L2A 框架，将推理建模为同时受输入和运行时资源预算约束的分配问题，通过轻量门控网络实现层跳过、头剪枝和推理 token 缩减的自适应配置，Llama-3-8B 上 34% 层稀疏时性能仅降 0.6%。

- **SHARD: cell-keyed residual splitting for alignment-resistant private dense retrieval**（arXiv:2606.27976）：提出 Shard 嵌入变换，将向量拆分为公共前缀和按文档独立密钥保护的私有残差，通过 CKKS 加密实现检索保持的隐私保护，显著提高了对抗对齐攻击的成本。

- **Listwise Explanation of Embedding-Based Rankings via Semantic Chunk Grouping**（arXiv:2606.27980）：提出 ChunkGroupSHAP，一种基于语义块分组的列表级 Shapley 解释方法，解决密集嵌入排序中特征单元粒度不匹配的问题，发现最优解释单元应随排序器表示粒度动态调整。

- **Single and Multi Truth Data Fusion using Large Language Models**（arXiv:2606.28062）：系统评估了 LLM 在单真值和多真值数据融合任务中的表现，表明 LLM 方法在多个基准数据集上均优于传统无监督真值发现方法（DART、LTM）。

- **Context-Aware Explanations for Spatialized Document Layouts**（arXiv:2606.28081）：提出 CAPE 框架，结合文档语义和空间布局上下文生成自然语言解释，用户研究表明空间感知解释比纯内容解释更有助于理解文档布局的空间组织。