---
title: "【推荐系统 Paper 日报】2026-07-06"
date: 2026-07-06
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2773640228"
---

# 【推荐系统 Paper 日报】2026-07-06

## 📊 今日概览

arXiv cs.IR 7月3日（周五）批次共 12 篇论文，其中 5 篇与推荐系统、个性化与用户建模密切相关。本期亮点：**矩阵分解与强化学习的结合**带来了新的候选生成思路，**电商搜索中的用户意图理解**有了更精细的解决方案，而**大模型个性化**成为新的热门交叉方向，3篇论文从不同角度探索了如何让 LLM 更懂你。

---

## 🔥 推荐系统论文深度解读

### 1. Planning over Matrix-Factorization MDPs for Candidate Generation

📄 [arXiv:2607.02115](https://arxiv.org/abs/2607.02115) | KDD 2026 Workshop | Mikhail Trapeznikov, Maksim Utushkin

**🗣️ 大白话：** 传统的矩阵分解推荐把用户当一个固定的向量，只算一次相似度就给出Top-K结果。这篇论文说：不对，用户每次点击一个商品后，用户的"状态"就变了，下一个该推荐啥也应该跟着变。于是他们做了一件很巧妙的事——把矩阵分解的隐式反馈更新过程建模成一个**马尔可夫决策过程（MDP）**，每次推荐就是一次"行动"，而用户点击后的向量更新就是"状态转移"。关键是，这整个过程不需要重新训练模型，只是在线上做几步规划（MCTS），就能把静态的Top-K打分变成动态的序列决策，在MovieLens和VK数据集上都有提升。

**🔬 专业讲解：** 本文的核心贡献是将隐式ALS（iALS）后验推断的fold-in更新机制重新解释为一个MDP，其中状态为 $(A^{-1}, u)$，动作为候选item，转移为闭式秩一fold-in，奖励函数结合了 relevance similarity 和 posterior-alignment。作者比较了静态检索、单步规划和horizon-K的MCTS，在5个数据集和两种划分协议（leave-last-n 和全局时间划分）上验证。实验发现：cosine similarity 比 inner product 更适合作为relevance度量（因为inner product会被item popularity entangle），且单步lookahead就能捕获大部分增益。这意味着我们可以在不改动任何embedding的情况下，仅通过一个轻量级的在线规划层来提升候选生成效果。

---

### 2. IntentTune: Using user demand and personalization to resolve "unknown" query intents for e-commerce search

📄 [arXiv:2607.01530](https://arxiv.org/abs/2607.01530) | Amazon | Rachith Aiyappa, Ishita Khan, et al.

**🗣️ 大白话：** 电商搜索里，用户搜"手表"或"衬衫"这种词的时候，系统根本不知道他要的是男款还是女款、成人还是儿童。这篇文章来自Amazon，提出了IntentTune框架——与其猜，不如看用户以前搜过什么、看过什么。实验发现，**用户的历史搜索记录**比人口统计信息（年龄、性别）甚至全站统计数据都更能准确推断用户当前的意图。说白了，一个人之前搜了"男士运动鞋"，那他再搜"T恤"大概率也是要男款。

**🔬 专业讲解：** IntentTune 是一个两路意图消解框架：(1) 基于用户特定行为信号（搜索历史、浏览行为、画像属性）；(2) 基于全站聚合需求模式。在真实电商数据上的实验表明，群体级需求统计不足以可靠推断under-specified query的意图，而用户特定行为信号（尤其是历史搜索query）在推断性别、年龄、品类和尺寸意图上显著优于群体统计和静态画像。这一结论对工业界搜索系统的个性化query理解有重要指导意义。

---

### 3. CoPersona: Collaborative Persona Graphs for Robust LLM Personalization

📄 [arXiv:2607.01485](https://arxiv.org/abs/2607.01485) | Yangtian Zhang, Leyao Wang, Hiren Madhu, et al. (Rex Ying 组)

**🗣️ 大白话：** 大模型要个性化，但用户的历史记录往往又少又偏。比如一个用户只聊过几次天，系统根本没法了解他的全貌。CoPersona 的思路是：既然一个人的数据不够，就找跟他"像"的人。但问题是，"像"不能只看整体，因为一个人可能在A话题上很活跃、B话题上没聊过。所以CoPersona把用户历史按不同维度（facet）分解，然后在每个维度上分别找相似的人，通过一个叫"multiplex persona graph"的结构来建模。实验显示，这种"分维度找邻居"的方法比直接全局匹配要靠谱得多。

**🔬 专业讲解：** 核心创新点：1) 将稀疏的用户历史分解为多个facet-level表示，解决了不均衡维度覆盖导致的相似度计算偏差；2) 通过multiplex persona graph显式建模peer-to-peer的facet-level对齐；3) 采用双分支架构（non-parametric peer retrieval + parametric graph reasoning）在推理时有效利用peer信息。在多个领域和不同规模模型上的实验均一致优于强基线，验证了图结构协同个性化对LLM的增益。

---

### 4. Bi-NAS: Towards Effective and Personalized Explanation for Recommender Systems via Bi-Level Neural Architecture Search

📄 [arXiv:2607.01387](https://arxiv.org/abs/2607.01387) | Longfeng Wu, Yao Zhou, Tong Zeng, et al.

**🗣️ 大白话：** 推荐系统不仅要"推得准"，还要"说得清"——为什么给我推荐这个？现有的解释生成要么太模板化，要么不够个性化。这篇论文用**双层神经架构搜索（Bi-NAS）**来自动寻找最优的attention机制和特征交互方式，同时引入LLM做零样本解释生成，把用户的偏好特征和商品的质量得分对齐起来，让解释既符合用户兴趣又反映商品属性。

**🔬 专业讲解：** Bi-NAS 同时探索 intra-layer 和 inter-layer 的设计空间，联合优化cross-attention机制与特征交互函数。框架进一步整合LLM（通过zero-shot prompting）增强解释生成，将用户特征偏好与item质量得分对齐，确保解释同时反映用户意图和item属性。在4个真实数据集上的评估表明，Bi-NAS不仅提升了推荐准确率，还显著改善了解释的有效性，为用户提供了更清晰、更可靠的推荐洞察。

---

### 5. ExPerT: Personalizing LLM Responses to Users' Domain Expertise via Query-Wise Semantic and Keystroke Behavioral Cues

📄 [arXiv:2607.01242](https://arxiv.org/abs/2607.01242) | Yeji Park, Jiwon Tark, Taesik Gong

**🗣️ 大白话：** 同一个问题，专家和非专家需要的信息深度完全不同。问"量子计算是什么"，专家想要公式和论文，普通人想要类比和例子。ExPerT 的想法很新颖：它不仅看用户输入的文字，还看用户**打字的方式**——专家打字更快、用词更专业、修改更少。把文字语义和打字行为结合起来，推断用户在该领域的 expertise 水平，然后据此调整回答的详细程度、术语复杂度和概念深度。40人用户研究显示，expertise 推断错误率降低了65.7%，用户满意度提升了17.52%。

**🔬 专业讲解：** ExPerT 包含两个核心组件：(i) 语义-行为 expertise 推断模块，通过in-context LLM prompting联合解读query文本和keystroke动态；(ii) expertise-conditional响应生成，自适应调整回答的详细程度、术语选择和概念复杂度。这是query-wise个性化而非user-level全局个性化，能更精细地捕捉用户在单次交互中的领域能力波动。实验规模为40参与者、1270 queries，MAE从1.162降至0.398。

---

## 📋 其他论文速览

- **Bringing Agentic Search to Earth Observation Data Discovery**（arXiv:2607.02387）：NASA地球科学数据发现领域的Agentic搜索系统，从知识图谱出发，结合神经打分和BM25融合，再通过LLM做零样本重排，MRR提升28%。
- **Evaluating Chunking Strategies for Retrieval-Augmented Generation on Academic Texts**（arXiv:2607.01852）：对比固定长度、递归和基于聚类的语义分块策略在学术文本RAG中的效果，发现聚类分块并未显著优于简单策略。
- **Retrieval-Augmented Generation to Support Railways Engineering Tasks**（arXiv:2607.01244）：铁路工程领域的RAG系统从设计到部署的工业级案例研究，强调受监管行业的合规性和准确检索。
- **STRUCTSURVEY: Structured Agentic Retrieval for Automated Survey Paper Generation**（arXiv:2607.01243）：通过多智能体框架动态构建实体、关系和主题分类的图表示，将结构化推理从生成阶段前移到检索阶段，提升自动综述质量。
- **HNSW with Accuracy Guarantees Using Graph Spanners**（arXiv:2607.02338）：提出"Certify-then-Rectify"框架，为HNSW近似最近邻搜索提供理论正确性保证，通过极端值理论估计图的stretch factor。
- **Embedding Inference Attack**（arXiv:2607.01276）：在黑盒IR系统设置下，仅通过观察检索结果集合即可推断使用的embedding模型，揭示了RAG系统的安全风险。
- **Office Comprehension Benchmark**（arXiv:2607.01245）：首个联合评估LLM对Word、Excel、PowerPoint原生格式理解能力的基准测试，即使最强模型在领域问答上也仅达59.3%。
