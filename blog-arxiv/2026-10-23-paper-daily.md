---
title: "【推荐系统 Paper 日报】2026-10-23"
date: 2026-10-23
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2793667055"
---

# 【推荐系统 Paper 日报】2026-10-23

## 📊 今日概览

arXiv cs.IR 今日（2026-10-23 周五公告）共 27 篇，其中推荐系统直接相关 5 篇，另有多篇 agentic 检索工作值得关注。今天堪称**工业界大型圈粉现场**：LinkedIn 的 PAIR 重构了职业社交推荐的相关性定义，快手的 OneLatent 把 LLM 推荐底座的 CoT 塞进隐空间、线上 A/B 实测收入 +9.6%（还顺手击败了自家的 OneRec 和 OneReason），淘宝系团队则交出了 agentic recommendation 的重量级基准 UserArena。

## 🔥 推荐系统论文深度解读

### 1. PAIR: Preference-Aligned Intent Retrieval for Premium People Recommendation at LinkedIn

📄 [arXiv:2610.30941](https://arxiv.org/abs/2610.30941) | LinkedIn | Zhongkai Shangguan, Yanbin Kang, Yihan Cao, Ruijie Jiang, Qiannan Yin, Chang Yue 等 10 人

**🗣️ 大白话：** LinkedIn 高端会员推荐里有个反直觉的事实："长得像你的人"往往不是"对你有用的人"。求职者想联系的是招聘者，而不是另一个和自己简历差不多的工程师。传统推荐拿画像相似度或共同好友来建模，在职业场景下就跑偏了。PAIR 的思路是直接学"意图偏好对齐"——从曝光和点击行为里学出谁会回应谁。更妙的是工程侧：用位置编码聚合点击历史，用户表示可以常数代价增量更新，线上服务时不用反复跑 LLM，轻量 CPU 操作就能完成个性化刷新。最终一个只有 0.6B 参数的小模型，MAR@100 就做到 0.45。

**🔬 专业讲解：** 论文指出职业网络中的相关性本质上是**互补而非对称**的（complementary rather than symmetric），这动摇了基于 profile similarity 的建模范式。方法上借鉴 DPO 的偏好学习视角，但将其实例化为**曝光条件化的多负样本对比目标**（exposure-conditioned multi-negative contrastive objective），无需显式 reference model，训练更简单且能高效扩展到大规模候选集。时序建模通过对固定历史窗口的点击序列做位置编码聚合实现，新交互无需重编码全量历史。在 LinkedIn Premium 检索任务上验证有效。

---

### 2. UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents

📄 [arXiv:2610.30932](https://arxiv.org/abs/2610.30932) | 淘宝/莱顿大学 | Jujia Zhao, Jiakai Tang, Jing Yu, Wen Chen, Jian Wu, Han Zhu, Fei Sun, Suzan Verberne, Zhaochun Ren

**🗣️ 大白话：** 推荐系统正在从"猜你想点什么"进化到"替你把事情办成"（agentic recommendation），但问题来了：怎么评测一个要跟用户多轮交互的购物 agent？静态数据集根本不够用。UserArena 搭了个真实电商交互基准：11,010 个真实用户的 64,729 条会话轨迹、566,102 个商品、13 种动作类型，还配套了可交互的模拟环境。最难得的是它支持**用生产环境真实 A/B 实验的结果做离线校验**——这意味着模拟器里测出来的结论可以放心外推到线上。另外提出 OPTD 蒸馏方法，让用户模拟器在长程交互下更"像真人"。

**🔬 专业讲解：** 论文将推荐世界模型（recommendation world model）定义为同时刻画交互式购物环境与用户行为响应的模拟器。评测设计为**五级体系**：输出合法性 → 局部决策 → 序列行为 → 个性化 → 最终结果，逐层递进。为提升长程模拟保真度，提出 On-Policy Trajectory Distillation（OPTD）：在学生模型自生成的 rollout 上，用轨迹级意图提供稠密的教师监督信号，避免了传统逐步蒸馏在长轨迹上的误差累积。实验表明 OPTD 在五级评测中综合保真度最强，且离线模拟最接近生产策略的真实效应。

---

### 3. OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models

📄 [arXiv:2610.30675](https://arxiv.org/abs/2610.30675) | 快手 | Hao Jiang, Peiru Du, Pengfei Yao, Mengting Li, Siyuan Lou, Kuo Cai, Sheng Yu 等 13 人

**🗣️ 大白话：** 用 LLM 当推荐底座（FRM）是当下的大趋势，"先思考再回答"的 CoT 确实让推荐更准，但线上根本扛不住——每个请求都要生成一大段推理文本，吞吐直接崩掉。OneLatent 的解法相当优雅：把显式 CoT 压缩成几个**可学习的 latent token**，让模型在隐空间里"思考"，完全不吐字。效果不降反升：在快手工业级数据上，SID@64 比显式 CoT 版本高 17.44%、比不思考版本高 9.33%，同时推理吞吐量提升 17 倍以上。更狠的是线上 A/B：在快手本地生活广告场景实测带来 **9.6% 收入提升**，超越自家上一代 OneRec 和 OneReason。

**🔬 专业讲解：** 技术路线分三步：(1) Multi-View Adaptive CoT（MV-ACoT）从多视角探索用户兴趣、自适应调整每个实例的推理复杂度，生成高质量教师监督；(2) 在预训练 FRM 上用三阶段 latent-token alignment 范式，把 CoT 轨迹渐进内化到可学习 latent token 中；(3) 多阶段课程式后训练激活 latent token 在下游推荐任务上的推理能力。论文同时给出了可扩展的实时 FRM 线上 serving 系统，是目前少有的"LLM 隐空间推理 + 大规模工业落地"完整闭环。

---

### 4. Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation

📄 [arXiv:2610.30825](https://arxiv.org/abs/2610.30825) | Ziang Lu, Yu Zhang, Xinzhe Jiang, Lei Sang, Yiwen Zhang

**🗣️ 大白话：** 跨域序列推荐想解决"新域没数据"的老问题，但现有方法大多一刀切：要么全局对齐两个域，要么粗粒度地搬特征。可现实中每个人跨域的兴趣一致性差异巨大——有人购物和刷视频的兴趣高度重合，有人则完全是两个人。BGAFlow 给每个用户单独估算"该迁移多少"：先用 LLM 推断的用户画像做双域预训练，建立共享语义空间；再按潜在兴趣重叠度确定个性化迁移范围；最后用一条贝塞尔曲线做几何参照，学一个残差流来平滑地把语义轨迹调整到位。实验全面超越 SOTA。

**🔬 专业讲解：** 方法的核心是把跨域语义迁移建模为一个**受几何引导的连续演化过程**：conditional Bezier curve 由中间偏好状态构造，作为目标语义轨迹的结构化参考；学习到的 residual flow 基于动态偏好反馈调整迁移方向，辅以推荐监督信号和轨迹正则（平滑性约束）保证适应过程有效且稳定。相比全局对齐目标，这种 per-user 的迁移控制（personalized transfer horizon + state-adaptive semantic evolution）能避免引入无关域信息。

---

### 5. FAIRGate: Agentic Runtime Policy Selection and Verified Repair for Fairer Recommendation Delivery

📄 [arXiv:2610.30359](https://arxiv.org/abs/2610.30359) | IEEE IRAI 2026 Accepted | Navkar Jain, Enock Ayiku, Kenneth Fletcher

**🗣️ 大白话：** 公平性推荐的常规做法是训练时定一个公平目标，或者上线后套一个写死的重排规则。但真实线上每次请求的情况都不一样：候选池在变、曝光欠债在变、用户偏好历史在变，一套固定规则显然不够灵活。FAIRGate 在排序器和最终 top-K 之间插了一个 agent 层，但这个 agent 很"守规矩"：它**不自己发明公平性目标**，只从预定义策略库里选（长尾曝光、群体曝光均衡、集中度控制、校准保护、弃权）；选定后由确定性执行器做带约束的修复；校验器验证相关性、可行性、元数据、校准和审计约束全部满足才放行；LLM 只在排序结果敲定后，基于审计痕迹生成有据可查的解释。整个流程可度量、有界、可回放。

**🔬 专业讲解：** 这篇的价值在于给出了 agentic fairness 的一种安全架构范式：agent 负责 runtime 决策（policy selection），但强制与确定性执行（constrained repair）和验证（validator）解耦，避免了"LLM 直接改排序结果"带来的不可控性和不可审计性。可视为 model-agnostic 的投递层控制器（delivery controller），与 base ranker 完全解耦，适合在现有系统上增量部署。

## 📋 其他论文速览

- **When Agentic Retrieval Fails Silently**（[arXiv:2610.30423](https://arxiv.org/abs/2610.30423)）：来自 LinkedIn 生产环境的反思——agentic 助手里 CTR/MRR/NDCG 全部失灵（agent 先于用户看结果、用户行为滞后多轮、归因混杂），提出 LARA 三层评估框架。
- **The Fusion Tax: A Diagnostic Analysis of When Hybrid Retrieval Hurts**（[arXiv:2610.30612](https://arxiv.org/abs/2610.30612)）：混合检索（BM25+稠密+RRF）不是万金油，逐 query 剖析融合何时反而拉低效果，主张"不融合"应成为一等决策。
- **Getting a GRIP on Graph-Based Search for Learned Sparse Retrieval**（[arXiv:2610.30425](https://arxiv.org/abs/2610.30425)）：为学习型稀疏检索设计图索引，挑战"倒排索引全面优于图索引"的社区共识。
- **Lychee: Certified Screening of Inverted Lists for High-Recall Vector Search**（[arXiv:2610.30697](https://arxiv.org/abs/2610.30697)）：面向 0.999+ 超高召回场景（风控、人脸、诊断），用降精度筛查+误差界保证不漏真邻居，大幅提升吞吐。
- **IRAH: Hierarchical Agentic Tree Search for Retrieval Pipeline Optimization**（[arXiv:2610.30167](https://arxiv.org/abs/2610.30167)）：用 LATS 树搜索 + 离线元学习初始化，在有限评估预算下联合优化 RAG 检索管线的结构与超参。
- **Deep Search in Real-World Web Environments**（[arXiv:2610.30181](https://arxiv.org/abs/2610.30181)）：提出 OpenDS 任务与基准，评测 agent 在真实开放网页（多源、多模态、复杂交互机制）上的多步深度搜索能力。
- **FlexVDR: Learning to Allocate Matryoshka Representation Budgets for Visual Document Retrieval**（[arXiv:2610.30177](https://arxiv.org/abs/2610.30177)）：视觉文档检索中为每个 query 自适应分配 Matryoshka 表示预算，算力按需花。
- **FormBench: A Benchmark for Fine-Grained Retrieval in Formulation Patents**（[arXiv:2610.30175](https://arxiv.org/abs/2610.30175)）：5.5 万查询、百万级语料的配方专利细粒度检索基准，硬负样本来自材料学本体。
- **Automated Enrichment Analysis with GraphRAG**（[arXiv:2610.30710](https://arxiv.org/abs/2610.30710)）：BIBM 2026，把多个基因集数据库统一成"词项-基因"知识图谱，用 GraphRAG 做可追溯的富集分析解读。
- **QProtFuse: Query-Guided Layer Fusion for Retrieval-Augmented Protein Function Prediction**（[arXiv:2610.30180](https://arxiv.org/abs/2610.30180)）：发现蛋白质语言模型不同层对不同任务的检索价值不同，提出 query 引导的多层融合，替代朴素的末层选择。
