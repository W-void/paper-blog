---
title: "【推荐系统 Paper 日报】2026-06-27"
date: 2026-06-27
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2771800376"
---

# 【推荐系统 Paper 日报】2026-06-27

## 📊 今日概览

arXiv cs.IR 最新公告日期为 **Fri, 26 Jun 2026**，共收录 **22** 篇论文，其中与推荐系统直接相关的 **5** 篇。本期亮点：两篇来自工业界的大厂实践（NOVA 和 AgentX），分别从「架构进化自动化」和「推荐算法自迭代」两个角度探索 AI Agent 在工业推荐系统中的应用；UniFormer 提出统一模型中心缩放框架，TRUST 从时间信号校准角度切入 session-based 推荐，还有一篇跨平台金融推荐的工作。

## 🔥 推荐系统论文深度解读

### 1. NOVA: A Verification-Aware Agent Harness for Architecture Evolution in Industrial Recommender Systems

📄 [arXiv:2606.27243](https://arxiv.org/abs/2606.27243) | 工业广告推荐系统 | Shaohua Liu, Liang Fang, Yilong Sun, et al.

**🗣️ 大白话：** 工业广告推荐模型的架构升级（比如 RankMixer、MixFormer 这些）目前高度依赖专家经验，难以规模化。NOVA 就是一个「AI 架构师」——它能自动探索推荐模型架构的改进方案，但关键不是简单生成代码，而是有一个多层验证机制（结构语义检查 → 本地可执行性 → 离线效果 → 线上 A/B 测试），把不合格的方案早早筛掉，避免「代码能跑但性能拉胯」的静默失败。

**🔬 专业讲解：** NOVA 的核心是 **Architecture Gradient**，一种受 SGD 启发的非可微更新信号，它会聚合历史修改记录、验证诊断、指标反馈和轨迹记忆来指导下一步的架构修改。整个系统采用 L1-L4 四级任务分级控制：低风险任务全自动化，高风险任务（如从文献到生产环境）转交人类 Copilot 审核。线上 A/B 测试显示，NOVA 产出的架构在三个 pCVR 目标上分别提升 GMV +1.25%、+1.70%、+2.02%，同时显著降低预测偏差。

---

### 2. AgentX: Towards Agent-Driven Self-Iteration of Industrial Recommender Systems

📄 [arXiv:2606.26859](https://arxiv.org/abs/2606.26859) | 快手工业推荐系统 | Changxin Lao, Fei Pan, Guozhuang Ma, et al.

**🗣️ 大白话：** 推荐算法的迭代长期靠「人想点子 → 改代码 → 做实验 → 看结果」的手工作坊模式，创新速度跟工程师人数成正比。AgentX 想做的是「推荐算法自己迭代自己」——一个多 Agent 闭环系统，能自己提出想法、自己写代码、自己上线实验、自己从结果中学习，然后继续优化。

**🔬 专业讲解：** AgentX 包含四个紧耦合阶段：
1. **Brainstorm Agent**：综合历史实验、系统架构、数据分析和外部研究，生成可执行的实验提案；
2. **Developing Agent**：将提案转化为生产级代码，通过仓库感知的生成和多维度可靠性验证；
3. **Evaluation Agent**：安全线上灰度，通过 guardrail 机制进行 A/B 判定，将成功和失败都沉淀为结构化知识；
4. **SGPO (Harness Evolution)**：从执行轨迹中提炼语义梯度，持续优化 Agent 本身。

关键是，AgentX 不仅自动化，而是**自我进化**——每次实验的结果都会反过来提升 Agent 的能力。

---

### 3. UniFormer: Efficient and Unified Model-Centric Scaling for Industrial Recommendation

📄 [arXiv:2606.27058](https://arxiv.org/abs/2606.27058) | 快手工业推荐系统 | Bo Chen, Jinlong Jiao, Tijian Hu, et al.

**🗣️ 大白话：** 推荐模型之前做 scaling 都是「各个模块分别放大」——比如单独放大行为建模模块，或者单独放大特征交互模块。UniFormer 想做一个「统一放大」的框架，让特征空间和任务空间能协同 scaling，同时通过语义分词实现用户-物品解耦，加速推理。

**🔬 专业讲解：** UniFormer 把整体建模空间分解为 **Feature Space** 和 **Task Space**，分别用堆叠的 Feature-space Interaction Module 和 Task-space Interaction Module 建模。关键设计包括：
- **Semantic-based Tokenization**：实现用户-物品解耦，支持请求级推理加速；
- **Multi-sequence Cross-Attention**：分别捕获异构行为模式，避免偏好坍缩；
- **Multi-view FFNs**：支持跨不同建模组件的灵活参数缩放。

在快手和快手极速版两个生产场景的 A/B 测试中，App Stay Time 分别提升 +0.101% 和 +0.260%，Watch Time 提升 +0.729% 和 +1.113%。

---

### 4. TRUST: Item-Calibrated Interval Evidence for Temporal Session-Based Recommendation

📄 [arXiv:2606.27214](https://arxiv.org/abs/2606.27214) | Session-Based RecSys | Linjiang Guo, Nitin Bisht, Shiqing Wu, et al.

**🗣️ 大白话：** 做 session-based 推荐时，大家都喜欢把时间间隔当信号用——比如用户隔了多久才点击下一个物品。但 TRUST 发现了一个被忽略的问题：不同物品的时间间隔分布本来就不同，你把「3 分钟」套在所有物品上是不公平的。TRUST 的做法是「按物品校准」——每个时间间隔都要相对于该物品的历史分布来看。

**🔬 专业讲解：** TRUST 提出一个 **score function**，用于评估每个观测时间间隔相对于对应物品的实证分布的位置。这个分数被用到三个环节：
1. **全局邻居采样**：根据校准后的时间分数选择相关邻居；
2. **Session Graph 编码**：用校准后的时间信号构建图；
3. **兴趣聚合**：基于校准后的时间证据做最终预测。

实验表明，TRUST 在公开数据集上持续优于 temporal 和 non-temporal baseline。更关键的是，这个 score function 可以作为**即插即用**的方法，提升现有 temporal session recommender 的性能。

---

### 5. From Clicks to Intent: Cross-Platform Session Embeddings with LLM-Distilled Taxonomy for Financial Services Recommendations

📄 [arXiv:2606.26277](https://arxiv.org/abs/2606.26277) | 金融推荐/跨平台用户建模 | Dianjing Fan, Yao Li, Kyaw Hpone Myint, et al.

**🗣️ 大白话：** 金融服务的推荐有个特殊难题：用户在网页端（未登录）和 App 端（已登录）的行为差异巨大——网页端在「探索产品」，App 端在「管理账户」。但由于跨渠道用户身份难以打通，网页端的意图信号长期被浪费。这篇论文的做法是：把网页端的点击流编码成 session embedding，同时用 LLM 生成可解释的金融意图标签，两个产出可以分别服务于「定量推荐」和「定性理解」。

**🔬 专业讲解：** 该框架产出两个互补输出：
- **Self-supervised Transformer** 编码多模态点击流为紧凑的 session embedding；
- **LLM-based Taxonomy Generation & Distillation** 生成可解释的意图标签。

在生产环境验证中：
- 移动端首页 tile 排序任务：Recall@1 提升 1.88%，Log Loss 降低 13.38%；
- 用户转化预测任务：embedding 比 LLM 标签的 micro F1 高 4.3%，而蒸馏层以超低延迟提供可解释标签，性能仅下降 7%。

## 📋 其他论文速览

- **GPUSparse**（2606.26441）：GPU 加速的稀疏检索，并行倒排索引设计。
- **TileMaxSim**（2606.26439）：GPU 上的 IO-Aware MaxSim 打分，结合维度分块和量化。
- **Scoring Is Not Enough**（2606.26369）：探讨排序中效用与公平性的 trade-off 差距。
- **Attributed, But Not Incremental**（2606.26690）：大规模广告中的 cannibalization-corrected attribution 方法。
- **Hybrid privacy-aware semantic search**（2606.26373）：SVD 截断文档几何 + CKKS 加密查询重排序。
- **ProvenAI**（2606.26449）：生成答案中的 provenance-native 证据溯源。
- **SocialPersona**（2606.26654）：多模态社交媒体上下文下的个性化画像与回复基准测试。
