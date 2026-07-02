---
title: "【推荐系统 Paper 日报】2026-07-02"
date: 2026-07-02
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
---

# 【推荐系统 Paper 日报】2026-07-02

## 📊 今日概览

arXiv cs.IR 公告日期 **Thu, 2 Jul 2026**，今日共收录 **26 篇**论文，其中与推荐系统/个性化检索/排序相关的论文 **8 篇**（占 30.8%）。本期亮点：从扩散模型重排序到对话推荐系统用户模拟，从工业级 Two-Tower 负采样到个人知识图谱推荐，覆盖模型创新、系统优化、评估方法多个维度，SIGIR 2026 和 ICDEW 录用论文也陆续上线。

## 🔥 推荐系统论文深度解读

### 1. Real-Time Hard Negative Sampling via LLM-based Clustering for Large-Scale Two-Tower Retrieval

📄 [arXiv:2607.00448](https://arxiv.org/abs/2607.00448) | 工业系统 | Ivan Ji, Liuyi Hu, Harrison Zhao, Lei Huang, Qunshu Zhang, Max Fan, Aameek Singh

**🗣️ 大白话：** Two-Tower 模型是推荐系统召回阶段的主力架构，但训练时的负样本太"容易猜对"了，模型学不到真本事。这篇论文说：用 LLM 把候选物品聚类，同一类里挑几个当"硬负样本"，让模型在训练时就见见世面。关键是可以实时做，不影响线上速度，而且实验证明这种负样本还能打破推荐里的"热门 bias"——原来经常推给你那几个东西，现在可以换换了。

**🔬 专业讲解：** 论文提出了一种基于 LLM 聚类的自监督硬负采样技术。核心思路是利用 LLM 学习媒体表示，在训练过程中从同一簇内生成硬负样本。该方法设计为实时采样框架，可无缝集成到生产模型中，处理数十亿级训练数据且计算开销极小。在公开数据集和大型在线系统上的部署实验均表明该方法优于广泛使用的工业基准方法。进一步分析表明，这种采样方法有助于打破推荐中的固有反馈循环，显著降低流行度偏差（popularity bias）。

---

### 2. Diffusion-GR2: Diffusion Generative Reasoning Re-ranker

📄 [arXiv:2607.01170](https://arxiv.org/abs/2607.01170) | 工作论文 | Zhuoxuan Zhang, Kangqi Ni, Yuhang Chen, Mingfu Liang, Xiaohan Wei, Yunchen Pu, Fei Tian, Chonglin Sun, Frank Shyu, Adam Song, Sandeep Pandey, Luke Simon, Tianlong Chen, Xi Liu

**🗣️ 大白话：** 现在的推荐重排序模型越来越喜欢"先想再说"——生成一段推理链再决定怎么排序。问题是 Transformer 解码太慢了，一个 token 一个 token 地生成。扩散模型可以一次性解多个位置，快得多。但直接把重排序模型改成扩散模型会出现两个问题：答案位置并行解会导致重复、遗漏或越界；而且训练时用的固定轨迹和推理时自己的行为不一致。这篇论文提出了一套完整的转换方案：先让模型学会自己生成合法排列，再用自己的输出轨迹做蒸馏对齐，最后 RL 微调。最终在 Amazon Beauty 上接近原模型精度，但解码速度提升了 2.4–3.5 倍。

**🔬 专业讲解：** 论文提出 Diffusion-GR2，将自回归推理重排序器（GR2）转换为块扩散重排序器。三个关键技术阶段：（1）Conversion Fine-Tuning (CFT)：将 AR 初始化的扩散模型适配为能自行去噪生成合法排列，无需外部约束解码器；（2）On-Policy Distillation (OPD)：用模型自身的解码轨迹进行监督，从 AR 教师获取密集的 per-token 目标；（3）RL 阶段：在 OPD 策略之上进行强化学习，针对重排序奖励进行优化。Amazon Beauty 实验表明 Diffusion-GR2 恢复至接近 AR 重排序器精度，块并行解码将解码吞吐量提升 2.4–3.5 倍。消融实验显示 CFT 恢复了大部分转换精度损失，OPD 进一步将其闭合至 AR 参考水平。

---

### 3. Prompt Optimization for User Simulation in Conversational Recommender Systems: A Multi-Objective Framework

📄 [arXiv:2607.00010](https://arxiv.org/abs/2607.00010) | ICDEW 2026 | Nipun B Nair, Tongtong Wu, Weiqing Wang

**🗣️ 大白话：** 对话推荐系统（CRS）需要大量的用户交互数据来训练和评估，但真实用户研究既贵又慢。用 LLM 模拟用户是个办法，但现有的模拟器有三大问题：对推荐结果总是"太客气"（positive bias）、会泄露训练数据里的信息、行为多样性不够，而且 prompt 全靠人手工调。这篇论文干脆不手工调 prompt 了，直接让框架自动优化，同时解决这三个问题。实验表明自动优化后的模拟器行为更贴近真实用户。

**🔬 专业讲解：** 论文提出一个自动优化 LLM 用户模拟器 prompt 的框架，同时缓解系统性正向偏差、数据泄露和行为多样性不足三大问题。框架采用多目标优化策略，无需领域专家手工设计 brittle prompt。在对话推荐系统场景下，实验结果表明该方法在多种 prompt 设置下均实现了与人类交互模式更好的行为对齐。

---

### 4. Learning User-Aware Recall: Personalized Retrieval in Long-Term Conversational Memory

📄 [arXiv:2607.00017](https://arxiv.org/abs/2607.00017) | 工作论文 | ZhiShu Jiang, Haibo Liu, Xin Shen, Guanqiang QI, Chenxi Miao, Weikang Li, Liwei Qian, Xin Pei, Jizhou Huang

**🗣️ 大白话：** 现在的对话 AI 都会说"我记得你"，但真能记住的没几个。就算建了记忆库，召回时还是按查询相似度排，没考虑"这个信息对这个用户重不重要"。这篇论文说：应该从对话历史里提炼出一个"用户画像"，作为召回时的个性化先验。比如你总是聊游戏，那游戏相关的东西就该排前面。同时，他们还用 GRPO 训练了一个查询改写器，让改写后的查询能更好地命中用户真正需要的记忆。在 LoCoMo 和 LongMemEval-S 上测试，确实比不用个性化先验的方法好。

**🔬 专业讲解：** 论文提出 Profile-guided Personalized Retrieval Optimization (PPRO)，一个以检索为中心的框架，使记忆检索同时具备用户感知和检索优化能力。从对话历史中构建情景记忆和语义记忆库，并从累积信息中推导用户画像。该画像作为显式的个性化先验参与记忆排序，使检索能够考虑稳定的用户属性、偏好和模式。进一步使用 Group Relative Policy Optimization (GRPO) 训练查询改写器，以证据检索质量和下游答案质量作为反馈，同时保持记忆库和答案模型固定。在 LoCoMo 和 LongMemEval-S 上取得一致增益。

---

### 5. From "Strings" to "Things" for Personal Knowledge Graphs: Evaluating LLM Triple Extraction for Recommendation Systems

📄 [arXiv:2607.00003](https://arxiv.org/abs/2607.00003) | 工作论文 | Abhirup Dasgupta, Fernando Spadea, Oshani Seneviratne

**🗣️ 大白话：** 个人知识图谱（PKG）是建模用户偏好的隐私友好方案，但怎么从聊天这种非结构化数据里提取结构化信息一直是个难题。这篇论文搭了一套完整流水线：用轻量级 LLM（Qwen、Gemma）从对话里提取 RDF 三元组，再链接到 Wikidata 实体。然后他们做了两件事：先看提取得准不准，再看提取出来的图谱在下游推荐任务里有没有用。结果发现，某些模型提取质量高，而且提取质量和推荐效果基本成正比。

**🔬 专业讲解：** 论文提出一个可复现的流水线，使用轻量级 LLM 从对话数据中提取与 Wikidata 标识符关联的结构化用户偏好三元组，用于 PKG 构建。评估涵盖语义提取保真度和下游推荐任务中的图谱效用两方面。使用 Qwen 和 Gemma 系列模型进行实验，发现特定模型在提取性能上表现良好，且其下游推荐性能与三元组提取性能呈比例关系。

## 📋 其他论文速览

- **SkillSelect-Serve: Budget-Controllable and QoS-Aware Skill Service Recommendation**（arXiv:2607.00011）：面向 LLM Agent 的技能服务推荐框架，将技能选择建模为服务推荐与组合问题，支持预算可控和 QoS 感知的技能 bundle 选择。在 35,353 个技能和 586 个任务上验证了同预算下召回率和效用提升。

- **As It Was: Aligning LLM Search Evaluation with Historical User Preferences**（arXiv:2607.01040）：Spotify 的工作，提出基于行为的 LLM 搜索评估方法，用历史用户交互构建 QRI 卡片作为查询-相关性的先验，在 6000 重组 SERP 上验证 Spearman 秩相关提升约 5%，分歧案例相对提升 91%。

- **Learning to Compose: Revisiting Proxy Task Design for Zero-Shot Composed Image Retrieval**（arXiv:2607.00374）：ECCV 2026 录用。针对零样本组合图像检索（ZS-CIR），提出 FoCo 框架，将组合建模为"聚焦修改相关视觉内容"和"完成目标语义"两阶段，通过文本锚定的视觉聚合和上下文条件语义补全两个代理任务实现，在四个 ZS-CIR 基准上取得 SOTA。

---

**附：今日全部 26 篇论文速览表**

| # | 论文 | 标题 |
|---|------|------|
| 1 | 2607.01170 | Diffusion-GR2: Diffusion Generative Reasoning Re-ranker |
| 2 | 2607.01162 | Trie-based Experiment Plans for Efficient IR Pipeline Experiments (ReNeuIR'26) |
| 3 | 2607.01071 | MemSyco-Bench: Benchmarking Sycophancy in Agent Memory |
| 4 | 2607.01040 | As It Was: Aligning LLM Search Evaluation with Historical User Preferences |
| 5 | 2607.00508 | When RAG Meets Query Planning: Logical Query Trees for Exploratory Reasoning (SIGMOD 2027) |
| 6 | 2607.00448 | Real-Time Hard Negative Sampling via LLM-based Clustering for Large-Scale Two-Tower Retrieval |
| 7 | 2607.00379 | Attribute-Prompted Kernel Hashing for Unsupervised Data-Efficient Cross-Modal Retrieval |
| 8 | 2607.00052 | AGE: Adaptive-masking for Graph Embedding in Graph Retrieval-Augmented Generation |
| 9 | 2607.00023 | Aligning Sentence Embeddings to Human Concepts via Sparse Autoencoders |
| 10 | 2607.00017 | Learning User-Aware Recall: Personalized Retrieval in Long-Term Conversational Memory |
| 11 | 2607.00016 | Libra: Training the Environment for Agentic Information Retrieval |
| 12 | 2607.00013 | GRACE-RAG: Governed Retrieval Architecture for Canonical Evidence Synthesis (COLM 2026) |
| 13 | 2607.00012 | PRA-RAG: Provably Robust Aggregation in RAG against Retrieval Corruption |
| 14 | 2607.00011 | SkillSelect-Serve: Budget-Controllable QoS-Aware Skill Service Recommendation |
| 15 | 2607.00010 | Prompt Optimization for User Simulation in Conversational Recommender Systems (ICDEW) |
| 16 | 2607.00008 | SchemaRAG: Dynamic Large Schema Reduction for LLM-driven Structured IE |
| 17 | 2607.00007 | BaRA: BFS-and-Reflection Web Data Collection Agent |
| 18 | 2607.00005 | Topological Void Analysis: Mathematical Framework for Innovation Discovery |
| 19 | 2607.00004 | Why Advanced Encoders Lag on Sparse Retrieval? (SIGIR 2026) |
| 20 | 2607.00003 | From "Strings" to "Things" for Personal Knowledge Graphs for Recommendation Systems |
| 21 | 2607.00768 | RACORN-1: Adaptive Recall-Preserving Speedup for Filtered Vector Search (cs.DB) |
| 22 | 2607.00728 | When to Repair a Graph ANN Index: Navigability-Signal-Triggered Local Repair (cs.DB) |
| 23 | 2607.00725 | What Survives Into Context: Budget-Constrained Multi-Hop RAG (cs.CL) |
| 24 | 2607.00597 | Multi-Turn Agentic Scientific Literature Search via Workflow Induction (cs.CL) |
| 25 | 2607.00374 | Learning to Compose: Revisiting Proxy Task Design for ZS-CIR (ECCV 2026) |
| 26 | 2607.00159 | Identifying and Resolving Pitfalls of Knowledge-Based VQA Benchmarks (ECCV 2026) |
