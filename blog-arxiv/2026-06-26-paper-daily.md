---
title: "【推荐系统 Paper 日报】2026-06-26"
date: 2026-06-26
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2770828086"
---

# 【推荐系统 Paper 日报】2026-06-26

## 📊 今日概览

今日 arXiv cs.IR（Thu, 25 Jun 2026）共收录 **20 篇**论文，其中推荐系统（RecSys）及相关领域论文 **5 篇**。本期亮点包括：字节跳动在 4 亿 DAU 平台部署的「生成式推荐+视频生成」统一框架 RaG，将广告收入提升 1.87%；YouTube 全量上线的用户 Token 化系统 TokenMinds，用离散语义 ID 解决用户表示瓶颈；以及一个针对「检索-重排序」流程的成本自适应路由方案，在多个数据集上将延迟降低 1.15~53 倍。

## 🔥 推荐系统论文深度解读

### 1. Recommendation as Generation: Unifying Personalized Video Generation and Recommendation at Industrial Scale

📄 [arXiv:2606.25496](https://arxiv.org/abs/2606.25496) | 字节跳动 | Yanhua Cheng, Bo Wang, Haotian Zhang, Xinyuan Gao, Zhihui Yin, Ben Xue, Yongzhi Li, Jieting Xue

**🗣️ 大白话：** 现在的短视频推荐就像你走进一家超市，只能在货架上已有的商品里挑。但问题是，货架上的商品是固定的，可能根本不存在"你此刻真正想要的东西"。这篇论文提出的 RaG 框架，思路是：与其在固定视频池里选，不如根据你的兴趣实时"生成"个性化视频——推荐和生成合二为一。它在字节跳动的 4 亿 DAU 平台实测，广告收入直接涨了 1.87%。

**🔬 专业讲解：** 传统短视频推荐系统受限于固定视频池，难以捕捉用户细粒度和动态偏好。本文提出 **Recommendation-as-Generation (RaG)** 范式，核心创新有三：

1. **共享语义 ID (SIDs)**：将视频表示解耦为内容语义和创意风格语义，既支持细粒度用户兴趣建模，又支持可控的个性化视频生成。
2. **Video Generation Agents (VGAs)**：以推断出的 SIDs 为条件，驱动视频创作的分层规划与细化，包括视觉构图、音频对齐和艺术效果增强。
3. **协同跨域奖励学习**：联合优化兴趣对齐、用户反馈和视频质量评估，形成闭环生成系统。

在**超过 4 亿 DAU 的工业平台**上部署，在线 A/B 测试显示相比生产级 GRM 基线，广告收入提升达 **1.87%**。这是将生成式视频直接融入推荐闭环的首次大规模工业验证，为"生成即推荐"的未来范式提供了强有力的实证支撑。

---

### 2. S2-CAR: Segmentation-Supervised Complexity-Adaptive Recommendation

📄 [arXiv:2606.25415](https://arxiv.org/abs/2606.25415) | 悉尼科技大学等 | Linjiang Guo, Nitin Bisht, Shiqing Wu, Xianzhi Wang, Guandong Xu

**🗣️ 大白话：** 用户的行为序列就像一本日记，但现有模型要么把整本日记当作"同一件事"来看，要么按固定页数（比如每 10 页）强行分割——这两种方式都忽略了用户兴趣真实变化的"拐点"。S2-CAR 的做法是把用户意图建模成一种"能量状态"，当能量自然衰减到某个阈值时自动分割，就像在兴趣切换的地方画了一条自然分界线。实验证明它在电影、电商、游戏三个场景都碾压了 SOTA。

**🔬 专业讲解：** 序列推荐的核心挑战在于用户行为序列的非均匀性和意图边界的模糊性。现有方法要么将完整序列视为同质上下文，要么依赖固定时间窗口分割，导致跨意图干扰和过度依赖短期信号。

S2-CAR 提出**基于能量状态的意图分割**框架：

- **Soft-TPP（上下文感知软时间点过程）**：将用户意图建模为连续潜在能量状态，通过能量自然衰减触发边界检测，摆脱固定时间间隔的束缚。
- **段数自适应多意图提取 (Segment-Count-Adaptive Multi-Intent Extraction)**：在分割基础上，分层聚合意图一致的段，形成紧凑的多兴趣表示。

在涵盖电影、电商、游戏的 **3 个公开数据集**、**13 个基线**上的实验表明，S2-CAR 在所有数据集和指标上均一致优于 SOTA。此外，能量分割模块可作为**即插即用组件**集成到现有序列推荐 backbone 中，带来稳定增益。

---

### 3. Adaptive Re-Ranking

📄 [arXiv:2606.25249](https://arxiv.org/abs/2606.25249) | 马萨诸塞大学阿默斯特分校 | Ata Cinar Genc, Emir Kaan Korukluoglu, James Allan

**🗣️ 大白话：** 现在搜索系统的"检索-重排序"流程有个通病：不管查询是简单还是复杂，一律上最贵的重排序模型。就像你问"今天天气"，系统也调动了一套深度学习模型来回答。Adaptive Re-Ranking 的思路是：先判断这个查询有多"难"，然后按需分配计算资源——简单查询走轻量级模型，复杂查询才上重型模型。结果延迟降低了几十倍，效果还能保住。

**🔬 专业讲解：** 现代 IR 系统普遍采用 "retrieve-then-rerank" 架构，但固定使用重型交叉编码器对所有查询进行重排序，导致高延迟和计算浪费。本文提出**基于效用的成本感知路由框架**：

- 训练三策略路由分类器：稀疏检索（BM25）、轻量密集重排序（MiniLM-L6-v2）、重型神经重排序（BGE-v2-m3）。
- 提出新的效用函数进行 per-query 路由决策。

实验结果显示：相比 BGE，在所有测试数据集上实现 **1.15~53× 更低的中位数延迟**和 **1.11~5.22× 更低的平均延迟**，同时 nDCG@10 在部分数据集上保持竞争力（-17.5% 到 +4.0%）。这证明了查询自适应路由在降低计算成本和延迟方面的可扩展性，为工业级搜索系统的成本优化提供了新方向。

---

### 4. TokenMinds: Pretrained User Tokens and Embeddings for User Understanding in Large Recommender Systems

📄 [arXiv:2606.25147](https://arxiv.org/abs/2606.25147) | Google/YouTube | Qingyun Liu, Bo Yan, Yang Liu, Yuji Roh, Ekansh Sharma, Likang Yin, Emma Olowo, Min-hsuan Tsai

**🗣️ 大白话：** 用户画像长期以来靠一个固定维度的向量（embedding）来表示，但这个"向量牢笼"有天然上限：它只能编码固定的信息，而且难以直接关联到物品属性。TokenMinds 的想法是：给用户也分配一套像商品条码一样的"语义 ID"（SID），同时保留传统的向量表示。这样做的好处是：既可以用离散token做跨场景迁移，又保持了和现有下游模型的兼容。YouTube 已经在全量流量上跑了。

**🔬 专业讲解：** 工业推荐系统的用户建模长期依赖密集嵌入，但固定维度向量存在表示瓶颈。LLM 生成的文本 token 虽然提供离散表示，但缺乏深度序列行为动态。同时，SID-based item tokenization 已在生成推荐中证明有效，但用户的离散 SID 表示几乎无人探索。

TokenMinds 的核心贡献：

1. **双输出设计**：基于预训练 LLM 的 encoder-decoder 架构，同时生成离散 SID 用户 token 和密集用户嵌入，兼具语义可解释性和下游兼容性。
2. **跨场景统一**：通过共享 SID 词汇表，将长短视频行为统一到一个模型中，大幅降低训练和服务成本。
3. **工业级验证**：在 YouTube 多场景通过**全量用户流量（数十亿用户）**异步服务验证，离散 token 和密集嵌入在不同生产排序系统中提供互补价值。

这是首次在工业规模上验证 SID-based 用户 token 的实用性，为下一代推荐系统的用户表示学习提供了重要参考。

---

## 📋 其他论文速览

- **AutoRelAnnotator: Calibrated Model Cascades for Cost-Efficient Relevance Evaluation in Sponsored Search**（arXiv:2606.25871）—— 通过校准模型级联（从微调到级联路由再到每类等渗校准）实现低成本大规模搜索相关性标注，在 6 个离线场景处理超 1.5 亿标注，是搜索广告系统规模化标注的重要基础设施。
- **How Large Language Models Source Brand Reputation Across Languages and Markets**（arXiv:2606.25787）—— 研究 LLM 在多语言和多市场环境下对品牌声誉的感知差异，发现跨语言一致性显著高于跨市场一致性。
- **Extreme Meta-Classification for Large-Scale Zero-Shot Retrieval**（arXiv:2606.25237）—— 提出极端元分类方法，通过极端分类器实现大规模零样本检索，在零样本设置下优于传统密集检索方法。
- **Is GraphRAG Needed? From Basic RAG to Graph-/Agentic Solutions with Context Optimization**（arXiv:2606.25656）—— 系统比较基本 RAG、GraphRAG 和 Agentic RAG 在上下文优化场景下的性能，指出 GraphRAG 的提升高度依赖具体任务。
- **BitNet Text Embeddings**（arXiv:2606.25674）—— 基于 BitNet 架构（1.58-bit 权重）的文本嵌入模型，在大幅降低存储和计算成本的同时保持与全精度嵌入相近的检索质量。
