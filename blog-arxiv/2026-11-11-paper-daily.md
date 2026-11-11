---
title: "【推荐系统 Paper 日报】2026-11-11"
date: 2026-11-11
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2797913195"
---

# 【推荐系统 Paper 日报】2026-11-11

## 📊 今日概览

arXiv cs.IR 今日（Wed, 11 Nov 2026）公告 20 篇新论文，其中推荐系统及用户行为建模相关约 10 篇，占比一半，可以说是推荐方向大丰收的一天。亮点集中在三个方向：**多模态/解耦表示学习**（LUMIR、MPIUR）、**离线评估方法论**（INTENT、IntentTwin 连环出击，直指离线 benchmark 的坑），以及**实用工程价值拉满的 scaling law 用法**——用小实验预测全量 A/B 效果，工业界同学值得细读。

## 🔥 推荐系统论文深度解读

### 1. Exploiting Feature-invariant Scaling Laws for Efficient A/B Experimentation in Recommendation Systems

📄 [arXiv:2611.13539](https://arxiv.org/abs/2611.13539) | arXiv cs.IR | Zhiliang Chen, Sammy Nammari, Jiahao Su, Xiaoqiang Luo

**🗣️ 大白话：** 每次想加个新特征、换个模型结构，都得跑一遍全量训练+线上 A/B，算力烧不起。这篇发现推荐模型有个"特性无关的 scaling 规律"：不管你怎么改特征，模型性能随训练规模的变化都遵循可预测的曲线。于是只用小规模实验，就能带置信区间地预测出全量效果——把没用的改动提前筛掉，省下大量算力。

**🔬 专业讲解：** 作者提出 feature-invariant scaling 的经验规律，并结合统计推断构建了全量 A/B effect 的预测方法（含置信区间）。在 Wukong、HSTU、LLM-based 推荐模型三个模型家族、40+ 种结构/优化/数据改动上验证，能够准确区分有益改动与中性/负向改动，且计算量仅为全量评测的一小部分。额外收获是借此在 MovieLens-20M 上找到了几个能提升 HSTU SOTA 的改动。对做特征迭代和实验设计的团队来说，这是一套可以直接落地的"省算力决策框架"。

---

### 2. LUMIR: Decoupled Multimodal Representation Learning from Heterogeneous Data for Next-POI Recommendation

📄 [arXiv:2611.14004](https://arxiv.org/abs/2611.14004) | RecSys 2026 DaQuaMRec Workshop | Zehui Wang, Wolfram Höpken, Dietmar Jannach

**🗣️ 大白话：** 做旅游推荐时手上有各种来源的数据（文本、图片、社交信息），以往的做法是把多模态融合"焊死"在某个下游模型里，换个模型就得重学。LUMIR 的思路是解耦：先用 LLM 把异构数据统一到共享文本表示空间，再用对比学习+序列信号学出一套"通用表示"，之后随便接哪个推荐模型都能用。

**🔬 专业讲解：** 框架分三步：① 基于 LLM 将异构多模态信息语义统一到共享文本空间；② 设计 interaction-aware 融合机制建模跨模态交互；③ 将序列信号作为结构约束引入表示学习。在多模态 POI 数据集的 next-POI 推荐设定下，跨多个序列推荐骨干模型评测，LUMIR 在准确率与 beyond-accuracy 指标上都稳定优于现有多模态融合基线，验证了"表示学习与下游优化解耦"是学习可复用多模态表示的有效范式。代码已开源。

---

### 3. SHARP: Semantic Hierarchical Agentic Reasoning for Next POI Prediction with Dynamic Memory

📄 [arXiv:2611.14220](https://arxiv.org/abs/2611.14220) | arXiv cs.IR | Yuhang Zhan, Silin Zhou, Zhuo Chen, Haoxiang Lei, Yunren Feng, Lisi Chen, Shuo Shang

**🗣️ 大白话：** 预测你下一个要去哪（next-POI）。现在流行用 LLM 做语义推理+图网络建模人群移动，但有三个老大难：LLM 的语义推理和具体 POI 预测对不上号、用户行为随时间变化导致历史知识装不下、全局转移图会把特定时段的规律"抹平"。SHARP 用"先猜类别、再定位 POI"的分层 agent 框架 + 动态轨迹记忆来逐个击破。

**🔬 专业讲解：** 核心设计包括：① 轨迹记忆 agent 维护动态记忆库，在有限上下文增长下保留早期移动模式并追踪行为变化；② 构建多粒度时间感知的类别转移图（全局视图 + 时间条件视图），保留被全局聚合掩盖的时段规律；③ 类别预测 agent 结合图与记忆先预测下一类别；④ 通过 RQ-VAE 学习语义 ID（SIDs）构建 POI 语义表示，与类别引导的 POI 预测器端到端联合优化。在三个真实数据集上，Acc@5 / Acc@10 相比最强 baseline 平均提升 5.29 / 4.52 个百分点。

---

### 4. INTENT: Out-of-Sample, Out-of-Time, and Cold-Start Evaluation on User Event Sequences

📄 [arXiv:2611.13069](https://arxiv.org/abs/2611.13069) | ICAIF 2026 MFMB Workshop | Mattias Kvist, Erik Lidman Hillbom, Edoardo de Cal, et al.

**🗣️ 大白话：** 银行都在拿用户交易序列训基础模型，但各家都用私有数据评，谁也不知道谁强；公开 benchmark 又很少测"模型没见过的未来时间段"。INTENT 提供了一个公开基准，按"用户见过没见过 × 时间段见过没见过 × 目标 item 见过没见过"切出 7 个格子分别打分——结果发现"无脑复读用户上一个动作"在新 item 格子里反而拿第一，这很扎心。

**🔬 专业讲解：** 作者审计了 59 个公开数据集家族，仅 5 个合格（最常见的缺陷是缺少时间戳）。每个数据集按评估前固定的规则在自己 cutoff 处切分，每个格子至少 11 万+ 用户。参考结果显示：transformer 在 cutoff 后的 seen-item 格子领先，但新 item 格子直接归零；嵌入 item 元数据的变体主要在 MicroLens 上起作用。一个无参数的对照还表明，三个数据集上 cutoff 后的分数损失主要来自行为分布漂移而非模型本身。这套 per-cell 评测协议对离线实验设计很有参考价值。

---

### 5. IntentTwin: Deconfounding Candidate Support and the Oracle-to-Deployment Gap in Offline Web Behavior Prediction

📄 [arXiv:2611.12918](https://arxiv.org/abs/2611.12918) | arXiv cs.IR | Miaobo Hu, Shuhao Hu, Xiaobo Guo, Xin Wang, Bokun Wang, Daren Zha

**🗣️ 大白话：** 又一篇"离线评测翻车现场"。很多网页行为预测 benchmark 把演示动作塞进候选集再测 rerank，结果发现一个致命混淆：只要目标动作不在训练分布里、干扰项都在，模型不用理解行为、光看"是否在训练分布内"就能答对（SIR 直接 1.0）。这篇把问题形式化并给出修正方案。

**🔬 专业讲解：** 作者提出 support-identifiability rate（SIR）来量化该混淆，构造 support-balanced 候选集，并评测一个结合支持检索与开放词表 DOM/LM 提案的 target-free 双路 proposer。在过滤后的 OPeRA 上：原协议下 SIR=1.0、仅靠 support 规则即可拿满 OOV Exact@1；平衡后 SIR 降为 0，最强条件 reranker 整体 Exact@1 为 0.7214（IV 行 0.7988、OOV 行 0.5668）。在 Mind2Web 上同样审计出 SIR 0.2380 与 0.2125 的 oracle-to-proposal 差距。结论很明确：用离线结果推断线上部署效果时，候选集的支持度构成必须与候选准确率一起控制。

---

### 6. From Counterfactual Edits to Human Narratives: LLM-Driven Interpretations for Recommender System Explanations

📄 [arXiv:2611.13914](https://arxiv.org/abs/2611.13914) | CIKM 2026 | Vojtech Cahlik, Amir Reza Mohammadi, Rodrigo Alves, Pavel Kordik, Eva Zangerle

**🗣️ 大白话：** 反事实解释（CFX）告诉你"如果你少看几部恐怖片，就会给你推荐这部电影"，但往往要改十几条历史记录，生成一长串没人看得懂的列表。这篇让 LLM 充当"翻译官"，把底层编辑列表总结成描述高层偏好模式的自然语言解释，并用偏好优化（DPO）提升质量。

**🔬 专业讲解：** 作者指出现有 CFX 评测过度关注编辑数量、忽视用户可读性与可操作性，提出用 LLM 作为中介将原始 CFX 交互编辑列表总结为简洁的叙事性解释，并通过偏好优化在正确性、信息量、语言质量三方面调优。评测采用基于人工标注数据集构建的 human-calibrated 指标；在 MovieLens-1M 上，跨多个 CFX 生成器和 LLM，DPO 几乎在所有设定下都改善了语义指标，高成功率的 CFX 方法（ACCENT、SPINRec）配合后语义效果最佳。

---

### 7. MPIUR: A Technique to Model Product Information and User Reviews

📄 [arXiv:2611.13361](https://arxiv.org/abs/2611.13361) | arXiv cs.IR | Emna Belguith, Fajrian Yunus, Talel Abdessalem

**🗣️ 大白话：** 电商平台天然有三种信息：商品描述、商品图、用户评论，但现有多模态推荐要么把评论扔了，要么没把三者放进统一框架。MPIUR 用异构图把评论编码进去，对齐图文表示，并根据商品交互密度自适应调整协同-语义对齐强度。结论：交互越稀疏的商品，用上评论越值。

**🔬 专业讲解：** MPIUR 是基于图的多模态推荐模型：将评论文本编码进异构图结构，对齐图像与文本表示，并以 item 交互密度为条件自适应调节 collaborative-semantic alignment。在 Amazon Reviews 2023 的 Musical Instruments 和 Baby 两个类目上，MPIUR 在全局 nDCG@10 和 Recall@10 上均为最优，且在稀疏 item 子集上同样拿到最佳指标，说明联合利用评论与多模态内容在交互历史有限时收益尤其显著。

---

## 📋 其他论文速览

- **FERN: Cross-Benchmark Table Retrieval for Text-to-SQL**（arXiv:2611.14477）：不用生成式 LLM，融合三个冻结检索器 + LightGBM 重排做 Text-to-SQL 表格检索，Spider 上 complete@5 从 83.9% 提到 95.6%，单题延迟仅 208ms。
- **From Search to Decision**（arXiv:2611.14149）：综述 LLM 后训练如何塑造信息获取能力，围绕六项信息检索能力组织学习信号与优化方法，指出现有评测的开放挑战。
- **Ontology-Guided Knowledge Graph Construction for Indian Knowledge Systems**（arXiv:2611.14050）：本体引导的知识图谱管线 + 多路证据检索，Multi-hop 检索 MRR@20 达 0.87。
- **From Show Programs to Linked Data**（arXiv:2611.14037）：用 VLM 把 1947 年至今的艺术节节目单转成 Linked Art 结构化数据，转写准确率超 98%，KG 约束显著降低标注幻觉。
- **Data Quality Challenges in Multimodal Tourism Recommender Systems**（arXiv:2611.13972）：LUMIR 的姊妹篇，盘点旅游多模态推荐中的数据质量坑：假评噪声、LLM 幻觉内容、模态矛盾、人群偏差，并给出 quality-aware fusion 等方向。
- **TIGA: Controlled Knowledge Engineering for Taxonomy Induction**（arXiv:2611.13966）：把分类体系构建形式化为带工具调用的迭代决策过程，结构质量最优但 token 成本显著偏高。
- **Auditing LLM Pseudo-Label Distillation for Review Informativeness**（arXiv:2611.13797）：534 万条土耳其电商评论上的伪标签蒸馏审计，发现 teacher fidelity 高不等于编辑审核对齐，学生管线快 50 倍。
- **DocFS: File Systems as Agentic Reasoning Environments**（arXiv:2611.12957）：把多模态长文档重组为文件系统供 agent 导航检索，MMLongBench-Doc 上 SOTA 且快 10 倍、省 10 倍 token。
- **Point-in-Time Encoders for Earnings Calls**（arXiv:2611.14325）：为金融回测训练"时间点正确"的编码器 vintage 消除 look-ahead bias，检索质量优于通用检索器。
- **StaRSE: Compact Russian Sentence Embeddings**（arXiv:2611.14236）：11.3 MiB 的符号编码静态句向量，CPU 单句 0.08ms，RuMTEB 上超最强静态基线近 8 分。
- **IFRS Compliance Verification**（arXiv:2611.13595）：2 万对 IFRS 法规-披露对的开源 benchmark + 内容条件化多 LLM 集成分类器，加权 F1 超最强单模型 10.4 分。
- **Activation-Guided Graph Retrieval for Cognitive Memory Reconstruction**（arXiv:2611.13127）：提出"激活条件化的记忆可用性"架构规范，让 RAG 返回证据路径而非仅排序列表（纯架构分析，无 benchmark）。
- **Beyond the Document: Compiled Context and Governed Agents**（arXiv:2611.13055）：提出 Portable Agent Format，把编译上下文作为交付物的一部分，托管 reader 成功率 96% vs 86%。
