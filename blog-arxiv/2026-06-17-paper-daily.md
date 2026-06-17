---
title: "【推荐系统 Paper 日报】2026-06-17"
date: 2026-06-17
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2769302064"
---

# 【推荐系统 Paper 日报】2026-06-17

## 📊 今日概览

arXiv cs.IR 于 **Tue, 16 Jun 2026** 发布最新一批论文，共 **34 篇**，其中推荐系统相关论文 **11 篇**。本期亮点颇丰：多任务推荐架构迎来"原生 Transformer"革新（OneRank），序列推荐开始玩起"合成先验预训练"，联邦图推荐借助 LLM 知识蒸馏打通隐私与效果的二元困境，另有负向行为建模、个性化重排等多个方向百花齐放。

## 🔥 推荐系统论文深度解读

### 1. OneRank: Unified Transformer-Native Ranking Architecture for Multi-Task Recommendation

📄 [arXiv:2606.16838](https://arxiv.org/abs/2606.16838) | 作者：Jiakai Tang, Sunhao Dai, Kun Wang et al.

**🗣️ 大白话：** 工业界推荐系统搞多任务学习（同时优化点击率、转化率等）时，大家都先用 Transformer 编码特征，再接多个任务头——这俩步骤是分离的。OneRank 说：为啥不把 Transformer 直接"原生绑定"到多任务里？这样信息流更顺畅，任务间梯度冲突也能缓解。

**🔬 专业讲解：** 现有多任务推荐的主流范式将 Transformer 视为"任务无关编码器"，然后接各任务独立的 prediction head。这带来两个核心问题：①不同任务目标下存在信息瓶颈，②梯度干扰导致经典的 seesaw 现象。OneRank 提出 Transformer-Native 架构，将多任务预测直接融合进 Transformer 的注意力计算与前馈层，使特征编码与任务学习协同进行。从根源上解决了 MTL 中特征共享与任务专属学习的耦合问题，并在多个工业数据集上验证了效果提升与扩展能力。

---

### 2. Harmonizing Semantic and Collaborative in LLMs: Reasoning-based Embedding Generator for Sequential Recommendation

📄 [arXiv:2606.16703](https://arxiv.org/abs/2606.16703) | 作者：Qidong Liu, Mingyao Huang, Moranxin Wang et al.

**🗣️ 大白话：** 序列推荐里有个老大难——长尾物品交互数据太少，传统协同过滤搞不定。用 LLM 生成语义 Embedding 能补充信息，但 LLM 的语义空间和协同过滤的协作空间是两码事，硬拼在一起经常打架。这篇论文的思路是让 LLM 用"推理"的方式生成 Embedding，而不是直接 encode，从而弥合两个空间的鸿沟。

**🔬 专业讲解：** 本文针对 LLM 作为 Embedding Generator 在序列推荐中的两大核心 Gap：①语义空间与协作信号空间的分布偏移；②LLM 忽略用户交互历史中的协作模式。提出 Reasoning-based Embedding Generator，通过设计链式推理 Prompt，让 LLM 在 Embedding 生成时同时考虑语义特征和协作关系，最终输出更适合下游推荐模型的 Embedding 表示，在长尾场景下表现尤为突出。

---

### 3. HoloRec: Holistic Encoding and Interleaved Reasoning for Generative Recommendation

📄 [arXiv:2606.15331](https://arxiv.org/abs/2606.15331) | 作者：Shuqi Zhao, Jingsong Su, Xiang Liu et al.

**🗣️ 大白话：** 生成式推荐把推荐任务变成了"生成序列"，比传统的打分排序更统一，但有两个痛点：特征表示太平铺、缺乏层次结构；chain-of-thought 需要昂贵标注且和推荐目标脱节。HoloRec 要同时解决这两个问题。

**🔬 专业讲解：** HoloRec 提出了两大核心设计：①"整体编码"（Holistic Encoding）构建用户/物品的层次化语义表示，捕获从细粒度到粗粒度的多尺度特征；②"交错推理"（Interleaved Reasoning）将推理步骤交织到生成过程中，无需外部 CoT 标注，通过在生成 token 序列时内嵌推理 token，让模型边推理边推荐。两个设计协同作用，使生成式推荐在精度和可解释性上均有明显提升。

---

### 4. Beyond Positive Signals: Unlocking Implicit Negative Behaviors for Enhanced Sequential User Modeling

📄 [arXiv:2606.15252](https://arxiv.org/abs/2606.15252) | 作者：Zexuan Cheng, Yue Liu, Jun Zhang, Jie Jiang

**🗣️ 大白话：** 用户行为序列建模历来只关注"点击了什么"（正向行为），但用户"看了没点"、"快速划走"这些隐式负向行为其实包含了大量信息——知道用户不喜欢什么，才能更准确地预测他们喜欢什么。这篇论文把隐式负向行为正式引入序列建模。

**🔬 专业讲解：** 本文聚焦 CTR 预测中被长期忽视的隐式负向行为（如曝光未点击、短停留等），提出系统性地将负向行为序列融入序列用户建模框架。核心挑战在于：负向行为含有噪声（可能是用户错过而非不喜欢），且与正向行为的建模粒度不同。作者通过解耦正负行为编码并设计对比学习目标，使负向信号能够有效增强用户偏好表达，在 CTR 任务上取得了显著提升。

---

### 5. PIANO: Personalized Reranking via Information Aggregation Node for Music Search Optimization

📄 [arXiv:2606.16641](https://arxiv.org/abs/2606.16641) | 作者：Weisheng Li, Chuqiao Huang, Pengcheng Li et al.

**🗣️ 大白话：** 音乐搜索的重排和短视频不一样——歌曲生命周期长，今天搜的结果明天还要用，所以既要满足当前搜索意图，又要兼顾长期口味。PIANO 通过一个"信息聚合节点"来平衡这两种需求，同时优化 CTR 和 CVR。

**🔬 专业讲解：** 音乐搜索重排面临两大挑战：①顺序方法依赖历史交互序列，无法捕获当前 query 的即时意图；②需同时优化短期 CTR 和长期 CVR。PIANO 提出信息聚合节点（IANode），作为用户实时意图与长期偏好的交汇点，支持跨任务特征融合与联合优化。在实际音乐平台部署后，CTR 和 CVR 均有明显提升。

---

### 6. One Sequential Recommendation Model Pretrained from Synthetic Priors Predicts Multiple Datasets

📄 [arXiv:2606.15752](https://arxiv.org/abs/2606.15752) | 作者：Woosung Kang, Jiwon Jeong, Jonghyeok Shin et al.

**🗣️ 大白话：** 传统序列推荐模型每个数据集都要从头训练，换个场景就得重来。这篇论文做了一个"通用序列推荐模型"——用合成数据预训练，可以直接预测多个不同数据集，不需要针对每个领域单独训练。

**🔬 专业讲解：** 本文提出 SRPFN（Sequential Recommendation Prior-data Fitted Network），借鉴 Prior-data Fitted Networks 的思想，用合成生成的先验交互数据预训练一个通用序列推荐模型。预训练阶段利用模拟用户偏好生成多样化的合成数据集，使模型学习到跨域泛化的交互模式。推理时无需在目标域重新训练，直接 in-context 预测，在多个真实数据集上验证了跨域零样本推荐能力，为推荐系统的"大模型化"提供了新的技术路径。

---

### 7. Guiding Federated Graph Recommendation with LLM-encoded knowledge

📄 [arXiv:2606.15277](https://arxiv.org/abs/2606.15277) | 作者：Thi Minh Chau Nguyen, Hien Trang Nguyen, Duc Anh Nguyen et al.

**🗣️ 大白话：** 联邦图推荐系统用联邦学习保护用户隐私，但各客户端的本地图结构差异太大，简单平均聚合效果很差。这篇论文用 LLM 编码的全局知识来"校准"各客户端的图 Embedding，让联邦聚合更稳定。

**🔬 专业讲解：** 联邦图推荐的核心难点在于 Non-IID 客户端数据导致的 Embedding 偏移问题——各端学到的结构表示互不对齐，朴素 FedAvg 失效。本文引入 LLM 编码的语义知识作为全局锚点，在聚合前对各客户端的图 Embedding 进行语义对齐，同时通过知识蒸馏将 LLM 的文本语义与图协作信号融合，在隐私保护前提下显著缓解了分布偏移问题。

---

### 8. OneBar: An End-to-End Content-Grounded Generative Query Recommendation Framework for E-Commerce Video Feeds

📄 [arXiv:2606.15330](https://arxiv.org/abs/2606.15330) | 作者：Yao Tang, Ying Yang, Ben Chen et al.

**🗣️ 大白话：** 短视频平台在视频下面放搜索入口（让你点进去搜相关内容），这叫 query 推荐。传统方法延迟高、目标不一致；现有生成方法又受噪声元数据和偏好漂移困扰。OneBar 端到端生成高质量 query，直接对齐视频内容和用户意图。

**🔬 专业讲解：** OneBar 面向电商短视频的内容诱发搜索意图场景，设计端到端内容锚定的生成式 query 推荐框架。核心创新在于：①内容锚定生成：直接从视频多模态内容（字幕、标签、商品信息等）中提取搜索意图，避免噪声元数据干扰；②目标对齐：生成 query 的评估目标与下游搜索系统直接对齐，解决传统两阶段方法的目标错配；③偏好建模：动态建模用户的实时兴趣漂移，使推荐 query 既贴合视频内容又符合个人偏好。

---

### 9. How Much Do Reviews Really Contribute? A Study on Text-Enriched Matrix Factorization for Recommendations

📄 [arXiv:2606.16973](https://arxiv.org/abs/2606.16973) | 作者：Eduardo Ferreira da Silva, Mayki dos Santos Oliveira et al.

**🗣️ 大白话：** 把用户评论文本加入推荐系统，这是很流行的思路。但评论到底贡献了多少？这篇论文系统性地研究这个问题，发现当协同过滤基线够强时，评论的贡献其实相当有限。

**🔬 专业讲解：** 本文对文本增强矩阵分解推荐模型进行系统性消融研究，控制协同过滤基线强度，测量评论文本表示（通过各类预训练语言模型生成）的增量贡献。核心发现：在强协同基线下，评论文本的边际收益显著下降；且文本质量、评论覆盖率和模型融合策略对最终效果影响很大。这一发现对工业界"堆文本特征"的做法提出了冷静质疑。

---

### 10. Leveraging Code-Mixed Product Metadata and User Feedback for Personalized Recommendation on Daraz Bangladesh

📄 [arXiv:2606.16387](https://arxiv.org/abs/2606.16387) | 作者：KM Fahim A Bari, Muhammad Abdullah Adnan, Nafis Sadeq

**🗣️ 大白话：** 孟加拉国电商平台上的评论混合了孟加拉语、英语和 Banglish（用拉丁字母写的孟加拉语），这种"代码混合"评论对推荐效果的影响从没被系统研究过。这是第一篇针对这个问题的 benchmark 研究。

**🔬 专业讲解：** 针对 Daraz Bangladesh 平台的代码混合（Bengali Unicode + English + Banglish）产品评论，本文首次建立系统性 benchmark，评估六类推荐模型家族在 per-user 留出测试协议下的表现。实验分析了代码混合文本对语义理解、物品表示和个性化推荐的影响，为低资源、多语言混合电商市场的推荐系统研究提供了重要基准。

---

### 11. Combining Retrieval-Augmented Text Generation with LLMs for Reading Content Recommendations

📄 [arXiv:2606.14817](https://arxiv.org/abs/2606.14817) | 作者：Sooyeon Kim, Piotr S. Maciąg

**🗣️ 大白话：** 用 RAG + LLM 给用户推荐适合他们阅读的内容，还可以指定内容难度级别。系统由输入、RAG、生成、评判四个模块组成，自动生成个性化阅读材料。

**🔬 专业讲解：** 本文提出一种将 RAG 与 LLM 结合的个性化阅读内容推荐系统，四模块架构中 RAG 负责召回相关文档，Generation 模块根据用户指定的目标难度级别生成定制化文本，Judging 模块评估生成内容的质量与难度适配性。核心贡献在于支持用户主动指定内容复杂度偏好，将传统被动式推荐升级为主动参数化个性化生成，为教育场景的自适应阅读推荐提供了新范式。

## 📋 其他论文速览

- **A Theoretical Framework for Risk Analysis of Stochastic Rankers**（arXiv:2606.16970）：为随机排序器建立系统性风险分析框架，分析排序决策中的不确定性传播。
- **SCAR: Semantic Continuity-Aware Retrieval for Efficient Context Expansion in RAG**（arXiv:2606.16661）：面向 RAG 的语义连续性感知检索方法，提升长文档场景下的上下文扩展效率。
- **RL-Index: Reinforcement Learning for Retrieval Index Reasoning**（arXiv:2606.16316）：用强化学习优化检索索引的推理能力，提升复杂查询场景下的索引效率。
- **Entity Labels Are Not Entity Signals: A Framework for Observable Relevance in Document Re-Ranking**（arXiv:2606.15998）：区分实体标签与实体信号，提出文档重排中可观测相关性框架。
- **MAGE-RAG: Multigranular Adaptive Graph Evidence for Agentic Multimodal RAG in Long-Document QA**（arXiv:2606.15906）：多粒度自适应图证据增强多模态 RAG，专注长文档问答场景。
- **Confidence-Based Stopping Methods for Systematic Reviews**（arXiv:2606.15380）：基于置信度的系统性综述停止策略，提升文献筛选效率。
- **EventConnector: Mining Social Event Relations through Temporal Graphs**（arXiv:2606.15448）：通过时序图挖掘社交事件关系，用于事件驱动的信息检索与推荐。
- **Retrieval-as-a-Service: A System-Oriented Analysis of Industrial Retrieval Pipelines in Web Systems**（arXiv:2606.14932）：工业级 Web 检索流水线的系统化分析，探讨检索即服务的架构设计。
- **S1-DeepResearch: Beyond Search, Toward Real-World Long-Horizon Research Agents**（arXiv:2606.15367）：超越搜索的长期研究 Agent，面向真实世界复杂研究任务。
- **Edu-Theater: A Data-Efficient Agent Framework for Scalable Learner Behavior Simulation**（arXiv:2606.15225）：教育场景下数据高效的学习者行为模拟 Agent 框架。
