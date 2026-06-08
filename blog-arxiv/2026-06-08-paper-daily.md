---
title: "【推荐系统 Paper 日报】2026-06-08"
date: 2026-06-08
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2767019681"
---

# 【推荐系统 Paper 日报】2026-06-08

## 📊 今日概览

arXiv cs.IR 于 2026年6月8日（周一）发布共 16 篇新论文，其中推荐系统相关论文 7 篇。本期亮点聚焦于**生成式推荐的三大热点**：动态语义 ID（解决冷启动痛点）、长序列注意力优化（线性复杂度 GBLA）、以及跨域冷启动（DoorDash 多场景 LLM 迁移）；此外还有一篇专门讨论如何公平评测推荐算法排名的方法论论文，非常实用。

## 🔥 推荐系统论文深度解读

### 1. Bradley-Terry Rankings for Recommender Systems Across Dataset Taxonomies

📄 [arXiv:2606.07492](https://arxiv.org/abs/2606.07492) | Ekaterina Grishina, Stepan Kuznetsov 等 11 位作者

**🗣️ 大白话：** 推荐算法的评测一直有个老问题——换个数据集，排名就变了。这篇论文用赛马中常用的 Bradley-Terry 模型来给算法排名，比简单取平均靠谱多了，而且还提出了"排名一致性"这个新指标来量化结果有多稳定。

**🔬 专业讲解：** 该工作将 Bradley-Terry（BT）配对比较模型引入推荐算法评测框架。BT 模型将多个基准数据集上的性能对比转化为成对胜负关系，再用最大似然估计得到全局排名。作者进一步提出 **ranking consistency metric**，衡量当数据集子集缺失时排名的鲁棒性，并实证了算法排名受数据稀疏度、序列结构、规模等因素显著影响。该框架为跨数据集公平评测提供了可量化的方法论基础，对 RecSys 社区的 Benchmark 设计有直接参考价值。

---

### 2. PaperFlow: Profiling, Recommending, and Adapting Across Daily Paper Streams

📄 [arXiv:2606.07454](https://arxiv.org/abs/2606.07454) | Fuqiang Wang, Song Tan, Zheng Guo 等 11 位作者

**🗣️ 大白话：** 现有的论文推荐系统都是"静态排名"，但研究者的兴趣是天天变的。PaperFlow 把学术论文推荐做成了一个动态追踪系统：每天根据你的阅读和评分更新你的学术画像，推送当天 arXiv 新论文，还能捕捉兴趣漂移。

**🔬 专业讲解：** PaperFlow 将每日论文推荐分解为三个耦合阶段：(1) **Profiling**——基于冷启动异构信号（过往论文、机构、关键词等）构建可解释的学术画像；(2) **Recommending**——在固定展示配额约束下，对每日候选流进行多信号聚合排序；(3) **Adapting**——从语义差异化的反馈信号（阅读时长、显式评分、跳过）中建模跨天的兴趣漂移。论文还构建了一个纵向 user-day benchmark，固定用户、日期、候选池和可见输入，为动态推荐研究提供了可复现的评测协议。

---

### 3. Gated Bidirectional Linear Attention for Generative Retrieval

📄 [arXiv:2606.07317](https://arxiv.org/abs/2606.07317) | Artem Matveev, Vladislav Tytskiy, Sergei Makeev, Sergei Liamaev

**🗣️ 大白话：** 生成式推荐要用 Encoder 处理用户历史序列，但用标准 Transformer 的话，序列越长计算量越爆炸。这篇论文提出 GBLA（门控双向线性注意力），把复杂度从 O(n²) 降到 O(n)，同时还保持了双向注意力的质量优势。

**🔬 专业讲解：** 在 Encoder-Decoder 式生成式检索框架中，Encoder 对活跃用户的超长历史序列处理存在二次复杂度瓶颈。GBLA 在核函数线性注意力基础上引入三个轻量组件：**Conv1D 局部因果混合**（捕捉短程依赖）、**输入门**（控制当前 token 对状态的贡献）、**遗忘门**（抑制历史状态的累积噪声）。三者协同形成线性时间的双向注意力层，在大规模流媒体推荐系统中实验验证其在质量和延迟之间取得了更优的 Pareto 权衡。

---

### 4. Beyond Matching: Category-Guided Latent Intent Reasoning for Generative Retrieval in E-Commerce

📄 [arXiv:2606.07075](https://arxiv.org/abs/2606.07075) | Fuwei Zhang, Xiaoyu Liu, Jiajie Jin 等 11 位作者

**🗣️ 大白话：** 电商搜索里，用户查询往往又短又杂，和系统里的商品语义 ID（SID）差距很大。用 CoT 显式推理能缩小差距，但太慢了。这篇论文的 CaLIR 把推理过程藏进隐空间，又快又准。

**🔬 专业讲解：** CaLIR（Category-guided Latent Intent Reasoning）针对电商生成式检索的"查询-SID 语义鸿沟"问题。电商 query 通常是短噪声属性词，而 SID 是离线分词器生成的紧凑语义标识符，两者表示空间天然割裂。论文提出用**品类树作为监督信号**引导隐式推理：模型在生成 SID 之前先在连续隐空间执行品类对齐的意图推理，避免 CoT 显式生成的额外延迟。该方法在工业电商数据集上实现了 recall 和延迟的双赢，具有较强的工程落地价值。

---

### 5. SSRLive: Live Streaming Recommendation with Dynamic Semantic ID

📄 [arXiv:2606.06970](https://arxiv.org/abs/2606.06970) | Teng Shi, Zhaoheng Li, Yuanhang Qu 等 6 位作者

**🗣️ 大白话：** 直播推荐很特殊——每个直播间的内容每时每刻都在变，用静态的语义 ID 根本跟不上。SSRLive 动态更新语义 ID，让生成式推荐框架真正能用在直播场景里。

**🔬 专业讲解：** 将生成式推荐迁移到直播场景面临两大核心挑战：(1) **静态 SID 问题**——直播内容实时变化，离线分词的 SID 无法反映当前直播间状态；(2) **资源利用率低**——现有方法 FLOPs 偏低，算力利用不充分。SSRLive 提出**动态语义 ID 更新机制**，基于直播流的实时文本/弹幕信号周期性重建 SID，同时设计了针对直播场景的生成式 Pipeline，解决了 SID 时效性与生成效率的矛盾，在工业直播平台数据集上取得显著收益。

---

### 6. DREAM: Dynamic Refinement of Early Assignment Mappings

📄 [arXiv:2606.06947](https://arxiv.org/abs/2606.06947) | Liwei Guan, Huanjie Wang, Hongwei Zhang, Linxun Chen, Zhaojie Liu

**🗣️ 大白话：** 生成式推荐里，新上架的商品（冷启动）拿到的语义 ID 质量很差——因为没有用户反馈数据，分词器瞎猜的。DREAM 发现这是"过早承诺静态 ID"的问题，提出动态优化早期 SID 分配的方案。

**🔬 专业讲解：** 在 SID-based 生成式推荐框架中，冷启动 item 的 SID 由离线分词器在用户反馈稀疏时一次性分配，导致语义区分度低、训练中很少被采样、路径对齐差的恶性循环。DREAM（Dynamic Refinement of Early Assignment Mappings）将问题归因于**分词目标与生成目标的割裂**，提出在 item 积累足够反馈后动态精炼其 SID，桥接两个目标，让冷启动 item 随时间获得更优的语义标识符，从而提升生成路径的对齐质量和召回效果。

---

### 7. Mind the Gap: Bridging Behavioral Silos with LLMs in Multi-Vertical Recommendations

📄 [arXiv:2606.06779](https://arxiv.org/abs/2606.06779) | Nimesh Sinha, Raghav Saboo, Martin Wang, Sudeep Das（DoorDash）

**🗣️ 大白话：** DoorDash 上，外卖订单多、但买菜/零售数据少。新业务线冷启动怎么办？这篇论文用 LLM 把用户的外卖历史翻译成跨品类的用户偏好特征，然后给买菜推荐用，效果提升明显。

**🔬 专业讲解：** 本文来自 DoorDash 工业实践，针对多业务线平台中数据丰富场景（外卖）向数据稀疏场景（生鲜/零售）的**跨域冷启动**问题。核心方法是**层次化 RAG Pipeline**：以用户外卖订单历史和搜索 query 为输入，通过 LLM 生成多层级品类特征（item-level → category-level → user-level），这些生成特征编码了用户的潜在亲和度，作为附加侧信息注入目标域推荐模型，有效缓解了新业务线 user 冷启动问题。该框架在无需跨域用户匹配的条件下实现知识迁移，具有良好的可扩展性。

---

## 📋 其他论文速览

- **FLOWREADER**（[arXiv:2606.07235](https://arxiv.org/abs/2606.07235)）：用最小代价流（Min-Cost Flow）优化多模态长文档 QA 中跨文本/表格/图片的证据聚合问题，解决 Top-k 检索的碎片化缺陷。

- **HKVM-RAG**（[arXiv:2606.07218](https://arxiv.org/abs/2606.07218)）：提出 Key-Value 分离的超图证据组织结构，专为 Multi-Hop RAG 设计，在固定检索预算内暴露多跳答案链。

- **RISE**（[arXiv:2606.07187](https://arxiv.org/abs/2606.07187)）：用 Rust 实现的高性能倒排索引库，支持高效全文检索，设计上兼顾安全性和低延迟。

- **Decision-Theoretic Stopping Rules**（[arXiv:2606.07071](https://arxiv.org/abs/2606.07071)）：将决策理论引入 Technology-Assisted Review（TAR）停止规则，结合审查目的动态决定何时停止文档筛选。

- **Semantic R-Precision (SemR-p)**（[arXiv:2606.07057](https://arxiv.org/abs/2606.07057)）：关键词自动评估的新指标，将语义相似度与预测排名结合，弥补纯词汇匹配指标的不足。

- **Towards Retrieving Interaction Spaces for Agentic Search**（[arXiv:2606.06880](https://arxiv.org/abs/2606.06880)）：重新定义 Agent 检索范式：检索不只是返回文档，而是构建 Agent 可交互探索的"语料子空间"，解决 DCI 无边界交互的扩展性问题。

- **UnEmbedding Matrix as Feature Lens**（[arXiv:2606.07502](https://arxiv.org/abs/2606.07502)）：发现 LLM 的 UnEmbedding 矩阵可作为文本嵌入的特征透镜，解释为何 LLM 直接当 Embedding 模型效果差，并提出改进方案。

- **TA-RAG**（[arXiv:2606.06794](https://arxiv.org/abs/2606.06794)）：针对 HIV 等同伴健康支持场景，在 RAG 基础上引入语气感知机制，确保生成内容不仅事实准确，还要无污名化、有同理心。
