---
title: "【推荐系统 Paper 日报】2026-07-23"
date: 2026-07-23
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2776515285"
---

# 【推荐系统 Paper 日报】2026-07-23

## 📊 今日概览

arXiv cs.IR 今日（Thu, 23 Jul 2026）共更新 **8 篇**论文，其中与推荐系统直接相关的有 **3 篇**，另有 4 篇涉及检索、向量嵌入与 RAG 方向。本期最大看点是两篇被 RecSys'26 接收的论文同时亮相——一篇关注「沉睡用户重激活」，一篇探索「LLM Agent 做个性化推荐」，加上一个大规模排序模型开源基准 UniRank，实用性拉满。

---

## 🔥 推荐系统论文深度解读

### 1. UniRank: Benchmarking Ranking Models for Unified Sequential Modeling and Feature Interaction

📄 [arXiv:2607.19987](https://arxiv.org/abs/2607.19987) | arXiv preprint | Honghao Li, Xianquan Wang, Zibin Zhang, Yi Zhang, Kangyi Lin, Yiwen Zhang

**🗣️ 大白话：**

排序模型领域里，大厂做的东西经常没法复现——数据闭源、代码不开、算力要求还高。这篇论文直接放了一个开源基准叫 UniRank，把 15 个主流统一排序模型拉到一起，在 5 个公开数据集上跑了一遍。最大的数据集有 7 亿条样本，最长的用户行为序列超过 10 万条交互记录。换句话说，以后你想对比排序模型，不用从零搭环境了，直接用他们的工具包就行。

**🔬 专业讲解：**

现代排序模型 increasingly 将序列建模（sequential modeling）和特征交互（feature interaction）统一在一个框架里，但学术界面临的三大痛点是：工业数据不可获取、实现细节不透明、硬件门槛过高。UniRank 通过以下方式解决：

- **Chronological pointwise autoregressive supervision**：按时间顺序的点式自回归监督，统一不同反馈任务（点击、转化、停留时长等）的评估标准。
- **PyTorch 工具包**：内置 DDP 分布式训练、算子优化、混合精度训练、注意力优化等，显著降低硬件要求。
- **15 个代表性模型 + 5 个大规模公开数据集**：覆盖短视频、广告、电商场景，支持 scaling laws 和超长序列建模的研究。

项目已开源，代码和数据见 [GitHub](https://github.com/salmon1802/UniRank)。

---

### 2. Zero-Observation User Reactivation with Gap-Driven Dimensional Gating

📄 [arXiv:2607.19802](https://arxiv.org/abs/2607.19802) | **RecSys 2026** | Jiandong Ding, Tianying Liu, Fuyuan Liu, Huijie Qin, Tiandeng Wu

**🗣️ 大白话：**

用户很久没来了，比如卸载 App 一年后又装回来，这时候推荐系统该怎么给他推东西？这篇论文研究的就是这种「零观测用户重激活」问题——用户之前有历史行为，但中间有一段很长的空白期（gap），平台啥也不知道。他们发现，gap 越长推荐效果越差，一年以上的用户 Hit@10 直接跌到底。然后他们提了一个叫 DeltaGate 的轻量插件，像一个「时间感知路由器」，根据用户沉默多久来决定用多少历史信息、补多少全局先验，效果提升明显，而且只改输出层、冻结主模型，训练参数只有原来的 2-4%。

**🔬 专业讲解：**

问题定义：**Zero-Observation Reactivation**——用户存在 pre-gap 历史行为，但平台在 macro-gap Δt 期间观测不到任何信号。在 Amazon 三个数据集（Video Games、CDs & Vinyl、Movies & TV）上的实验表明，Hit@10 随 gap 增大单调下降，且该趋势在 recurrent（SASRec）、unidirectional、bidirectional（BERT4Rec）等 SR backbone 上均成立。

核心方法 **DeltaGate**：
- 轻量级输出层插件，冻结 backbone，仅引入约 66K 可训练参数（2-4% overhead）。
- 每个表示维度独立路由：在「个性化历史表示」和「零初始化全局先验」之间做选择。
- 路由门控由 Δt 和个性化表示联合条件化。
- 在 >365 天的 Video Games 桶中，DG-SASRec 的 Hit@10 从 0.031 提升到 0.047，DG-BERT4Rec 从 0.025 提升到 0.046。

消融实验设计巧妙：固定个性化表示、只改变 Δt，可以独立观察门控对 gap 输入的响应，避免了 end-to-end retraining 带来的 backbone embedding drift。

---

### 3. Personalized Recommendation Tool Learning via Autonomous Language Agents

📄 [arXiv:2607.19739](https://arxiv.org/abs/2607.19739) | **RecSys'26** | Mingdai Yang, Zhiwei Liu, Weizhi Zhang, Yibo Wang, Hao Peng, Philip Yu

**🗣️ 大白话：**

LLM 做推荐挺火的，但直接让大模型排序几万件商品根本不现实——幻觉严重、上下文长度也扛不住。这篇论文换个思路：让 LLM 当「指挥官」，传统推荐模型当「工具」。LLM 负责分析用户画像、判断哪个推荐工具最适合这个用户，然后调用对应的模型做 full-ranking。相当于把 LLM 的推理能力和传统模型的规模化能力结合了，既避免了幻觉，又解决了长序列问题。

**🔬 专业讲解：**

框架 **PRTA**（memory-based Personalized Recommendation Tool learning via autonomous language Agents）的核心架构：

- **LLM 作为中央 planner**：负责高层推理和个性化工具选择，不直接参与排序。
- **多个传统推荐模型作为 tools**：各自负责 full-ranking scoring，利用其在行为模式建模上的可扩展性。
- **Reflection 机制**：支持 agent 基于用户画像和候选排序列表，评估和比较不同工具的适用性，实现个性化工具选择。

实验在 3 个公开数据集上进行，PRTA 在 full-ranking 推荐性能上同时优于传统推荐基线和纯 LLM-based 基线。该框架的价值在于通过架构设计绕开 LLM 的固有限制（幻觉、上下文长度），而非修改 LLM 本身。

---

## 📋 其他论文速览

- **Using Hierarchical Controlled Vocabularies to Understand CLIP Retrieval Failures in Historical Photo Collections**（arXiv:2607.19836）：用 GLAM 机构的分层受控词表（AAT）分析 CLIP 在历史照片检索中的失败模式，发现词表层级深度和根面类型能解释部分检索差异。

- **CIR at iKAT SCAI 2026: Exploring Clarification Need Prediction in Agentic Conversational Search**（arXiv:2607.19801）：科隆信息检索组在 iKAT SCAI 2026 共享任务中的参与报告，探索对话式搜索中的澄清需求预测。

- **Near-Optimal Dimension Lower Bounds for Single-Vector Embeddings of Maximum Inner Product Similarity**（arXiv:2607.20393）：对最大内积相似度（MAX-IP）的单向量嵌入维度下界进行理论分析，将指数间隙从 1/ε 推进到接近 1/ε²。

- **GraphContainer: A Unified Platform for Comparing and Debugging Graph RAG Methods**（arXiv:2607.19362）：**VLDB 2026 demo**，统一可视化平台，支持多格式图 RAG 工作流的导入、比较和逐步调试。
