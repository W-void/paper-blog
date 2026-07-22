---
title: "【推荐系统 Paper 日报】2026-07-22"
date: 2026-07-22
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2775844770"
---

# 【推荐系统 Paper 日报】2026-07-22

## 📊 今日概览

arXiv cs.IR 今日（7月22日）共更新 **15 篇**论文，其中 **7 篇**与推荐系统直接相关，涵盖生成式推荐、可解释性、去噪建模、强化学习排序等方向。本期亮点：淘宝搜索推出价值感知的生成检索框架 TSGR，以及多模态序列推荐的全新双层次去噪框架 DDMSR。

## 🔥 推荐系统论文深度解读

### 1. Spectral Biclustering-Driven Scalability for Post-Hoc Explainability in Recommender Systems

📄 [arXiv:2607.19189](https://arxiv.org/abs/2607.19189) | Know.-Based Syst. 342, C (Jun 2026) | Jose L. Salmeron, Irina Arévalo

**🗣️ 大白话：** 推荐系统需要可解释性来建立信任，但现有方法计算代价太高——每次要移除一个用户或商品重新训练模型才能看影响，数据集一大数据量就崩了。这篇论文提出一个"分组删除"方法，用谱双聚类把用户和商品分成块，整块整块地删，计算量大幅降低，还能按块级别解释推荐结果。

**🔬 专业讲解：** 文章引入块删除诊断框架（Block-Deletion Diagnostic），利用谱双聚类（Spectral Biclustering）对用户-商品交互矩阵进行双聚类分组，然后通过移除整块交互来评估推荐敏感度。相比传统的逐观测删除方法，该框架显著减少了重训练次数，同时提供用户段、商品组和交互级别的可解释性。在 SVD 和 Neural Collaborative Filtering 两个范式上，基于 MovieLens 和 Amazon 数据集的实验表明，排名靠前的推荐对特定交互块更敏感，且不同用户段对块删除的敏感性存在异质性。

---

### 2. Beyond Noisy Signals: Dual-Level Denoising for Multi-modal Sequential Recommendation

📄 [arXiv:2607.18786](https://arxiv.org/abs/2607.18786) | Jie Luo, Qi Jin, Xinming Zhang

**🗣️ 大白话：** 多模态推荐（用图片、文字等辅助信息建模用户偏好）听起来很美，但信号太杂——一方面预训练模型的特征和推荐意图有语义鸿沟（特征级冗余），另一方面用户点击序列里有大量误触噪声（序列级噪声）。DDMSR 框架从图结构和频域两个层面同时去噪，效果拔群。

**🔬 专业讲解：** 论文提出 DDMSR（Dual-level Denoising Multi-modal Sequential Recommendation），识别出多模态序列推荐中的"双噪声困境"：特征级冗余（通用预训练表示与细粒度推荐意图之间的语义鸿沟）和序列级随机性（偶然点击等虚假交互）。解决方案包括：(1) 基于拉普拉斯平滑的图结构低通滤波器，抑制高频语义噪声；(2) 利用快速傅里叶变换的频域序列去噪模块，自适应调制交互谱；(3) 多模态对比对齐目标，桥接异构性鸿沟。在四个基准数据集上均优于 SOTA 基线。

---

### 3. Mitigating Matthew Effect: Multi-Hypergraph Boosted Multi-Interest Self-Supervised Learning for Conversational Recommendation

📄 [arXiv:2607.18609](https://arxiv.org/abs/2607.18609) | Yongsen Zheng, Ruilin Xu, Guohua Wang, Liang Lin, Kwok-Yan Lam

**🗣️ 大白话：** "马太效应"在推荐系统里就是富者愈富——热门商品越推越热，冷门商品永远没人看。这篇论文专门解决对话式推荐中的马太效应，用多层超图来学习用户的多粒度兴趣，让系统能更好地发现长尾商品。

**🔬 专业讲解：** 提出 HiCore 框架（Multi-Hypergraph Boosted Multi-Interest Self-Supervised Learning for Conversational Recommendation），针对对话式推荐系统（CRS）中用户-系统动态反馈回路加剧马太效应的问题。通过构建物品级、实体级、词级多通道超图来学习多级用户兴趣，有效缓解流行度偏差。在四个 CRS 基准数据集上达到了 SOTA 性能，代码已开源。

---

### 4. Topology-Aware Tokenization for Generative Recommendation

📄 [arXiv:2607.18600](https://arxiv.org/abs/2607.18600) | Yaokun Liu, Yifan Liu, Zhenrui Yue, Gyuseok Lee, Zelin Li, Ruichen Yao, Dong Wang

**🗣️ 大白话：** 生成式推荐把推荐问题变成"预测下一个商品 ID"的序列生成任务，但商品 ID 的量化编码过程会破坏商品之间的语义关系（拓扑失真），导致模型搞不清哪些商品是相似的。TopoTok 通过多级蒸馏让编码过程保持拓扑结构，Recall@5 提升最高达 9.42%。

**🔬 专业讲解：** 论文指出生成式推荐的一个关键问题：商品在预训练语义嵌入空间中的邻接关系在量化后被严重破坏，导致拓扑失真。提出 TopoTok（Topology-Aware Tokenization），引入三级蒸馏方案：(1) 组间蒸馏捕获全局簇级关系；(2) 组内蒸馏细化语义簇内部结构；(3) 商品间蒸馏在个体商品级别强制对齐。在三个基准数据集上，TopoTok 一致优于 SOTA tokenizer，Recall@5 提升最高 9.42%。

---

### 5. An Epistemic Position-Based Click Model: From Interactions to Epistemic Distributions of Relevance and Bias

📄 [arXiv:2607.18712](https://arxiv.org/abs/2607.18712) | Oscar Rolando Ramirez Milian, Harrie Oosterhuis

**🗣️ 大白话：** 传统点击率模型只能给出"点不点"的预测值，但不知道预测有多靠谱。这篇论文首次引入了"认知不确定性"的概念——用贝塔分布来建模相关性和位置偏差，让你知道推荐结果的置信度是多少。

**🔬 专业讲解：** 提出首个基于证据深度学习的认知不确定性点击率模型，将传统的频率派点估计扩展为贝塔分布形式的认知分布。模型以商品和位置特征为输入，输出位置基础模型中每个相关性和位置偏差变量的贝塔分布，捕获点击概率的认知不确定性。实验表明该方法在未见数据上能有效捕捉认知不确定性，而标准策略梯度无法学习到有意义的分布。

---

### 6. Exposure-Based Reinforcement Learning to Rank

📄 [arXiv:2607.18689](https://arxiv.org/abs/2607.18689) | Harrie Oosterhuis, Rolf Jagerman, Zhen Qin, Xuanhui Wang

**🗣️ 大白话：** 强化学习排序（RL for LTR）理论上什么目标都能优化，但实际用不了——动作空间太大，而且现有方法依赖复杂的自定义梯度计算，和框架的自动求导打架。这篇论文提出一个文档曝光分布抽象，让你只需要定义一个可微分的损失函数，RL 就能自动优化排序，而且 GPU 友好，收敛快得多。

**🔬 专业讲解：** 论文重新审视 RL for LTR，摒弃对自定义梯度的依赖，转而聚焦方差减少和 GPU 计算。通过基线修正和部分边际化实现高样本效率，并提出将梯度估计置于文档曝光分布之后的抽象，实现与自动求导的无缝集成。用户只需实现一个关于曝光的可微分损失函数，RL for LTR 即可优化。实验表明新方法收敛更快、排序性能更高，且不存在 GPU 计算时间开销，而现有方法在长时间训练中出现严重的稳定性问题。

---

### 7. Sequential Learner Modeling Using Multi-Relational Graph Convolutional Networks

📄 [arXiv:2607.19253](https://arxiv.org/abs/2607.19253) | Rawaa Alatrash, Mohamed Amine Chatti, Hong Yang, Yumeng Wang

**🗣️ 大白话：** 在线教育推荐系统里，准确建模学习者的知识状态是个难题。这篇论文用多关系图卷积网络（MR-GCN）结合个人知识图谱来建模学习者，同时考虑长期和短期交互序列，在在线用户研究（31人）中验证了效果。

**🔬 专业讲解：** 提出 MR-ConceptGCN，基于概念的个人知识图谱（PKG）+ MR-GCN + SBERT 预训练语言模型，获得增强的关系感知和语义感知 PKG 实体表示。利用学习者在 CourseMapper 平台上未理解的知识概念增强嵌入，构建结合长期和短期学习者交互的序列模型。在线用户研究（n=31）表明在准确性、有用性、多样性和满意度四个维度均有显著提升。

---

## 📋 其他论文速览

- **PAGE-RAG: Evidence-Grounded Adaptive Graph Retrieval for Long-Document Question Answering**（[arXiv:2607.19301](https://arxiv.org/abs/2607.19301)）：提出 PAGE-RAG，将图结构视为语义骨架而非独立知识源，引入任务自适应检索路由和严格的知识边界控制，提升 GraphRAG 的可靠性和效率。
- **TSGR: Taobao Search Generative Retrieval**（[arXiv:2607.18796](https://arxiv.org/abs/2607.18796)）：淘宝搜索提出的价值感知生成检索框架，在 SID 构建中编码查询条件化价值排序，并引入价值感知排序模块，线上 A/B 测试 GMV 提升 1.64%。
- **Answer-Reconstruction Search Density**（[arXiv:2607.18904](https://arxiv.org/abs/2607.18904)）：定义 ARSD 指标，量化会话回答所压缩的最小常规搜索工作量，区分查询压缩和来源压缩。
- **RAGAL: A Frugal, Fully Local Retrieval-Augmented Assistant**（[arXiv:2607.18756](https://arxiv.org/abs/2607.18756)）：在 8GB 消费级笔记本上部署的完全本地化 RAG 助手，展示检索工程和嵌入微调在资源受限场景下的高杠杆效应。
- **PLAID-PRF: Pseudo-Relevance Feedback with Centroid-like Tokens in PLAID**（[arXiv:2607.18626](https://arxiv.org/abs/2607.18626)）：在 PLAID 索引上实现轻量级伪相关反馈，利用内部质心向量作为扩展词，在 MSMARCO 和 BEIR 基准上 nDCG@10 提升最高 4.3%。
- **AutoIndex: Learning Representation Programs for Retrieval**（[arXiv:2607.18603](https://arxiv.org/abs/2607.18603)）：学习文档表示程序的可执行变换，在 CRUMB 基准上 Recall@100 平均提升 8.4%。
- **Biological Amnesia in ICU Time-Series Prediction**（[arXiv:2607.19020](https://arxiv.org/abs/2607.19020)）：ICU 预测中漂移自适应的双流架构，通过时间检索从 PubMed 获取时代匹配的医学证据。
- **AILQA: Evaluating AI-Driven Legal Question Answering Systems**（[arXiv:2607.18825](https://arxiv.org/abs/2607.18825)）：面向印度法律系统的 AI 问答评估系统，在 AIBE 标准化考试上提供基准。
