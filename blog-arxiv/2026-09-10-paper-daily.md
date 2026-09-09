---
title: "【推荐系统 Paper 日报】2026-09-10"
date: 2026-09-10
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2785965780"
---

# 【推荐系统 Paper 日报】2026-09-10

## 📊 今日概览

arXiv cs.IR 于 **Wed, 9 Sep 2026** 公告了 51 篇新论文，其中与推荐系统/信息检索直接相关的有 **12 篇**。本期亮点包括：抖音工业界落地的 100K 超长序列推荐模型 SequenceO1（RecSys'26 Industry 长报告）、首个面向数据集选择的推荐系统 FINALLY、以及多任务统一排序骨架 Task-Blind No MORE（CIKM 2026）等。工业界与学术界的碰撞非常精彩。

---

## 🔥 推荐系统论文深度解读

### 1. SequenceO1: End-to-End Ultra-Long (100K) Sequence Modeling in Recommendation with Low-Rank Caching

📄 [arXiv:2609.08443](https://arxiv.org/abs/2609.08443) | RecSys'26 Industry Track (Long Oral) | Lin Guan, Jia-Qi Yang, Zhishan Zhao, Jiaqi Huang, Hangyu Wang, et al.

**🗣️ 大白话：** 抖音把用户行为序列从几千直接干到了 10 万级别，而且是在生产环境里跑起来的。关键 trick 是用低秩缓存把历史行为压缩成一小块「记忆芯片」，推理时不用重新算全量 attention，速度反而更快了。

**🔬 专业讲解：** 工业级推荐系统中，建模超长用户行为序列（100K 级别）面临 latency、内存、通信和训练吞吐的多重约束。SequenceO1 提出了端到端的低秩缓存机制（Low-Rank Caching），将用户历史行为序列通过低秩投影压缩为紧凑的缓存表示，在推理阶段直接复用缓存而非重新计算全量 self-attention。该方法已在抖音生产环境部署，在保持 CTR 预测精度的同时显著降低了推理延迟和通信开销。论文同时探讨了序列压缩、用户表示缓存与大规模排序系统的协同设计，是超长序列推荐在工业界落地的标志性工作。

---

### 2. FINALLY: A Dataset Recommender System for Recommender-Systems Research

📄 [arXiv:2609.08941](https://arxiv.org/abs/2609.08941) | Bachelor's Thesis, University of Siegen | Louis Owie

**🗣️ 大白话：** 做推荐系统研究时，选数据集是个头疼事——你得同时满足好多实验约束。这篇论文搞了个「数据集的推荐系统」，专门帮研究者挑合适的数据集组合。

**🔬 专业讲解：** 数据集选择直接影响推荐算法评估的实验条件，但现有工具在构建满足实验约束的数据集集合方面支持有限。FINALLY 将数据集选择形式化为一个集合级推荐问题：给定实验约束（如数据规模、领域、稀疏度等）和选择目标，系统推荐最优的数据集组合。这项工作虽然是一篇本科毕业论文，但切中了推荐系统研究领域的一个长期被忽视的问题——实验可重复性和评估一致性的根基在于数据集选择的科学性。对于做 benchmark 和元分析的研究者来说，这个想法很有启发。

---

### 3. Task-Blind No MORE: Multi-Task Information Flow in Unified Ranking Backbones

📄 [arXiv:2609.07273](https://arxiv.org/abs/2609.07273) | CIKM 2026 | Yuchen Wang, Feng Niu, Qing Tan, Junting Lu, Baoxin Wu, et al.

**🗣️ 大白话：** 以前的排序模型要么搞特征交叉，要么搞序列建模，各干各的。HyFormer、MixFormer 把这些统一到一个 backbone 里了，但真实系统都是多任务的。这篇论文问：统一 backbone 里的多任务信息是怎么流动的？会不会互相打架？

**🔬 专业讲解：** 工业排序模型通常需要同时优化多个目标（CTR、CVR、停留时长等），但现有统一 backbone（如 HyFormer、MixFormer）主要关注单任务场景。Task-Blind No MORE 分析了统一排序骨架中的多任务信息流，揭示了不同任务之间信息干扰的机制，并提出了改进方案。这对于理解「一个模型干多个活儿」时的内部竞争与协作关系非常关键，特别是在特征交互和序列建模被统一到一个模块之后，多任务学习的信息流动变得更加复杂。

---

### 4. EAGER: Enrich-and-Align Generative Query Recommendation from Clicked Items in E-commerce Search

📄 [arXiv:2609.07143](https://arxiv.org/abs/2609.07143) | EMNLP 2026 Industry Track | Shuwei Yuan, Mingqian Ding, Luxin Liu, Rong Xiao, Xiaoyi Zeng

**🗣️ 大白话：** 你在淘宝刷商品时，下面经常有一排「相关搜索词」。传统方法只能从历史日志里挖矿，看不到新趋势。EAGER 用生成式模型，根据你刚点的商品直接「编」出高质量搜索建议，还能跟现有检索系统对齐。

**🔬 专业讲解：** 电商搜索中的查询推荐（Query Suggestion）传统上依赖历史日志挖掘，存在覆盖率低、无法捕捉新兴趋势的问题。EAGER 提出了 Enrich-and-Align 框架：首先基于用户点击的商品通过生成式模型生成候选查询，然后通过对比学习将生成的查询与真实检索系统的语义空间对齐。这种生成式方法能够突破历史日志的限制，产生新颖且相关的查询建议，在电商搜索场景中具有重要的商业价值。

---

### 5. Closing the Long-Short View Gap in Sequential Recommendation without Cached History

📄 [arXiv:2609.06219](https://arxiv.org/abs/2609.06219) | CIKM 2026 | Lingfeng Shi, Chengkai Huang, Lina Yao, James Caverlee

**🗣️ 大白话：** 序列推荐模型训练时用很长的历史，但线上推理为了省资源只给看最近几条，效果差很多。这篇论文找到了不用缓存历史也能缩小这个差距的办法。

**🔬 专业讲解：** 序列推荐器通常在长用户历史上训练以捕捉丰富的行为信号，但在线服务时由于实时效率约束往往只能使用近期行为，导致严重的性能下降（long-short view gap）。本文提出了一种无需缓存历史记录的解决方案，通过某种形式的蒸馏或历史信息压缩，使得短序列推理能够逼近长序列训练的效果。这对于资源受限的实时推荐系统特别有价值——在不增加存储和计算开销的前提下，提升短序列推理的质量。

---

### 6. FunnelAudit: Responsibility Auditing in Multi-Route Recommender Systems

📄 [arXiv:2609.06964](https://arxiv.org/abs/2609.06964) | Jie Li, Dudu Luo, Jiayang Niu, Ke Deng, Yongli Ren

**🗣️ 大白话：** 现在的推荐系统越来越复杂，召回、分配、融合、排序好几条路线并行。出了问题到底是谁的锅？FunnelAudit 就是来给这个「多路线迷宫」做责任审计的。

**🔬 专业讲解：** 多路线推荐系统（Multi-Route）将检索、分配、融合和排序等多个阶段组合在一起，使得单个项目的包含/排除原因难以追溯。路线重叠会掩盖单一路线消融的效果，而冻结下游阶段产生的反事实结果与实际服务行为不一致。FunnelAudit 提出了一套责任审计框架，能够准确追踪每个推荐结果在各路线中的贡献度，为推荐系统的可解释性和公平性评估提供了新的工具。在越来越复杂的工业推荐架构中，这种审计能力对于调试和优化至关重要。

---

## 📋 其他论文速览

- **Do All Nodes Benefit Equally from Knowledge Graphs?**（arXiv:2609.05909, CIKM 2026）：提出自适应节点感知 KG 融合方法，发现不同用户对 KG 信息的利用程度不同，不应一刀切地为所有节点注入知识图谱信息。

- **What Price Fairness? Evaluating Energy - Fairness - Accuracy Trade-off in Recommender Systems**（arXiv:2609.05759）：公平性推荐系统通常只评估准确性和公平性，而忽略了能耗。本文首次系统性地评估了三者的权衡关系，提醒我们公平性是有「碳成本」的。

- **Embedding Surgery: Localized Updates for Adaptive Ranking Correction in Dense Retrieval**（arXiv:2609.05110, CIKM 2026）：稠密检索系统的文档嵌入通常是联合训练的，修改单个文档需要重训整个系统。本文提出「嵌入手术」——只局部更新目标文档的嵌入，而不影响其他文档，为动态索引更新提供了高效方案。

- **Beyond Co-purchase Relation: Evolution of Complementary Recommendations at Allegro**（arXiv:2609.05063, RecSys'26 OARS Workshop）：来自波兰电商巨头 Allegro 的互补商品推荐实践，探讨了如何区分真正的互补品（相机→镜头）与简单的共购关系（相机→另一台相机）。

- **A Multi-Source Ensemble Approach to Candidate Generation for Alternative Vacation Rental Property Recommendations**（arXiv:2609.05748, RecTour 2026）：度假租赁平台的备选房源推荐，通过多源集成方法解决异构库存、地理约束和快速变化的市场动态等挑战。

- **Evaluating Deep-Search Agents under Hierarchical Web Evidence Poisoning**（arXiv:2609.06027）：针对搜索增强 LLM Agent 的 GEO（生成式引擎优化）投毒攻击评估框架，引入分层 Web 证据投毒场景，追踪 Agent 对可疑证据的验证行为。
