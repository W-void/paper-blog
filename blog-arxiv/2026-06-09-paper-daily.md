---
title: "【推荐系统 Paper 日报】2026-06-09"
date: 2026-06-09
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2767394854"
---

# 【推荐系统 Paper 日报】2026-06-09

## 📊 今日概览

arXiv cs.IR 于 **2026 年 6 月 9 日（周二）** 公告新论文共 **31 篇**，其中推荐系统相关论文 **8 篇**。本期亮点涵盖：生成式推荐全面开花（Semantic ID 生成、RL 优化、概念遗忘三路并进），短视频超长序列建模在十亿用户规模落地，以及多模态推荐"让模型真正看懂图片"的 REVEAL 框架。工业界味道很浓，多篇带 A/B 结果。

## 🔥 推荐系统论文深度解读

### 1. Beyond Item IDs: Scaling Short-Form-Video Recommendation via Semantic-Native Long Sequence Modeling

📄 [arXiv:2606.07546](https://arxiv.org/abs/2606.07546) | 工业实践 | Ruixiao Sun, Diego Uribe Mora, Zhimeng Jiang, Yuanzhen Lin, Jiarui Wang, Yuening Li, Danfeng Guo, Zhizhong Chen, Chuan He, Liang Liu

**🗣️ 大白话：** 短视频推荐要看用户几百上千条历史行为才准，但 Transformer 的复杂度会爆炸。这篇论文在十亿用户规模真实上线了一套新框架，用"内容语义 ID"替代原子 Video ID，再加一个压缩 Transformer，把内存降了一个数量级，同时大幅提升了用户互动。

**🔬 专业讲解：** 论文针对工业级短视频推荐的两大瓶颈展开：① **语义稀疏问题**：传统 Video ID 是随机正交向量，无法捕捉内容间相似性，冷启动也差；解法是采用深度截断的粗粒度 Semantic ID（SID），embedding 表规模从语料规模压缩到 SID 词典规模，自然支持冷启动。② **序列扩展瓶颈**：标准 Self-Attention 的二次复杂度限制了可支持的历史长度；解法是提出 **Global-Aware Compression Transformer**，结合非参数时间折叠（temporal folding）和统一全局 query，将长序列压缩后再做注意力。离线测试表明峰值内存降幅约一个数量级，计算开销大幅下降；大规模在线 A/B 测试验证了用户满意互动和内容消费的实质性提升。

---

### 2. Gryphon: A Unified Architecture for Semantic-ID Generation and Item-Level Scoring in Industrial Recommendations

📄 [arXiv:2606.08604](https://arxiv.org/abs/2606.08604) | 工业实践 | Daria Tikhonovich, Oleg Sorokin, Vladislav Dodonov, Mariia Ulianova, Ilya Murzin

**🗣️ 大白话：** 生成式推荐（GR）用 beam search 解码 SID 序列来召回候选，但 beam 搜索优化的是 token 序列概率，不是"这个 item 到底好不好"。Gryphon 在 Encoder-Decoder 架构中加了一个 Item 级别的打分头，直接对 item 打分，绕过序列概率误差。在音乐服务上，Gryphon 一套系统顶替了原来 15+ 个召回源加一个预排序阶段，完全不逊色。

**🔬 专业讲解：** 传统 GR 的两个痛点：**序列概率误校准**（beam search 累积误差）和 **SID 碰撞**（多个 item 映射到同一 SID，得到相同分数）。Gryphon 的核心改进是复用 encoder 计算出的用户表示，额外训练一个 item-level scoring 组件，在 beam search 生成候选 SID 后，将 SID 解析到具体 item，再用 item-level scorer 重新打分排序。实验在工业音乐服务：item-level scoring 在 Recall@1000 上比 vanilla GR 高 +3.7%，比 collision-resolved GR 高 +2.5%；同候选集上 item-level ranking 比 beam-likelihood ranking 高 +4.2%。7 天 A/B 测试中总听时间变化 +0.25%（无统计显著差异），但系统被大幅简化。

---

### 3. AdaGRPO: Adaptive Loss Balancing for Noise-Robust GRPO in Generative Recommendation

📄 [arXiv:2606.08480](https://arxiv.org/abs/2606.08480) | 电商推荐 | Kewei Xu, Junbo Qi, Yanyan Zou, Pengfei Zhang, Xingzhi Yao, Shengjie Li

**🗣️ 大白话：** 用强化学习（RL）来训练生成式推荐模型听起来很美，但现实中的 reward 模型（通常是线上排序模型）有曝光偏差，不是所有样本的 reward 信号都可信。AdaGRPO 只在"policy 自己拿不准、同时 reward 模型又能分辨好坏"的样本上用 GRPO，其他样本退回监督学习，大幅降低噪声梯度影响。

**🔬 专业讲解：** 论文对 reward 信号的可信度做了分层分析，发现：reward 有益的条件是"policy 侧不确定（高熵）+ reward 模型可分辨（ground-truth item rank 靠前）"，两个条件任意缺失都会导致 reward 要么可忽略要么有害。AdaGRPO 设计两个 rollout 诊断指标：**policy 侧困难度**（当前 policy 对 ground-truth item 的排名不确定性）和 **reward 可分辨性**（ranker 能否区分 ground-truth 与 rollout 负样本），满足双条件才触发 GRPO 目标，否则用纯 NLL 监督。大规模电商数据集上，最佳中间 checkpoint 的 HR@10 从 11.01% 提升到 12.18%，幻觉率控制在 0.22% 以下；线上 A/B 测试 CTR 和停留时长均有显著提升。

---

### 4. TRACER: Token ReAssignment for Concept ERasure in Generative Recommendation

📄 [arXiv:2606.07688](https://arxiv.org/abs/2606.07688) | 隐私安全 | Ziheng Chen, Jiali Cheng, Zezhong Fan, Hadi Amiri, Diyuan Wu, Gabriele Tolomei, Yang Zhang

**🗣️ 大白话：** 生成式推荐系统里，怎么"忘掉"某类敏感或有害概念（比如某类违规内容）？直接用 LLM unlearning 的方法不行，因为 SID 是抽象 token，忘掉它会把无辜的无关 item 也连带删掉。TRACER 的思路是"重新分配 token"：把要忘掉的 item 换一批新 token，让它和保留 item 的 token 不再重叠。

**🔬 专业讲解：** 核心挑战：SID 是分层量化产生的抽象标识符，forget set 和 retain set 的 item 经常共享 SID prefix，直接抑制 SID 会波及无辜。TRACER 分两步：① **Token Reassignment**：为 forget items 生成替代 SID token，最大化 forget item 在替代 token 下的生成概率（便于遗忘），同时最小化与 retain items 的 token 重叠；② **Coherence Regularizer**：在遗忘过程中保持 retain items 的语义一致性，防止推荐质量下降。真实推荐数据集上，TRACER 在移除目标概念的同时，推荐效用保留度显著优于现有 unlearning baselines。

---

### 5. DeRes: Decoupling Residual Stability and Adaptivity for Scalable CTR Prediction

📄 [arXiv:2606.07980](https://arxiv.org/abs/2606.07980) | CTR 预估 | Wenzhuo Cheng, Shipeng Nie, Qixin Guo, Xuefeng Sun, Jianguo Lou, Zhengwei Zheng

**🗣️ 大白话：** Transformer 做 CTR 预估时，残差连接有三个问题：Pre-Norm 下早期兴趣信号逐层稀释、Identity skip 无法遗忘过时兴趣、每层只看上一层看不到长程依赖。DeRes 用双路径设计（Identity 路 + Block Attention Residual 路）同时解决这三个问题，同等参数量下 AUC 更高，还有更陡的 scaling law。

**🔬 专业讲解：** DeRes 的核心设计：每层输入分两路——**Identity Residual Path**（保留一阶特征复用和梯度流，相当于传统 skip）和 **Block Attention Residual Path**（对所有前层压缩输出做跨层注意力，实现高阶特征召回）。两路用 vector-wise gate 加权融合。另一个创新是 **Pointwise AttnRes**：把跨层注意力里的 Softmax 换成 SiLU，允许多个历史层同时激活，负权重对应"遗忘"，更契合 CTR 的多兴趣并行模式。在 331M 交互工业数据集、Criteo（45M）、Avazu（40M）上，相比 OneTrans/TokenMixer-Large/UniMixer 等 12 个 baseline，最高 +0.32% AUC，FLOP 增加不到 5%；scaling law 斜率（γ=0.118）是 OneTrans（γ=0.071）的 1.66 倍，8 层 DeRes 相当于 16 层 OneTrans。

---

### 6. REVEAL: Teach Multimodal Recommendation Model to See via Personalized Visual Extraction and Adaptive Learning

📄 [arXiv:2606.09082](https://arxiv.org/abs/2606.09082) | 多模态推荐 | Yutong Li, Xinyi Zhang, Ziyi Ye, Daoguo Dong, Yu-gang Jiang

**🗣️ 大白话：** 多模态序列推荐里，图片特征经常被模型忽视，文本特征一统天下。REVEAL 是个即插即用框架，通过"让反馈指导图片提取"和"动态重加权视觉学习"两招，让模型真正用上图片信息。不改原始推荐骨架，直接套上去就能涨点。

**🔬 专业讲解：** REVEAL 由两个模块组成：① **Feedback-Guided Visual Extraction (FVE)**：用任务层面的反馈信号迭代优化 prompt-guided 视觉提取，确保提取出来的视觉特征与用户偏好相关，而不是图片的"通用特征"；② **Adaptive Visual Learning (AVL)**：动态调整视觉学习的权重，当文本特征主导时主动上调视觉 loss 权重，缓解模态不平衡。在多个真实世界数据集和多种 MSR 骨架上的实验表明，REVEAL 持续提升推荐性能，分析还发现模型的注意力权重更多落在视觉偏好相关区域。

---

### 7. ToolRec: Calibrated Preference Alignment for Query Recommendation in On-Device Assistants

📄 [arXiv:2606.08466](https://arxiv.org/abs/2606.08466) | 端侧推荐 | Zihan Luo, Lingkui Chen, Ruike Zhang, Hong Huang, Boyang Zhang, Ziniu Chen, Lizhong Wang

**🗣️ 大白话：** 手机上的智能助手（比如 OPPO 小布）要给用户推荐查询词，但用户更希望的是直接调系统工具（打电话、开导航），而不是聊天。直接用点击日志训练 LLM 对齐又充满噪声。ToolRec 构建了 708 个系统工具的工具库，并设计了双层校准机制过滤噪声，在 1.5 亿月活的平台上 CTR 显著提升。

**🔬 专业讲解：** ToolRec 的三大组件：① **SysToolKit**：包含 708 个系统工具的综合仓库，配套 context-aware 工具检索机制，确保推荐的查询词和实际可用工具对齐；② **双层校准机制**：基于用户活跃度对原始点击信号做校准（活跃度越高的用户点击噪声越多，降权），同时上调工具调用类查询词的信号权重（这类 query 更符合用户真实意图）；③ **Sample-level weighted KTO**：用 Kahneman-Tversky Optimization 做对齐，样本级别加权反映校准后的偏好强度。OPPO Xiaobu（月活 1.5 亿）的在线 A/B 测试中，CTR 和总点击量均显著高于 baseline，同时保持高查询相关性。

---

### 8. Popcorn: A Configurable Benchmark for Visual Evidence in Multimodal Movie Recommendation

📄 [arXiv:2606.09595](https://arxiv.org/abs/2606.09595) | 评测基准 | Ali Tourani, Fatemeh Nazary, Yashar Deldjoo, Tommaso Di Noia

**🗣️ 大白话：** 多模态电影推荐的研究一直有个模糊地带：用电影完整视频、预告片还是缩略图作为视觉证据，效果到底有没有本质区别？Popcorn 是第一个系统性回答这个问题的 benchmark，结论是：它们不能互相替代，选哪种视觉来源和怎么融合，对排名准确率、覆盖率、多样性和校准性都有明显影响。

**🔬 专业讲解：** Popcorn 的设计围绕"可配置性"展开：将电影标题对齐的完整视频/预告片 embedding（由现代视觉和 VLM 模型编码）与 MovieLens 关联的缩略图特征打包在一个统一配置契约下，支持模态组装、融合策略、分割方式、评估指标和 LLM 增强元数据的灵活切换。关键发现：缩略图 VLM 提供强且可规模化的 item 侧证据；预告片和完整视频的对比实验表明不同视觉来源带来的信息是不等价的，融合策略选择直接影响 Recall、Coverage、Diversity 和 Calibration 多维指标。

## 📋 其他论文速览

- **Closing the Indexing-Decoding Gap in Multimodal Generative Retrieval**（arXiv:2606.09241）：多模态生成式检索中索引阶段与解码阶段存在 gap，提出 Prefix Retention Optimization 来对齐两者
- **OneFeed: A Unified Generative Framework for Feed Content Enhancement and Query Generation**（arXiv:2606.07972）：统一建模 feed 推荐和搜索 query 生成，引入 SID-Query 对齐目标打通两个系统的语义空间
- **EviProp: Seeded Relevance Diffusion on Chunk-Page Graphs for Long Multimodal Document Retrieval**（arXiv:2606.08979）：通过在分块-页面图上做相关性扩散来检索长多模态文档中的证据页
- **Report on CHIIR 2026 Workshop on Generative AI and Academic Search**（arXiv:2606.08936）：CHIIR 2026 生成式 AI 与学术搜索研讨会报告，探讨 GenAI 如何重塑学术检索系统
- **When Should Queries Be Decomposed?**（arXiv:2606.08577）：针对多条件检索，研究 query 分解在不同检索 pipeline 阶段的有效性
- **Personal Salience: Highlighting Is Social, but Individuality Lives in Selection**（arXiv:2606.09024）：从社交标注行为中恢复个人身份，研究用户高亮选择的个性化特征
- **ASH: Asymmetric Scalar Hashing for High-Fidelity Vector Quantization**（arXiv:2606.07870）：将标量量化与学到的降维结合，在向量量化精度上挑战乘积量化的霸主地位
- **Aperon Technical Report: HNTL for High-Dimensional ANN**（arXiv:2606.08813）：无指针层级切线局部搜索图索引，消除 HNSW 的指针开销，提升 CPU pipeline 效率
- **Driving Video Retrieval for Complex Queries with Structured Grounding**（arXiv:2606.09109）：自动驾驶场景下的复杂事件视频检索，用结构化 grounding 处理动态事件
- **TABVERSE: Benchmarking Cross-Format Table Understanding in LLMs and VLMs**（arXiv:2606.09578）：跨格式（HTML/Markdown/LaTeX/图片）表格理解基准评测
- **TrustMargin: Training-Free Arbitration between Parametric Memory and Retrieved Evidence**（arXiv:2606.08397）：后生成冲突仲裁，决定大模型应信赖参数记忆还是检索证据
- **PulseBench-Tab: A Multilingual Benchmark for Table Extraction**（arXiv:2606.07534）：覆盖 9 种语言的多语言表格提取基准，含 1820 个人工标注表格
- **Decoy-Calibrated Failure Audits for Language Models**（arXiv:2606.09046）：审计语言模型失败模式时的多重检验校正方法，防止选择偏差
- **RACT: Retrieval Augmented Column-Table Learning for Multi-Table Schema Matching**（arXiv:2606.07843）：检索增强的跨表模式匹配，处理异构 schema 下的列对应问题
- **Bidirectional Semantic Complementary Tool Retrieval for Remote Sensing Agents**（arXiv:2606.07538）：遥感 Agent 的双向语义互补工具检索，应对超长工具文档的上下文窗口限制
- **GIScholarBench: Benchmarking LLM Overconfidence in GIS Research**（arXiv:2606.08036）：地理信息科学领域 LLM 过度自信的行为基准测试
- **Frequency-Scale Saliency for Spectral Descriptor Analysis in 3D Shape Retrieval**（arXiv:2606.07791）：频率尺度显著性框架，分析 HKS/WKS 等谱描述子在 3D 形状检索中的失效模式
- **Have I Solved This Before? Retrieving Similar Segmentation Problems**（arXiv:2606.08155）：制造业监控系统配置中，通过检索相似分割问题支持进化式学习
- **EmpiriGraph-Psy: Extracting Empirical Relation Graphs from Psychology Abstracts**（arXiv:2606.08362）：从心理学摘要中提取变量间经验关系图的 LLM pipeline
- **MIRAGE: Metadata-Integrated Repository Analysis for MSR Datasets**（arXiv:2606.07611）：通过元数据丰富和 FAIRness 评估改进挖掘软件仓库数据集的分析方法
- **Evaluating Advanced Prompting on Gemini Flash for Multi-Hop Biomedical QA**（arXiv:2606.07548）：先进 prompt 工程在 Gemini Flash 上处理多跳生物医学问答的效果评估
- **VisualLeakBench: Action-Boundary Propagation Failures in Vision-Language Agents**（arXiv:2606.07595）：VLM Agent 中敏感可见文本被复制到工具参数的安全失效模式基准
