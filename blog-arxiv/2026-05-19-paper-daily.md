---
title: "【推荐系统 Paper 日报】2026-05-19"
date: 2026-05-19
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2762926376"
---


# 【推荐系统 Paper 日报】2026-05-19

> 📅 论文来源：arxiv cs.IR，公告日期：Tue, 19 May 2026
> 📊 今日 cs.IR 论文总计：**36 篇**（含 cross-list）
> 🎯 推荐系统相关：**10 篇**，涵盖多模态推荐、去偏校准、生成式推荐、个性化强化学习等方向

---

### 一、今日概览

今天的 cs.IR 收到了整整 36 篇论文，阵仗相当大。推荐系统方向有 10 篇值得关注，今天的研究呈现出几个鲜明趋势：

**生成式推荐**持续火热，从时尚图文生成（DualFashion）到评论增强序列建模（RAGR），大家都在琢磨怎么让推荐不只是"猜你喜欢"，而是能"说清楚为什么"。**去偏/校准**也是今天的高频词——短视频观看时长预测的长尾偏差（DADF）、低活用户的不确定性校准、生成式推荐中的流行度偏差（Ghost），三篇论文从不同角度挖这个坑。另外，来自 Pinterest 工业界的一篇 RL 框架论文（PRL-PUTS）实战感极强，值得细读。

---

### 二、今日推荐系统论文深度解读

---

#### 📄 1. MAIL: Modality-Aware Identity Construction and Counterfactual Structure Learning for ID-Free Multimodal Recommendation

**🔗 链接**：[arxiv.org/abs/2605.18044](https://arxiv.org/abs/2605.18044) | [PDF](https://arxiv.org/pdf/2605.18044)
**👥 作者**：Hongjian Ma, Wenxin Huang, Yan Zhang, Zhifei Li, Zheng Wang
**🏷️ 关键词**：多模态推荐、ID-free、反事实学习、流行度去偏

##### 🍞 大白话解读

传统推荐系统给每个商品一个 ID 编号（就像身份证），然后用这个 ID 来匹配用户兴趣。但问题是，新商品没有 ID，数据稀疏，容易扑街。最近大家开始尝试"无 ID"方案——直接用商品的图片、文字等多模态信息来代替 ID。

但已有的无 ID 方案有两个毛病：一是构建出来的"身份特征"太静态，没充分利用多模态的丰富语义；二是做图学习的时候容易被热门商品带偏，长尾商品永远捞不到。

**MAIL** 的解法：动态调制位置编码（Modality-Aware Identity Construction）来构建更灵活的 ID-free 表示，同时引入**反事实结构学习**（Counterfactual Structure Learning），主动挖掘被热门商品压制的长尾语义关联。

##### 🔬 专业讲解

**核心模块**：

- **模态感知身份构建模块**：用多模态语义动态调制位置编码，使商品表示随模态信息变化而变化，而非固定向量
- **反事实图结构学习**：通过反事实推断识别哪些边是因为"流行度相似"建立的伪关联，剔除噪声边，增强长尾商品之间的真实语义连接
- **图卷积融合**：在清洁图结构上做 GNN 传播，获得更可靠的协同信号

**实验结果**：在多个标准多模态推荐基准（Baby、Sports、Clothing 等）上超越当前 SOTA，特别是在长尾物品的召回指标上提升显著。

---

#### 📄 2. DADF: A Distribution-Aware Debiasing Framework for Watch-Time Regression in Recommender Systems

**🔗 链接**：[arxiv.org/abs/2605.17863](https://arxiv.org/abs/2605.17863) | [PDF](https://arxiv.org/pdf/2605.17863)
**👥 作者**：Yiqing Yang, Xinlong Zhao, Zhao Liu, Xiao Lv, Ruiming Tang, Han Li, Kun Gai
**🏛 机构**：华为 Noah's Ark Lab / 快手（作者背景涵盖头部短视频平台）
**🏷️ 关键词**：观看时长预测、长尾分布、去偏、第二阶段校正

##### 🍞 大白话解读

短视频平台要预测用户会看一个视频多久——这个"观看时长"分布极其不均匀：大多数视频只看几秒，少数视频才会看完。这种长尾分布让模型很头疼：一个看起来整体误差还行的模型，其实悄悄地在把短视频的时长高估、长视频的时长低估，两个方向的误差互相抵消了。

**DADF** 不去替换已有的预测模型，而是做**第二阶段乘法残差校正**：在原始预测值的基础上再乘一个校正因子。这个校正因子由三个互补设计共同计算：动态分布感知变换（稳定长尾校正目标）、去偏因子感知模块（对不同视频时长建模异质残差模式）、以及 Quantile-guided 对比学习。

##### 🔬 专业讲解

**三核心设计**：

1. **Dynamic Distribution-Aware Transformation**：对校正目标做稳定化变换，防止极端值主导训练
2. **Debias-Factor-Aware Module**：以视频时长（duration）作为推断时可观测的核心因子，建模不同 duration 组的残差异质性
3. **Quantile-guided Contrastive Learning**：在分位数层面对比学习，强制模型区分"高观看"和"低观看"区间的预测行为

**方法亮点**：即插即用（plug-in），不依赖模型结构，可叠加在任意现有观看时长预测模型上做校正，工业落地友好。

---

#### 📄 3. Uncertainty-Calibrated Recommendations for Low-Active Users

**🔗 链接**：[arxiv.org/abs/2605.17788](https://arxiv.org/abs/2605.17788) | [PDF](https://arxiv.org/pdf/2605.17788)
**👥 作者**：Bob Junyi Zou, Sai Li, Tianyun Sun, Wentao Guo, Qinglei Wang 等
**🏛 机构**：大型直播平台工业界背景（论文明确提到"major livestream platform"）
**🏷️ 关键词**：不确定性量化、低活用户、UCB 探索、差异化策略

##### 🍞 大白话解读

一个推荐系统面对的用户千差万别：每天刷好几小时的"重度用户"和偶尔打开看一眼的"低活用户"。对这两类人，应该用完全不同的策略。

低活用户历史数据少，模型对他们的预测很不确定——如果这时候给他们推一个"不靠谱"的内容，他们可能就直接流失了。高活用户有足够的历史，反而可以多探索新类型内容，发现新兴趣。

这篇论文做了一个统一框架：用**模型不确定性**来区分这两类用户，然后分别上不同策略——低活用户用风险厌恶的"打压策略"（deboosting），高活用户用 **UCB 探索**（给置信区间上界高的内容加分），在真实直播平台上验证有效。

##### 🔬 专业讲解

**不确定性量化方法**：基于 dropout 的 MC Sampling 或集成方法，在推理时估计每个推荐的预测方差

**差异化策略**：

- **LAU（低活用户）**：将不确定性高的候选项 deboosting，抑制可能导致负体验的低质推荐
- **HAU（高活用户）**：UCB = 预测均值 + β × 标准差，鼓励探索历史上未被充分展示的内容

**工业价值**：生产就绪的统一框架，无需为不同用户群维护独立模型，在留存率和多样性指标上均有提升。

---

#### 📄 4. TGQ-Former: Text-Guided Visual Representation Learning for Robust Multimodal E-Commerce Recommendation

**🔗 链接**：[arxiv.org/abs/2605.17366](https://arxiv.org/abs/2605.17366) | [PDF](https://arxiv.org/pdf/2605.17366)
**👥 作者**：Yufei Guo, Jing Ma, Tianlu Zhang, Shijie Yang, Yanlong Zang, Weijie Ding, Pinghua Gong, Jungong Han
**🏷️ 关键词**：电商推荐、多模态、视觉噪声、Q-Former、文本引导

##### 🍞 大白话解读

电商图片往往很"脏"——上面贴满了"限时折扣""买一送一"的水印、促销横幅，背景也乱七八糟。这些"视觉噪声"会污染商品的图像特征，让以图找图或图文匹配变得一团糟。

**TGQ-Former** 的思路是：用商品的文字信息（标题、类目、属性）来**引导**图像特征提取，告诉模型"我们关注的是商品本身，不是那些促销贴纸"。具体用的是 Q-Former 结构（BLIP-2 那套），配上一个混合查询连接器，区分"文本锚定视觉流"和"探索视觉流"，用可靠性感知的双门控模块自适应融合。

##### 🔬 专业讲解

**核心设计**：

- **Hybrid-Query Connector**：分两路查询——一路用文本 metadata 做锚定查询（抑制噪声），一路做自由探索查询（捕捉潜在视觉特征）
- **Reliability-Aware Dual-Gated Vector Modulation**：在嘈杂输入下自适应调节两路视觉流的权重，噪声大时更依赖文本锚定路
- 整体插入 MLRM（Multimodal LLM-based Recommendation）pipeline，与冻结的视觉编码器兼容

**工业背景**：在真实大规模电商数据集上验证，直接面向生产场景的问题，实用性强。

---

#### 📄 5. DualFashion: Dual-Diffusional Generative Fashion Recommendation

**🔗 链接**：[arxiv.org/abs/2605.17357](https://arxiv.org/abs/2605.17357) | [PDF](https://arxiv.org/pdf/2605.17357)
**👥 作者**：Mingzhe Yu, Lei Wu, Qianru Sun, Yunshan Ma
**🏷️ 关键词**：时尚推荐、生成式推荐、扩散模型、图文联合生成、可解释性

##### 🍞 大白话解读

买衣服的时候，你不只是想看个缩略图——你想知道"这件衣服穿出去是什么感觉"，还有"为什么推荐给我"。

**DualFashion** 做的就是这件事：不只预测你下一件可能喜欢的衣服的 ID，而是**同时生成这件衣服的图片和文字描述**。通过一个双分支扩散 Transformer（图像分支 + 文字分支），以用户历史交互中提取的属性级字幕和视觉穿搭信息为条件信号，联合扩散生成，既保证视觉搭配合理，又能解释推荐理由。

##### 🔬 专业讲解

**双分支扩散架构**：

- 图像分支：用用户行为历史的视觉特征作为条件，扩散生成目标 outfit 图像
- 文字分支：用属性级结构化字幕（颜色、风格、材质等）作为条件，扩散生成文字描述
- 跨分支交互：图像分支和文字分支共享部分注意力层，保证图文语义一致性

**可解释性**：生成的文字描述直接作为推荐理由，可视化展示给用户，解决时尚推荐"黑盒"问题。

---

#### 📄 6. RAGR: Review-Augmented Generative Recommendation

**🔗 链接**：[arxiv.org/abs/2605.17267](https://arxiv.org/abs/2605.17267) | [PDF](https://arxiv.org/pdf/2605.17267)
**👥 作者**：Yingyi Zhang, Junyi Li, Yejing Wang, Wenlin Zhang, Xiaowei Qian, Sheng Zhang, Yue Feng, Yichao Wang 等
**🏷️ 关键词**：序列推荐、生成式推荐、评论增强、语义 ID

##### 🍞 大白话解读

用户买了什么→点了什么→这就是序列推荐的全部数据。但你想想，用户每次交互都留下了评论——"这个耳机低音太强了不喜欢""这款粉底色号太深"——这些**为什么**买/不买的理由，几乎没有推荐系统用到过。

**RAGR** 提出把评论塞进用户序列里去建模。具体做法：用语义 ID 编码评论（不只是商品本身），在生成式推荐的 token 序列里穿插"物品语义 ID + 评论语义 ID"，这样模型不只知道用户买了什么，还知道用户怎么评价的——让推荐更懂用户的真实偏好。

##### 🔬 专业讲解

**核心思路**：打破"序列推荐 = 纯物品 ID 序列"的范式，引入评论 feedback 作为额外 token

**Review-Augmented User Sequence**：

- 每个历史交互位置包含：物品语义 ID（item token）+ 评论语义 ID（review token）
- 评论语义 ID 通过 VQ-VAE 风格的量化编码生成，将评论文本映射到离散 token 空间
- 自回归解码时，模型在"下一个物品"和"下一条评论"上联合训练

**实验结果**：在多个公开基准上（Amazon 系列数据集），相比纯物品序列的生成式推荐方法，HR@10 和 NDCG@10 均有显著提升。

---

#### 📄 7. Ghost: Echoes in Filter Bubble — Diagnosing and Curing Popularity Bias in Generative Recommenders

**🔗 链接**：[arxiv.org/abs/2605.16825](https://arxiv.org/abs/2605.16825) | [PDF](https://arxiv.org/pdf/2605.16825)
**👥 作者**：Jun Yin, Bangguo Zhu, Peng Huo, Ruochen Liu, Hao Chen, Senzhang Wang, Shirui Pan, Chengqi Zhang
**🏷️ 关键词**：生成式推荐、流行度偏差、物品 tokenization、去偏

##### 🍞 大白话解读

生成式推荐系统（GR）最近很火，它把推荐问题变成序列生成问题——就像语言模型生成文字一样，生成"下一个推荐物品的 code"。但这类系统有个被忽视的老毛病：**流行度偏差**，热门商品在训练数据里出现太多，模型就更倾向于生成热门商品的 token，形成"回声室"效应。

这篇论文做了理论分析，找到了 GR 中流行度偏差的两个根源：（1）**token 级优化缺陷**：交叉熵损失在 code 层面不对等地偏向频繁出现的 token；（2）**物品 tokenization 的无差别性**：语义 ID 编码没有区分热门和长尾物品。基于此提出 **Ghost** 系统，从这两个维度同时矫正。

##### 🔬 专业讲解

**理论贡献**：首次对 GR 中流行度偏差的来源进行形式化分析，证明偏差来自"token-level optimization flaw + undifferentiated item tokenization"的叠加

**Ghost 的两个矫正机制**：

- **Token-level Debiasing Loss**：对高频 token 施加降权，对低频（长尾物品相关）token 施加补偿，平衡优化梯度
- **Popularity-Aware Tokenization**：在语义 ID 编码阶段引入流行度信息，让热门物品和长尾物品的 code 在结构上可区分

**实验结果**：在多个公开数据集上，Ghost 在保持整体准确率的同时，显著提升长尾物品的召回率和公平性指标。

---

#### 📄 8. UniER: A Unified Benchmark for Item-level and Path-level Exercise Recommendation

**🔗 链接**：[arxiv.org/abs/2605.16750](https://arxiv.org/abs/2605.16750) | [PDF](https://arxiv.org/pdf/2605.16750)
**👥 作者**：Xinghe Cheng, Guiyong Zhuang, Yusheng Xie, Jiapu Wang, Yixin Liu, Quanlong Guan, Liangda Fang 等
**🏷️ 关键词**：教育推荐、习题推荐、统一基准、学习路径规划

##### 🍞 大白话解读

教育推荐系统分两派：一派做"给你推下一道最合适的题"（物品级），另一派做"给你规划一条学习路径，让你长期收益最大"（路径级）。这两派的评估指标完全不同，导致根本没法横向比较谁更好。

**UniER** 来打统一。提出一个新指标叫 **WCG（加权认知增益）**，把单步推荐和路径规划都能衡量的认知提升量化出来，在 9 个数据集上对多种算法进行了统一评测，算是给这个方向立了规矩。

##### 🔬 专业讲解

**WCG 指标设计**：结合知识追踪（Knowledge Tracing）中的认知状态估计，对推荐的习题序列赋予基于知识点难度和学生掌握程度的权重，度量整体认知提升量

**基准覆盖**：4 种题目生成机制 × 9 个数据集 × 多种 ILER/PLER 算法，是目前教育推荐领域覆盖最全的统一评测框架

**意义**：推动教育推荐领域告别"各自为战"，走向可重复、可对比的规范化研究。

---

#### 📄 9. PRL-PUTS: A Production-Ready RL Framework for Personalized Utility Tuning with Pareto Sweeping in Pinterest Recommender Systems

**🔗 链接**：[arxiv.org/abs/2605.16344](https://arxiv.org/abs/2605.16344) | [PDF](https://arxiv.org/pdf/2605.16344)
**👥 作者**：Yichu Zhou, Mehdi Ben Ayed, Lin Yang, Jiacong He, Andreanne Lemay, Jiaye Wang, Jaewon Yang, Josie Ze... (Pinterest 团队)
**🏛 机构**：Pinterest
**🏷️ 关键词**：工业推荐系统、多目标优化、强化学习、效用权重调优、帕累托前沿

##### 🍞 大白话解读

大型推荐系统（比如 Pinterest）通常要同时优化好几个目标：用户点击、保存、观看时长、商业化收入……这些目标之间经常互相打架。目前的做法是人工调整各目标的权重，但这个过程极其痛苦：每次业务方向变了都要重调，全局一刀切，反应又慢。

**PRL-PUTS** 把效用权重调优变成了一个 RL 问题：给定当前请求的上下文（用户特征、场景信号），RL agent 实时选择一组最优的目标权重向量，最大化请求级别的参与度奖励。同时引入**帕累托前沿扫描**——推理时对 scalarization 参数扫多组值，生成一族策略和对应的帕累托前沿，决策者可以一键切换当前部署的操作点。

##### 🔬 专业讲解

**系统设计亮点**：

- **One-step Value-based RL**：避免复杂的时序 RL，将效用调优简化为单步决策，大幅降低在线推理开销
- **Ranker Independent**：RL agent 在排序模型之上工作，不侵入排序器，便于独立迭代
- **Inference-time Pareto Sweeping**：通过 scalarization 参数扫描，在推理时即可可视化完整的业务-效率权衡曲线
- **Governance Artifact**：帕累托前沿作为治理工具，产品决策者可以直接在前沿上选择运营点

**工业价值**：Pinterest 实际部署验证，解决了工业界效用调优中长期存在的"慢、手动、全局"三大痛点，值得工业界同仁深读。

---

#### 📄 10. How Algorithmic Popularity Bias Hinders or Promotes Quality

**🔗 链接**：[arxiv.org/abs/1707.00574](https://arxiv.org/abs/1707.00574) | [PDF](https://arxiv.org/pdf/1707.00574)
**👥 作者**：Azadeh Nematzadeh, Giovanni Luca Ciampaglia, Filippo Menczer, Alessandro Flammini
**🏛 机构**：Indiana University（网络科学与复杂系统方向）
**🏷️ 关键词**：流行度偏差、质量vs流行度、算法影响、经典论文重现

> ⚠️ 注：这是一篇 2017 年的论文（arXiv ID: 1707.00574），今日出现在 cs.IR recent 列表中可能是因为版本更新或交叉引用。作为经典背景文献收录。

##### 🍞 大白话解读

这是一篇研究"热度算法"会不会把好内容推上去的经典之作。结论颇为辩证：**取决于用户探索的意愿成本**。当用户懒得探索（认知成本高），流行度算法会形成自我强化的滚雪球效应，劣质但热门的内容会把优质但小众的内容压死；但当用户主动探索时，流行度反而能帮助高质量内容脱颖而出。

对今天做去偏研究的人来说，这篇论文是绕不开的理论基石。

##### 🔬 专业讲解

**模型设定**：文化市场模型 + 内在质量参数 + 认知探索成本参数，分析流行度算法在不同参数设置下对质量排名的影响

**核心发现**：

- 当用户探索成本低：流行度 ≈ 质量的合理代理，算法有效
- 当用户探索成本高：出现相变（phase transition），低质量高流行度项目固化，优质内容永久被压制
- 这一机制与 Ghost（第7篇）中的 filter bubble 理论直接呼应

---

### 三、其他论文速览

> 今日其他 26 篇 cs.IR 论文，按方向分类快速扫描。

#### 🔍 检索与搜索

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 1 | [TIGER-FG](https://arxiv.org/abs/2605.18434) | 电商图文检索的文本引导隐式细粒度定位，提升复杂商品的检索精准度 |
| 2 | [Improving BM25 Code Retrieval](https://arxiv.org/abs/2605.18561) | 在固定通用分词下改进 BM25 代码检索，自适应 q-Log Odds 即插即用 |
| 3 | [PIPER: Table Search via LLM Pseudoqueries](https://arxiv.org/abs/2605.18199) | 用 LLM 生成伪查询做内容级表格搜索，突破 schema-only 匹配局限 |
| 4 | [Multi-Value-Aware E-Commerce Search](https://arxiv.org/abs/2605.17994) | 电商搜索的多价值感知检索框架，兼顾用户体验与平台可持续性 |
| 5 | [IVF-TQ: Streaming-Robust ANN Search](https://arxiv.org/abs/2605.17415) | 无码书残差层实现流式鲁棒近似最近邻搜索，支持向量索引动态更新 |
| 6 | [Policy-Grounded Dynamic Facet Suggestions](https://arxiv.org/abs/2605.16479) | 招聘搜索中基于策略的动态切面建议生成，提升搜索意图覆盖 |

#### 🤖 RAG & LLM 应用

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 7 | [SD-Search: On-Policy Search-Augmented Reasoning](https://arxiv.org/abs/2605.18299) | 在线策略自蒸馏提升 LLM 搜索增强推理能力，让模型更会搜、更会用搜索结果 |
| 8 | [From Volume to Value: On-Device RAG Memory](https://arxiv.org/abs/2605.18271) | 端侧 RAG 的偏好对齐记忆构建，从海量信息中筛选高价值内容存本地 |
| 9 | [Vector RAG vs LLM-Compiled Wiki](https://arxiv.org/abs/2605.18490) | 向量 RAG 与 LLM 编译 Wiki 的预注册对比研究，评估两种知识访问策略 |
| 10 | [LERA: LLM-Enhanced RAG for Ad Auction](https://arxiv.org/abs/2605.16474) | 生成式聊天机器人广告拍卖的 LLM 增强 RAG，探索 AI 搜索商业化路径 |
| 11 | [Protein-Text QA Dual-Dimensional RAG](https://arxiv.org/abs/2605.17261) | 蛋白质文本问答的双维度 RAG 框架，整合生物工作流知识提升鲁棒性 |
| 12 | [MARQUIS: Video RAG Pipeline](https://arxiv.org/abs/2605.17640) | 视频 RAG 三阶段流程，从海量视频中检索相关片段支持多模态生成任务 |

#### 📊 信息检索基础研究

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 13 | [RCTEA: Temporal Entity Alignment](https://arxiv.org/abs/2605.18255) | 时序实体对齐的丰富度引导协同训练框架，提升知识图谱跨时态对齐 |
| 14 | [Text-Video Retrieval Global-Local](https://arxiv.org/abs/2605.17959) | 文本-视频跨模态检索的全局-局部对比一致性学习，提升语义匹配精度 |
| 15 | [LARGER: Repo Graph Retrieval](https://arxiv.org/abs/2605.16352) | 词汇锚定代码仓库图探索与检索，提升大型代码库的语义导航能力 |
| 16 | [RAPT: Retrieval-Aug Multi-Label](https://arxiv.org/abs/2605.16535) | 多标签分类的检索增强后验阈值方法，通过相似样本优化分类决策边界 |

#### 🌍 语言与语料库

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 17 | [SomaliWeb v1](https://arxiv.org/abs/2605.18232) | 高质量索马里语网络语料库，含匹配分词器和语言识别基准，推动低资源NLP |
| 18 | [Dataset Visibility Asymmetry](https://arxiv.org/abs/2605.17442) | 低资源多语言 NLP 数据集可见性不对称问题，超越目录统计看真实资源获取 |

#### 🏛️ 学术与专业领域

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 19 | [Peer Reviewer Identification](https://arxiv.org/abs/2605.18752) | 传统统计表示在识别同行评审专家上优于生成式AI，学术评审自动化新洞见 |
| 20 | [Temporal Decay Co-Citation](https://arxiv.org/abs/2605.17639) | 法律条文引用预测的时间衰减，基于3.96亿乌克兰法院引用的20年基准研究 |
| 21 | [SotA Lens: Research Review Tool](https://arxiv.org/abs/2605.16333) | 网络增强的最新研究综述方法论工具，辅助研究者系统性探索领域前沿 |

#### 🔒 安全与其他

| # | 标题 | 一句话摘要 |
| --- | --- | --- |
| 22 | [Privacy Leakage via Prompt Injection](https://arxiv.org/abs/2605.18133) | 黑盒聊天机器人提示注入导致隐私泄露链的实证研究，揭示 AI 系统安全隐患 |
| 23 | [AI Search Impact on Content Ecosystem](https://arxiv.org/abs/2605.16428) | AI 搜索对在线内容生态的影响，基于 Google 和 Reddit 的实证分析 |
| 24 | [Agentic Chunking Fuzzy Cognitive Maps](https://arxiv.org/abs/2605.17903) | AI 生成模糊认知图的智能分块与贝叶斯反分块，用于战略情景博弈建模 |
| 25 | [NewsLens: News Bias Navigation](https://arxiv.org/abs/2605.17364) | 多智能体新闻偏见导航框架，对抗性地分析新闻内容中的立场偏向 |
| 26 | [Approximate Distributed Coded Computing](https://arxiv.org/abs/2605.16744) | 分布式编码计算近似算法，多项式码和随机草图优化通信效率 |

---

*🤖 由 小美 自动生成 | arxiv cs.IR 日报 | 2026-05-19*
*📚 覆盖今日 36 篇 cs.IR 论文，其中推荐系统相关 10 篇深度解读*