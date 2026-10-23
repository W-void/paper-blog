---
title: "【推荐系统 Paper 日报】2026-10-23"
date: 2026-10-23
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2793648473"
---

# 【推荐系统 Paper 日报】2026-10-23

## 📊 今日概览

本期为 arXiv cs.IR 10月23日（周五）公告，共收录 27 篇论文，其中推荐系统直接相关 5 篇，整体质量相当高：LinkedIn 的工业级人员推荐检索框架 PAIR、快手上线 A/B 并拿到 9.6% 收入提升的 OneLatent 潜在推理模型，以及首个针对长程购物 Agent 的真实用户仿真基准 UserArena，都是值得精读的硬货。检索方向今天也很热闹，混合检索什么时候反而变差（Fusion Tax）、RAG 安全综述等都有看点。

## 🔥 推荐系统论文深度解读

### 1. PAIR: Preference-Aligned Intent Retrieval for Premium People Recommendation at LinkedIn

📄 [arXiv:2610.30941](https://arxiv.org/abs/2610.30941) | 工业论文（LinkedIn） | Zhongkai Shangguan, Yanbin Kang, Yihan Cao, Ruijie Jiang, Qiannan Yin, Chang Yue 等

**🗣️ 大白话：** LinkedIn 上求职者想联系的是招聘方，不是和自己背景相似的同行。所以"找人"不能按"像不像"来排，得按"合不合适"来排。这篇就是 LinkedIn 把"意图匹配"做成一套检索框架，用在 Premium 会员推荐上。

**🔬 专业讲解：** 核心洞察是职业社交网络中相关性是"互补式"而非"对称式"的，通用 profile 相似度嵌入会系统性错排。PAIR 借鉴 DPO 的偏好学习视角，但把偏好学习实例化为 exposure-conditioned 的多负样本对比目标，无需显式 reference model，训练简单且能高效扩展到大规模候选集。个性化方面，用带位置编码的方式聚合点击历史、在固定历史窗口上做常数成本的用户表示增量更新——新交互进来不用重新跑 LLM 编码，serving 时用轻量 CPU 运算即可完成个性化更新。0.6B 参数的模型在 LinkedIn Premium 检索任务上做到 MAR@100 = 0.45。

---

### 2. OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models

📄 [arXiv:2610.30675](https://arxiv.org/abs/2610.30675) | 工业论文（快手，含线上 A/B） | Hao Jiang, Peiru Du, Pengfei Yao, Mengting Li, Siyuan Lou, Kuo Cai 等

**🗣️ 大白话：** 现在流行用 LLM 当推荐底座，让它先"想一步"再推荐（Think-then-Answer）。但显式思维链又慢又贵，模板还僵化。OneLatent 的思路是：把思考过程"压缩"进几个可学习的 latent token 里，模型在隐空间里想完直接出答案——想得一样好，但快了 17 倍。

**🔬 专业讲解：** 提出 Multi-View Adaptive CoT（MV-ACoT）从多视角探索用户兴趣、按实例自适应调整推理复杂度，生成多样高质量的教师监督；再通过三阶段 latent-token 对齐范式，把 CoT 轨迹逐步内化进可学习的 latent token；最后用多阶段课程式 post-training 激活 latent token 在下游推荐任务上的推理能力。在工业级快手数据集和公开 Kuaishou LLM-Rec 基准上，相比 FRM 的 Think/No-Think 变体分别提升 SID@64 17.44% 和 9.33%，线上推理吞吐高 17 倍以上；本地服务广告场景 A/B 相对 OneRec、OneReason 等强基线估算收入提升 9.6%。是目前少见的"LLM 推理底座推荐"完整落地案例。

---

### 3. UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents

📄 [arXiv:2610.30932](https://arxiv.org/abs/2610.30932) | 基准/仿真 | Jujia Zhao, Jiakai Tang, Jing Yu, Wen Chen, Jian Wu, Han Zhu

**🗣️ 大白话：** Agentic 推荐时代，得先有个靠谱的"虚拟用户"来陪购物 Agent 演练。UserArena 搬出了 6 万多条真实用户会话轨迹、56 万商品，还罕见地支持拿线上 A/B 实验结果做离线校验——就是问一句：你模拟的用户，像不像真人？

**🔬 专业讲解：** 构建了真实电商交互基准：11,010 名用户的 64,729 条会话轨迹，覆盖 566,102 个商品、13 种动作类型，配交互式环境，并支持与受控生产 A/B 实验结果做离线对齐验证。评估体系分五级：输出有效性 → 局部决策 → 序列行为 → 个性化 → 最终结果。为提升长程交互下仿真器的保真度，提出 On-Policy Trajectory Distillation（OPTD）：用轨迹级意图在学生模型自己生成的 rollout 上提供密集教师信号。实验显示 OPTD 在五级评估下整体保真度最强，且离线仿真中最接近复现生产策略效应。对做用户模拟、Agent 离线评估的团队是重要参考。

---

### 4. BGAFlow: Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation

📄 [arXiv:2610.30825](https://arxiv.org/abs/2610.30825) | 跨域序列推荐 | Ziang Lu, Yu Zhang, Xinzhe Jiang, Lei Sang, Yiwen Zhang

**🗣️ 大白话：** 跨域推荐的老问题是"一刀切"：把 A 域的知识全量搬到 B 域，不管这个用户在两个域的口味到底像不像。BGAFlow 给每个用户算一个"该搬多少"的度量，再用贝塞尔曲线引导兴趣语义平滑演化，搬多搬少因人而异。

**🔬 专业讲解：** 先通过统一双域预训练建立共享语义空间，用 LLM 推断的用户画像增强初始化；然后基于潜在兴趣重叠为每个用户估计个性化迁移范围（personalized horizon），决定迁移的"距离"；语义适配用条件贝塞尔曲线作为几何参考，学习一个残差流（residual flow）基于中间偏好状态逐步精化迁移轨迹，动态偏好反馈调整迁移方向，推荐监督 + 轨迹正则保证适配有效且平滑。真实数据集上持续超越 SOTA，验证了"个性化迁移控制 + 状态自适应语义演化"的价值。

---

### 5. FAIRGate: Agentic Runtime Policy Selection and Verified Repair for Fairer Recommendation Delivery

📄 [arXiv:2610.30359](https://arxiv.org/abs/2610.30359) | 推荐公平性 | Navkar Jain, Enock Ayiku, Kenneth Fletcher

**🗣️ 大白话：** 公平性推荐一般要么训练时定死一个公平目标，要么上线后套一个固定重排规则。FAIRGate 让一个 Agent 在线上实时"选策略"：候选池变了、曝光欠债变了，就换一种公平性打法，但执行和验收都交给确定性的规则，不靠 LLM 拍脑袋。

**🔬 专业讲解：** 提出模型无关的交付层控制器：在 base ranker 和最终 top-K 之间插入 agentic 策略选择层。Agent 不自行定义公平性目标，而是从预定义策略库中选择——覆盖长尾曝光、item 组曝光均衡、集中度控制、校准保护、弃权（abstention）五类；确定性执行器以约束修复方式应用所选策略；验证器只在相关性、可行性、元数据、校准、审计约束全部满足时接受结果；LLM 组件仅拿到已验证的审计轨迹、在排序决策固定后生成带证据的叙述。设计上让 Agent 承担运行时决策，同时保证公平性执行可度量、有界、可回放。

---

## 📋 其他论文速览

- **The Fusion Tax**（arXiv:2610.30612）：混合检索（稀疏+稠密+RRF）被普遍推荐，但作者系统诊断了"融合什么时候反而伤害效果"，给出何时该付这笔"融合税"的分析。
- **Getting a GRIP on Graph-Based Search for Learned Sparse Retrieval**（arXiv:2610.30425）：针对学习型稀疏检索（LSR），用图结构加速倒排搜索，兼顾神经泛化与关键词可解释性。
- **When Agentic Retrieval Fails Silently**（arXiv:2610.30423）：Agentic 助手场景下用户先看生成结果而非排序列表，CTR/NDCG 假设被打破；给出评测框架+生产环境实证。
- **Deep Search in Real-World Web Environments**（arXiv:2610.30181）：真实开放网页环境中的端到端 Deep Search Agent 评测，信息分散在多源异构站点中，比静态检索难得多。
- **Lychee**（arXiv:2610.30697）：高召回向量检索的倒排表"认证式筛选"（certified screening），漏一个邻居就是漏掉一次欺诈/威胁的高风险场景下很有价值。
- **FlexVDR**（arXiv:2610.30177）：视觉文档检索中用可学习方式分配 Matryoshka 表示预算，压缩多向量表示省算力。
- **FormBench**（arXiv:2610.30175）：配方类专利细粒度检索基准，5.5 万查询 + 百万级段落，考的是精确化学信息检索。
- **IRAH**（arXiv:2610.30167）：分层 Agentic 树搜索自动优化 RAG 检索管线的结构组件与超参，评估预算有限时尤其有用。
- **Chunk Recomputation under Real Document Revisions**（arXiv:2610.31019）：文档一改，RAG 分块就得重算——实测固定分块/递归/内容定义分块在真实修订下的更新成本与检索质量。
- **Lean Finder V2**（arXiv:2610.30843）：面向 Mathlib 的语义搜索，用对抗训练+查询改写消解模糊查询。
- **Compiling Autoregressive LLM Control into Policy-Exact Parallel Inference**（arXiv:2610.30664）：把 LLM 在层级 RAG 中的自回归控制决策"编译"成策略精确的并行推理，提速结构化决策管线。
- **Data-Void Exploits in Web-Searching LLMs**（arXiv:2610.30365）：新型攻击面——虚假信息制造者利用"data void"诱导搜索型 LLM 引用并传播其内容。
- **Protection Is Not One Event**（arXiv:2610.30193）：RAG 安全综述，按"被测端点"组织泄露、投毒、注入等风险的保护研究，统一了此前互不兼容的评测口径。
- **SurveyGraph**（arXiv:2610.31317）：基于"方法-实体"知识图谱自动生成学术综述，突破把论文当扁平文档检索的局限。
- **Journal Basket**（arXiv:2610.30544）：面向跨学科文献检索与综述方法透明化的支持工具，帮商科学生入门学术检索。
