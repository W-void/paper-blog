---
title: "【推荐系统 Paper 日报】2026-05-28"
date: 2026-05-28
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2764946724"
---


# 【推荐系统 Paper 日报】2026-05-28

### 📊 今日概览

arXiv cs.IR 今日（2026-05-28）共收录 **39 篇**论文，其中与推荐系统（Recommendation / Personalization / Ranking）直接相关的有 **12 篇**。本期亮点：LLM 与推荐系统的深度融合仍是主旋律——无论是面向海量候选集的 LRanker 框架，还是把 KG-RAG 与 MoE 结合的新范式，都在探索如何让 LLM 在工业推荐场景中真正落地；同时电商多任务排序的生产级实践和高效特征交互新方法也值得关注。

---

### 🔥 推荐系统论文深度解读

#### 1. Looking Farther with Confidence: Uncertainty-Guided Future Learning for Sequential Recommendation

📄 [arXiv:2605.28493](https://arxiv.org/abs/2605.28493) | 作者：Cui, Ziqiang 等

**🗣️ 大白话：** 序列推荐一般只盯着"下一个点击"来训练模型，但用户的长期兴趣其实藏在更远的未来交互里。这篇论文的思路是：用不确定性来判断"哪条未来信号值得信赖"，让模型有选择地去学习远期交互，避免被嘈杂的未来数据带偏。

**🔬 专业讲解：** 论文聚焦序列推荐中的数据稀疏问题。现有自监督方法普遍只在 next-item 预测上做文章，忽略了更长视野的未来交互信息。作者提出 Uncertainty-Guided Future Learning（UGFL）框架：对每条未来监督信号赋予自适应权重——不确定性高的信号权重低，不确定性低的信号权重高。相比已有少量探索未来数据的工作，UGFL 避免了"对所有样本施加等强度未来监督"导致的次优解，在多个公开数据集上取得了更好的推荐精度。

---

#### 2. Mixture-of-Experts Knowledge Graph RAG for Multi-Agent LLM-based Recommendation

📄 [arXiv:2605.28175](https://arxiv.org/abs/2605.28175) | 作者：Wang, Shijie 等

**🗣️ 大白话：** LLM 做推荐最大的短板是知识会过期，而且对不同复杂度的用户查询"用同一把锤子"。这篇论文把知识图谱（KG）、RAG、混合专家（MoE）和多智能体全打包在一起，构建了一个能根据查询复杂度灵活调度的推荐系统。

**🔬 专业讲解：** 论文提出 MoE-KG-RAG 框架用于 LLM-based Recommendation。核心挑战有二：① 用户查询复杂度差异大，需要不同粒度的 KG 知识；② 一套固定的 RAG 策略无法适配所有场景。解决方案：设计多个专家模块，每个专家负责不同粒度的 KG 检索与推理；MoE 门控机制根据查询特征动态路由；多智能体协同处理子任务。该框架能及时融入最新结构化知识，在推荐解释性和准确性上均有提升。

---

#### 3. Joint Optimization of Relevance and Engagement in Multi-Task Ranking for E-Commerce with Efficient LLM Supervision

📄 [arXiv:2605.27704](https://arxiv.org/abs/2605.27704) | 作者：Chen, Luming 等

**🗣️ 大白话：** 电商搜索排序只优化点击率容易陷入"流量陷阱"——热门商品占尽流量但未必满足用户真实意图。这篇来自工业界的论文展示了如何在生产级系统中把语义相关性和用户互动同时优化，并用 LLM 高效生成弱监督标签。

**🔬 专业讲解：** 论文提出一套生产级多任务排序系统，将语义相关性作为主要优化目标，与互动信号（点击/购买）联合训练。关键设计：① Ordinal Relevance Head，预测相关性的累积概率，保留标签顺序关系；② 利用 LLM 对大规模样本高效生成相关性弱监督标签，降低人工标注成本；③ 相关性-互动的可控权衡机制。系统已在某电商平台上线，实现了相关性与业务指标的双提升。

---

#### 4. Context Features Are Cheap: Rank-Aware Decomposition for Efficient Feature Interaction in Recommender Systems

📄 [arXiv:2605.27450](https://arxiv.org/abs/2605.27450) | 作者：Tkach, Yevgeny 等

**🗣️ 大白话：** 工业推荐系统每次请求要给 N 个候选商品打分，每次都重复计算用户特征和上下文特征非常浪费。这篇论文从代数角度证明：只要对特征交互做一次分解，就能把这部分冗余计算减到最低。

**🔬 专业讲解：** 论文提出 Rank-Aware Decomposition（RAD），适用于 FM 二阶交叉、DCNv2 cross-layer、自注意力和全连接层等主流交互机制。核心思路：基于"线性/双线性运算可分解"这一代数原理，将 context-only 部分的计算从 N×M 次压缩到 1 次，同时 item-specific 计算保持不变。实验表明 RAD 在不损失精度的情况下，显著降低了推理延迟和计算量，对高 QPS 的工业场景非常友好。

---

#### 5. LRanker: LLM Ranker for Massive Candidates

📄 [arXiv:2605.27810](https://arxiv.org/abs/2605.27810) | 作者：Feng, Tao 等

**🗣️ 大白话：** 用 LLM 做排序效果好，但候选集一旦到百万级，上下文窗口塞不下、成本也扛不住。LRanker 用 K-means 聚类先压缩全局候选信息，再用图结构建模候选间关系，让 LLM 真正能用在大规模排序场景。

**🔬 专业讲解：** LRanker 针对 large-candidate ranking 问题提出两项设计：① Candidate Aggregation Encoder：用 K-means 聚类将海量候选集压缩成少量 cluster 中心向量，让 LLM 感知全局分布而不爆显存；② Graph-based Text Encoder：用图结构建模候选间语义关联，增强 LLM 对候选多样性和冗余的感知。整个框架在保持 LLM 语义能力的同时，将候选规模从 few-hundreds 扩展到 millions 级别。

---

#### 6. Affective Music Recommendation: A Rollout-Based World Model for Offline Preference Optimization

📄 [arXiv:2605.28810](https://arxiv.org/abs/2605.28810) | 作者：Chan, Audrey 等

**🗣️ 大白话：** 给临床用户（如老年神经认知障碍患者）推荐音乐时，不能随便做在线 A/B 测试——万一推错了影响情绪怎么办？这篇论文用"世界模型+离线强化学习"的思路，在不打扰用户的前提下优化推荐策略。

**🔬 专业讲解：** 论文提出 AMRS（Affective Music Recommendation System），已在 LUCID 健康平台部署。核心挑战：临床人群（老年神经认知障碍患者）无法正常跳过歌曲或表达痛苦，在线实验不可行。解决方案：设计 Rollout-Based World Model，在历史数据上模拟用户情感反应轨迹；基于 world model 进行离线偏好优化（类 RL），使推荐序列的情感效果最大化。系统同时服务临床用户和消费级健康用户（专注/睡眠/活力等场景）。

---

### 📋 其他推荐系统论文速览

- **Whose Name Comes Up? III: Persona Prompting Effects in LLM-Based Scholar Recommendation**（[arXiv:2605.28187](https://arxiv.org/abs/2605.28187)）：审计 43 个 LLM 在学者推荐场景下的 Persona Prompting 效应，覆盖 6 个学科，揭示语言/地区/角色提示对推荐结果的系统性偏差。

- **Developing an Intelligent Job Recommendation System Using Semantic Retrieval and Explainable AI**（[arXiv:2605.27656](https://arxiv.org/abs/2605.27656)）：融合 TF-IDF、Sentence-BERT、Cross-Encoder 重排序和可解释性生成，构建职位推荐系统，兼顾检索效果与推荐可解释性。

- **Paraphrase Brittleness in Production Retrieval-Augmented Commercial Recommendation**（[arXiv:2605.27440](https://arxiv.org/abs/2605.27440)）：6000+ 次实验揭示 AI 商业推荐对换句话的脆弱性——同一购买意图的不同表达，品牌推荐集合 Jaccard 相似度仅 0.288，稳定性堪忧。

- **Prominence-Stratified Failure Modes in Retrieval-Augmented Commercial Recommendation: A 37,000-Run Audit**（[arXiv:2605.27439](https://arxiv.org/abs/2605.27439)）：3.7 万次生产级审计，分析 ChatGPT/Claude 等模型在 215 个商业查询、533 个品牌上的推荐失效模式，揭示品牌知名度与推荐偏差的强相关性。

- **Ocean4Rec: Offline LLM-Derived OCEAN Profiles for Request-Time VOD Reranking**（[arXiv:2605.27429](https://arxiv.org/abs/2605.27429)）：VOD 推荐场景中，将 LLM 仅用于离线生成 OCEAN 人格特征向量（大五人格），请求时直接查表重排，规避在线 LLM 调用的延迟和吞吐问题。

- **Memory-Based vs. Context-Only Conditioning Produces Distinct Behavioral Patterns in Stateful Personalization**（[arXiv:2605.27389](https://arxiv.org/abs/2605.27389)）：对比"基于持久记忆"和"仅当前上下文"两种个性化条件，发现前者有更强的学习者差异化能力，在面向教师的教育推荐系统中表现更优。