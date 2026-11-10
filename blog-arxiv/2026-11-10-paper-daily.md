---
title: "【推荐系统 Paper 日报】2026-11-10"
date: 2026-11-10
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2797572567"
---

# 【推荐系统 Paper 日报】2026-11-10

## 📊 今日概览

本期为 arXiv cs.IR 于 2026-11-10（周二）公告的最新一批论文，共 35 篇，其中推荐系统相关 10 篇。今天堪称"工业界大模型推荐专场"：字节 SepLRM 与 RecoGEM 分别从训练范式和线上服务两个角度解决生成式推荐的规模化落地问题，另有 NeurIPS 2026 两篇入选工作（SituRecBench、IntentLens）探索 LLM/VLM 推荐的新形态。生成式推荐的语义 ID 构造与去噪基础组件也有新进展。

## 🔥 推荐系统论文深度解读

### 1. RecoGEM: A Serving System for Production-Scale Generative Recommendation

📄 [arXiv:2611.12296](https://arxiv.org/abs/2611.12296) | 工业系统论文 | Xiangrui Yang, Yunfeng Zhao, Jiawei Yang 等

**🗣️ 大白话：** 生成式推荐不再给候选打分，而是让模型像写句子一样"生成"物品 ID。听起来很酷，但线上服务起来是噩梦：每个请求要连续解码好几步，每步之间还有依赖关系，传统推荐服务架构完全对不上号，LLM 推理引擎的假设也套不上去。这篇论文给出了一个真正跑在生产环境里的答案。

**🔬 专业讲解：** RecoGEM 采用 runtime–engine 解耦架构：把候选状态转移、在线模型/索引产物热更新等 GR 特有逻辑剥离到专用 runtime，执行引擎则利用 GR 序列短、候选空间大、解码步形状可预测的特点，针对性优化 self-attention、候选选择与执行计划。系统已上线超过 9 个月，服务数亿用户、支撑 10+ 个 GR 模型家族；在 OneModel 生产负载上达到单实例 1000+ QPS、P99 延迟低于 35ms，吞吐较代表性 baseline 提升 2.88 倍。对做生成式推荐落地的人来说，这是一篇难得的"踩坑实录 + 系统蓝图"。

---

### 2. SepLRM: A Foundation Model Paradigm for Recommendation

📄 [arXiv:2611.10356](https://arxiv.org/abs/2611.10356) | 基础模型范式 | Di Chen, Xijun Xiao, Qin Ren 等（字节跳动）

**🗣️ 大白话：** 大推荐模型越堆越大，钱却越花越亏：不同的推荐场景、不同业务线，每家模型都要从头编码一遍几十万长的用户行为序列，重复劳动且 ROI 直线下降。SepLRM 的思路是"一次编码，到处复用"——把序列编码抽出来做成共享的基础模型，下游只保留轻量的垂域模型。

**🔬 专业讲解：** SepLRM 将多个端到端 LRM 重构为一个推荐基础模型（RFM）+ 多个独立优化的垂直模型（VM）。RFM 采用 encoder-decoder 架构，将末层 encoder 状态导出为与下游候选无关的共享 KV cache——相比候选特定 logits 或聚合用户向量，KV cache 保留了细粒度行为信息。各 VM 在该 KV 接口上构建候选条件化查询，保持与 E2E 模型等价的 query-KV 交互，实现接近 100% 的能力迁移率。配套设计了 KV cache 压缩、训推工作流及分布式存储系统 LG-Store。三个大规模数据集上达到 SOTA，已在字节两个大规模工业场景部署，显著提升序列扩展 ROI，线上 A/B 一致正向。

---

### 3. SituRecBench: Evaluating Frontier Models as Situated Recommendation Assistants in 3D Environments

📄 [arXiv:2611.10349](https://arxiv.org/abs/2611.10349) | NeurIPS 2026 Evaluations and Datasets Track | Jingtong Yang, Dongding Lin, Jian Wang, Wenjie Li

**🗣️ 大白话：** 推荐系统正在从"猜你喜欢"变成"陪逛导购"。这个基准把 VLM 扔进高保真 3D 超市/家具店里，让模型和你共享第一视角，边聊天边挖掘你的偏好、指着货架推荐、还得把你带到商品跟前。结果发现：现有最强的多模态模型在"空间定位"和"问出你的真实需求"这两件事上都很拉胯。

**🔬 专业讲解：** SituRecBench 将推荐重构为情境化辅助过程：助手与用户共享 egocentric 视角，通过多轮对话完成偏好引导（preference elicitation）、环境接地推荐（environment-grounded recommendation）与导航引导三重任务。评估采用统一交互协议，同时考核对话质量、推荐效用与导航有效性。实验显示前沿 VLM 在空间 grounding、将全局上下文与局部观察融合方面存在系统性短板。对做具身/多模态推荐评估的人来说，这是一个全新的评测维度。

---

### 4. IntentLens: Grounding Underspecified Multimodal Queries for Recommendation via Tool-Augmented Reasoning

📄 [arXiv:2611.11346](https://arxiv.org/abs/2611.11346) | NeurIPS 2026 | Xiao Chen, Dong Fang, Haitao Li, Qing Li

**🗣️ 大白话：** 用户拿一张参考图加一句"想要个差不多这个感觉的"就来求推荐——关键属性全靠猜。现有方法要么依赖历史行为，要么假设用户把需求说得明明白白，都不够用。IntentLens 的解法很直接：先别急着匹配，让多模态大模型调工具把模糊需求"查清楚"再排序。

**🔬 专业讲解：** IntentLens 采用 ground-then-rank 两段式流水线：共享 MLLM 调用视觉工具、用户记忆模块和物品属性检索工具，(i) 从图文输入推断潜在意图，(ii) 为每个候选物品补充查询条件化的细粒度证据，随后轻量 ranker 基于 grounded 表示打分。作者构建了两个欠规格多模态查询基准（GoogleReview-MMTool、Yelp-MMTool），IntentLens 超过竞争性 MLLM 与检索 baseline，并对未见类别和数据集有较强泛化。工具增强 + 推荐的组合范式值得关注。

---

### 5. Not All Branches Are Equal: Adaptive Semantic ID Construction for Generative Recommendation

📄 [arXiv:2611.11549](https://arxiv.org/abs/2611.11549) | RecSys '26 | Guy Hadad, Haggai Roitman, Bracha Shapira

**🗣️ 大白话：** 生成式推荐给每个物品分配一串"语义 ID"，现有做法假设每一层 token 的含义是独立的。作者指出这不对：语义 ID 应该像树上的路径，第 N 个 token 的含义取决于前面走了哪条路。于是他们造了一棵"自适应分叉的树"来生成 ID，效果显著更好。

**🔬 专业讲解：** 论文提出 Adaptive Silhouette Tree（AST），一种自顶向下的分裂式聚类方法：与固定分支因子的 RQ/HQ 量化不同，AST 在每个节点通过最大化轮廓系数动态决定分支数量，密集区域细划分、同质区域粗归并；并引入带最小概率质量约束的分裂变体，改善长尾物品的监督信号。五个不同规模和领域的 Amazon Review 数据集上显著超过强 baseline。核心贡献是把语义 ID 构造与生成式推荐器隐式学习的层次结构对齐。

---

### 6. Proactive Dimension-Adaptive Denoising for Graph Collaborative Filtering via Representation Coherence

📄 [arXiv:2611.11801](https://arxiv.org/abs/2611.11801) | 图协同过滤去噪 | Wenjun Li, Dong Zhao, Jiaying Shi, Juan Zhang, Zhaoming Pan, Zhimin Zhang

**🗣️ 大白话：** 误点、冲动消费这些噪声交互会在用户-物品图里扩散，污染整个表示。现有去噪方法都靠训练 loss 来判断交互可不可靠，但 loss 是个"事后诸葛"——只有噪声已经造成预测错误了它才报警。这篇论文换了个信号：直接看这个交互的表示和用户历史偏好中心离得近不近。

**🔬 专业讲解：** 提出 Noise-aware Dimension Learning（NDL）：核心是 Representation Coherence Detection（RCD），在嵌入空间度量交互表示与用户历史偏好质心的连贯性，作为不依赖 loss 的主动噪声信号；通过 activity-aware 加权与 loss 信号融合（活跃用户更信 coherence，冷启动用户自动回退 loss），融合估计驱动交互级、维度自适应的掩码，限制不可靠交互的有效表示容量；辅以轻量对比正则稳定嵌入几何。Amazon-book / Yelp / MovieLens-1M 上 Recall@5 分别较最强 baseline DAR 提升 +17.95% / +12.33% / +5.63%。方法仅作用于训练期，与 LightGCN 生产管线兼容，推理零开销。

---

### 7. Slim Foundation Models for Latency-Critical Recommendation Serving

📄 [arXiv:2611.11013](https://arxiv.org/abs/2611.11013) | 高效 CTR 建模 | Danyal Aftab, Anas Zafar, Assadig Abakr, Steven Davy

**🗣️ 大白话：** LLM 的语义先验对 CTR 预估（尤其冷启动和长尾）很有用，但在线挂一个 LLaMA-8B 太贵了，所以大家都偷偷离线缓存 LLM 输出。这篇论文偏要让它在线跑：把模型砍掉一半再微调，居然几乎不丢精度，还快了 3 倍多。

**🔬 专业讲解：** 提出 SlimFM 流水线：(1) 依赖感知的结构化剪枝将 LLaMA3-8B 压缩 44% 至 4.5B 参数骨干；(2) LoRA field-aware 微调使剪枝模型从轻量文本 prompt 产出判别性的字段级语义嵌入；(3) 语义引导融合模块将嵌入注入传统 CTR 模型的特征交互。4 个数据集 × 6 个 CTR 骨干上，保留 99%+ 未压缩模型精度，推理延迟较现有 LLM-enhanced baseline 降低最多 3.4 倍。是"LLM 塞进在线推荐链路"这条路线里少见的正面答案。

---

### 8. Beyond Ranking: Are Decision Models Calibrated Relevance Scorers?

📄 [arXiv:2611.11480](https://arxiv.org/abs/2611.11480) | 相关性校准 | Shengyao Zhuang, Xueguang Ma, Matthias Petri, Jimmy Lin

**🗣️ 大白话：** 新一代"决策模型"（如 Jev）宣称直接输出校准过的相关性概率。作者实测发现：嘴上很自信，实际很翻车——它给出 0.9 以上置信度的文档对里，只有 66% 是真相关的。好消息是，这主要是"刻度问题"，用 2000 来个样本拟合个两参数校准就能修好。

**🔬 专业讲解：** 论文先在 8 个 BEIR 集合上复现 "Beyond Yes and No" 的 FLAN-UL2 设定，再以相同协议评测 Jev 及两个开源决策模型：排序上 Jev 与 27B pplx-decider 平均优于 FLAN-UL2 和三个 cross-encoder。但对照人工标注，Jev 原生概率明显 overconfident；在 DL19 的 2257 对上拟合两参数校准后可大幅消除，且可迁移至 DL21。校准后 Jev 的 DL21 Brier 分数优于 FLAN-UL2 与 cross-encoder，主要得益于相关/不相关的分离能力。附加发现：用校准概率按期望 F1 选截断，无需额外参数即优于固定 top-10 截断。对用 LLM 打分做检索/推荐融合的人有直接参考价值。

---

### 9. An Adaptive, Context-Aware, and Stacked Attention Network-Based Recommendation System to Capture Users' Temporal Preference

📄 [arXiv:2611.11278](https://arxiv.org/abs/2611.11278) | IEEE TKDE | Jung-Hsien Chiang, Chung-Yao Ma, Chi-Shiang Wang, Pei-Yi Hao

**🗣️ 大白话：** 用户喜好会变：上周痴迷露营装备，这周转向健身器材。这篇工作把时间切成区间、把上下文（场景因素）喂给注意力机制，让模型跟着用户"变心"。

**🔬 专业讲解：** 方法将用户各时间段内的交互物品与上下文因素联合建模：上下文物品注意力模块捕捉上下文信息、偏好变化模式与物品重要性；多头注意力模块扩展偏好多样性并自适应偏好漂移；再引入物品时间信息强化上下文物品表示。三个真实数据集上超越多个 SOTA 基线。属于中规中矩的时序偏好建模改进，胜在已发表于 TKDE 且代码开源。

---

### 10. Clinical Evidence-Guided Residual Learning for Medication Recommendation with Dynamic DDI Regularization

📄 [arXiv:2611.10613](https://arxiv.org/abs/2611.10613) | 医疗推荐 | Zesheng Li, Chengchang Pan, Honggang Qi

**🗣️ 大白话：** 给病人推荐用药，既要"对症"又要防药物相互作用（DDI）。EviDrug 用临床证据引导的残差学习 + 动态 DDI 正则，在保证疗效预测质量的前提下压低药物冲突风险。

**🔬 专业讲解：** 框架含临床记忆骨干（自训练的 visit-aware 编码器 + 训练案例记忆 + 药物集合交互块）建立患者特异处方表示；门控精化头通过有界 logit 修正融合临床关联与病史条件化的药物身份；DDI 反馈模块基于训练查询预测自适应调节正则强度。MIMIC-IV、NWICU、SICdb 三个数据集上，AP 较最强 baseline 分别 +2.26 / +2.06 / +1.71 个百分点，参数量与运行开销低于 MetaDrug，控制实验证实 DDI 降低且预测质量稳定。

---

## 📋 其他论文速览

- **NIFT-SQL: Customer-Supervised Table Scoring for Enterprise Text-to-SQL Retrieval**（arXiv:2611.12731）：企业级 Text-to-SQL 检索中的表打分方法，让客户监督参与筛选流程。
- **TS-GEAR: Taobao Shangou GEnerative Ad Retrieval**（arXiv:2611.12180）：淘宝近场电商的生成式广告检索系统，工业界 GR 在广告侧的又一落地。
- **CHO-Bench: How Do Context Hints Affect Ad Rankings in LLM Advertising?**（arXiv:2611.11955）：研究上下文提示如何影响 LLM 广告排序的基准，暴露提示注入对广告公平性的影响。
- **RoutingTrie: Metadata Routing for Constrained Generative Retrieval**（arXiv:2611.11016）：用元数据 Trie 路由约束生成式检索的解码空间，保证输出满足结构约束。
- **LEGIT: Live Eligibility Gating over Identifier Tries for Constrained Decoding of Heterogeneous Pages**（arXiv:2611.10357）：基于标识符 Trie 的在线合法性门控，约束异构页面的生成式解码。
- **Search-by-Answer Bias in Retrieval Models**（arXiv:2611.11396）：揭示检索模型存在"按答案搜索"偏置——模型倾向记住答案本身而非问题。
- **Hybrid Product Search Without the Copy: Lexical, Semantic and Filtered Retrieval Served Directly from a Data Lake**（arXiv:2611.11031）：不建索引副本、直接在数据湖上提供词法+语义+过滤混合商品检索的系统方案。
- **Yuanbao-Reranker: Document-Grounded Synthesis and Preference Distillation for Text Reranking**（arXiv:2611.10405）：腾讯元宝的文本重排模型，通过文档接地的合成数据与偏好蒸馏训练。
