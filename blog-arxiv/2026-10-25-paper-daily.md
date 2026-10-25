---
title: "【推荐系统 Paper 日报】2026-10-25"
date: 2026-10-25
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2794311541"
---

# 【推荐系统 Paper 日报】2026-10-25

## 📊 今日概览

本期覆盖 arXiv cs.IR 于 2026-10-23（周五）公告的最新论文，共 27 篇，其中与推荐系统/个性化方向直接相关的有 5 篇。今天的亮点相当集中：快手把 LLM 的思维链"压缩进隐空间"做基础推荐模型（OneLatent），LinkedIn 公开高端人才推荐的生产级检索框架（PAIR），还有来自电商真实 A/B 环境的智能体推荐基准 UserArena——工业界含量爆表的一天。此外混合检索"什么时候反而帮倒忙"的诊断分析也值得一读。

## 🔥 推荐系统论文深度解读

### 1. OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models

📄 [arXiv:2610.30675](https://arxiv.org/abs/2610.30675) | 快手工业级实验 | Hao Jiang, Peiru Du, Pengfei Yao, Mengting Li, Siyuan Lou, Kuo Cai 等

**🗣️ 大白话：** 现在流行让大模型"先想一步再推荐"（Think-then-Answer），但让模型把推理过程一个字一个字吐出来实在太贵了。OneLatent 的思路是：把冗长的思维链"压缩"成几个可学习的隐向量 token，模型在隐空间里"默念"完推理再给答案——效果反而更好，在线推理吞吐还快了 17 倍以上。

**🔬 专业讲解：** 论文指出现有基础推荐模型（FRM）依赖显式 CoT 有两大痛点：推理轨迹生成本身带来巨大推理开销；手工设计的 reasoning 模板难以覆盖多样且动态的用户兴趣。OneLatent 提出三段式方案：（1）MV-ACoT（Multi-View Adaptive CoT），从多视角探索用户兴趣并自适应调整每条样本的推理复杂度，自动生成多样、高质量的教师监督信号；（2）在预训练 FRM 之上做三阶段 latent-token 对齐，把显式 CoT 逐步内化（internalize）为可学习的隐 token，实现 Latent-Reason-then-Answer 推理范式；（3）多阶段课程式 post-training 激活隐 token 在下游推荐任务上的推理能力。在工业级快手数据集和公开 Kuaishou LLM-Rec 基准上，OneLatent 相比 FRM 的 Think / No-Think 变体分别将 SID@64 提升 17.44% 和 9.33%，同时在线推理吞吐超过 17 倍。这是"隐空间推理替代显式思维链"在推荐场景的一次相当扎实的落地验证，对推理成本敏感的工业推荐系统很有参考价值。

---

### 2. PAIR: Preference-Aligned Intent Retrieval for Premium People Recommendation at LinkedIn

📄 [arXiv:2610.30941](https://arxiv.org/abs/2610.30941) | LinkedIn 生产系统 | Zhongkai Shangguan, Yanbin Kang, Yihan Cao, Ruijie Jiang, Qiannan Yin, Chang Yue 等

**🗣️ 大白话：** 在 LinkedIn 上给"高端人才"做推荐，不能照搬社交网络的"相似人推荐"——求职者想看的是招聘者，不是和自己履历差不多的同行。PAIR 干的事就是把"画像相似度"换成"意图互补匹配"，直接在生产环境里跑通了一套基于偏好的大规模检索。

**🔬 专业讲解：** 论文的核心观察是：职业网络中的相关性是"互补"而非"对称"的，传统基于 profile 相似度或社交信号（共同好友）的检索范式在这里失效。PAIR 受 Direct Preference Optimization（DPO）的偏好学习视角启发，但把偏好学习实例化为 exposure-conditioned multi-negative 对比学习目标，直接作用在 embedding 上——无需显式 reference model，训练更简单，且能高效扩展到超大候选集。另外，它通过带位置编码的点击历史聚合来刻画时序，用户表示可以在固定历史窗口上以常数代价增量更新，新交互无需重新编码整个历史。对于所有"跨角色、意图驱动"场景（招聘匹配、买家-卖家、创作者-消费者等）的人/物推荐，这篇是很好的工程范式参考。

---

### 3. UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents

📄 [arXiv:2610.30932](https://arxiv.org/abs/2610.30932) | 电商智能体推荐基准 | Jujia Zhao, Jiakai Tang, Jing Yu, Wen Chen, Jian Wu, Han Zhu 等

**🗣️ 大白话：** 未来的推荐可能是"购物智能体"替用户逛好几轮再下单，但怎么评估这种智能体？现有模拟器要么交互太短、要么不是真实用户数据。UserArena 拿出了 6 万多条真实用户长会话轨迹，还能和线上 A/B 实验结果对齐验证——相当于给购物 Agent 模拟器建了个"真值考场"。

**🔬 专业讲解：** Agentic recommendation 需要通过一串依赖上下文的决策来达成购物目标，其开发与评估依赖忠实的"推荐世界模型"（同时建模交互式购物环境与用户行为响应）。UserArena 提供 64,729 条来自 11,010 个用户的真实会话轨迹，覆盖 566,102 个商品和 13 种动作类型，支持与受控生产 A/B 测试结果进行离线校验（offline validation），并提出五级评估体系：从输出合法性、局部决策，到序列行为、个性化，再到最终结果。为提升模拟器在长程交互上的保真度，作者提出 On-Policy Trajectory Distillation（OPTD）：用轨迹级 intent 在学生模型自己生成的 rollout 上提供稠密教师监督，在 UserArena 评估协议下取得最强整体保真度，且在离线模拟中最接近复现生产策略的真实效果。做 Agent 推荐和用户模拟方向的同行的必读基准。

---

### 4. Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation

📄 [arXiv:2610.30825](https://arxiv.org/abs/2610.30825) | 跨域序列推荐 | Ziang Lu, Yu Zhang, Xinzhe Jiang, Lei Sang, Yiwen Zhang

**🗣️ 大白话：** 跨域推荐想把用户在 A 域的兴趣"搬"到 B 域，但每个人的兴趣跨域一致程度不一样——有人两边口味接近，有人完全是两副面孔。BGAFlow 让每个用户自己决定"搬多少、怎么搬"，用贝塞尔曲线当导航路线，把语义迁移变成一条平滑可调的轨迹。

**🔬 专业讲解：** 现有跨域序列推荐多依赖全局对齐目标或粗粒度迁移策略，容易引入跨域无关信息，且无法针对个体差异调整语义表示的适应程度。BGAFlow 提出个性化框架：（1）通过 LLM 推断用户画像、进行双域统一预训练来建立共享语义空间；（2）基于隐兴趣重叠度为每个用户估计"个性化迁移视界"（personalized horizon），决定该用户合适的迁移幅度；（3）构造条件贝塞尔曲线作为几何参照，学习一个 residual flow，依据中间偏好状态逐步细化迁移轨迹，并引入动态偏好反馈调整迁移方向，辅以推荐监督与轨迹正则保证适应平滑有效。真实数据集上一致超越 SOTA 基线。把 flow/曲线几何思想用在跨域偏好迁移上是个挺新颖的视角。

---

### 5. FAIRGate: Agentic Runtime Policy Selection and Verified Repair for Fairer Recommendation Delivery

📄 [arXiv:2610.30359](https://arxiv.org/abs/2610.30359) | IEEE IRAI 2026（已录用） | Navkar Jain, Enock Ayiku, Kenneth Fletcher

**🗣️ 大白话：** 公平性通常在训练时定死一个目标，但线上每个请求的情况都不一样：候选池、曝光欠债、用户偏好都在变。FAIRGate 在排序器和最终 top-K 之间加了个"智能体调度员"：实时从策略库里挑一个公平策略执行，改完还要过一道"验收员"关卡，不合格就打回。

**🔬 专业讲解：** FAIRGate 是一个模型无关的投放层控制器（delivery controller），在 base ranker 与最终 top-K 之间插入 agentic 策略选择层。关键设计是"agent 不发明公平性，只做选择"：策略库预定义了长尾曝光、物品组曝光均衡、集中度控制、校准保护与弃权（abstention）等策略；确定性执行器通过约束修复（constrained repair）落实所选策略；验证器仅在相关性、可行性、元数据、校准与审计约束全部满足时接受结果；LLM 组件只在排序决策固定后拿到经过验证的审计轨迹，生成有证据链的说明文字。这样 agent 拥有运行时职责，但公平性执行是可度量、有界、可重放的。"agent 选择 + 确定性执行 + 验证器守门"的架构对任何需要在生产中引入 LLM 决策、又怕它放飞自我的场景都有借鉴意义。

## 📋 其他论文速览

- **The Fusion Tax: A Diagnostic Analysis of When Hybrid Retrieval Hurts**（arXiv:2610.30612）：混合检索（BM25+稠密）虽整体涨点，但在 8–21% 的查询上反而比纯稠密检索差，作者称之为"融合税"——"不融合"应被视为一等公民选项，RRF 在稠密明显更强时税更重。
- **IRAH: Hierarchical Agentic Tree Search for Retrieval Pipeline Optimization**（arXiv:30167）：用 LATS 式分层树搜索（先选宏观结构、再调参数）+ 离线元学习热启动，自动优化 RAG 检索 pipeline，nDCG@10 最高提升 6.4%。
- **Getting a GRIP on Graph-Based Search for Learned Sparse Retrieval**（arXiv:2610.30425）：把图搜索引入学习型稀疏检索（SPLADE 一类）的倒排遍历，8 页短文。
- **Lychee: Certified Screening of Inverted Lists for High-Recall Vector Search**（arXiv:2610.30697）：高召回向量检索中带"认证保证"的倒排表剪枝筛选。
- **Deep Search in Real-World Web Environments**（arXiv:2610.30181）：真实 Web 环境下的深度搜索智能体研究。
- **When Agentic Retrieval Fails Silently**（arXiv:2610.30423）：来自创意 AI 助手的生产证据，揭示智能体检索"静默失败"现象，投稿 CHIIR 2027。
- **Compiling Autoregressive LLM Control into Policy-Exact Parallel Inference for Hierarchical RAG**（arXiv:2610.30664）：把自回归 LLM 控制编译为策略精确的并行推理，加速分层 RAG。
- **QProtFuse: Query-Guided Layer Fusion for Retrieval-Augmented Protein Function Prediction**（arXiv:2610.30180）：检索增强助力蛋白质功能预测。
- **Chunk Recomputation under Real Document Revisions**（arXiv:2610.31019）：文档真实修订场景下 RAG 分块更新的成本与检索质量权衡，AIBDCC 2026 录用。
- **Protection Is Not One Event: A Survey of RAG Protection Research**（arXiv:2610.30193）：按"防护端点"维度梳理 RAG 安全防护研究综述。
- **Data-Void Exploits in Web-Searching LLMs**（arXiv:2610.30365）：针对联网搜索 LLM 的 data void 攻击面分析（NDSS 版本扩展）。
- **FormBench: A Benchmark for Fine-Grained Retrieval in Formulation Patents**（arXiv:2610.30175）：配方专利细粒度检索基准，数据集与代码已开源。
- **FlexVDR: Learning to Allocate Matryoshka Representation Budgets for Visual Document Retrieval**（arXiv:2610.30177）：用 Matryoshka 表征做视觉文档检索的自适应维度预算分配。
- **Journal Basket**（arXiv:2610.30544）：支持跨学科文献检索与方法透明性的工具研究。
- **Lean Finder V2**（arXiv:2610.30843）：面向 Mathlib 数学库的语义搜索，聚焦查询歧义消解。
- **SurveyGraph**（arXiv:2610.31317）：基于"方法-实体"知识图谱自动生成学术综述，EMNLP 2026 Findings。
- **Better Reasoning, Not Just Bigger Models**（arXiv:2610.30611）：训练-free 的结构化不确定性削减框架 SGUR，在医疗诊断基准上以约 1/5 的 token 量超过最强 Graph-RAG 基线 9.4 个点。
- **Association between Player Perception and AI Disclosure on Steam**（arXiv:2610.30178）：Steam 游戏 AI 披露与玩家感知关系的探索性研究。
