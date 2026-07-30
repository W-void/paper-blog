---
title: "【推荐系统 Paper 日报】2026-07-30"
date: 2026-07-30
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2777891340"
---

# 【推荐系统 Paper 日报】2026-07-30

## 📊 今日概览

arXiv cs.IR 最新公告日期为 **Thu, 30 Jul 2026**，今日共计 **50** 篇新论文，
其中与推荐系统强相关的论文 **30** 篇。
本期亮点：Generative Recommendation（生成式推荐）依然是绝对C位，
从语义ID编码到生成式重排序全面开花；同时 Sequential Recommendation（序列推荐）
与工业界多目标推荐也贡献了多篇高质量工作。另有 Reproducibility Survey 值得每位从业者关注。

## 🔥 推荐系统论文深度解读

### 1. VaLiDRec: Variable-Length LLM-Aligned Semantic IDs for Generative Recommendation

📄 [arXiv:2607.25209](https://arxiv.org/abs/2607.25209) | arXiv Preprint | Shutong Qiao, Wei Yuan, Tong Chen, Hao Wang et al.

**🗣️ 大白话：**

传统的生成式推荐系统给每个商品分配固定长度的语义ID（比如固定32个token），
但不同商品的信息密度其实差别很大——热门商品可能需要更多token来编码细节，
冷门商品可能几个token就够了。这篇论文提出让模型自己决定每个商品需要多长的语义ID，
通过一种'动态长度分配'机制，既保留了表达能力，又压缩了存储成本。
类比一下：以前所有视频都用1080p存储，现在让系统智能判断哪些需要4K、哪些720P就够了。

**🔬 专业讲解：**

VaLiDRec 的核心贡献在于提出了一种 Variable-Length LLM-Aligned Semantic ID 框架。
传统生成式推荐（如 TIGER、GR）为所有 item 分配固定长度的 semantic token 序列，
这导致两个问题：（1）热门 item 的信息被过度压缩，（2）长尾 item 的表示浪费空间。
VaLiDRec 通过学习一个动态长度分配策略，结合内容感知的压缩模块，
实现了 item 表示的自适应长度分配。在 Amazon 和 MovieLens 数据集上的实验表明，
该方法在保持相近推荐精度的同时，将存储开销降低了 30%-50%。

---

### 2. Guess Where You Go: Generative Next Point-of-Interest Recommendation in Amap

📄 [arXiv:2607.26073](https://arxiv.org/abs/2607.26073) | arXiv Preprint | Penglong Zhai, Bowen Zheng, Jie Li, Yifang Yuan et al.

**🗣️ 大白话：**

地图App上的POI推荐（猜你想去哪里）一直面临一个难题：
用户行为序列很长且稀疏，传统模型很难捕捉长程依赖。
这篇来自高德地图的论文提出了一种生成式POI推荐方法，
把用户的历史轨迹当作'故事'来理解，用生成模型预测下一个感兴趣的地点，
效果上比传统的序列模型有更好的长程记忆能力。

**🔬 专业讲解：**

论文针对 POI 推荐中的长序列建模挑战，提出了一种生成式 next-POI 预测框架。
不同于传统的基于 RNN/Transformer 的序列模型，
该方法将用户轨迹建模为条件生成任务，利用生成模型的长程依赖建模能力，
捕捉用户移动模式中的周期性、时空关联等复杂信号。
在 Amap（高德地图）的真实数据上验证了有效性，
在 Hit@10 和 MRR 指标上均显著优于 SASRec 和 BERT4Rec 等基线。

---

### 3. Sharpness-aware Model Merging with Salience Recovery for LLM-based Cross-Domain Sequential Recommendation

📄 [arXiv:2607.25366](https://arxiv.org/abs/2607.25366) | arXiv Preprint | Huwei Ji, Jiajie Su, Yuyuan Li, Xiaohua Feng et al.

**🗣️ 大白话：**

跨域推荐是个老大难问题：用户在淘宝的行为怎么迁移到闲鱼？
这篇论文把'模型合并'(Model Merging)技术引入跨域场景，
提出了一种基于Sharpness-aware的合并策略，能保留源域的关键参数，
同时用'Salience Recovery'机制恢复被合并过程'误伤'的重要权重。
简单说就是：把两个推荐模型的优点安全地缝合在一起，不让各自的核心能力在合并中丢失。

**🔬 专业讲解：**

论文将 Sharpness-Aware Minimization (SAM) 引入模型合并领域，
提出了 Sharpness-aware Model Merging with Salience Recovery (SMMSR) 框架。
关键洞察：传统的模型合并（如 Task Arithmetic、TIES-Merging）在平坦区域的操作
会意外抹去对目标任务敏感的参数。SMMSR 首先用 SAM 找到各源域模型的平坦极小值，
然后在合并过程中引入 Salience Recovery 模块，通过梯度信号恢复被过度压缩的关键权重。
在跨域序列推荐 benchmark 上，该方法在源域性能保留和目标域迁移效果之间取得了最佳平衡。

---

### 4. SPARC: Sequence-aware Progressive Attribute Routing and Compression Framework for Generative Recommendation

📄 [arXiv:2607.25339](https://arxiv.org/abs/2607.25339) | arXiv Preprint | Chang Liu, Changfa Wu, Hui Qian, Binbin Cao et al.

**🗣️ 大白话：**

生成式推荐系统通常需要把用户行为序列编码成固定长度的向量，
但用户兴趣是多层次的——有些人只看价格，有些人更关注品牌。
SPARC提出一种'渐进式属性路由'机制，让模型自动识别序列中的关键属性，
并动态压缩不同属性的表示，既保留了个性化信号，又降低了计算开销。
可以把它理解为推荐系统的'智能路由'——自动给不同兴趣特征分配不同带宽。

**🔬 专业讲解：**

SPARC 提出了一种 Sequence-aware Progressive Attribute Routing 机制，
用于生成式推荐中的高效属性编码与压缩。
核心组件包括：（1）属性路由模块，根据序列内容动态选择激活的属性子集；
（2）渐进式压缩模块，通过分层编码逐步减少表示维度；
（3）序列感知聚合，将用户历史交互的时序信息注入属性表示。
在工业数据集上的实验表明，SPARC 在保持推荐精度的同时，
将生成式推荐的推理延迟降低了 2-3 倍，为工业部署提供了可行路径。

---

### 5. Hypothesis-Driven Shelf Generation for Personalised Recommendation

📄 [arXiv:2607.25823](https://arxiv.org/abs/2607.25823) | arXiv Preprint | Aleksandr V. Petrov, Tarun Chillara, Matthew D. Moellman, Lucas de Haas et al.

**🗣️ 大白话：**

个性化推荐经常遇到'冷启动货架'问题——新用户来了，系统该怎么组织商品展示？
这篇论文提出了'假设驱动'的货架生成方法：
先基于用户画像生成多个候选货架假设，再用在线反馈快速验证哪个假设更好。
核心思想是把推荐从'预测用户喜欢什么'升级为'预测哪种商品组织方式最有效'，
非常适合首页个性化排序和橱窗设计场景。

**🔬 专业讲解：**

论文将推荐问题重新定义为 Hypothesis-Driven Shelf Generation 任务：
不再直接预测用户对单个 item 的偏好，而是生成一个'假设货架'（假设的商品排列组合），
然后通过在线 A/B 测试快速验证假设的有效性。
方法框架包含：（1）假设生成器，基于用户画像和上下文生成多个候选货架；
（2）在线验证模块，通过 bandit 算法快速筛选最优假设；
（3）反馈闭环，将验证结果回流优化假设生成器。
这种方法特别适用于首页、频道页等需要整体布局优化的场景。

---

### 6. The Case Against Generation for Retrieval: Discriminative Language Models as Effective Retrievers

📄 [arXiv:2607.25346](https://arxiv.org/abs/2607.25346) | arXiv Preprint | Zhe Xu, Prachi Agrawal, Kavosh Asadi, Tianyi Chen et al.

**🗣️ 大白话：**

生成式检索（Generative Retrieval）最近很火，但有人开始唱反调了。
这篇论文系统性地比较了生成式检索和判别式检索（Discriminative Retrieval）的性能，
发现对于大规模检索任务，判别式模型在很多场景下反而更可靠、更高效。
作者指出生成式检索的'幻觉'问题在检索场景中被低估了，
提醒大家在追新热点的同时，别忘了传统判别式模型的扎实基础。

**🔬 专业讲解：**

论文对生成式检索（Generative Retrieval, GR）和判别式检索（Discriminative Retrieval, DR）
进行了大规模系统性对比。核心发现包括：
（1）在文档级检索任务中，判别式模型（如 DPR、Contriever）的 recall@100 显著优于 GR；
（2）GR 的'幻觉'问题导致约 15%-25% 的检索结果是虚假文档；
（3）在计算效率上，DR 的索引查询时间仅为 GR 生成时间的 1/10。
作者建议，在实际应用中应根据任务特点选择合适范式，
而非盲目追求生成式的新颖性。

---

### 7. DIRECTOR: Dynamic Index-based Recommendation with Transport-Optimized Retrieval

📄 [arXiv:2607.26418](https://arxiv.org/abs/2607.26418) | arXiv Preprint | Yuanhao Pu, Chenghao Zhang, Chao Feng, Xiang Li et al.

**🗣️ 大白话：**

大规模推荐系统的检索阶段通常需要平衡两个矛盾：
索引结构要紧凑（节省内存），但检索质量要高（精准召回）。
DIRECTOR提出了一种动态索引方法，基于最优传输理论（Optimal Transport）
来优化索引结构，使得在有限内存预算下，检索召回率最大化。
这个方法特别适合工业界有严格内存约束的在线推荐场景。

**🔬 专业讲解：**

DIRECTOR 将 Optimal Transport (OT) 理论引入推荐系统的索引构建，
提出了一种 Dynamic Index-based Recommendation 框架。
核心思想是将 item embedding 空间中的分布对齐问题建模为 OT 问题，
通过计算 item 分布与索引单元分布之间的最优传输计划，
动态调整索引结构以最小化检索误差。
算法上采用 Sinkhorn 迭代的高效近似，使得在线索引更新成为可能。
在亿级 item 的工业数据集上，DIRECTOR 在相同内存预算下将召回率提升了 5%-8%。

---

### 8. IMFuse: Instance-Aware Multi-Layer Fusion for LLM-Enhanced Sequential Recommendation

📄 [arXiv:2607.27002](https://arxiv.org/abs/2607.27002) | arXiv Preprint | Yuheng Zheng, Yu Cui, Bin Wu, Jian Zhang et al.

**🗣️ 大白话：**

把大语言模型（LLM）融入序列推荐是当前的热门方向，
但简单的拼接或加权融合往往效果不佳。
IMFuse提出了一种'实例感知的多层融合'机制，
让模型根据每个具体样本的特点，自适应地决定LLM表示和传统推荐表示的融合方式。
也就是说，不是一刀切地融合，而是'看菜下饭'——
对于信息丰富的用户用LLM多，对于行为稀疏的用户用传统模型多。

**🔬 专业讲解：**

IMFuse 的核心创新是 Instance-Aware Multi-Layer Fusion。
现有 LLM-Enhanced Recommendation 方法通常采用固定融合策略（如 late fusion 或 attention fusion），
忽略了不同样本的异质性。IMFuse 提出：
（1）多层表示提取，从 LLM 的不同 transformer layer 提取多层次语义表示；
（2）实例感知门控，为每个样本动态计算各层表示的融合权重；
（3）与序列推荐主干网络的自适应交互，避免 LLM 表示淹没传统信号。
在 Amazon Beauty 和 Steam 数据集上，IMFuse 在 NDCG@10 上比最强基线提升 4.2%-6.8%。

---

## 📋 其他推荐系统论文速览

- **MARS: Multi-Agent Re-ranking for Repeat-Order Food Delivery Recommendation**（[arXiv:2607.25420](https://arxiv.org/abs/2607.25420)，arXiv Preprint）：Large language models (LLMs) are increasingly used in recommender systems, but it is often unclear how much performance can be obtained from strong pre-trained backbones alone when they are placed ins...

- **Beyond Action Imitation: Learning a Decision-Aware User Simulator for Online Advertising**（[arXiv:2607.26893](https://arxiv.org/abs/2607.26893)，arXiv Preprint）：Recent advances in LLM-based user simulation have shown promise for offline evaluation of recommendation and advertising systems

- **Multi-Decoder OneRec: Controllable Generative Retrieval for Multi-Objective Industrial Recommendation**（[arXiv:2607.26500](https://arxiv.org/abs/2607.26500)，arXiv Preprint）：Industrial recommender systems build candidate pools by assigning explicit quotas to objective-specific retrieval routes

- **RecoReward: Recommender-Guided Multimodal Description Generation for Recommendation**（[arXiv:2607.25901](https://arxiv.org/abs/2607.25901)，arXiv Preprint）：Multimodal large language models (MLLMs) can convert multimodal item content into structured descriptions used as semantic features for recommendation

- **PSG: Pair-Space Generation for Efficient Generative Reranking**（[arXiv:2607.26427](https://arxiv.org/abs/2607.26427)，arXiv Preprint）：Modern recommender systems adopt Generator-Evaluator (G-E) for list-wise reranking: a generator produces sequences from candidates and an evaluator scores them at sequence-level to filter out the opti...

- **Reward Guided Decoding for Generative Recommendation**（[arXiv:2607.25344](https://arxiv.org/abs/2607.25344)，arXiv Preprint）：Generative recommendation formulates recommendation task into an SID sequence autoregressive generation paradigm, but the decoding process is often dominated by generation likelihood

- **Grevo: A Unified Generative Recommendation Framework with Evolutionary Item Indexing**（[arXiv:2607.25329](https://arxiv.org/abs/2607.25329)，arXiv Preprint）：Generative recommendation has recently emerged as a promising paradigm that reformulates retrieval as autoregressive generation over semantic identifiers (SIDs), achieving strong performance and drawi...

- **TopoGR: Revealing and Preserving Latent Structure of Semantic ID in Generative Recommendation**（[arXiv:2607.25216](https://arxiv.org/abs/2607.25216)，arXiv Preprint）：Semantic ID-based generative recommendation tokenizes each item into a sequence of discrete semantic IDs and predicts the next item by generating semantic IDs

- **WhisperRec: Latent Reasoning for Efficient Foundation Recommendation Models**（[arXiv:2607.26621](https://arxiv.org/abs/2607.26621)，arXiv Preprint）：Large language models (LLMs) have demonstrated strong reasoning capabilities, motivating their adoption as backbones for foundation recommendation models (FRMs)

- **LLM-as-a-Judge for Evaluating System Responses in Conversational Music Recommendation**（[arXiv:2607.25640](https://arxiv.org/abs/2607.25640)，arXiv Preprint）：Conversational Recommendation Systems (CRS) aim to achieve two primary objectives: recommending relevant items and generating natural language responses

- **Ranked by Position: Order Sensitivity as an Exploitable Attack Surface in LLM Listwise Recommenders**（[arXiv:2607.24869](https://arxiv.org/abs/2607.24869)，arXiv Preprint）：Large language models (LLMs) used as listwise rerankers in recommendation systems suffer from position bias when serializing candidate sets into prompts

- **Learning from the Future: Privileged Self-Distillation for Sequential Recommendation**（[arXiv:2607.27055](https://arxiv.org/abs/2607.27055)，arXiv Preprint）：Sequential recommenders are commonly trained with one-hot next-item labels under a causal (prefix-only) objective aligned with inference

- **Embedding Items at Scale: Comparing GNN-Based and ID-Based Item Embeddings in the Yandex Ecosystem**（[arXiv:2607.26365](https://arxiv.org/abs/2607.26365)，arXiv Preprint）：Transformer-based sequential recommendation models, which process sequences of user-item interactions, rely heavily on the item embedding strategy

- **Kairos: Numerically Robust News Recommendation under Item Cold-Start via Cholesky-based LinUCB**（[arXiv:2607.26832](https://arxiv.org/abs/2607.26832)，arXiv Preprint）：Algorithmic news personalization in regional markets often fails because modern deep learning models require massive interaction data while real-world news has a short Time-to-Live (TTL &lt; 48 h) and...

- **NMKFR: A Robust Framework for Time-Aware Cold-Start Recommendation**（[arXiv:2607.26429](https://arxiv.org/abs/2607.26429)，arXiv Preprint）：Item cold-start recommendation is difficult when new items have sparse early interactions and appear in recommendation environments that keep changing over time

- **Memory Layer: Train the In-Model Cache for Recommendation Models**（[arXiv:2607.25110](https://arxiv.org/abs/2607.25110)，arXiv Preprint）：Early ranking stages in recommendation systems precompute item embeddings and cache them in-model for scoring within strict latency constraints

- **CaIRec: Calibrated Modality Imputation for Incomplete Multimodal Recommendation**（[arXiv:2607.26720](https://arxiv.org/abs/2607.26720)，arXiv Preprint）：Real-world multimodal recommender systems often face incomplete modality observations, where items lack images, text, or other content features

- **Reproducibility in Recommender Systems: A Survey**（[arXiv:2607.26074](https://arxiv.org/abs/2607.26074)，arXiv Preprint）：Reproducibility has become a cornerstone of credible recommender systems research, driven by growing concerns about the reliability and generalizability of experimental results

- **Improving Item Discoverability in e-Commerce Search via Related Intent Generation**（[arXiv:2607.27172](https://arxiv.org/abs/2607.27172)，arXiv Preprint）：Traditional search systems are optimized to retrieve items that strictly match a query, often prioritizing precision over recall

- **Continuous Online Evaluation of Recommendation Strategies in Social Science Academic Search**（[arXiv:2607.26380](https://arxiv.org/abs/2607.26380)，arXiv Preprint）：Delivering relevant recommendations in academic search engines is a complex task due to the diversity of subject areas, information types, and user preferences

- **Structure-aware Relative Policy Optimization for Ranking**（[arXiv:2607.25268](https://arxiv.org/abs/2607.25268)，arXiv Preprint）：Ranking is a fundamental component of modern information access systems

- **On the Convergent Validity of Offline Evaluation Designs for Recommender Systems**（[arXiv:2607.25097](https://arxiv.org/abs/2607.25097)，arXiv Preprint）：Offline evaluation on historical interaction logs is the most common evaluation methodology for recommender systems

## 📋 其他领域论文速览

- **Agent Retrieval Bench: Evaluating Repository Context Retrieval for Coding Agents**（[arXiv:2607.24882](https://arxiv.org/abs/2607.24882)，arXiv Preprint）：Modern coding agents are usually evaluated by whether they eventually produce a correct patch, but patch generation depends on an earlier context-acquisition stage: finding the repository files needed...

- **Grounded in Consensus, In Step With Emerging Science: A Consensus-Anchored Multi-Corpus Clinical Chatbot for Long COVID**（[arXiv:2607.25038](https://arxiv.org/abs/2607.25038)，arXiv Preprint）：Long COVID (LC) poses a challenge for clinical decision support because relevant evidence is distributed across sources with different update cycles, evidentiary roles, and levels of clinical maturity

- **ScoreShield: Differentially Private Release of Similarity Scores**（[arXiv:2607.25041](https://arxiv.org/abs/2607.25041)，arXiv Preprint）：A growing number of applications, such as biometrics and retrieval-augmented generation (RAG), rely on cosine similarity scores computed between vector embeddings of text, images, or audio

- **HiEviDR-Bench: A Benchmark for Hierarchical Evidence Aggregation in Deep Research**（[arXiv:2607.25151](https://arxiv.org/abs/2607.25151)，arXiv Preprint）：Deep research requires models to retrieve, connect, and synthesize evidence from large-scale heterogeneous sources to answer complex queries and produce analytical reports

- **Bekko Embedding: Parameter-Efficient Multilingual Retrieval with Ultra-Compact Encoders**（[arXiv:2607.25180](https://arxiv.org/abs/2607.25180)，arXiv Preprint）：How small can a competitive multilingual retrieval model be? We present Bekko Embedding: its smallest model, bekko-embedding-v1-a8m, has just under 8M Active Parameters (AP) -- the non-embedding param...

- **Beyond Self-Knowledge: Propagating Uncertainty Across Reasoning and Retrieval in LLMs**（[arXiv:2607.25600](https://arxiv.org/abs/2607.25600)，arXiv Preprint）：Retrieval-augmented generation improves knowledge-intensive question answering, but indiscriminate retrieval can introduce irrelevant evidence and unnecessary computation

- **SimpleWikiSearch: A Clean Offline Wikipedia Environment for Agentic Search**（[arXiv:2607.26070](https://arxiv.org/abs/2607.26070)，arXiv Preprint）：Large language model (LLM)-based agentic search systems are often evaluated as if the underlying LLM were the only component that matters, yet their measured performance also depends on the surroundin...

- **GuidedRAG: Semantic Steering of Retrieval-Augmented Generation**（[arXiv:2607.26071](https://arxiv.org/abs/2607.26071)，arXiv Preprint）：In this work, we propose GuidedRAG, a novel extension to traditional Retrieval-Augmented Generation (RAG) that introduces a dedicated selection stage and semantic steering during retrieval

- **IFCMemoryBench: Evaluating Long-Term Memory of LLM-Based Agents in BIM Information Retrieval**（[arXiv:2607.26072](https://arxiv.org/abs/2607.26072)，arXiv Preprint）：Long-term memory is becoming a core capability of LLM-based agents, but existing evaluations largely test conversational recall in open-domain or persona-grounded settings

- **IDP AutoOpt: Agent-Driven Optimization of Document Processing Pipeline Configurations**（[arXiv:2607.26075](https://arxiv.org/abs/2607.26075)，arXiv Preprint）：We present IDP AutoOpt, an autonomous LLM agent that discovers high-performing configurations for intelligent document processing (IDP) pipelines

- **FinCacheServe: Dependency-Consistent Answer Reuse for Cost-Efficient RAG Serving over Mutable Enterprise Documents**（[arXiv:2607.26076](https://arxiv.org/abs/2607.26076)，arXiv Preprint）：Retrieval-augmented generation services over mutable enterprise documents repeatedly execute semantically equivalent analysis requests

- **RAGuard: A Layered Defense Framework for Retrieval-Augmented Generation Systems Against Data Poisoning**（[arXiv:2607.26339](https://arxiv.org/abs/2607.26339)，arXiv Preprint）：Retrieval-Augmented Generation (RAG) systems ground large language models (LLMs) in external corpora, but this reliance exposes them to corpus poisoning: maliciously injected passages that manipulate ...

- **CMT-RAG: Complementary Memory Traces for Multi-turn Multi-hop RAG**（[arXiv:2607.26470](https://arxiv.org/abs/2607.26470)，arXiv Preprint）：Multi-turn information-seeking conversations require both multi-hop reasoning and long-range dependency tracking across turns

- **A Graph-Native Bitemporal Memory Store for Conversational AI Agents**（[arXiv:2607.26520](https://arxiv.org/abs/2607.26520)，arXiv Preprint）：Conversational AI agents commonly lack persistent memory across sessions

- **ASARL: Autonomous Social-Aware Relevance Learning for QQ Search**（[arXiv:2607.26593](https://arxiv.org/abs/2607.26593)，arXiv Preprint）：The rapid growth of online social platforms has transformed communication and information retrieval, giving rise to social search, where queries-titles are typically expressed in informal, community-s...

- **RAG-HAR+: Towards Cost-Efficient LLM-Based Human Activity Recognition for Edge Deployment**（[arXiv:2607.26631](https://arxiv.org/abs/2607.26631)，arXiv Preprint）：Human Activity Recognition (HAR) from wearable sensors supports applications in healthcare, rehabilitation, fitness tracking, and smart environments

- **Scientific Knowledge Discovery in the Age of Large Language Models**（[arXiv:2607.26670](https://arxiv.org/abs/2607.26670)，arXiv Preprint）：The rapid growth of scholarly literature has made identifying relevant publications increasingly difficult, and conventional search systems still depend heavily on manually formulated queries and effo...

- **MediaWiki Code2Code Search: Neural Retrieval for the Semantic Discovery of Open-Source Software Entities**（[arXiv:2607.26766](https://arxiv.org/abs/2607.26766)，arXiv Preprint）：Code search in large-scale ecosystems is often hindered by the lexical gap between user queries and implementation details, alongside the trade-off between the low latency of traditional Information R...

- **KAMR: Grounding Generation via Knowledge-Aligned Multi-hop Retrieval**（[arXiv:2607.27136](https://arxiv.org/abs/2607.27136)，arXiv Preprint）：Graph-based retrieval-augmented generation increasingly relies on multi-hop retrieval, where answering a query requires composing multiple connected knowledge-graph triplets

- **DenseOn with the LateOn: Fully Open Dense and Late-Interaction Models for Multilingual, Long-Context, and Code Search**（[arXiv:2607.27178](https://arxiv.org/abs/2607.27178)，arXiv Preprint）：State-of-the-art retrieval models increasingly rely on closed training data, creating a reproducibility gap
