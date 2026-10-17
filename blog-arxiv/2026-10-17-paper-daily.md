---
title: "【推荐系统 Paper 日报】2026-10-17"
date: 2026-10-17
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2791919368"
---

# 【推荐系统 Paper 日报】2026-10-17

## 📊 今日概览

本期覆盖 arXiv cs.IR 于 2026-10-16（周五）公告的最新 14 篇论文，其中推荐系统方向 2 篇，但含金量极高：一篇是快手系团队提出的可控多目标推荐模型合并方案 RecSoup（CIKM 2026），推理速度比参数生成范式快 165-228 倍；另一篇是工业级序列推荐基础框架 TransX，线上 A/B 将 CTR 拉升 6.02%。其余论文集中在 LLM 检索、搜索智能体与 RAG 评测方向，同样值得关注。

## 🔥 推荐系统论文深度解读

### 1. RecSoup: Efficient Model Merging Approach for Controllable Multi-Objective Recommendation

📄 [arXiv:2610.21220](https://arxiv.org/abs/2610.21220) | CIKM 2026 | Zidong Jia, Guofu Xie, Xiao Zhang

**🗣️ 大白话：** 推荐系统经常要同时顾好几个"打架"的目标——点击率、转化率、时长、多样性，想要哪种组合就得重新训练一个模型，成本高得离谱。RecSoup 的思路是：把多个只优化单一目标的模型"熬成一锅汤"——先剪掉各模型间互相干扰的参数，再学一个"偏好→合并系数"的小映射，推理时你说想要什么口味的目标配比，它当场给你调出一个对应的模型，全程不用重新训练。

**🔬 专业讲解：** 论文针对可控多目标推荐（CMOR）提出两阶段模型合并方案。第一阶段通过联合考虑目标特有重要性与跨目标相关性的剪枝策略，缓解多目标参数干扰、建立共享线性区域；第二阶段用可学习的 preference-to-coefficient 映射做自适应参数合并，在推理时实现无重训练的动态权衡控制。理论上作者证明 RecSoup 不受平滑性约束、可完整遍历 Pareto 前沿，效果与效率均优于参数生成范式。实验显示其 Pareto 前沿质量与可控性更优，推理时延比参数生成方法低 165-228 倍。

---

### 2. TransX Technical Report: Scaling Sequence Transduction for Recommendation

📄 [arXiv:2610.20913](https://arxiv.org/abs/2610.20913) | 工业技术报告 | Da Xu, Liyan Fang, Divya Venugopalan 等（Meta/Instagram 方向团队）

**🗣️ 大白话：** 这是那种一年见不到几篇的"重量级工业报告"：把推荐系统当成一个序列转译问题来重新设计——用户行为编码、行为记忆、候选融合三个组件各自独立扩容，训练时把因果轨迹计算摊销到行为前缀上，线上服务则把"大块预计算"和"实时预测"拆开部署。结果非常硬核：核心模型 CTR +6.02%、转化 +4.45%，服务成本还降了近 80%，同等成本下模型算力能开到 HSTU 基线的 5 倍。一句话：推荐模型的容量可以涨，但线上成本不必跟着涨。

**🔬 专业讲解：** TransX 将序列编码、行为记忆（behavior memory）与候选条件化融合（candidate-conditioned fusion）解耦为可独立扩展的组件：训练侧按行为前缀摊销因果轨迹计算，并将记忆状态扇出给各候选；服务侧通过紧凑的行为记忆 KV，将批量 prefill、近线刷新与在线预测 disaggregation 分离。作者观察到"各向异性扩展回报"：编码器深度在固定记忆分辨率下会饱和、监督信号增加时扩容前沿应偏向融合模块、而记忆分辨率需求随模型容量增长基本稳定。生产 A/B 中核心模型 CTR +6.02%、CVR +4.45%；后训练的检索与偏好排序变体分别带来 CTR +2.96% / CVR +1.33%；训练吞吐 +84%，disaggregation 服务在同等流量与 SLO 下总成本降低近 80%，同成本下单请求模型 FLOPs 约为 HSTU 基线的 5 倍，同 FLOPs 下单 H200 吞吐约 4 倍。

---

## 📋 其他论文速览

- **GACC-Bench: Benchmarking Goal-Adaptive Context Compression Ability across LLMs**（arXiv:2610.21893）：提出目标自适应上下文压缩基准，500 目标 / 2571 问题，发现即使最强压缩模型与全上下文仍有明显差距。
- **Aligning LLMs with Sparse Retrieval via Adaptive Sparse Supervision**（arXiv:2610.21877）：用 SPLADE 激活质量做动态 α-截断来对齐 LLM 稀疏检索，相比 Lion-sp 索引存储降 6.4 倍、端到端延迟降 11 倍以上。
- **VoteGEO-Bench: Measuring the Impact of Generative Engine Optimization on Electoral Visibility**（arXiv:2610.21330）：研究生成式引擎优化（GEO）在选举信息场景的风险，评估 11 种内容改写策略对生成结果曝光的影响。
- **Learning When to Think: Utility-Guided Adaptive Reasoning for Efficient Text Retrieval**（arXiv:2610.21030）：AURA 框架按"能否区分相关文档与硬负例"监督中间推理状态，BRIGHT 上 nDCG@10 达 34.7，自适应停止将延迟从 4.6s 降到 0.76s。
- **Idea2Prior: Auditable Paper Retrieval and Ranking from Research Ideas**（arXiv:2610.20857）：从一段模糊研究想法出发做可审计的论文检索，Hit@5 达 53.3%，超过 ChatGPT/Gemini Deep Research。
- **Information-Gain Calibrated On-Policy Distillation for Deep Search Agents**（arXiv:2610.20664）：发现在线蒸馏存在"证据盲监督"问题，用检索后信息增益重标定监督分配，4B 学生模型在 MMSearch 上反超 8B 老师。
- **CARA: Causally Guided Retrieval Agent for Question Answering**（arXiv:2610.22017）：免训练检索智能体，用"补充证据是否提升可答性、删除证据是否削弱可答性"两个因果准则指导图检索，效果和忠实度双提升。
- **Retrieved but Not Read: Understanding Why Search-Augmented LLMs Fail to Use Available Evidence**（arXiv:2610.21731）：揭示搜索增强 LLM 常只看摘要片段不点开原文，导致过时答案与不忠实引用，内部表征已"看到"证据但最终输出仍偏爱旧知识。
- **Making every stage of medical device document assessment with LLMs deterministic**（arXiv:2610.21300）：证明从 OCR 到推理全链路字节级确定性可达成，为 LLM 审计与变更控制提供可测试基础。
- **TRACER: Trajectory-Aware Tool Retrieval for LLM Agents**（arXiv:2610.21267）：用 Trie 索引工具调用轨迹做工具检索，只暴露 128 个工具中的 5 个即可提升选择准确率 4.7 点、输入 token 降 80%。
- **SSR: Structural Signal Retriever for Scalable Agent Discovery in LLM-Orchestrated Multi-Agent Systems**（arXiv:2610.21113）：面向千级 Agent 注册表的确定性免训练发现方法，LLM 输入降 98.8%、编排延迟降 70.9%。
- **ReviewPilot: A Multi-Agent System for Screening and Data Extraction in Systematic Reviews**（arXiv:2610.21042）：自动化 PRISMA 文献综述流程的多智能体系统，筛选宏 F1 最高 0.776、抽取 F1 最高 0.788。
