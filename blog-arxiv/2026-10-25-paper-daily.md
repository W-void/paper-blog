---
title: "【推荐系统 Paper 日报】2026-10-25"
date: 2026-10-25
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2794690590"
---

# 【推荐系统 Paper 日报】2026-10-25

## 📊 今日概览

本期覆盖 arXiv cs.IR 于 10 月 23 日（周五）公告的 27 篇新论文，其中与推荐系统直接相关的有 5 篇，整体质量颇高：LinkedIn 的工业级"意图检索"方案、快手 OneRec 团队把推理搬进隐空间的 OneLatent（线上收入 +9.6%）、以及电商场景超长会话模拟基准 UserArena 都值得关注。

## 🔥 推荐系统论文深度解读

### 1. OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models

📄 [arXiv:2610.30675](https://arxiv.org/abs/2610.30675) | 工业落地（快手） | Hao Jiang, Peiru Du, Pengfei Yao, Mengting Li, Siyuan Lou, Kuo Cai, Sheng Yu, Qiang Luo, Jian Liang, Ruiming Tang, Fei Pan, Peng Jiang, Wenwu Ou

**🗣️ 大白话：** 现在流行让 LLM 在推荐里"先想后答"（Think-then-Answer），问题是想得太啰嗦——线上每来一个请求都要生成一大段推理文本，成本扛不住。这篇来自快手 OneRec 团队的工作干脆把"思考过程"压缩成几个可学习的隐向量（latent tokens）：模型在隐空间里"默默想完"再直接给答案，完全不用吐出推理文字。训练时分多视角生成多样化 CoT 老师信号，再分三阶段把 CoT 内化进 latent token，配课程式后训练激活。

**🔬 专业讲解：** OneLatent 提出三层设计：① Multi-View Adaptive CoT（MV-ACoT），从多视角探索用户兴趣并自适应调整每个样本的推理复杂度，产出高质量教师监督；② 三阶段 latent-token 对齐范式，在预训练 FRM（foundation recommendation model）基础上将显式 CoT 轨迹渐进内化为可学习 latent token，实现 Latent-Reason-then-Answer；③ 多阶段课程化后训练激活下游推理。效果上，在快手工业数据集与公开 Kuaishou LLM-Rec 基准上，SID@64 相比 Think / No-Think 两个 FRM 变体分别提升 17.44% / 9.33%，在线推理吞吐提升 17 倍以上；配合自建的生产级实时 FRM 推理系统，在快手本地生活广告场景 A/B 实验中相对 OneRec、OneReason 等强基线带来约 9.6% 收入提升。对做 LLM 推荐推理的同学，这是"隐式推理替代显式 CoT"路线目前最有说服力的工业验证。

---

### 2. PAIR: Preference-Aligned Intent Retrieval for Premium People Recommendation at LinkedIn

📄 [arXiv:2610.30941](https://arxiv.org/abs/2610.30941) | 工业落地（LinkedIn） | Zhongkai Shangguan, Yanbin Kang, Yihan Cao, Ruijie Jiang, Qiannan Yin, Chang Yue, Zijian Zhou, Girish Kathalagirou, Changshuai Wei, Zhengming Xing

**🗣️ 大白话：** 在职场社交里，"相似"不等于"匹配"：求职者想联系的是招聘者，而不是另一个和自己简历差不多的人。通用 embedding 按"资料相似度"训练，在这种跨角色互补场景天然会排错序。LinkedIn 的 PAIR 框架改为建模"意图偏好"：借鉴 DPO 的偏好学习思想，但不用参考模型，而是把偏好学习实例化为"曝光条件下的多负例对比学习"，训练简单、对海量候选集也能高效扩展。

**🔬 专业讲解：** 技术上两个亮点：其一，将 DPO 的偏好视角转写为 exposure-conditioned multi-negative contrastive objective，直接在 embedding 空间对齐跨角色互补意图，免去显式 reference model 与 RLHF 式流程；其二，个性化侧用位置编码聚合点击历史，在固定历史窗口上实现常数代价的用户表征增量更新——新交互进来不用重新编码全部历史，也无需线上反复调用 LLM 推理，轻量 CPU 运算即可刷新个性化。在 LinkedIn Premium 人才检索任务上，仅 0.6B 参数的模型即取得 MAR@100 = 0.45。对"互补匹配 vs 相似匹配"这一经典难题给出了工业级的解法参考。

---

### 3. UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents

📄 [arXiv:2610.30932](https://arxiv.org/abs/2610.30932) | 基准/模拟器 | Jujia Zhao, Jiakai Tang, Jing Yu, Wen Chen, Jian Wu, Han Zhu, Fei Sun, Suzan Verberne, Zhaochun Ren

**🗣️ 大白话：** Agentic Recommendation（让 AI 代理替用户逛、替用户买）火了，但怎么评估这些"购物代理"？真实用户的长程交互轨迹数据太稀缺，模拟器又太假。UserArena 拉来真实电商的 64,729 条会话轨迹（11,010 个用户、56 万+ 商品、13 种动作类型），配上可交互环境，还能对着一次受控的生产 A/B 实验做离线验证——从输出合法性到个性化再到最终结果，提供五级评估。

**🔬 专业讲解：** 论文的核心贡献有二：① 构建目前最大规模的电商交互式用户模拟基准，首次支持轨迹级评估与"对齐生产 A/B 结论"的离线校验，评估维度覆盖输出有效性、局部决策、序列行为、个性化与结果五个层级；② 提出 On-Policy Trajectory Distillation（OPTD）：以轨迹级意图为密集教师目标，直接在学生自生成的 rollout 上做蒸馏，缓解传统模拟器在长程交互上的误差累积与分布漂移。实验显示 OPTD 在 UserArena 评估协议下保真度最强，且离线模拟最能复现生产策略的真实效果。做 agent 推荐或用户模拟的团队，这套基准+蒸馏方案值得直接复用。

---

### 4. BGAFlow: Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation

📄 [arXiv:2610.30825](https://arxiv.org/abs/2610.30825) | 学术论文 | Ziang Lu, Yu Zhang, Xinzhe Jiang, Lei Sang, Yiwen Zhang

**🗣️ 大白话：** 跨域序列推荐想用 A 域的知识救 B 域的数据稀疏/冷启动，但每个人的跨域偏好一致性差别很大——有人两个平台口味接近，有人完全分裂。现有方法一股脑做全局对齐，等于把不相关的偏好也搬过去了。BGAFlow 的思路是"按人定量搬运"：先预估每个用户该迁移多少（personalized horizon），再用贝塞尔曲线当几何参考轨道，学一个残差流逐步把语义表示平滑演化到位。

**🔬 专业讲解：** 框架分三步：① 双域统一预训练构建共享语义空间，用户画像由 LLM 推断增强；② 基于潜在兴趣重叠估计每个用户的个性化迁移范围（horizon），决定"搬多少"；③ 以条件贝塞尔曲线为几何参照，学习残差流（residual flow）沿中间偏好状态渐进精化轨迹，动态偏好反馈调整迁移方向，推荐监督+轨迹正则保证适配有效且平滑。真实数据集上稳定超过 SOTA 基线。亮点在于把"迁移程度个性化"显式建模，而不是用统一的域对齐损失一刀切。

---

### 5. FAIRGate: Agentic Runtime Policy Selection and Verified Repair for Fairer Recommendation Delivery

📄 [arXiv:2610.30359](https://arxiv.org/abs/2610.30359) | IRAI 2026（IEEE 首届负责任 AI 会议） | Navkar Jain, Enock Ayiku, Kenneth Fletcher

**🗣️ 大白话：** 推荐公平性 usually 是训练时定一个目标、或者上线后套一个固定的重排规则。但实际线上每个请求的情况都不一样：候选池、曝光欠账、用户偏好历史都在变。FAIRGate 在排序器和最终 top-K 之间加了一层 Agent：它不从零发明公平目标，而是从预定义策略库里现场选一条（长尾曝光、分组曝光均衡、集中度控制、校准保护、弃权），再由确定性执行器做约束修复，校验器验收通过才放行。

**🔬 专业讲解：** 架构上的关键取舍是"agent 只负责选择，执行与校验全部确定性化"：策略库覆盖 long-tail exposure、item-group exposure balance、concentration control、calibration protection 与 abstention；deterministic executor 执行约束修复；validator 检查相关性、可行性、元数据、校准与审计约束全部满足后才接受结果；LLM 组件只拿到已验证的审计轨迹，在排序决策固定之后生成带证据的叙述。这样公平性执行是可度量、有界、可重放的，agent 的自由度被限制在策略选择层，避免了"LLM 直接改排序结果"的不可控风险。模型无关，可直接插到现有 ranker 后面，IRAI 2026 录用。

---

## 📋 其他论文速览

- **The Delayed Countdown Method for Validating Review-Oriented AI Workflows in eDiscovery**（arXiv:2610.31311）：面向 eDiscovery 审阅型 AI 工作流的"延迟倒计时"验证方法。
- **The Fusion Tax: A Diagnostic Analysis of When Hybrid Retrieval Hurts**（arXiv:2610.30612）：系统诊断混合检索（BM25+向量）何时反而拖后腿，给出"融合税"分析框架。
- **Lychee: Certified Screening of Inverted Lists for High-Recall Vector Search**（arXiv:2610.30697）：带认证保证的倒排链筛选，提升高召回向量检索效率。
- **Getting a GRIP on Graph-Based Search for Learned Sparse Retrieval**（arXiv:2610.30425）：图搜索结构用于学习型稀疏检索的 GRIP 方法。
- **When Agentic Retrieval Fails Silently: Framework and Production Evidence from a Creative AI Assistant**（arXiv:2610.30423）：生产环境实证 agentic 检索的"静默失败"问题并提出分析框架。
- **IRAQ/IRAH: Hierarchical Agentic Tree Search for Retrieval Pipeline Optimization**（arXiv:2610.30167）：层次化 agentic 树搜索自动优化检索流水线。
- **Deep Search in Real-World Web Environments**（arXiv:2610.30181）：真实 Web 环境下的深度搜索系统研究。
- **FlexVDR: Learning to Allocate Matryoshka Representation Budgets for Visual Document Retrieval**（arXiv:2610.30177）：为视觉文档检索自适应分配 Matryoshka 嵌入维度预算。
- **FormBench: A Benchmark for Fine-Grained Retrieval in Formulation Patents**（arXiv:2610.30175）：配方专利细粒度检索基准。
- **Lean Finder V2: Semantic Search for Mathlib That Disambiguates User Queries**（arXiv:2610.30843）：面向 Mathlib 的消歧语义搜索。
- **Chunk Recomputation under Real Document Revisions**（arXiv:2610.31019）：真实文档修订下固定/递归/内容定义分块的更新成本与检索质量对比。
- **Data-Void Exploits in Web-Searching LLMs**（arXiv:2610.30365）：揭示面向 Web 搜索 LLM 的数据真空（data void）攻击面。
- **Protection Is Not One Event: A Survey of RAG Protection Research by Measured Endpoint**（arXiv:2610.30193）：按防护端点度量的 RAG 安全研究综述。
