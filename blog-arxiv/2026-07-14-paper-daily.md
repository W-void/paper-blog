---
title: "【推荐系统 Paper 日报】2026-07-14"
date: 2026-07-14
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2774436446"
---

# 【推荐系统 Paper 日报】2026-07-14

## 📊 今日概览

arXiv cs.IR 今日公告 **Tue, 14 Jul 2026**，共收录 **35 篇**论文。其中与推荐系统强相关的有 **12 篇**，涵盖 LLM 驱动的推荐、序列推荐、推荐系统评估、多模态推荐、工业界搜索推荐等热门方向。本期亮点包括：淘宝/京东等工业界大厂的生成式检索与多模态排序实践，以及多篇探索 LLM 在推荐评估与群体偏好建模中的前沿工作。

## 🔥 推荐系统论文深度解读

### 1. User Preference Induction with LLMs for Offline Top-N Recommendation Evaluation

📄 [arXiv:2607.11354](https://arxiv.org/abs/2607.11354) | 作者：David Otero, Javier Parapar

**🗣️ 大白话：** 离线评估推荐系统时，测试集里没出现过的用户-物品交互通常被默认当成"不感兴趣"——但这会严重低估推荐质量，尤其对那些善于挖掘长尾的模型不公平。这篇论文用 LLM 来给这些"没标签的候选物品"打分，让离线评估更靠谱。

**🔬 专业讲解：** 论文提出了一套基于 LLM 的偏好归纳框架，分两阶段：先用 LLM 总结用户历史交互生成偏好画像，再以画像为条件让 LLM 充当相关性裁判，为候选池中未观测到的物品补充标签。实验表明，这种"判断扩展"策略能有效改善离线 top-N 评估的鲁棒性，并缓解由稀疏反馈导致的流行度偏差。

---

### 2. ZoRRO: A Zero-Weight Personalized Recommender System for Scalable News Recommendation

📄 [arXiv:2607.10910](https://arxiv.org/abs/2607.10910) | 作者：Johannes Kruse, Ryotaro Shimizu, Kasper Lindskow, Jon Tofteskov, Michael Riis Andersen

**🗣️ 大白话：** 做新闻推荐不用训练神经网络？这篇论文搞了一个"零权重"推荐系统，不训练任何模型参数，离线效果却能打平甚至超过深度学习基线，线上速度还快了 600 多倍。它提醒我们：有时候简单的方法加上好的设计，比堆模型更管用。

**🔬 专业讲解：** ZoRRO 是一个训练免、零权重的个性化新闻推荐框架，在离线 ranking 评估中超越多个强神经网络基线，并在在线 A/B 测试中取得了与 SOTA 深度学习模型接近的 CTR 表现。同时，论文发现离线指标相近的模型可能产生截然不同的推荐分布，对整体新闻生态的影响不可忽略——评估推荐系统不应只看准确率。

---

### 3. RecRec: Recursive Refinement for Sequential Recommendation

📄 [arXiv:2607.10541](https://arxiv.org/abs/2607.10541) | 作者：Pervez Shaik, Prosenjit Biswas, Abhinav Thorat, Ravi Kolla, Niranjan Pedanekar

**🗣️ 大白话：** 现有的序列推荐模型基本都是"一次编码定终身"——把用户的交互历史编码一次就输出推荐。这篇论文问：能不能像人类反复思考一样，迭代精化用户偏好？答案是肯定的，而且只需要三四百万参数就能达到 SOTA。

**🔬 专业讲解：** RecRec 提出了一种递归推理视角下的序列推荐框架，维护一个紧凑的隐状态并通过共享递归模块迭代更新。关键创新是"证据锚定的校正机制"：每次更新都锚定在原始交互上下文中，防止递归深度增加时的语义漂移。在三个标准数据集上，RecRec（3.9M–14M 参数）匹敌或超越了 SOTA 序列、图和推理增强推荐器。

---

### 4. Tokenizing Numerical and Embedding Features for LLM RecSys

📄 [arXiv:2607.10016](https://arxiv.org/abs/2607.10016) | 作者：Zhe Xu, Ankit Peshin, Chiyu Zhang, Feng Qi, Johnson Lui

**🗣️ 大白话：** LLM 做推荐现在很火，但 LLM 擅长处理的是文本 token，而推荐系统里大量用的是数值特征和连续嵌入。这篇论文把数值和嵌入特征也转成 LLM 能吃的"软 token"，让 LLM 推荐器能真正利用工程侧产生的高维特征。

**🔬 专业讲解：** 论文提出 soft-token fusion 框架，将数值和嵌入特征映射到 LLM 的嵌入空间，使其能通过标准 token 接口消费。在共享参数的两塔检索 LLM 中实例化，并引入交互式融合模块来精化 heterogeneous soft tokens。Amazon 三个推荐基准上的实验表明，soft-token fusion 显著优于 LLM-based 基线，交互式融合比直接拼接更有效。

---

### 5. An LLM-powered Agentic Recommendation System for Connected TV Content Discovery

📄 [arXiv:2607.09988](https://arxiv.org/abs/2607.09988) | 作者：Lei Shi, Di Wang, Harry Tran, Helsing Xu, Yuchen Lu

**🗣️ 大白话：** 电视内容推荐面临一个难题：要整合 trending topics、突发新闻、文化活动等动态上下文，传统系统需要大量特征工程。这篇论文用 LLM 做 agent，让 LLM 自己推理怎么整合这些异构信号，同时保留了传统 ML 在检索效率和个性化精度上的优势——是个"混合系统"。

**🔬 专业讲解：** 论文提出了面向 Connected TV（CTV）的 LLM-powered agentic 推荐系统，利用 LLM 的推理能力自然处理和综合不同 schema 的多样化信号，消除了大量手工集成。同时采用 agentic 架构编排专业化组件，让各子任务由最适合的方法（LLM 或传统 ML）处理。核心贡献在于成功克服了 LLM 在推荐场景中的实际限制，尤其是推理延迟。

---

### 6. Consensus vs. Dissent: Dynamic LLM Modeling of Subjective Preferences in Group Recommenders

📄 [arXiv:2607.10235](https://arxiv.org/abs/2607.10235) | 作者：Cedric Waterschoot, Nava Tintarev, Francesco Barile

**🗣️ 大白话：** 一群人一起看电影，有人想看科幻有人想看爱情，怎么平衡？群体推荐系统以前靠投票策略来聚合偏好，但不同群体结构适合不同策略。这篇论文用 LLM 来模拟人类对公平、满意度和共识的感知，动态选择最适合的聚合策略。

**🔬 专业讲解：** 论文通过微调 LLM（Judgmental Llama 和 Judgmental OLMo）作为实时判断模型，基于 DeepSeek-V3.1 蒸馏的推理数据集和人类评估数据。系统生成多种社交选择聚合策略的推荐候选，并动态选择最大化预测人类评估的候选。在 284 人规模的用户研究中，该方法在满意度和群体共识上得分最高，且 LLM 判断与公平/满意度/共识的人类感知在考虑群体配置交互效应时最为一致。

---

### 7. Normative Alignment of Recommender Systems via Internal Label Shift (NAILS)

📄 [arXiv:2607.10915](https://arxiv.org/abs/2607.10915) | 作者：Johannes Kruse, Kasper Lindskow, Michael Riis Andersen, Ryotaro Shimizu, Julian McAuley

**🗣️ 大白话：** 推荐系统如果只优化用户点击，容易推荐越来越窄的内容。NAILS 提供了一种"不用重新训练模型"的方法，让已有推荐器的输出在类别分布上对齐目标，既满足编辑价值观又保证用户兴趣。

**🔬 专业讲解：** NAILS 通过修改用户条件物品分布来在物品属性层面引入指定的边际分布，同时保留现有推荐系统学到的偏好。形式化为层次分类框架内的标签偏移问题。实验表明，NAILS 在最小影响用户参与度的前提下，持续改善了属性级对齐，为价值驱动的推荐提供了实用机制。

---

### 8. RouteRec: Strict Evaluation of Recommender-Agent Selection and Aggregation

📄 [arXiv:2607.09908](https://arxiv.org/abs/2607.09908) | 作者：Kaiji Zhou, Vladimir Kalmykov, Yue Feng

**🗣️ 大白话：** 推荐系统越来越多地面临"选哪个模型"的问题：协同过滤、序列模型、LLM 重排，各有各的擅长场景。这篇论文严格评估了两种策略——请求级硬选择 vs. 物品级聚合——发现后者更靠谱，因为请求级选择粒度太粗了。

**🔬 专业讲解：** RouteRec 在 MovieLens-1M 上比较了请求级硬选择和物品级学习聚合，覆盖四种传统推荐 agent 和一种 LLM 重排 agent。在无泄露的 5-fold 协议下，硬选择甚至低于 BM25 基线（HR@10 0.223 vs. 0.254），而物品级聚合达到 HR@10 = 0.295，70.2% 的 LLM 调用。核心洞察：请求级选择太粗，物品级聚合才是更有前景的行动空间。

---

### 9. Prompt Generation Technical Report (Taobao)

📄 [arXiv:2607.11326](https://arxiv.org/abs/2607.11326) | 作者：Dan Ou, Gui Ling, Hao Wan, Hongbin Zhou, Jialiang Cheng

**🗣️ 大白话：** 淘宝做生成式检索时，每次改特征都要改训练代码和线上 serving 代码，迭代慢还容易不一致。这篇论文提出了一套配置驱动的框架，让特征处理逻辑和模型架构解耦，改特征只需改 JSON 配置，训练、部署、在线推理都标准化了。

**🔬 专业讲解：** Prompt Generation（PG）是淘宝搜索的生成式检索框架，通过两个声明式 JSON 文件统一离线和在线的特征处理逻辑。支持四种特征类型和三种可组合处理组件，在训练迭代速度、部署速度和在线推理速度三个层面实现加速。淘宝搜索全量部署后，交易笔数 +0.47%、GMV +0.51%，已推广至多个搜索和推荐团队。

---

### 10. Serving the Long Tail: Training-Free LLM Candidate Generation for Vacation Rental Marketplaces

📄 [arXiv:2607.09877](https://arxiv.org/abs/2607.09877) | 作者：Syed Mohammed Arshad Zaidi, Eric Rincon, Shayan Hassantabar

**🗣️ 大白话：** 度假房屋租赁平台（Vrbo）有一个典型问题：热门房源被反复推荐，新上架、小众、季节性的房源因为交互数据太少，协同过滤完全覆盖不到。这篇论文用 LLM 生成房源的语义描述，然后做向量检索来补充候选，完全不训练任何模型，却覆盖了数万传统方法找不到的房源。

**🔬 专业讲解：** 论文提出训练免的 LLM 候选生成管道：off-the-shelf LLM 为每个房源合成多样化语义查询，预训练文本编码器嵌入，近似最近邻索引从 1170 万房源目录中检索。Union 融合策略与 IBKNN 合并，同时保留行为通道的排序，保证已服务好房源不降级。下游 LTR 模型进一步重排序。1170 万房源目录上，系统将候选覆盖扩展到传统方法无法触达的数万个房源，长尾段增益最大，共享房源上全 K 范围内匹配或优于 IBKNN。

---

### 11. Beyond Semantic IDs: Encoding Business-Value Ranking into Document Identifiers for Generative Retrieval

📄 [arXiv:2607.11392](https://arxiv.org/abs/2607.11392) | 作者：Gui Ling, Zhihong Chen, Yu Li, Tong Xiong, Kunhai Lin

**🗣️ 大白话：** 生成式检索（DSI/GenRet）靠给文档编一个 ID 然后让模型生成 ID 来检索。但现有 ID 只编码语义，不编码商业价值（比如哪些商品更赚钱）。这篇论文把"商业价值排序"也编进了 DocID 里，而且是无碰撞的、支持增量更新。

**🔬 专业讲解：** 论文提出 Cluster-Ranked Identifier（CRID），将 DocID 解耦为语义聚类和商业价值排序两部分，产生无碰撞标识符并支持通过簇内重排序实现增量更新。引入分析框架将检索增益分解为个性化偏好和统计先验泛化，揭示语义簇大小如何调控两者平衡。在 3 亿物品的淘宝电商语料上，CRID 超越最强嵌入检索基线，全量部署带来 +1.06% GMV 提升。

---

### 12. Stream-aware Side Adaptation for Large Pre-trained Multimodal Embedding Models in Sequential Recommendation

📄 [arXiv:2607.10909](https://arxiv.org/abs/2607.10909) | 作者：Junchen Fu, Kaiwen Zheng, Ioannis Arapakis, Wenhao Deng, Xin Xin

**🗣️ 大白话：** 像 Qwen3-VL 这样的大预训练多模态嵌入模型在序列推荐中很有潜力，但直接用它们的嵌入效果并不理想，因为和推荐领域有 gap。这篇论文设计了一个 side adapter，让模型在冻结主参数的情况下适应推荐领域，而且解决了现有 side adapter 随着深度增加性能下降的问题。

**🔬 专业讲解：** 论文提出 Stresa（Stream-aware side-adaptation framework），包含 Stream-aware Hidden-Adapter Fusion（SHAF）保留历史 side memory 和 Residual Stream Adapter（ReSA）产生选择性残差更新。在多个公共数据集和多个骨干嵌入模型上，Stresa 一致优于标准 side adapter 和 SOTA 基线，展示了将大嵌入模型适配到序列推荐的前景。

---

## 📋 其他论文速览

- **Score-Only Distillation for Compact Dense Retrieval**（2607.11465）：大嵌入模型做检索效果好但部署贵，论文研究学生模型能否仅从分数向量学习教师排序行为，0.6B 学生模型恢复高达 50% 的基线到教师差距，查询编码快 4.7×、文档编码快 9.7×。

- **Tool-Adaptive LLM Reranker**（2607.10555）：TALRanker 将逐点相关性打分形式化为 agentic MDP，通过两阶段训练（warm-up + 非对称成本感知 RL）实现置信时跳过工具、不确定时检索外部证据，在标准和推理密集型检索基准上达到 SOTA，吞吐量与逐点重排器相当。

- **MMRM: A Multiplex Multimodal Representation Model for Product Ranking in E-commerce Search**（2607.11030）：京东电商搜索中部署的多路多模态表征模型，用共享骨干 + 任务特定 token 和投影层，从多种协同信号同时学习并生成多路物品表征，已在 JD 搜索引擎部署，为数百万日活用户带来显著性能提升。

- **Scaling and Stabilizing Large-Scale Embedding-Based Retrieval**（2607.10096）：Walmart 的 EBR 工业实践，提出在线跨批次采样增加负样本多样性，结合交叉编码器预测与元数据启发式识别细微不匹配；从 DistilBERT 过渡到 GTE-base 时通过 Warm-Start Distillation 保证平滑迁移，NDCG@5 +7.34%、总收入 +0.50%。

- **SVD-RAG: Efficient Tree-Organized RAG via SVD**（2607.10316）：用 SVD 对密集句嵌入矩阵做提取式摘要，构建层次 RAG 树，无需 LLM 摘要，构建树快 317 倍，检索质量与 RAPTOR 差距仅 1–5%。

- **Multilingual Semantic Retrieval for Apple Music Search**（2607.10239）：Apple Music 的 3.05 亿参数多语言语义检索系统，基于 GTE-multilingual-base 微调，全球 A/B 测试中转化率提升 2.28%，无结果率降低 86%，长尾查询转化率提升 7.93%。

- **GRASP: GRanularity-Aware Search Policy for Agentic RAG**（2607.10463）：RL 框架训练 agent 在语义搜索、关键词搜索和段落阅读间自适应协调，根据答案准确性、grounded reading、互补搜索和轮次效率联合优化 reward。

- **NGM-RAG: Neural Graph Matching based RAG**（2607.11159）：结合文本匹配和 GNN 的图匹配 RAG，在多跳问答和长文本摘要上优于 NaiveRAG、GraphRAG 和 LightRAG。

- **FAIR GraphRAG**（2607.11464）：将 FAIR Digital Objects 作为图检索基本单元，应用于胃肠病学生物医学数据集，在涉及元数据和本体链接的复杂查询上显著提升 QA 准确性和可解释性。

- **PaperRouter-Agent: Personalized Hierarchical Paper Routing**（2607.11564）：为个人参考管理器中的文件夹层次结构设计的训练免 LLM agent，基于文件夹成员而非名称进行路由决策，真实个人库中 Recall@1 从 0.39 提升到 0.61。
