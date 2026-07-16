---
title: "【推荐系统 Paper 日报】2026-07-16"
date: 2026-07-16
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2774808101"
---

# 【推荐系统 Paper 日报】2026-07-16

## 📊 今日概览

arXiv 今日（Thu, 16 Jul 2026）cs.IR 共放出 **10 篇**新论文。其中 **3 篇**与推荐系统直接相关，包括 1 篇 RecSys 2026 Industry Track 录用、1 篇推荐系统可控性评测框架、以及 1 篇天猫搜索生成式 CTR 模型的工业落地工作。本期亮点是 Apple TV 个性化视频搜索的实战经验，展示了在增量搜索场景（1-3 字符前缀）下，个性化带来的 NDCG 提升高达 +8.63%。

---

## 🔥 推荐系统论文深度解读

### 1. Personalizing Incremental Video Search with Hybrid Text and ID Embeddings

📄 [arXiv:2607.13493](https://arxiv.org/abs/2607.13493) | RecSys 2026 Industry Track | Vivek Kanojiya, Vishalaksh Aggarwal, Daeho Baek, Lyndon Kennedy, Xuetao Yin

**🗣️ 大白话：** 你有没有发现，在电视盒子上搜片时，刚打了一两个字，系统就猜出你想看啥？这篇论文讲的就是 Apple TV 怎么把这个体验做好的。他们的核心思路是：别光用文本语义匹配，还得把你看过什么电影、追过什么剧这些「个人历史」也塞进去，而且是两种信号一起用——文字理解（文本嵌入）+ 协同过滤（ID 嵌入），最后用 XGBoost 排个序。

**🔬 专业讲解：** 增量视频搜索的痛点在于 query 极度短（1-3 字符前缀），用户意图严重 underspecified。本文提出了一套双空间嵌入 + 混合排序的个性化方案：

- **TextEmb**：多语言文本编码器，在共点击三元组上通过对比学习 fine-tune，捕捉语义相似性。
- **IdEmb**：基于用户交互正样本训练的协同嵌入，捕捉行为相似性。
- 在线服务时，从用户近期观看历史构建用户表征，将文本和 ID 两种 user-item 余弦相似度注入 pairwise XGBoost ranker。

离线评估：在 temporal held-out 数据集上，对带历史会话的查询，NDCG@10 提升 **2.99%**，MRR 提升 **3.30%**。切片分析显示：
- 在模糊前缀（1-3 字符）上 NDCG 提升 **+8.63%**，而完整查询仅 **+1.46%**——这说明个性化在增量搜索场景价值最大。
- 长历史用户增益更高：1-5 条历史 NDCG +2.13%，51-100 条 +4.37%。有趣的是，基线排名对这些用户更差（NDCG@10 从 0.733 降至 0.680），说明个性化补足了 default ranking 的短板。

在线 3 周对照实验：TTR +1.14%，CVR +1.23%，转化商品排名提升 2.91%。论文还通过消融实验分析了语义 vs. 协同信号在 coverage-precision trade-off 上的差异，并用 LLM 评判相似性标签降低点击/曝光偏差。

---

### 2. Can We Steer the Black-Box? Towards Controllability-Centric Evaluation of Recommender Systems with Collaborative Agents

📄 [arXiv:2607.13418](https://arxiv.org/abs/2607.13418) | 作者：Jiwen Zhou, Xiang Liu, Mingming Li, Pengbo Mo, Jiao Dai, Honglei Lv, Jizhong Han, Songlin Hu

**🗣️ 大白话：** 推荐系统就像个黑盒子，你让它"给我推荐点小众独立音乐"，它可能还是给你推抖音神曲。这篇论文问了一个非常实际的问题：我们能不能「控制」推荐系统？他们设计了一套多智能体协作评测框架，专门测推荐系统听不听人话，还开源了代码。

**🔬 专业讲解：** 推荐系统的可控制性（controllability）——即系统对显式指导的响应能力——长期以来被忽略。本文提出 **CtrlBench-Rec**，首个面向推荐系统可控性的多智能体协作评测框架：

- 形式化三个核心任务：
  1. **Target content discovery**：用户指定内容，系统能否找到。
  2. **Interest profile shaping**：用户意图调整，系统能否响应。
  3. **Popularity bias mitigation**：算法能否克服 popularity bias，推荐长尾内容。
- 通过多个智能体协作模拟用户-系统交互，量化从显式命令到隐式表征 steering 的 steerability。

在真实数据集和多种推荐模型上的实验表明，该框架能有效量化可控性，并暴露了一个关键瓶颈：**系统对引导长尾内容推荐存在持续抗拒**。本文是第一个推荐系统可控性标准化工具包，可用于可控推荐研究、算法审计和用户赋权。代码已开源。

---

### 3. TMallGS: Scaling Unified Feature and Sequence Modeling for Generative E-commerce Search

📄 [arXiv:2607.13398](https://arxiv.org/abs/2607.13398) | 作者：Zhentao Song, Yufeng Gao, Xing Fang, Jing Wang, Guangxin Song, Bokang Wang, Yipin Dai, He Guo

**🗣️ 大白话：** 以前做电商搜索里的点击率预估，用 DeepFM 这种模型就够了。但现在大家都想往大模型 Transformer 上靠，觉得算力砸下去就能提升。但问题是，搜索排序里的特征类型太杂了——有用户 ID、商品 ID、类目、价格、文本描述……全塞成 token 效果并不好。天猫团队提出了 TMallGS，专门针对异构特征做了优化，还上了 A/B 测试验证。

**🔬 专业讲解：** 工业搜索排序的 CTR 预测正从传统 DLRM 向统一 Transformer 架构迁移。现有方法（如 OneTrans、Climber）采用 all-in-tokenization，忽视 ranking features 的异构性。TMallGS 包含五个核心组件：

1. **Hierarchical Distribution-Calibrated Tokenization**：通过 Field-wise Saliency Reweighting (FSR) + Distribution-Calibrated Projection (DCP)，将异构特征映射到优化子空间。
2. **Field-Adaptive Gated Transformer Backbone**：per-field QKV 投影 + 噪声自适应门控，实现细粒度语义交互。
3. **Decoupled FiLM Late Fusion**：保留显式高频信号。
4. **Context-Aware Bias Net**：解耦系统偏置与用户意图。
5. **Error-Aware Progressive Training**：动态加权损失，提升鲁棒性。

离线实验和天猫搜索在线 A/B 测试均验证了显著提升，在 UCTCVR 和 GMV 上取得实质性增益，同时训练吞吐率更高。

---

## 📋 其他论文速览

- **Optimizing Visibility in Generative Engines: A Critical Survey of GEO (2023-2026)**（arXiv:2607.14035）：对 45 项生成式引擎优化（GEO）研究的系统性综述，指出 GEO 不是单一排名任务而是多阶段随机管道，并提出了可见性向量和多阶段形式模型。对内容分发和推荐系统的 SEO 扩展有参考价值。

- **Cluster with Auctions for Vector Search**（arXiv:2607.13728）：NeurIPS 2026 在审。提出 CwA 方法，联合学习平衡的数据库划分和神经探测函数，通过并行拍卖算法解决大规模组合优化。当查询分布与数据库分布不同时，吞吐量提升达 4.7×。向量搜索是推荐系统的底层基础设施，值得关注。

- **Where Does the Noise Come From? Variance-Components Decomposition of Non-Determinism in LLM Brand Answers**（arXiv:2607.13304）：对 LLM 品牌推荐答案中的非确定性进行方差分解，发现查询语言是最大系统因素（26.5%），而品牌身份仅占 1.5%。对 LLM 作为推荐/问答系统的评测方法论有启发。

- **Multimodal Assessment of Pancreatic Cancer Resectability Using Deep Learning**（arXiv:2607.13826）：跨学科医学+计算机视觉论文，利用 Swin-UNETR 和临床信息融合进行胰腺癌可切除性分类。与信息检索关联较弱。

- **Measuring What the Crawler Sees**（arXiv:2607.13636）：基于 urn 模型和发现曲线（discovery curve）对网络爬虫的纵向覆盖分析，提出两组件模型（persistent core + dynamic shell）解释爬取数据中的不一致性。对 web-scale 数据获取有方法论意义。

- **Gauge-Invariant Regularization for Potential Recovery from Flow on Directed Graphs**（arXiv:2607.13609）：LoG 2026 在审。提出规范不变的图 Dirichlet 能量正则化，解决从有向图流中恢复潜在势的经典病态问题。在公开点击流语料上验证了比 ridge 更好的动态范围保持。点击流分析可间接服务于用户行为建模。

- **Classifying daily activities needs posture, reconstructing them needs motion**（arXiv:2607.13216）：跨学科神经科学+运动分析论文，探讨动作分类 vs. 动作重建所需信息差异。与信息检索无直接关联。