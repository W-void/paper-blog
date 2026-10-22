---
title: "【推荐系统 Paper 日报】2026-10-22"
date: 2026-10-22
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2793625196"
---

# 【推荐系统 Paper 日报】2026-10-22

## 📊 今日概览

arXiv cs.IR 今日公告（Thu, 22 Oct 2026）共 25 篇新论文，其中推荐系统与个性化方向相关约 8 篇。本期亮点相当集中：生成式推荐一口气来了三篇硬货——LoopRec 做逐 item 自适应计算深度、CAPE 修复生成式推荐器的长尾遗忘、ReGen 实现可控生成推荐；另外 CTR 方向的 FineSID 也值得重点关注。

## 🔥 推荐系统论文深度解读

### 1. Think Harder Where It Matters: Item-Level Adaptive Recursion for Sequential Recommendation

📄 [arXiv:2610.30128](https://arxiv.org/abs/2610.30128) | 作者：Zhanshuo Cao, Jiakai Tang, Yuqi Zhou, Sunhao Dai, Jun Xu

**🗣️ 大白话：** 现在的序列推荐模型对用户历史里的每个商品都"一视同仁"地花同样多的算力，但这其实很浪费——大部分商品浅浅过一层就够了，只有少数关键商品需要深度思考。这篇论文让模型自己学会"在重要的地方多想一会儿"。

**🔬 专业讲解：** 作者先做了两个诊断实验：(1) 同一序列内不同 item 的计算需求差异巨大，多数 item 在浅层就收敛，少数 item 需要满深度才稳定；(2) 即使拿到 oracle 目标信息，非均匀深度分配也稳定优于固定深度。据此提出 LoopRec：权重共享的单个 block 递归应用，在每个递归边界用轻量 gate 对每个 item 独立做"退出或继续"的二元决策，无需辅助深度标签即可把全局固定深度转化为逐 item 学习到的属性，且可适配多种骨干结构。在四个骨干家族的公开基准上一致优于同算力的固定深度版本，且学到的分配模式可解释：低频 item 和更近的交互自然获得更深的计算。

---

### 2. Generative Recommenders Forget the Long Tail: Restoring Memorization in Retrieval and Ranking

📄 [arXiv:2610.29298](https://arxiv.org/abs/2610.29298) | 作者：Xu Huang, Jiancan Wu, Hongzheng Qin 等

**🗣️ 大白话：** 生成式推荐用一个大模型同时干检索和排序两件事，听着很美，但它有个致命伤：长尾商品会被"忘掉"两次——检索时被提前剪枝，排序时被 likelihood 压到底部。这篇论文提出了一个免训练的补丁 CAPE，把丢失的"死记硬背"能力找回来。

**🔬 专业讲解：** 作者指出问题根源在于共享打分函数缺失 item 级记忆（即"哪些商品曾共同出现"的直接召回），而这恰是协同过滤的强项。具体失败机制：检索侧，beam search 按子树概率质量保留标识符前缀，尾部 item 被早期剪枝，且加大 beam 也收效甚微；排序侧，即使尾部 item 进入候选集，likelihood 仍将其排在头部之后。CAPE（Co-occurrence-Aware Pool Expansion）作为免训练插件双管齐下：(i) 记忆通道在 beam 之外检索共现支持的尾部 item，用冻结生成器打分；(ii) 记忆校准排序在保留生成器 top-1 的前提下融合生成 likelihood 与共现证据。在商品和音乐两个领域、两个生成骨干上，CAPE 显著提升长尾精度，整体精度不降反升，延迟只增加一小部分。

---

### 3. Controllable Generative Recommendation via Guided Token Refinement

📄 [arXiv:2610.28642](https://arxiv.org/abs/2610.28642) | ICDM 2026 | 作者：Haichao Zhang, Zhixuan Liang, Chong Zhang 等

**🗣️ 大白话：** 生成式推荐的另一个痛点：自回归模型只能从左到右一个个生成 token，早期决定被"锁死"，想实时调控（比如调多样性）很容易把语义结构改坏，生成出不存在的商品。ReGen 把"逐个生成"改成"并行迭代修正"，调控起来就顺滑多了。

**🔬 专业讲解：** ReGen 将生成重构为 mask-filling 任务，所有 Semantic ID token 并行预测而非逐个生成，获得全局视角后可将控制信号直接施加在高语义层级的 token 上而无需重训模型。为保证解码候选映射到真实商品，引入 topology-constrained tree，在 beam 推理中迭代修正低置信预测并严格约束合法 codebook 路径。实验表明 ReGen 在中等引导强度下取得良好的精度-多样性权衡，同时保持生成 Semantic ID 的高有效率。

---

### 4. Progressive Learning from Content to Relevance to Personalization for CTR Prediction

📄 [arXiv:2610.29138](https://arxiv.org/abs/2610.29138) | 作者：Zhiguang Yang, Yulin Yang, Fuyu Lv, Dan Ou

**🗣️ 大白话：** 这是来自工业界搜索广告一线的 CTR 预判工作。核心思路是"三级跳"：先把多模态内容切成细粒度的语义 token，再用 query-商品相关性做预训练打底，最后用真实点击数据微调出个性化偏好。离线在线都涨了。

**🔬 专业讲解：** 针对"细粒度异构内容与 ID-based 预估器难融合"的问题，提出 FineSID 渐进式学习框架，通过共享的细粒度离散表示统一三个阶段：(1) 预训练多尺度视觉 tokenizer 与文本 tokenizer 将异构内容转为细粒度 Semantic IDs（SIDs）并与 ID 特征显式对齐；(2) 在 query-item 相关性监督下做全参数语义预训练，建立稳健匹配先验，在共享预估器内联合优化多模态 SIDs 与传统字段的交互；(3) 以用户点击监督直接微调该预估器，捕获隐式个性化偏好。离线与在线评估均取得显著收益，且 FineSID 提升了同商品内的创意区分能力，展现出超越传统 ID 记忆的语义泛化。

---

### 5. Preference Is Not Permission: Personalizing the Auto-Purchase Line in Agentic Commerce

📄 [arXiv:2610.29216](https://arxiv.org/abs/2610.29216) | 作者：Ryotaro Shimizu, Sai HtaungKham, Mo Fan

**🗣️ 大白话：** Agent 帮你购物时，到底能"自作主张"到什么程度？这篇论文发现现在的模型太激进——明明证据不足也敢直接下单。作者提出"自动购买边界"这一新任务：每个人的边界不一样，但用几十条你自己的历史标注就能学到你的边界，比任何 prompt+模型组合都准。

**🔬 专业讲解：** 与传统个性化基准只问"哪个商品适合用户"不同，本文问"agent 可以在该商品上承诺到什么程度"。该边界是证据条件化的三值输出：不买 / 先确认 / 自动购买，取决于商品信息充分性（warrant）、可逆性、价格与用户规范、紧急性而非仅拟合度。对 16 个 instruction-tuned 模型的评测显示，自主承诺与 15 名标注者构建的人类授权参考严重错位——即便拟合度低、自身证据标志缺失时模型仍会承诺（overreach）。个体边界虽因人而异，但分歧是结构化且可从个体其他标注部分预测的：仅 30-40 条个人标注的浅层学习器即可在 held-out 上达到 0.79 的中位预测精度，优于所有 prompt×模型配置（含每标注者 80 配置的 oracle）。

---

### 6. SOAR: Social and Opinion-Aware Recommendations

📄 [arXiv:2610.29556](https://arxiv.org/abs/2610.29556) | 作者：Giannis Christoforidis, Apostolos N. Papadopoulos

**🗣️ 大白话：** 一个地点推荐模型，两招提升准确率：一是看你的好友网络，二是读评论的文字情感——不只是"别人去过"，而是"别人去了开不开心"。

**🔬 专业讲解：** SOAR 面向 POI（兴趣点）推荐，同时建模用户好友网络与文本评论，重点利用共享评论的情感信号来评估某地点对特定用户的适配度。真实数据集上的实验表明，将评论（尤其是情感维度）纳入推荐流程能够有效提升推荐精度。

---

### 7. RESEARCHHUB: A Personalized Literature Discovery System for Biomedical Preprints

📄 [arXiv:28636 → 2610.28636](https://arxiv.org/abs/2610.28636) | 作者：Viswonathan Manoranjan, Taeyoon Kim 等

**🗣️ 大白话：** 一个面向生物医学预印本的"个性化找论文"系统：能按你的阅读历史帮你找前沿工作，还能控制新颖度和多样性，避免推来推去都是差不多的论文。

**🔬 专业讲解：** 系统核心是 prism——一个适配生物医学预印本的 bi-encoder 检索器，使用 GPT-4o 生成的自然语言 query 和 Multiple Negatives Ranking + MarginMSE 混合目标（cross-encoder 软标签）训练。在 44,937 篇 2023-2025 年 MedRxiv 论文上，prism 的 Recall@10 比 SPECTER2-Search 高 12.4 个百分点。系统还支持基于阅读历史的前沿检索、DPP 多样性重排、从主流到专深的局部内在维度（LID）排序，以及轻量级归因卡片解释结果，全流程低延迟。

---

### 8. X-Embedding: Two-Stage Training for Multilingual Patent Prior-Art Retrieval

📄 [arXiv:2610.29521](https://arxiv.org/abs/2610.29521) | 作者：Wentao Wu, Xu Wang, Linqing Chen 等

**🗣️ 大白话：** 专利查新检索的天花板级任务：要找的不是"相似专利"，而是真正威胁新颖性的 X 类对比文件。这篇论文分两阶段训练——先学专利领域表示，再专攻 X 类相关性，多语言场景下遥遥领先。

**🔬 专业讲解：** 两阶段框架：第一阶段对齐专利内部互补章节及同族跨语言专利的对应章节，同时从专利结构和多语言表达中学习；第二阶段以审查报告中的 X 类引用为正例、检索候选和 A 类引用为负例学习 X 类相关性。借助 Matryoshka 表示学习（MRL）在单模型内支持 64 与 1024 维嵌入。在中英日三语、四个查询视图的集合上，64 维下整体 macro Hit@100 达 89.09%，超 Qwen3-Embedding-0.6B 与 RoBERTa 达 21.25 和 3.68 个百分点；两阶段训练比直接监督微调高 3.19 分。

---

## 📋 其他论文速览

- **ERCLIP: Small-Data Adaptation of CLIP for Free-Length Image-Text Retrieval**（arXiv:2610.29939）：训练时把长 caption 切句融合，推理时保持 CLIP 双塔原样，2 万对数据就能大幅提升长文本图文检索，还顺手保住了零样本分类能力（ACCV 2026 Workshop）。
- **pplx-embed-v2-late Technical Report**（arXiv:2610.29523）：0.6B/9B 一对多语言多模态 late-interaction 模型，支持"9B 建索引、0.6B 查询"的非对称部署，多基准 SOTA。
- **Beyond the Vote: When Do LLMs Add Value to Retrieval-Based Tabular Classification?**（arXiv:2610.29520）：19 个表格数据集上的严格对照——多数情况下距离加权 KNN 投票就能打赢 LLM in-context learning，LLM 只在邻居标签共识低时有增量。
- **Directional Posterior Feedback Fusion for Query Reformulation in Dense Retrieval**（arXiv:2610.29464）：把伪相关反馈从"点融合"改为"切空间中的方向性证据"，先验正则化后验融合更新 query，免训练即可提升多种稠密检索器。
- **Learning Marginal Viewpoint Utility for Budgeted Evidence Selection in RAG**（arXiv:2610.29234）：多观点 query 的 RAG 证据选择，按"边际观点覆盖增益"排序候选，1024 token 预算下逼近 oracle 覆盖上限。
- **Reasoning-Search-Augmented LLMs**（arXiv:2610.29189）：推理-搜索循环 LLM 的系统性综述，给出检索耦合/控制器/知识源/接地严格度四轴分类法。
- **Constrained Tagging for Span Labeling**（arXiv:2610.28922）：免训练约束解码让 LLM 做 span 标注时输出必须逐字复制输入并内联打标，25 万次生成保证率 99.978%，彻底解决"生成的 span 不在输入里"的问题。
- **Transaction Foundation Models for RAG over Financial Transaction Data**（arXiv:2610.28641）：金融交易基础模型 vs 通用文本嵌入的对照实验——TFM 单独看很强，但"人工聚合摘要+通用编码器"的简单管线就能追平甚至反超，教训是收益是分品类的。
- **Can AI Chat Replace Traditional Search?**（arXiv:2610.28639）：预注册的真实用户实验——AI 聊天搜索表现最差（回音室效应+prompt 疲劳），AI 应该是传统筛选式搜索的补充而非替代。
- **TAGR: Task-Adaptive Geo-Semantic Retrieval**（arXiv:2610.28638）：城市即时配送三任务（需求预测/ETA/下一站）共享 LLM 地理语义先验 + 任务自适应检索库，避免统一融合导致的负迁移。
- **What the Author Wrote, What the Agent Reads**（arXiv:2610.30026）：企业文档摄入层会悄悄丢失作者用高亮/颜色编码的信息，导致 agent"自信地答错"；实测 docling 摄入后 F1 从 0.69 跌到 0.15，修复成本极低——可靠性赢在摄入而非推理。
- **Real PMIDs, Wrong Papers**（arXiv:29812 → 2610.29812）：生物医学声明验证 agent 的 harness 消融——闭卷模型引用的 PubMed ID 几乎都存在但几乎都不相关（3/327 相关），存在性校验远不够（NeurIPS 2026 Workshop）。
- **Our Own Jev: Typed Decisions in One Forward Pass**（arXiv:2610.29052）：一次前向传播读 logits 做类型化决策，自建 System-1 judge 成本仅前沿 LLM judge 的约 1%，35B 开源模型在 JevBench 硬题上与商用系统打平。
- **Scriptorium: Multi-Human, Multi-AI Collaborative Digital Library Search**（arXiv:2610.28929）：多人类+多 AI 协作检索平台，Manager-Worker 架构 7 个角色化 agent，完整公开实现细节（SIGIR 2027 投稿附录）。
- **FutureLens: Longitudinal Topic Patterns in Scholarly Text**（arXiv:2610.28656）：用 ACL 5655 篇论文的 future-work 引用做纵向主题测量研究，NMF vs LDA 的稳定性与多样性对比（JCDL 2026 Workshop）。
- **Building Knowledge Graphs for Theses: A Survey**（arXiv:2610.28648）：学位论文知识图谱构建的系统综述，46 篇 2021-2025 研究从 NLP 抽取到 LLM 驱动增强的方法演进。
