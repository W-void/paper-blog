---
title: "【推荐系统 Paper 日报】2026-07-09"
date: 2026-07-09
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2773537111"
---

# 【推荐系统 Paper 日报】2026-07-09

## 📊 今日概览

arXiv 公告日期：Thu, 9 Jul 2026。今天 cs.IR 共放出 5 篇新论文，其中 2 篇与推荐系统强相关，分别是多模态 Agent 协同推荐框架和对话推荐中的动态偏好挖掘策略。两篇都各有亮点，一篇把视觉信号拉进了推荐 Agent 的记忆体系，另一篇则拿到 SIGIR 2026 录用，专注「什么时候问、问什么」这个 CRS 的核心难题。

## 🔥 推荐系统论文深度解读

### 1. Seeing and Reflecting: Multimodal Memory-Enhanced Agent Collaboration for Recommendation

📄 [arXiv:2607.07108](https://arxiv.org/abs/2607.07108) | 信息检索 | Hao Cong, Huizu Lin, Zihan Wang, Chengkai Huang, Quan Z. Sheng, Lina Yao

**🗣️ 大白话：**

现在用 LLM Agent 做推荐越来越火，但有个很尴尬的问题：这些 Agent 基本只处理文字，用户图片里的信息、商品图里的细节，它们都视而不见。而且 Agent 记忆更新方式太粗糙，像是个乱记的账本，用久了容易漏记关键偏好、被噪声干扰，甚至推荐方向越跑越偏。

这篇论文提出了 MMEACR，一个「能看图、会反思」的推荐 Agent 团队。它设计了**双轨记忆架构**：一条轨道是**推理轨道**，让「用户记忆 Agent」和「物品记忆 Agent」分工维护多模态记忆，通过一个「属性引导的强化+反思」机制来更新记忆；另一条轨道是**匹配轨道**，把原始交互文本和商品图片抽成细粒度的跨模态嵌入，保留结构化记忆之外的文字和图像细节。两条轨道最后用加权 Reciprocal Rank Fusion 融合，既让推荐结果更可解释，也保证了在「图片说了算」的推荐场景里表现更强。

三个真实数据集上的实验显示，MMEACR 在视觉上依赖的推荐场景中尤其能打，算是给多模态 Agent 推荐补了一块关键拼图。

**🔬 专业讲解：**

- **核心问题**：LLM-based agentic recommender systems 受限于纯文本输入、粗粒度记忆更新，导致视觉信息缺失、语义噪声累积、偏好漂移（preference drift）。
- **MMEACR 双轨架构**：
  - **推理轨道（Reasoning Track）**：User Memory Agent 与 Item Memory Agent 分别维护持久化多模态记忆，通过 attribute-guided reinforcement-and-reflection 机制更新。该机制允许 Agent 在记忆更新时反思哪些属性值得强化、哪些需要修正。
  - **匹配轨道（Matching Track）**：构建 decoupled multimodal embedding memory，从原始交互叙事和物品图像中提取跨模态嵌入，捕获结构化记忆无法覆盖的细粒度信号。
  - **融合**：两条轨道的输出通过加权 Reciprocal Rank Fusion（RRF）整合，兼顾可解释性与排序精度。
- **实验**：在三个真实领域上验证，对比了 competitive LLM-based 和 agent-based baselines，在视觉主导场景中优势显著。
- **启示**：推荐系统正从「纯文本推理」向「多模态 Agent 协同」演进，Agent 的「反思能力」和「记忆精细化」可能是下一个关键方向。

---

### 2. When and How to Ask: Dynamic Preference Elicitation Strategies for Conversational Recommendation

📄 [arXiv:2607.06765](https://arxiv.org/abs/2607.06765) | **SIGIR 2026** | Feng Xia, Shuo Zhang, Xi Wang

**🗣️ 大白话：**

对话式推荐系统（CRS）就像你跟一个导购聊天：你问一句，它推荐一句，但它得先搞清楚你真正想要什么。问题是怎么问？问太早了用户烦，问晚了又错过了推荐窗口。现在的研究大多关注「问什么属性」（比如预算、品牌），但**什么时候问、问什么类型的问题**（问属性 vs 直接问物品）这个策略问题，其实很少有人系统研究过。

这篇论文发现，最优的提问策略是**随对话阶段变化的**：对话早期用「属性提问」更有效（帮用户快速收敛方向），偏好逐渐明确后「物品提问」反而更优（直接确认用户喜欢的具体东西）。为此他们构建了一个叫 **InPE** 的数据集，标注了每个对话轮次「是否需要提问」以及「该用什么策略」。然后提出 **COPE**（Conversational Preference Elicitation via Mixture of Experts），一个用 MoE 架构来动态建模提问策略的模型，离线实验证实 context-aware 策略确实对对话推荐有帮助。更有趣的是，预测出来的策略分布还揭示了对话推进的普遍规律，说明这些策略变化不是随机的，而是有规律可循的。

**🔬 专业讲解：**

- **核心问题**：CRS 的 preference elicitation 策略在 timing 和 selection 上缺乏系统研究。现有工作偏向静态属性提问，对 item-based elicitation 和 stage-dependent 策略变化探索不足。
- **关键发现**：最优 elicitation 策略是 stage-dependent 且 context-sensitive 的——attribute-based 在对话早期占优，item-based 在偏好细化后反超。
- **InPE 数据集**：首个带有 fine-grained elicitation necessity 和 strategy selection 标注的对话推荐数据集，为策略建模提供监督信号。
- **COPE 架构**：基于 Mixture of Experts（MoE）的上下文感知策略模型，给定对话状态动态预测最优提问策略。
- **实验**：InPE 数据集上离线评测表明 COPE 显著优于现有 baseline；策略预测的分布分析揭示了对话推进的 stage-wise tendency，提供了对话推荐的交互模式实证证据。
- **开源**：数据集已开源在 https://github.com/juanfacabian/InPE
- **启示**：对话推荐不再只是「推荐什么」，而是「怎么问」——策略性提问或许是提升 CRS 体验和效率的下一个杠杆点。

---

## 📋 其他论文速览

- **Interpretable Uncertainty for Adaptive Retrieval and Reasoning in Question Answering**（arXiv:2607.07380）：LLM 在问答中容易产生幻觉，这篇工作从 LLM 的 hidden states 中提取可解释的不确定性信号（区分知识不足 vs 知识冲突），据此决定何时触发检索、何时增加推理。对 RAG 系统的自适应决策提供了透明且高效的替代方案，虽非直接推荐，但不确定性驱动的检索策略对推荐系统同样有启发。

- **Granularity in Actoin: Graphing sources for social history**（arXiv:2607.07183）：基于 GRAM 框架的自动化社会历史行动图构建管线，用 ML 工具将历史档案转化为结构化行动图。偏向数字人文领域，与推荐系统关联度较低。

- **InductWave: Inductive Multi-Hop Logical Query Answering on Knowledge Graphs**（arXiv:2607.07422）：基于小波变换的归纳式知识图谱多跳逻辑查询方法。仅用一半的 message-passing 层数即可匹敌甚至超越现有 baseline，支持在训练未见过的实体上推理。投 TKDE 中，适用于知识推理场景，但非直接推荐系统工作。
