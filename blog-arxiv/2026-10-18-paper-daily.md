---
title: "【推荐系统 Paper 日报】2026-10-18"
date: 2026-10-18
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2792019573"
---

# 【推荐系统 Paper 日报】2026-10-18

## 📊 今日概览

本期覆盖 arXiv cs.IR 10月16日（周五）公告的 14 篇新论文，其中推荐系统相关 2 篇。今日最大亮点：Meta 的 TransX 工业级推荐框架在生产 A/B 中 CTR +6.02%，以及 CIKM 2026 接收的 RecSoup 用模型合并实现可控多目标推荐，推理时延降低两个数量级。此外检索方向也有多篇精彩工作（推理式检索、稀疏检索 LLM 化、RAG 证据利用失败分析）。

## 🔥 推荐系统论文深度解读

### 1. RecSoup: Efficient Model Merging Approach for Controllable Multi-Objective Recommendation

📄 [arXiv:2610.21220](https://arxiv.org/abs/2610.21220) | CIKM 2026 | Zidong Jia, Guofu Xie, Xiao Zhang

**🗣️ 大白话：** 推荐系统经常要同时照顾好几个互相打架的目标——点击率、转化率、停留时长，顾此失彼是常态。以前的办法要么推理时重新排序（能调的空间小），要么训练一个"参数生成器"按需生成模型权重（贵得离谱）。RecSoup 的思路特别讨巧：既然已经有每个目标的专属模型了，直接把它们"合并"起来，学一个小映射——你说想要什么偏好组合，它就算出一组混合系数，现场把模型按比例调和。不用重新训练，推理还快了 165~228 倍。

**🔬 专业讲解：** 该工作针对可控多目标推荐（CMOR）任务，指出直接模型合并的两大障碍：目标专属模型缺乏共享线性模式（shared linear regime）、参数跨目标干扰。RecSoup 分两阶段解决：① 剪枝阶段联合考虑目标特定重要性（objective-specific importance）与跨目标相关性（cross-objective relevance），缓解参数干扰；② 合并阶段学习偏好到系数（preference-to-coefficient）的映射，实现推理期动态权衡，无需联合重训练或额外的参数生成模块。理论上证明 RecSoup 相比参数生成范式可完整遍历 Pareto 前沿且不受平滑性约束，在效果和效率上均占优。多基准实验显示 Pareto 前沿质量与可控性均提升，推理时延较参数生成方法降低 165–228 倍。

---

### 2. TransX Technical Report: Scaling Sequence Transduction for Recommendation

📄 [arXiv:2610.20913](https://arxiv.org/abs/2610.20913) | 工业技术报告（Meta） | Da Xu, Liyan Fang, Divya Venugopalan 等

**🗣️ 大白话：** 这是 Meta 交出的一份工业级答卷：怎么把推荐模型做大做快还不烧钱。TransX 把推荐模型拆成三块独立扩容的组件——序列编码器（看用户历史）、行为记忆（存住关键状态）、候选融合（结合候选物品做预测），各自可以单独加码。最有意思的发现是"各向异性的缩放收益"：编码器加深到一定程度就饱和了，继续堆算力不如加强候选融合那一层。生产 A/B 实测 CTR +6.02%、转化 +4.45%，而通过把训练和推理的计算"分期付款"，单次请求的模型算力做到基线的 5 倍但总成本不涨。核心结论一句话：推荐模型的在线服务成本不必随模型容量线性增长。

**🔬 专业讲解：** TransX 是面向工业推荐的序列转导（sequence transduction）框架与协同设计的基础设施，将序列编码、行为记忆（behavior memory）与候选条件化融合（candidate-conditioned fusion）解耦为独立可扩展组件。训练侧沿行为前缀（behavioral prefixes）摊销因果轨迹计算，并将记忆状态扇出（fan-out）至各候选；服务侧通过紧凑的行为记忆 KV 将批量 prefill、近线刷新与在线预测分列（disaggregation）。实验揭示各向异性缩放规律：固定记忆分辨率与融合容量时编码器深度存在饱和点；监督信号增强时最优算力配比向候选融合侧移动；保持质量所需的记忆分辨率随模型容量增长基本稳定。模型在点击与转化上联合训练，共享行为接口经后训练（post-training）适配检索与偏好排序任务。生产 A/B：核心模型 CTR +6.02%、CV +4.45%；后训练检索/排序变体分别 CTR +2.96%、CV +1.33%。同等训练条件下监督目标吞吐 +84%；服务分列使总服务成本较同位部署降低近 80%，同等成本下单请求模型 FLOPs 达 HSTU 风格基线的约 5 倍，同 FLOPs 下单 H200 请求吞吐约 4 倍。

---

## 📋 其他论文速览

- **GACC-Bench**（arXiv:2610.21893）：评测 LLM"目标自适应上下文压缩"的新基准，500 个目标、2571 个问题，发现即使最强模型与全上下文表现仍有明显差距。
- **Aligning LLMs with Sparse Retrieval via Adaptive Sparse Supervision**（arXiv:2610.21877）：用 SPLADE 激活质量动态截断做 LLM 稀疏检索对齐，索引存储降 6.4 倍、端到端查询时延降 11 倍以上。
- **VoteGEO-Bench**（arXiv:2610.21330）：研究"生成式引擎优化"对选举信息可见性的影响，指定目标的改写策略才能有效提升曝光，显式党派身份造成的曝光差距比单页改写收益更大。
- **Learning When to Think (AURA)**（arXiv:2610.21030）：EMNLP 2026 Findings，用信息效用引导推理式检索的自适应深度，BRIGHT 上 nDCG@10 达 34.7，时延从 4.6 秒降到 0.76 秒。
- **Idea2Prior**（arXiv:2610.20857）：从模糊研究想法出发的可审计论文检索系统，Hit@5 达 53.3%，超过 ChatGPT/Gemini Deep Research。
- **Information-Gain Calibrated On-Policy Distillation**（arXiv:2610.20664）：发现深度搜索智能体蒸馏中的"证据盲监督"问题，用检索后信息增益重新校准监督分配，4B 学生反超 8B 老师。
- **CARA**（arXiv:2610.22017）：因果导向的图检索智能体，用"后果性"和"必要性"双标准评估证据因果相关性，检索更少节点、答案质量更高。
- **Retrieved but Not Read**（arXiv:2610.21731）：揭示搜索增强 LLM 为何"检索到了却不读"——只看摘要不点原文导致过时答案，证据可用性与实际使用之间存在鸿沟。
- **Making every stage of medical device document assessment deterministic**（arXiv:2610.21300）：将医疗设备合规评估全链路（OCR→检索→推理）做到字节级确定性输出，可审计可复现。
- **TRACER**（arXiv:2610.21267）：面向 LLM 智能体的轨迹感知工具检索，仅暴露 128 个工具中的 5 个即可提升工具选择准确率 4.7 点，输入 token 降 80%。
- **SSR**（arXiv:2610.21113）：多智能体系统中免训练的 Agent Card 结构化检索，1000 智能体规模下 LLM 输入降 98.8%、编排时延降 70.9%。
- **ReviewPilot**（arXiv:2610.21042）：自动化 PRISMA 系统综述流程的多智能体系统，筛查宏 F1 达 0.776，每个决策附理由与出处。
