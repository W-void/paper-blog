---
title: "【推荐系统 Paper 日报】2026-06-19"
date: 2026-06-19
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2769496737"
---

# 【推荐系统 Paper 日报】2026-06-19

## 📊 今日概览

arXiv 于 **Fri, 19 Jun 2026** 发布了 cs.IR 类别共 **18 篇**新论文，其中推荐系统相关论文 **4 篇**。本期亮点：工业界 generative recommendation 再进一步，G2Rec 提出了统一图建模与语义 tokenization 的框架；Token Factory 则为大推荐模型（LRM）高效整合异构信号提供新思路；快手也在冷启动去噪方向上带来了已部署上线的 DIF 方法。

## 🔥 推荐系统论文深度解读

### 1. Structuring and Tokenizing Distributed User Interest Context for Generative Recommendation

📄 [arXiv:2606.20554](https://arxiv.org/abs/2606.20554) | 作者：Ruizhong Qiu, Yinglong Xia, Dongqi Fu, Hanqing Zeng, Ren Chen 等 (Meta & UIUC)

**🗣️ 大白话：** 生成式推荐现在挺火的，但怎么把用户行为和商品语义同时喂给模型是个难题。图方法太慢或只看局部，语义 tokenization 又常常拍脑袋搞。这篇论文搞了个叫 G2Rec 的框架，把用户协同行为的图建模和语义 tokenization 统一起来，既 scalable 又准确，还不需要人工标注的兴趣标签。

**🔬 专业讲解：** G2Rec 的核心创新在于将分布式用户兴趣上下文的结构化与 tokenization 合二为一。现有方法存在两条路线的局限：1) 图序列化/GNN 类方法要么扩展性差，要么只利用局部图信息；2) 语义 tokenization 依赖启发式规则，缺乏显式监督。G2Rec 通过 holistic graph-based user co-engagement modeling 捕获全局用户兴趣原型，同时结合语义 tokenization 实现语义对齐。该方法无需 ground-truth user interest 标签，即可在工业级序列推荐场景中实现全面且准确的用户行为建模。论文已在 Meta 的产品 surface 上进行了在线部署，并在公开数据集上验证了优越性。

---

### 2. Token Factory: Efficiently Integrating Diverse Signals into Large Recommendation Models

📄 [arXiv:2606.19635](https://arxiv.org/abs/2606.19635) | 作者：Xilun Chen, Shao-Chuan Wang, Baykal Cakici, Lukasz Heldt, Lichan Hong 等 (Google)

**🗣️ 大白话：** 大推荐模型（LRM）很强，但把传统推荐里的各种信号（ID、类别、统计特征等）塞进 Transformer 架构里，要么 prompt 太长，要么内存和算力爆炸。这篇论文提出了 "Token Factory"，把传统信号压缩成 "soft token"，直接喂给 LRM，既省资源又提效果。

**🔬 专业讲解：** Token Factory 针对 LRM 中异构信号整合的效率瓶颈提出了系统性解决方案。传统方法（如直接文本化或离散 item 表示）会导致 prompt 长度爆炸、内存占用高、计算开销大。Token Factory 将传统信号转化为 soft token，实现特征的高效压缩与整合，避免 prompt 长度失控，同时提升模型性能。论文详细介绍了架构设计，并在生产级推荐环境中验证了有效性。该工作为 LRM 的工业化落地提供了关键的基础设施支持。

---

### 3. VCG: A Multimodal Retrieval Framework for E-Commerce Video Feeds under Extreme Cold-Start Conditions

📄 [arXiv:2606.19627](https://arxiv.org/abs/2606.19627) | 作者：Katya Mirylenka, Egor Malykh, Mahdyar Ravanbakhsh, Michael Gygli, Marco-Andrea Buchmann 等 (eBay)

**🗣️ 大白话：** 电商正在从静态搜索目录转向沉浸式视频流。新视频没有交互历史，传统协同过滤完全失效，而且视频流里的位置 bias 和观看时长 bias 会让信号严重失真。eBay 团队搞了个 VCG 系统，用 domain-adapted CLIP 把用户和视频映射到同一语义空间，实现零样本召回，A/B 测试显示深度视频完成率提升了 50%。

**🔬 专业讲解：** VCG（Video Candidate Generation）系统针对电商视频 feed 的极端冷启动问题设计了多模态召回框架。该工作的核心洞察有三点：1) 新短视频缺乏密集交互历史，协同过滤失效；2) 沉浸式 feed 存在强位置 bias 和时长 bias；3) 生成式模型（LLM）在属性预测上表现优异，但在检索任务中存在 embedding space collapse。VCG 采用 domain-adapted CLIP 构建共享语义空间，实现基于视觉内容的零样本召回。在线 A/B 测试表明，该系统有效缓解了 engagement bias，深度视频完成率提升 50%。论文还展示了双向检索场景（Product-to-Video、Video-to-Product、Zero-Shot Semantic Search）的交互演示。

---

### 4. Denoising Implicit Feedback for Cold-start Recommendation

📄 [arXiv:2606.19658](https://arxiv.org/abs/2606.19658) | 作者：Gaode Chen, Shicheng Wang, Shikun Li, Rui Huang, Xinghua Zhang 等 (快手 & 国科大)

**🗣️ 大白话：** 隐式反馈（点击、曝光）是推荐系统的命根子，但噪声太大（标题党、位置 bias）。冷启动 item 尤其惨，因为交互少，噪声影响被放大。这篇论文提出了 DIF，用内容相似的 warm item 来给 cold item 打伪标签，再根据不确定性自适应修正，已在快手十亿级用户场景上线。

**🔬 专业讲解：** DIF（Denoising Implicit Feedback）是一类模型无关的冷启动去噪方法，其核心假设是用户的内容偏好具有稳定性。该方法通过三个关键步骤实现：1) 利用内容相似的 warm item 推断 cold item 的伪标签；2) 基于 cold item 与 warm item 的内容相似度建模伪标签置信度，并聚合多个伪标签；3) 通过相对熵和 item 冷启动状态显式估计噪声样本标签的不确定性，自适应地指导伪标签在样本层面的修正。DIF 既有理论保证，也在真实数据集上取得显著效果。该方法已在快手短视频平台部署，在冷启动场景中显著提升了多项商业指标。

## 📋 其他论文速览

- **ELVA: Exploring Ranking-Driven Universal Multimodal Retrieval**（arXiv:2606.20280）：针对多模态检索中对比学习的 "grain blindness" 问题，提出基于规则的 RL 框架 ELVA，通过排序驱动优化负样本粒度信息，在 MRBench 上提升 13.1%。
- **ScholarQuest: A Taxonomy-Guided Benchmark for Agentic Academic Paper Search**（arXiv:2606.20235）：为 LLM 驱动的学术文献搜索 agent 构建新 benchmark，支持迭代式、意图驱动的文献探索评估。
- **Generative Engine Optimization at Scale: Measuring Brand Visibility Across AI Search Engines**（arXiv:2606.20065）：基于 10 万+ prompt 响应分析品牌在不同 AI 搜索引擎中的可见性，发现品牌知名度层级差异显著（73% vs 44% vs 11%）。
- **PACMS: Submodular Context Selection as a Pluggable Engine for LLM Agents**（arXiv:2606.20047）：将子模函数引入 LLM Agent 的上下文选择，通过增量式内容添加实现高效上下文压缩。
- **Stellar: Scalable Multimodal Document Retrieval for Natural Language Queries**（arXiv:2606.19960）：面向 RAG 场景的多模态文档检索系统，支持从大规模语料中选取最相关的多模态文档回答自然语言查询。
- **Closing the Calibration Gap in Semantic Caching**（arXiv:2606.19719）：指出 PR-AUC 在评估语义缓存时存在校准不足问题，提出更精确的评估方法。
- **SAFE-Cascade: Cost-Adaptive Vision-Language Routing for Chart Question Answering**（arXiv:2606.19646）：针对图表问答场景，设计成本自适应的 VLM 路由策略，对简单查询使用轻量模型降低成本。
- **MonaVec: A Training-Free Embedded Vector Search Kernel for Edge and Offline AI Systems**（arXiv:2606.19458）：面向边缘和离线场景的训练无关向量搜索内核，解决无服务器、无网络、无训练数据的困境。
- **Easy Reads: A Python program for making Scientific Papers on arXiv more Reader Friendly and Accessible**（arXiv:2606.20550）：一个 Python 工具，将 arXiv 论文转换为更友好的阅读格式。
- **When Does Streaming Tool Use Help? Characterizing Tool-Intent Stabilization in Streaming RAG**（arXiv:2606.20113）：分析流式 RAG 中工具调用的时机和收益，发现工具意图稳定性是收益的关键。
- **Multi-Agent Transactive Memory**（arXiv:2606.19911）：提出跨异构 LLM Agent 群体的知识共享基础设施，类比搜索引擎的索引机制。
- **Query-aware Routing for Filtered Approximate Nearest Neighbors Search**（arXiv:2606.19898）：面向过滤 ANN 搜索的查询感知路由策略，对主流向量数据库进行对比评估。
- **When Global Gating Is Enough: Admission-Time Hubness Control in Anisotropic Vector Retrieval**（arXiv:2606.19692）：在检索时通过全局门控机制缓解向量 hubness 问题，降低 RAG 中的投毒风险。
- **Cost-Optimal LLM Routing with Limited User Feedback under User Satisfaction Guarantees**（arXiv:2606.19376）：在用户满意度约束下，通过有限反馈实现成本最优的 LLM 路由策略。