---
title: "【推荐系统 Paper 日报】2026-07-03"
date: 2026-07-03
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2772314910"
---

# 【推荐系统 Paper 日报】2026-07-03

## 📊 今日概览

arXiv cs.IR 公告日期 **Fri, 3 Jul 2026**，今日新上线 12 篇论文，其中推荐系统及相关方向 10 篇。本期亮点：Netflix 推出端到端生成式首页构建系统 GenPage，并在线上 A/B 测试中取得显著收益；ShopX 探索大模型原生语义 ID 在智能购物中的应用；Diffusion-GR2 将扩散模型引入重排序阶段，实现推理速度 2.4-3.5 倍提升。整体趋势是"大模型 + 推荐系统"深度融合，从召回、排序到解释生成全面渗透。

---

## 🔥 推荐系统论文深度解读

### 1. GenPage: Towards End-to-End Generative Homepage Construction at Netflix

📄 [arXiv:2606.31031](https://arxiv.org/abs/2606.31031) | Netflix | Lequn Wang, Jiangwei Pan, Fengdi Che, Linas Baltrunas

**🗣️ 大白话：**
Netflix 把传统的「多阶段推荐流水线」彻底干掉了，换成一个 Transformer 直接生成整个首页！以前是先召回、再排序、再排版的层层漏斗，现在是把用户上下文当作 prompt，让模型自回归地生成多行结构化内容。线上实验显示，用户核心指标提升了 0.24%（p < 0.001），端到端服务延迟还降低了 20%。

**🔬 专业讲解：**
GenPage 的核心创新在于用一个生成模型替代了传统的多阶段推荐系统。它将用户请求上下文编码为 prompt，通过自回归生成整个多行首页结构。训练采用 LLM 的经典范式：先在生产页面数据上预训练，再通过加权二元分类（WBC）或强化学习（RL）进行后训练。为解决工业级部署挑战，论文提出了冷启动、模型时效性、业务规则约束和 serving 效率的解决方案。关键离线发现：在当前 regime 下，丰富 prompt 的收益大于扩大模型容量；RL 后训练即使不将多样性纳入目标，也能提升首页多样性。

---

### 2. ShopX: A Foundation Model for Intent-to-Item Fulfillment in Agentic Shopping

📄 [arXiv:2606.31693](https://arxiv.org/abs/2606.31693) | 淘宝/阿里 | Jiacheng Chen 等 26 人

**🗣️ 大白话：**
智能购物时代，LLM 代理不能只会"聊天"，还得直接操作商品空间。ShopX 是一个专门为购物代理设计的基座模型，它把「理解意图、规划执行、操作商品」三件事统一到一个模型里。模型用语义 ID（SID）来操作商品，支持检索、排序、商品组合等操作，在淘宝真实日志上验证效果优于工具调用方案。

**🔬 专业讲解：**
ShopX 解决了现有 LLM 代理购物系统的瓶颈：LLM 只能通过低带宽的检索/排序接口与商品空间交互，导致复杂意图的 fulfillment 效率低下。方案核心包括：(1) 设计语义可恢复、LLM 可操作的语义 ID（SIDs）；(2) 训练方案使通用 LLM 掌握灵活的多轮商品空间操作能力；(3) 模型原生 item-fulfillment 框架，定义面向模型的动作协议，支持上下文访问、目录 grounding 和状态管理。ShopX 支持 SID 束搜索检索、列表排序、商品打包等操作。在淘宝匿名生产日志的单轮和多轮 fulfillment 任务上，模型原生方案优于工具调用方案，尤其在复杂或模糊请求上表现突出。

---

### 3. Diffusion-GR2: Diffusion Generative Reasoning Re-ranker

📄 [arXiv:2607.01170](https://arxiv.org/abs/2607.01170) | Meta/GR2 团队 | Zhuoxuan Zhang 等 14 人

**🗣️ 大白话：**
生成式重排序器 GR2 通过链式思维（CoT）在重排序前进行推理，效果虽好但推理太慢——因为自回归解码每个 token 都要一次前向传播。这篇论文把 GR2 改成了扩散模型版本，通过并行去噪多个位置，推理速度提升了 2.4-3.5 倍，同时精度接近原版！

**🔬 专业讲解：**
Diffusion-GR2 通过三个关键步骤解决从自回归到扩散转换的精度损失：
1. **Conversion Fine-Tuning (CFT)**：将 AR 初始化的扩散模型适配为独立去噪出有效排列（permutation），无需外部约束解码器。
2. **On-Policy Distillation (OPD)**：用模型自身解码的轨迹进行监督，通过 AR 教师提供密集逐 token 目标。
3. **RL stage**：在 OPD 的 on-policy 策略基础上，针对重排序奖励进行强化学习。

在 Amazon Beauty 数据集上，Diffusion-GR2 恢复到了接近 AR 重排序器的精度，同时 block-parallel 解码将推理吞吐量提升了 2.4-3.5 倍。消融实验表明 CFT 恢复了大部分转换差距，OPD 进一步将其缩小到 AR 参考水平。

---

### 4. Bi-NAS: Towards Effective and Personalized Explanation for Recommender Systems via Bi-Level Neural Architecture Search

📄 [arXiv:2607.01387](https://arxiv.org/abs/2607.01387) | 推荐系统可解释性 | Longfeng Wu, Yao Zhou, Tong Zeng 等 8 人

**🗣️ 大白话：**
推荐系统的解释经常让人看不懂，或者太笼统。这篇论文用神经架构搜索（NAS）来自动设计最优的解释生成架构，同时结合大语言模型做零样本解释生成，让推荐理由更贴合用户个人偏好。

**🔬 专业讲解：**
Bi-NAS 提出双层神经架构搜索框架，同时优化解释层和推荐层的设计空间。具体来说，它同时探索层内（intra-layer）和层间（inter-layer）的架构设计，包括交叉注意力机制和特征交互函数。此外，Bi-NAS 集成 LLM 增强解释生成，通过零样本提示产生更有效和个性化的推荐理由。通过将用户特征偏好与商品质量分数对齐，确保解释同时反映用户意图和商品属性。在四个真实数据集上的评估表明，Bi-NAS 不仅提升了推荐准确性，还显著改善了解释的有效性。

---

### 5. Planning over Matrix-Factorization MDPs for Candidate Generation

📄 [arXiv:2607.02115](https://arxiv.org/abs/2607.02115) | 候选生成 | Mikhail Trapeznikov, Maksim Utushkin

**🗣️ 大白话：**
传统矩阵分解做候选生成时，每次推荐都是独立的，不考虑用户看了前面推荐后状态的变化。这篇论文把隐式 ALS 的后验建模成马尔可夫决策过程（MDP），通过动态规划来做候选生成，不用重新训练模型，直接在现有 embedding 上规划即可提升效果。

**🔬 专业讲解：**
论文将 top-K 检索建模为隐式 ALS 后验 (A⁻¹, u) 上的 MDP，其中动作是商品，转移是闭式秩一 fold-in，轨迹奖励结合相关性相似度和后验对齐项。在五个数据集和两种划分协议（per-user leave-last-n 和 stricter global time split）上，动态感知规划在 leave-last-n 上优于静态检索，在 MovieLens-1M 和 VK-LSVD 切片上全局时间划分的增益也得以保持。关键发现：单步 lookahead 已捕获大部分增益，因此轻量级规划层将静态 top-K 评分转化为短程决策即可改进检索效果。增益取决于使用余弦相似度而非内积相似度，否则内积会与商品流行度纠缠。

---

### 6. IntentTune: Using user demand and personalization to resolve "unknown" query intents for e-commerce search

📄 [arXiv:2607.01530](https://arxiv.org/abs/2607.01530) | 电商搜索 | Rachith Aiyappa 等 7 人

**🗣️ 大白话：**
在电商搜索里，用户搜"手表"或"衬衫"时，系统不知道TA想要男款还是女款。IntentTune 通过分析用户的搜索历史、浏览行为和个人资料来推断这些模糊的意图，而且发现用户历史搜索比人口统计信息更管用。

**🔬 专业讲解：**
IntentTune 是一个解决电商搜索中模糊查询意图的框架。论文首先证明，仅使用群体级别的需求模式不足以可靠推断模糊查询的意图。然后证明，用户特定的行为信号——特别是先前的搜索查询——在推断性别、年龄组、产品类别和尺寸意图方面，优于群体统计和静态个人资料信息。框架同时支持两种信号来源：(1) 用户特定行为信号（搜索历史、浏览活动、个人资料属性）和 (2) 跨所有用户聚合的群体需求模式。在真实电商数据上的实验验证了行为信号的有效性。

---

## 📋 其他论文速览

- **Real-Time Hard Negative Sampling via LLM-based Clustering for Large-Scale Two-Tower Retrieval**（arXiv:2607.00448）：用 LLM 做聚类来实时生成难负样本，用于双塔模型训练。工业级部署，可处理数十亿数据点，还能打破推荐系统的反馈循环并降低流行度偏差。

- **Learning User-Aware Recall: Personalized Retrieval in Long-Term Conversational Memory**（arXiv:2607.00017）：提出 PPRO 框架，通过用户画像指导对话记忆检索，并用 GRPO 训练查询重写器，在 LoCoMo 和 LongMemEval-S 上取得一致提升。

- **Prompt Optimization for User Simulation in Conversational Recommender Systems**（arXiv:2607.00010）：多目标框架自动优化 CRS 用户模拟器的提示词，解决正偏差、数据泄露和行为多样性不足的问题。

- **From "Strings" to "Things" for Personal Knowledge Graphs: Evaluating LLM Triple Extraction for Recommendation Systems**（arXiv:2607.00003）：用轻量 LLM 从对话数据中提取结构化三元组构建个人知识图谱，评估了 Qwen 和 Gemma 系列在推荐下游任务中的表现。

- **CoPersona: Collaborative Persona Graphs for Robust LLM Personalization**（arXiv:2607.01485）：通过多层面 persona 图和邻居检索+图推理双分支架构，解决 LLM 个性化中用户历史稀疏和偏斜的问题。

- **Bringing Agentic Search to Earth Observation Data Discovery**（arXiv:2607.02387）：NASA 部署的代理搜索系统，结合知识图谱和监督学习+LLM 重排序，将 NASA 数据集检索的 MRR 提升 28%。

- **As It Was: Aligning LLM Search Evaluation with Historical User Preferences**（arXiv:2607.01040）：将 LLM 搜索评估与历史用户偏好对齐，提出更贴近真实用户行为的搜索评价方法。

- **ExPerT: Personalizing LLM Responses to Users' Domain Expertise**（arXiv:2607.01242）：通过查询语义和键盘行为信号联合推断用户领域 expertise，实现 LLM 响应的个性化， expertise 推断误差降低 65.7%。
