---
title: "【推荐系统 Paper 日报】2026-07-31"
date: 2026-07-31
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2777955558"
---

# 【推荐系统 Paper 日报】2026-07-31

## 📊 今日概览

arXiv cs.IR 于 **Fri, 31 Jul 2026** 发布新论文 **26 篇**，其中与推荐系统强相关的论文 **25 篇**，占比高达 **96%**！本期工业界论文非常密集，Meta（Instagram）、Google Discover、腾讯、淘宝等巨头纷纷发布核心工作，同时 LLM-based 推荐与生成式推荐仍是学术热点。推荐阅读 OneShot（Meta 工业检索新架构）、ROCS（Meta 推理效率突破）、HA-MoE（Google 异构排序）和 CCFormer（腾讯生产落地）。

---

## 🔥 推荐系统论文深度解读

### 1. OneShot: Index-in-Ranking with Neural Scoring for Large-Scale Retrieval

📄 [arXiv:2607.27475](https://arxiv.org/abs/2607.27475) | Meta/Instagram | Ziwei Li, Shuyao Li, Xufeng Cai et al.

**🗣️ 大白话：** 推荐系统的检索和排序长期"各干各的"——检索只管快速捞候选，排序只管精准打分数，两者目标不一致。Meta 这篇工作直接把检索和排序融合成一个端到端框架，用神经网络打分代替传统的向量内积，既保留检索的速度，又获得排序的精度。上线 Instagram 短视频推荐后，召回率提升 20%，效率提升 10 倍。

**🔬 专业讲解：** 传统两阶段检索（ANN 索引 + 精排）存在结构性错位：索引学习优化的是表征相似性，而排序优化的是用户行为对齐。OneShot 提出了"in-model index learning"思路，将索引结构与排序目标联合优化。通过神经网络评分（Neural Scoring）突破内积瓶颈，实现了检索阶段的交互建模扩展。工业部署验证了在十亿级候选集上的有效性，同时大幅提升了线上用户日活、互动时长等核心指标。

---

### 2. ROCS: Request-Oriented Compute Sharing for Efficient Large-Scale Recommendation

📄 [arXiv:2607.27744](https://arxiv.org/abs/2607.27744) | Meta | Yuxin Chen, Liang Luo, Buyun Zhang 等 47 位作者

**🗣️ 大白话：** 推荐模型越来越大了，但推理成本成了瓶颈。Meta 发现推荐推理有个特点：同一个用户的请求要算很多候选物品，但用户侧特征只用算一次。ROCS 就是把这个"算一次"的部分提取出来，让推理效率暴涨。检索模型 QPS 提升 3 倍，排序模型在 QPS 提升 50% 的同时还降低了 0.5% 的 LogLoss。

**🔬 专业讲解：** ROCS 是一种模型和推理架构，核心洞察是 request-candidate 计算的不对称性：request-side 特征在大量 candidates 间共享。通过 Generalized Layer Masking (GLM) 隔离 candidate-dependent 表示，Deep Cross Attention (DCA) 扩展序列架构的 request-oriented sharing，以及 In-Kernel Broadcast Optimization (IKBO) 加速 GPU 部署。该方案已全面部署在 Meta 的推荐系统中，覆盖广告、自然流量、检索和排序阶段。

---

### 3. Heterogeneous Ranking in Industrial-Scale Recommender Systems: A Case Study

📄 [arXiv:2607.27577](https://arxiv.org/abs/2607.27577) | **RecSys 2026 Industry Track** | Di Bai, Jintao Liu, Zhenwei Tang et al. (Google)

**🗣️ 大白话：** Google Discover 的推荐流里有文章、长视频、短视频、UGC 等各种内容，每种内容的特征密度和用户互动方式都不一样。用同一个模型打分，很容易出现"视频挤占文章"的 majority bias。Google 提出了 HA-MoE——异构自适应的混合专家架构，让不同内容类型走不同的专家通路，同时用轻量级的 LENS 框架监控专家的专业化程度，避免部署后"专家塌房"。

**🔬 专业讲解：** 本文基于 Google Discover 的工业部署，提出了 HA-MoE（Heterogeneity-Adaptive Multi-gated Mixture-of-Experts）架构，将异构上下文显式编码到 gating 网络和 expert 表示中。配套提出 LENS 可观测框架，可追踪专家在连续重训练中的功能异构性。新指标 DL-AUC（Dual-Level AUC）同时衡量全局排序性能和跨段排序正确性。离线和在线 A/B 实验均验证了有效性。

---

### 4. CCFormer: Efficient Cross-Field Interaction and Hierarchical Sequence Compression for Industrial Recommendation at Tencent

📄 [arXiv:2607.28070](https://arxiv.org/abs/2607.28070) | Tencent | Yunlong Wang, Huizhe Zhang, Haonan Hu et al.

**🗣️ 大白话：** 自注意力模型在推荐里越用越大，但工业系统对延迟和资源的限制很严格。腾讯把跨域特征交互和序列压缩塞进一个统一的 Transformer 里，让长序列建模不再烧钱。视频推荐 CTR 提升 3.57%，广告收入提升 1.71%，训练速度还比 HSTU 快了 2.2 倍。

**🔬 专业讲解：** CCFormer 提出 feature-field separated cross attention 结合 long-sequence subspace token mixing，通过分层序列压缩（progressively expanded receptive fields）实现高效长序列建模。在两个公开 benchmark 和腾讯大规模工业数据集上均超越 SOTA，并已在腾讯生产环境全量部署，覆盖视频推荐和广告排序两大场景。

---

### 5. From Understanding to Action: Feedback-Grounded Policy Discovery for Generative Recommendation

📄 [arXiv:2607.27789](https://arxiv.org/abs/2607.27789) | Zhi Chen, Minmao Wang, Xingchen Liu et al.

**🗣️ 大白话：** LLM 能看懂用户历史，但"看懂"不等于"能推荐好"。LLM 的推理可能听起来很有道理，但推荐效果不一定好。这篇工作把 LLM 的"理解"和"行动"拆成两个层面：先理解用户意图，再通过实际推荐反馈来发现最优策略。然后通过知识蒸馏把 LLM 的洞察压缩到轻量级的 Semantic-ID 生成器里，线上 Revenue 提升 4.5%，ADVV 提升 4.6%。

**🔬 专业讲解：** 提出 Understanding-Action Gap 概念：LLM 的意图知识（intent knowledge）和推荐策略知识（policy knowledge）存在断层。设计反馈驱动的 agent 框架，先诱导任务导向意图，再基于增量效用发现推荐策略。通过 dual-space relational distillation 将意图和策略知识转移到轻量 Semantic-ID 生成器的两个 latent token 中，实现 LLM-free 在线推理。大规模线上 A/B 验证效果显著。

---

### 6. LoopMemGR: From Behavior Logs to Evolving Memory for Generative Recommendation

📄 [arXiv:2607.27647](https://arxiv.org/abs/2607.27647) | Hui Qian, Changfa Wu, Chang Liu et al. (Taobao/Alibaba)

**🗣️ 大白话：** 生成式推荐只记用户点了什么，但忘了系统之前给用户推过什么。这导致系统不知道"推了 A 用户没点，下次可能该推 B"。LoopMemGR 让推荐系统也记"推荐日志"——不仅记用户行为，还记系统推荐决策和用户反馈，形成闭环记忆。通过"近因-频率-全局"三个视角提取经验，淘宝数据集上效果显著。

**🔬 专业讲解：** 提出 closed-loop recommendation experience memory 框架，在传统 behavior log 之外维护 recommendation experience log，记录 past recommendation--feedback trajectories。设计三视角经验提取：recency view（短期动态）、frequency view（重复模式）、global view（跨用户可迁移规律）。将信号压缩为固定数量 experience tokens 约束生成模型。在工业级淘宝数据集上验证了闭环经验积累的有效性。

---

### 7. Restoring Collaborative Signals in Semantic-ID Generative Recommendation via Personalized Natural Language

📄 [arXiv:2607.27682](https://arxiv.org/abs/2607.27682) | Changjiang Han, Qingyang Li, Yaqiang Zang et al.

**🗣️ 大白话：** Semantic-ID 把物品压缩成短码，但压缩过程中把协同过滤信号弄丢了——代码里只有内容信息，没有"用户 A 和 B 都喜欢这个"的协作信息。这篇工作用自然语言作为桥梁，把协同信号在推理时注入 SID 生成过程，不用改模型也不用重训练，准确率就上去了。

**🔬 专业讲解：** 核心洞察：compact SID 无法同时容纳内容信号和协同信号，两者存在竞争。提出基于个性化自然语言的框架，在推理时为 SID 生成添加分层协同线索，通过可分析的链接恢复缺失的协同信号。不修改 backbone、不重训练 SID，仅通过推理时注入协同信号实现一致的性能提升。

---

### 8. Hierarchical Latent Reasoning for LLM-based Recommendation

📄 [arXiv:2607.27760](https://arxiv.org/abs/2607.27760) | Peiyu Hu, Siying Gu, Weihai Lu et al.

**🗣️ 大白话：** 让 LLM 做推荐，直接让它"思考"会太慢，但隐式推理又不知道每层在干什么。HiLaR 把推理过程分层：从宏观偏好到微观意图，逐层递进。每层推理贡献多少，用强化学习的 process reward 来优化，让 LLM 推荐又快又准。

**🔬 专业讲解：** 提出 HiLaR（Hierarchical Latent Reasoning）框架，构建时间引导的分层用户偏好表示，将其与 LLM 的多层隐式推理状态对齐，从 broad preferences 到 fine-grained current intents 组织推理过程。通过 final recommendation feedback 与 layer-aware process rewards（基于每层边际目标似然增益）联合优化推理轨迹。在 Amazon 四个 benchmark 上超越序列、生成式和 LLM-based 基线。

---

### 9. Interpretable Representation via LLM-Driven Generative Disentanglement for Local-Life Service Recommendation

📄 [arXiv:2607.27944](https://arxiv.org/abs/2607.27944) | Long Zhang, Hao Jiang, Sheng Yu et al. (Kuaishou)

**🗣️ 大白话：** 本地生活服务推荐（如快手本地生活）中，地理位置、品牌、品类等属性混在一起，压缩成 Semantic-ID 后既看不懂又撞码率高。LGRID 把属性拆开，各自编码再对齐，让 SID 的每一位都有明确含义。快手和 Foursquare 上 AUC 提升 5.44%，粗粒度地理字段解码准确率超 99%。

**🔬 专业讲解：** 提出 Encode -> Disentangle -> Align -> Quantize 流水线。联合 LLM 编码保留跨属性地理-语义依赖；Structured Disentangled Block 将 hidden states 路由到地理和语义属性槽；Synergistic Alignment Learning 使槽既可生成解码又可用于检索判别；Dual-Stream Residual Quantization 分别离散化两流。碰撞率从 97% 降至 39.9%。

---

### 10. Hierarchical Reranking for Scalable Financial RAG System

📄 [arXiv:2607.27523](https://arxiv.org/abs/2607.27523) | **IJCAI-ECAI 2026 (FinLLM)** | Joohyun Lee, Sungwoo Hong

**🗣️ 大白话：** 金融文档（年报、财报）又长又杂，RAG 系统经常找不到关键信息。这篇工作设计了一个三阶段金融 RAG：先优化查询，再分层重排序，最后管理长上下文。在多个金融 benchmark 上 NDCG@20 达到 0.79，还拿了 ACM FinanceRAG 挑战赛第二名。

**🔬 专业讲解：** 三阶段架构：Pre-Retrieval Optimization（归一化、关键词扩展、表格转换）、Hierarchical Reranker Architecture（两阶段排序机制）、Long-Context Management（自适应输入分区和融合）。在 FinQA、FinanceBench、ConvFinQA 上验证，NDCG@20=0.7918，事实一致性显著优于基线。

---

### 11. An Exploration Graph with Continuous Refinement for Efficient Multimedia Retrieval

📄 [arXiv:2607.27623](https://arxiv.org/abs/2607.27623) | **ICMR 2024** | Nico Hezel, Kai Uwe Barthel, Konstantin Schall et al.

**🗣️ 大白话：** 多媒体数据库越来越大，找近邻是个刚需。传统图索引建得慢、占内存。这篇工作提出 crEG（continuous refining Exploration Graph），建图快、搜索准，还能做"探索式搜索"——也就是查询本身就是数据库里已有的元素，这在推荐场景里很常见（"给我找类似这个的"）。

**🔬 专业讲解：** crEG 保证无向图偶数度和全局连通性，特别适用于 exploratory search（查询属于数据库元素）。实验发现 ANNS 上的高效不一定直接对应 exploratory search 上的好性能，揭示了检索与推荐场景的评估差异。

---

### 12. Dynamic Exploration Graph: A Novel Approach for Efficient Nearest Neighbor Search in Evolving Multimedia Datasets

📄 [arXiv:2607.27640](https://arxiv.org/abs/2607.27640) | **MMM 2025** | Nico Hezel, Kai Uwe Barthel, Bruno Schilling et al.

**🗣️ 大白话：** 多媒体数据库不是静态的——新内容不断加入，旧内容不断删除。上一篇 crEG 的扩展版 DEG 支持动态增删数据，删除顶点时保证图不碎，新增数据时自动扩展。不管是流式还是在线场景，都比现有动态图算法更快。

**🔬 专业讲解：** DEG 核心创新：保证连通性的顶点删除算法 + 数据分布无关的图扩展方法。在 streaming 和 online 场景均优于现有动态图算法，同时保持对静态数据集与 SOTA 相当的表现。

---

### 13. Gradient-free Task-Conditioned Retrieval for On-Device In-Context Learning

📄 [arXiv:2607.27766](https://arxiv.org/abs/2607.27766) | Xinyu Luo, Hui Liu, Yihua Shao et al.

**🗣️ 大白话：** 手机/边缘设备上跑 LLM，检索上下文示例时不能训练模型（算力不够）。CoRA 不用训练，把 frozen encoder 改造成任务相关的检索器：用 ridge regression 对齐表示，低秩压缩索引，离线建索引时只需候选输入输出对，在线查询时只需输入即可。已经在树莓派 5 上跑通了！

**🔬 专业讲解：** CoRA 框架通过 closed-form ridge regression 将候选输入表示对齐到输出导出的条件空间，低秩因子化产生紧凑检索基。在 10 个文本数据集和 4 个多模态 benchmark（Llama-3.2-1B、MobileLLM-Pro 等）上验证，无需 fine-tuning、backpropagation 或目标模型调用。支持端到端树莓派 5 部署。

---

### 14. FiRE: Enhancing MLLMs with Fine-Grained Context Learning for Complex Image Retrieval

📄 [arXiv:2607.27959](https://arxiv.org/abs/2607.27959) | **SIGIR 2025** | Bohan Hou, Haoqiang Lin, Xuemeng Song et al.

**🗣️ 大白话：** 多模态大模型做图像检索，粗粒度理解不够用了。FiRE 提出两阶段细粒度微调：先让模型理解图像的细粒度上下文，再优化检索对齐。还配套了自动构建细粒度图文数据集的方法。五个 benchmark 上零样本检索全面超越现有方法。

**🔬 专业讲解：** 提出自动细粒度多模态五元组数据集构建 pipeline，将微调解耦为两个阶段：fine-grained context reasoning-oriented fine-tuning 和 fine-grained retrieval-oriented fine-tuning。在五个涵盖复杂图像检索任务的数据集上，零样本设置下显著超越现有方法，且 backbone 更轻量。

---

### 15. VIG-RL: Learning to Search and Insert for Verified Image Grounding

📄 [arXiv:2607.28055](https://arxiv.org/abs/2607.28055) | Qinhan Yu, Jun Guang, Chong Chen et al.

**🗣️ 大白话：** AI 回答问题时插入图片，怎么保证图片确实相关且位置合适？现有 RAG 都是静态流水线，VIG-RL 把搜索-选择-插入当成一个强化学习任务，让 agent 自己决定什么时候搜图、插在哪里。用 ReAct 循环 + 复合奖励，效果远超静态基线。

**🔬 专业讲解：** 将 Verified Image Grounding (VIG) 形式化为 active decision-making 过程，在动态 ReAct 循环中通过 RL 优化，复合奖励系统同时评估逐步工具执行和最终多模态对齐。达到新的 SOTA，显著超越现有静态基线。

---

## 📋 其他论文速览

- **EMBL AI Librarian**（arXiv:2607.28229）：为生命科学 AI agent 升级 Europe PMC 接口，自然语言查询直接返回证据，ScholarQABench 上 Citation F1 提升 16+ 点。
- **GLM-RAG: Graph Language Models for Graph-Based Retrieval-Augmented Generation**（arXiv:2607.28397）：图语言模型做知识图谱 RAG 检索，在域外泛化上超越 GNN 和向量检索基线，10 页 19 图。
- **Finding Change in Satellite Archives from Text**（arXiv:2607.28571）：从文本查询卫星图像变化，对比注意力、Mamba 和压缩三种融合策略，两阶段搜索成本降低 10-15 倍。
- **TCA-SIR: Learning Target-Conditioned Abstractions for Scientific Inspiration Retrieval**（arXiv:2607.28498）：科学灵感检索新思路——学习目标条件抽象表示，ResearchBench 上 HitRate@top4% 提升 10+ 个百分点。
- **A Structured Knowledge Infrastructure for Domain-Specific Data Asset Discovery**（arXiv:2607.27748）：小红书数据仓库知识图谱，RAG 检索数据资产 Hit@10 从 19.1% 提升到 96.6%。
- **DS@GT ARC at ImageCLEFmedical 2026**（arXiv:2607.27763）：医学图像检测和描述生成，概念检测 F1 达 0.579，caption 生成排名第三。
- **Measuring Alignment With Reader Highlights**（arXiv:2607.27739）：评估 LLM 上下文压缩与人类高亮的一致性，控制位置和长度偏差后，GPT-5.4 与单个人类读者表现相当。
- **Face and Voice Cross-modal Association**（arXiv:2607.28129）：人脸-语音跨模态关联，凸特征嵌入方法在 VoxCeleb 上取得显著改进。
- **SciSchema.org**（arXiv:2607.27955）：多学科科学过程描述结构化 schema 集合，16 个专家标注 schema，覆盖生物学、化学、物理等领域。
- **Extended Depth-First Representations of k²-trees**（arXiv:2607.28136）：k²-树的空间优化表示，理论贡献。
