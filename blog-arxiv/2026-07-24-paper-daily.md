---
title: "【推荐系统 Paper 日报】2026-07-24"
date: 2026-07-24
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2776418596"
---

# 【推荐系统 Paper 日报】2026-07-24

## 📊 今日概览

arXiv cs.IR 于 2026年7月24日（周五）更新，本期共计 **50 篇** 新论文，其中与推荐系统直接相关的有 **13 篇**。本期亮点包括：Diffusion Language Model 首次应用于推荐系统、多模态序列推荐的"双重噪声困境"被系统性解决，以及多篇 RecSys 2026 录用论文集体亮相。"

---

## 🔥 推荐系统论文深度解读

### 1. Diffusion Language Model for Recommendation

📄 [arXiv:2607.21519](https://arxiv.org/abs/2607.21519) | 作者：Chengyi Liu, Yongqi Zhou, Junwei Pan, Zhixiang Feng, Chengguo Yin, Haijie Gu, Jie Jiang, Yinghao Liu, Yujuan Ding, Qing Li, Wenqi Fan

**🗣️ 大白话：** 现在大家都在用大语言模型做推荐，但基本都是让模型一个词一个词地「从左到右」预测，这不太适合推荐——因为用户偏好不是线性的，item 之间也不是简单的先后顺序。这篇论文就像给推荐系统装了一个「扩散引擎」，不是一步步猜，而是先把答案模糊化再逐步去噪恢复，就像 AI 画图那样。具体做了三件事：把用户协同信号编码成离散的「token」让扩散模型能处理；用课程学习策略让模型从易到难学偏好恢复；最后用投票机制把多次迭代的结果聚合起来，让推荐更稳定。

**🔬 专业讲解：** 现有 LLM-based 推荐方法普遍采用自回归（autoregressive）范式，存在两个结构性缺陷：(1) next-token objective 强调序列顺序而非 item 间的结构依赖；(2) prefix-constrained 生成限制了双向上下文，左到右解码导致早期错误累积。DLMRec 引入离散扩散语言模型作为替代方案，核心创新包括：(a) 协同感知随机 tokenizer，将多跳协同信号编码为兼容扩散建模的离散 token；(b) 课程驱动的训练策略，通过渐进式 item-level 和 token-level 学习对齐去噪过程与偏好恢复；(c) 稳定性感知投票机制，聚合迭代预测以提升生成一致性和鲁棒性。

---

### 2. Bridging the Structural Gap: Adapting Autoregressive Generation for Recommendation

📄 [arXiv:2607.21028](https://arxiv.org/abs/2607.21028) | 作者：Junchao Zeng, Junzhang Zhu, Junyang Chen, Yudong Li, Wei Liu

**🗣️ 大白话：** 生成式推荐现在很火，比如把 item 用残差量化编码成一串 token 然后逐 token 预测。但这里有两个坑：一是把多 token 的 item ID 拍平成一条序列，破坏了 item 本身的结构；二是训练和推理时层次化 codebook 的不一致导致「语义漂移」。这篇论文提出 BARGE，用 Item Context-Aware Attention 恢复 item-level 结构，再用层次化路径重排序和双路径解码从两个角度抑制语义漂移。腾讯已经在线上 A/B 测试了，CTR 提升 0.60%，阅读时长提升 1.70%。

**🔬 专业讲解：** BARGE 针对生成式推荐中的两个结构性 gap 提出解决方案：(1) 通过 Item Context-Aware Attention (ICA) 在编码阶段恢复 item-level 结构，解决 flatten multi-token IDs 造成的结构破坏；(2) 通过 Hierarchical Path Reranking (HPR) 和 Dual-Path Decoding (DPD) 在解码阶段从互补角度抑制语义漂移。在公开 benchmark 和大规模离线测试中表现优异，腾讯平台在线 A/B 测试显示 CTR +0.60%、CUV +1.34%、总阅读时长 +1.70%。

---

### 3. Probabilistic Residual Learning for Online Recommendations (RecSys 2026)

📄 [arXiv:2607.20863](https://arxiv.org/abs/2607.20863) | RecSys 2026 | 作者：Wenyuan Wang, Yusong Zhao, Zihao Xu, Hengyi Wang, Qi Xu

**🗣️ 大白话：** 深度学习推荐系统像个黑盒子，计算复杂还不好调。这篇论文的思路很巧妙：不搞一个全新的模型，而是做一个「补丁」——先让现有模型预测，然后用一个概率化的残差学习模块去修正预测误差。这个模块会把用户自动分组，每组学自己的修正模式，还用因果推断（do-calculus）处理混淆变量。关键是「即插即用」，兼容各种现有的深度推荐模型。

**🔬 专业讲解：** PRL 是一个因果贝叶斯推荐模型，建模 ground-truth 与 base 预测之间的残差，实现对现有系统的 targeted refinement。核心机制：(1) 概率化用户分组进行 localized residual modeling；(2) 建模影响用户和 item 表示的 domain-level confounders；(3) 使用 do-calculus 在 confounders 上聚合 cluster-specific 残差预测。实验表明 PRL 可 plug-and-play 兼容多种 base DL 推荐系统，在提升性能的同时自动发现有意义的用户聚类。

---

### 4. Zero-Observation User Reactivation with Gap-Driven Dimensional Gating (RecSys 2026)

📄 [arXiv:2607.19802](https://arxiv.org/abs/2607.19802) | RecSys 2026 | 作者：Jiandong Ding, Tianying Liu, Fuyuan Liu, Huijie Qin, Tiandeng Wu

**🗣️ 大白话：** 推荐系统有个头疼的场景：用户一段时间不用 App，回来以后行为全变了。论文定义了「零观测重新激活」问题——用户有一段历史行为，然后沉默了很长时间（比如一年以上），再回来。实验发现，超过一年后 Hit@10 跌到谷底。他们提出了 DeltaGate，一个很轻量的插件（只有 backbone 参数的 2-4%），在 backbone 冻结的情况下，根据沉默时间长度和个性化表示共同决定每个维度该用历史偏好还是全局先验。Video Games 数据集上，超过 365 天的 bucket 里，DG-SASRec 的 Hit@10 从 0.031 提升到 0.047。

**🔬 专业讲解：** DeltaGate 是一个轻量级输出层插件，核心设计包括：(1) 保持 backbone 冻结，仅训练门控路由机制；(2) 联合条件化于时间间隔 Delta t 和个性化表示；(3) 零初始化的全局先验与个性化历史之间的维度级路由。在 Amazon Video Games/CDs/Movies 数据集上，Gap-Synthesize Protocol 诊断显示：>365d bucket 中 DG-SASRec Hit@10 0.047 vs SASRec 0.031（+51.6%），DG-BERT4Rec 0.046 vs BERT4Rec 0.025（+84%），训练参数仅 66K（2-4% overhead）。

---

### 5. Personalized Recommendation Tool Learning via Autonomous Language Agents (RecSys 2026)

📄 [arXiv:2607.19739](https://arxiv.org/abs/2607.19739) | RecSys 2026 | 作者：Mingdai Yang, Zhiwei Liu, Weizhi Zhang, Yibo Wang, Hao Peng

**🗣️ 大白话：** LLM 做推荐有两个硬伤：幻觉和上下文长度限制，没法做全量排序。这篇论文换个思路——不让 LLM 直接打分，而是让 LLM 当「指挥官」，指挥多个传统推荐模型（工具）协同工作。LLM 负责高层推理和个性化工具选择，传统模型负责 scalable 的全量排序。还设计了反射机制，让 agent 能根据用户画像和候选列表评估和比较不同工具的效果。

**🔬 专业讲解：** PRTA 框架将 LLM 作为 central planner，与多个推荐模型作为工具交互：(1) LLM-based agent 负责高层推理和个性化工具选择；(2) 传统推荐模型执行 full-ranking scoring，利用其在行为模式建模上的可扩展性；(3) 反射机制支持 agent 基于用户画像和候选排序列表评估比较工具。三个公开数据集上的实验表明 PRTA 在全量排序推荐性能上优于传统推荐和 LLM-based baseline。

---

### 6. Topology-Aware Tokenization for Generative Recommendation (RecSys 2026)

📄 [arXiv:2607.18600](https://arxiv.org/abs/2607.18600) | RecSys 2026 | 作者：Yaokun Liu, Yifan Liu, Zhenrui Yue, Gyuseok Lee, Zelin Li

**🗣️ 大白话：** 生成式推荐把 item 编码成一串 token，但这里有个被忽视的问题：item 在原始语义空间中的相邻关系，经过量化（quantization）后被打乱了。就像把一幅地图切成小块重新排列，地理关系全乱了。TopoTok 提出三层蒸馏来保持拓扑结构：先学组间关系（大局），再学组内结构（局部），最后对齐单个 item（精细）。实验显示 Recall@5 最高提升 9.42%。

**🔬 专业讲解：** TopoTok 针对生成式推荐中 item tokenization 的 topology distortion 问题，提出多层级蒸馏方案：(1) Inter-Group Distillation 捕获全局 cluster-wise 关系；(2) Intra-Group Distillation 精化语义 cluster 内的局部结构；(3) Inter-Item Distillation 在单个 item 级别强制执行细粒度对齐。三个 benchmark 数据集上 Recall@5 提升最高达 9.42%。

---

### 7. Beyond Noisy Signals: Dual-Level Denoising for Multi-modal Sequential Recommendation (ACM MM 2026)

📄 [arXiv:2607.18786](https://arxiv.org/abs/2607.18786) | ACM MM 2026 | 作者：Jie Luo, Qi Jin, Xinming Zhang

**🗣️ 大白话：** 多模态序列推荐用文本、图片等 side information 增强推荐，但有两个噪声来源：一是预训练特征和推荐意图之间的语义 gap 导致特征冗余；二是用户行为序列里的「误点击」等随机噪声。DDMSR 从两个层面解决这个问题：用图拉普拉斯平滑做特征去噪（结构低通滤波），用 FFT 和可学习频率滤波器做序列去噪（频域过滤）。还加了多模态对比对齐来处理跨模态异质性。

**🔬 专业讲解：** DDMSR 提出 Dual-Noise Dilemma 形式化框架：(1) Feature-level redundancy：通用预训练表示与细粒度推荐意图之间的语义 gap；(2) Sequence-level stochasticity：误点击等虚假交互引入的随机性。解决方案：(a) 图基特征去噪模块，利用 item 语义图上的 Laplacian smoothing 作为结构低通滤波器；(b) 频域序列去噪模块，使用 FFT 和可学习频率滤波器自适应调制交互频谱；(c) 多模态对比对齐目标桥接异质性 gap。四个公开 benchmark 上 consistently 超越 SOTA。

---

### 8. RAMP: Robust Ad Recommendation Under Limited Personalized-Feature Availability via Masking and Alignment Pathways (ICTIR 2026)

📄 [arXiv:2607.17473](https://arxiv.org/abs/2607.17473) | ICTIR 2026 | 作者：Dairui Liu, Zhongyi Lu, Roger Zhe Li, Changhong Jin, Jitao Lu

**🗣️ 大白话：** 在线广告里，CTR/CVR 预测高度依赖用户的个性化特征（年龄、性别等），但隐私法规越来越严，这些特征经常拿不到。RAMP 的解决思路是：训练时同时走两条路——一条用全部特征（含个性化），一条只用非个性化特征；然后用一个「蒸馏式」的对齐架构，让非个性化路径的预测向全特征路径学习。这样部署时即使没有个性化特征，预测质量也不会掉太多。

**🔬 专业讲解：** RAMP 包含三个核心组件：(1) Personalized Pathway：基于 dual-tower 组件，相同输入但独立参数，输出 masking 分离个性化与非个性化信号预测；(2) Non-Personalized Pathway：仅使用非个性化特征训练；(3) 蒸馏式预测对齐架构：在 personalized 和 non-personalized 路径之间进行预测对齐，提升无个性化特征时的预测能力。在多个 backbone 模型和公开/工业数据集上验证，缺失个性化特征时 consistently 超越 SOTA，全特征可用时保持 competitive performance。

---

### 9. Learning Sparse Representations of Multimodal Content for Enhanced Cold Item Recommendation (RecSys 2026)

📄 [arXiv:2607.17184](https://arxiv.org/abs/2607.17184) | RecSys 2026 | 作者：Gregor Meehan, Johan Pauwels

**🗣️ 大白话：** 冷启动 item 没有历史交互数据，通常靠 item 的内容特征（图片、文本）生成 embedding。但工业级目录里 embedding 存储是个大问题。这篇论文发现稀疏 embedding 比稠密 embedding 更适合冷启动场景：存储更小，还能通过「预稀疏化激活」技术让相似度计算更 sharp 更去噪。多兴趣用户的场景下提升尤其明显。

**🔬 专业讲解：** 论文提出稀疏表示用于基于内容的冷启动推荐：(1) 将现有冷启动训练流程适配于稀疏表示学习；(2) 基于线性注意力 insights 设计 pre-sparsification 激活技术，在 item-item 相似度中引入 sharpness 和去噪效果；(3) 四个多模态 RS 数据集上显示稀疏 embedding 在显著降低存储成本的同时提升冷启动推荐精度，且具有良好的可解释性和 size-accuracy 权衡鲁棒性。

---

### 10. Uncertainty as Remedy: Mitigating Satisfaction Label Bias in Short Video Multi-Objective Ensemble Ranking

📄 [arXiv:2607.17092](https://arxiv.org/abs/2607.17092) | 作者：Zonghe Shao, Tiantian He, Xiaoxiao Xu, Jiaqi Yu, Minzhi Xie

**🗣️ 大白话：** 短视频推荐的核心难题是「真实满意度不可观测」，模型只能靠点击率、观看时长等 proxy 信号训练，但这些信号是片面的、碎片化的，甚至相互矛盾。现有方法要么无视这个不确定性，要么只在排序后做后处理。UAME 把预测建模成一个高斯变量——均值是预测分数，方差是不确定性——然后设计了一个概率化 pairwise ranking loss，并基于不确定性做样本级重加权，从源头缓解 label bias。已经在工业短视频平台上线了，效果稳定显著。

**🔬 专业讲解：** UAME 将预测表示为高斯评分变量（均值=预测满意度，方差=预测不确定性），核心贡献：(1) 概率化 pairwise ranking loss；(2) 不确定性感知样本级 weighting scheme 缓解 satisfaction label bias（附理论分析）；(3) 大规模工业短视频平台离线+在线实验，consistently 提升 EMER 和 EASQ 两种 SOTA 范式，与用户问卷满意度更一致。

---

### 11. Mitigating Matthew Effect: Multi-Hypergraph Boosted Multi-Interest Self-Supervised Learning for Conversational Recommendation

📄 [arXiv:2607.18609](https://arxiv.org/abs/2607.18609) | 作者：Yongsen Zheng, Ruilin Xu, Guohua Wang, Liang Lin, Kwok-Yan Lam

**🗣️ 大白话：** 推荐系统里的「马太效应」——热门 item 越来越火，冷门 item 无人问津——在对话式推荐里更严重，因为用户和系统在持续交互中可能不断强化已有偏见。HiCore 用多层超图（item、entity、word 三个通道）来学习多层级用户兴趣，通过自监督学习来缓解马太效应。四个 CRS 数据集上达到 SOTA。

**🔬 专业讲解：** HiCore 针对对话式推荐中的马太效应问题，构建 item-、entity-、word-oriented 多通道超图，通过多层级用户兴趣学习和自监督信号来缓解动态交互循环中的马太效应放大。四个 CRS 数据集上达到新的 SOTA。

---

### 12. HyCoRec: Hypergraph-Enhanced Multi-Preference Learning for Alleviating Matthew Effect in Conversational Recommendation

📄 [arXiv:2607.17461](https://arxiv.org/abs/2607.17461) | 作者：Yongsen Zheng, Ruilin Xu, Ziliang Chen, Guohua Wang, Mingjie Qian

**🗣️ 大白话：** 和上面 HiCore 是同一个团队的连续工作，HyCoRec 更全面地覆盖了用户的多方面偏好：item、entity、word、review、知识五个维度，通过超图增强来学习这些偏好，在对话生成和推荐预测两个任务上同时缓解马太效应。

**🔬 专业讲解：** HyCoRec 提出超图增强的多偏好学习框架，同时建模 item-、entity-、word-、review- 和 knowledge-aspect 偏好，通过超图结构捕获高阶交互关系，在对话推荐任务中有效缓解马太效应。两个 benchmark 上达到 SOTA。

---

### 13. Spectral Biclustering-Driven Scalability for Post-Hoc Explainability in Recommender Systems

📄 [arXiv:2607.19189](https://arxiv.org/abs/2607.19189) | 作者：Jose L. Salmeron, Irina Arévalo

**🗣️ 大白话：** 推荐系统的可解释性很重要，但 post-hoc 方法（比如删除诊断）计算量太大，逐用户/逐 item 重训练成本高得不可接受。这篇论文用谱双聚类把用户和 item 分组，然后按块删除，大幅减少了重训练次数。有意思的是，他们发现排名越高的推荐结果对特定交互块越敏感，不同用户段对块删除的敏感度也不同。

**🔬 专业讲解：** 提出基于谱双聚类的块删除诊断框架：(1) 使用 spectral biclustering 对用户和 item 分组；(2) 按块删除交互而非逐条删除，减少重训练开销；(3) 在 SVD 和 NCF 上于 MovieLens 和 Amazon 数据集验证；(4) 发现 top-ranked 推荐对特定交互块更敏感，不同用户段敏感度异质。

---

## 📋 其他论文速览

- **SHIFT: Self-reconstruction Harnesses Implicit Fine-grained Thinking for Retrieval**（arXiv:2607.21333）：通过自重构捕获检索中的隐式细粒度推理
- **Controllable and Content-Based Recommendations**（arXiv:2607.20938）：可控与基于内容的推荐
- **Fast and Efficient Approximate Nearest Neighbor Search for High-Dimensional LLM Embeddings**（arXiv:2607.20957）：高维 LLM embedding 的快速近似最近邻搜索
- **Cardinality-Decomposed Loss: Matching Training Objectives to Relation Structure in Heterogeneous Recommendation Graphs**（arXiv:2607.20737）：基数分解损失匹配异构推荐图中的关系结构
- **SalesLoop: Reinforcement Learning from Performance Feedback for Sales Lead Ranking**（arXiv:2607.20655）：从绩效反馈中学习销售线索排序
- **jina-reranker-v3.5: An Efficient Listwise Reranker with Hybrid Attention and Self-Distillation**（arXiv:2607.18152）：高效列表级重排序器
- **The Matryoshka Hypencoder**（arXiv:2607.17457）：Matryoshka 假设编码器，SIGIR 2026
- **Exposure-Based Reinforcement Learning to Rank**（arXiv:2607.18689）：基于曝光的强化学习排序，ICTIR 2026
- **AutoIndex: Learning Representation Programs for Retrieval**（arXiv:2607.18603）：学习检索的表示程序
- **TSGR: Taobao Search Generative Retrieval**（arXiv:2607.18796）：淘宝搜索生成式检索
- **An Epistemic Position-Based Click Model**（arXiv:2607.18712）：基于认知位置的点击模型，SIGIR 2026
- **PLAID-PRF: Pseudo-Relevance Feedback with Centroid-like Tokens in PLAID**（arXiv:2607.18626）：PLAID 中的伪相关反馈，SIGIR 2026
- **MagicSelector: Joint Optimization for Agent Tool Selection via Counterfactual Decomposition and Progressive Reranking**（arXiv:2607.17751）：Agent 工具选择的联合优化
- **Search-on-Graph-R1: Training LLMs to Search Knowledge Graphs with RL**（arXiv:2607.18481）：用 RL 训练 LLM 搜索知识图谱
- **Search-on-Graph: Iterative Informed Navigation for LLM Reasoning on Knowledge Graphs**（arXiv:2510.08825）：知识图谱上的迭代知情导航，KDD 2026
- **UniRank: Benchmarking Ranking Models for Unified Sequential Modeling and Feature Interaction**（arXiv:2607.19987）：统一序列建模和特征交互的排序模型基准测试
- **Adapting Embedding Models for Agent Capability Retrieval**（arXiv:2607.17347）：为 Agent 能力检索适配 embedding 模型，SIGIR 2026 Workshop
- **Personalized Recommendation Tool Learning via Autonomous Language Agents**（arXiv:2607.19739）：自主语言 Agent 的个性化推荐工具学习，RecSys 2026
- **PAGE-RAG: Evidence-Grounded Adaptive Graph Retrieval for Long-Document QA**（arXiv:2607.19301）：基于证据的自适应图检索用于长文档问答
- **GraphContainer: A Unified Platform for Comparing and Debugging Graph RAG Methods**（arXiv:2607.19362）：Graph RAG 方法的统一比较调试平台，VLDB 2026 Demo
- **FinSAgent: Corpus-Aligned Multi-Agent RAG Framework for SEC Filing QA**（arXiv:2607.18102）：SEC 文件问答的多 Agent RAG 框架
- **Evidence-in-the-Loop: Trace-Driven Optimization for Customer-Service LLM Agents**（arXiv:2607.18039）：客服 LLM Agent 的追踪驱动优化
- **Agentic Context Management: Solving Agent Memory and Cost by Treating Them as Lifecycle and Architecture Problems**（arXiv:2607.21503）：Agent 记忆和成本的架构化解决方案
- **TopoGuard: Graph Theory Based Defenses Against Split-Knowledge Attacks on RAG**（arXiv:2607.20437）：基于图论的 RAG 分割知识攻击防御
- **RAGAL: A Frugal, Fully Local Retrieval-Augmented Assistant for Technical Support**（arXiv:2607.18756）：低成本全本地 RAG 技术支撑助手
- **Using Hierarchical Controlled Vocabularies to Understand CLIP Retrieval Failures in Historical Photo Collections**（arXiv:2607.19836）：理解历史照片集合中 CLIP 检索失败
- **CIR at iKAT SCAI 2026: Exploring Clarification Need Prediction in Agentic Conversational Search**（arXiv:2607.19801）：对话式搜索中的澄清需求预测
- **Answer-Reconstruction Search Density**（arXiv:2607.18904）：测量对话答案压缩的查询和源工作量
- **Near-Optimal Dimension Lower Bounds for Single-Vector Embeddings of MIPS**（arXiv:2607.20393）：MIPS 单向量嵌入的近优维度下界
- **Two-Step Occupation Coding**（arXiv:2607.20101）：两步职业编码
- **Sequential Learner Modeling Using Multi-Relational Graph Convolutional Networks**（arXiv:2607.19253）：多关系图卷积网络的序列学习者建模
- **Biological Amnesia in ICU Time-Series Prediction**（arXiv:2607.19020）：ICU 时间序列预测中的生物遗忘
- **AILQA: Evaluating AI-Driven Legal Question Answering Systems for the Indian Legal System**（arXiv:2607.18825）：印度法律系统的 AI 法律问答评估
- **Transparent by Design, Usable in Practice? A Formative Usability Study of a Conversational Product Advisor**（arXiv:2607.21513）：对话式产品顾问的可用性研究
- **Remote Awareness of Seafloor Images Collected by AUVs**（arXiv:2607.18013）：AUV 收集的海底图像远程感知
- **Fenced Citation-Context Retrieval for Case Law**（arXiv:2607.17142）：案例法的围栏引用上下文检索
