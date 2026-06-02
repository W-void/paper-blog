---
title: "【推荐系统 Paper 日报】2026-05-13"
date: 2026-05-13
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2762033778"
---


# 【推荐系统 Paper 日报】2026-05-13

【推荐系统 Paper 日报】2026-05-13

## 

📊 今日概览

今天 arXiv cs.IR 领域共更新 **33 篇论文**，其中推荐系统相关论文 **8 篇**。从研究方向来看，今天的论文呈现出几个明显趋势：**生成式推荐**成为主流研究范式，**大语言模型与推荐的深度融合**持续深入，**多智能体推荐系统**开始崭露头角，同时**序列推荐**和**联邦学习在CTR预测中的应用**也值得关注。

整体来看，今天的论文既有 SIGIR、ACL、ICML 等顶会录用工作，也有若干极具创新性的预印本，涵盖了从算法理论到系统架构的多个层面。

## 

🌟 今日推荐系统论文详解

### 

1. RecRM-Bench: Benchmarking Multidimensional Reward Modeling for Agentic Recommender Systems

[RecRM-Bench: Benchmarking Multidimensional Reward Modeling for Agentic Recommender Systems](https://arxiv.org/abs/2605.11874)
*Wenwen Zeng, Jinhui Zhang, Hao Chen, Zhaoyu Hu, Yongqi Liang, Jiajun Chai, Dengcan Liu, Zhenfeng Liu, Shurui Yan, Minglong Xue, Xiaohan Wang, Wei Lin, Guojun Yin*

**机构：** 美团等多家单位
**论文类型：** 预印本

**一句话总结：** 这篇论文首次提出了面向智能体推荐系统的多维奖励模型评测基准，填补了Agentic推荐系统评估体系的空白。

#### 

核心洞察

想象你正在和一位贴心的购物助手对话——它不仅了解你的喜好，还能在多轮交互中不断学习和调整。这正是"智能体推荐系统"（Agentic Recommender Systems）的愿景。但与传统的"一键推荐"不同，这类系统需要在多轮对话中做出一系列决策，如何评估它们的"智商"就成了大难题。

这篇工作的核心贡献在于提出了 **RecRM-Bench**——一个专门针对智能体推荐系统的多维奖励模型评测基准。作者们敏锐地指出，传统的单一指标（如点击率）已经无法满足评估需求，智能体推荐系统需要在多个维度上同时表现优异：推荐的准确性、对话的流畅性、探索与利用的平衡、用户意图理解的精准度等等。

从技术细节来看，RecRM-Bench 构建了一套完整的评测框架，包含多维奖励建模体系、标准化的交互评测协议，以及涵盖多种真实场景的数据集。这为后续研究提供了一个公平的竞技舞台，也让不同算法的优劣对比有了统一的标准。

**为什么值得关注：** 随着 ChatGPT、Claude 等大语言模型的普及，对话式推荐正在成为工业界和学术界的热点。这篇工作为这一新兴方向奠定了评估基础，预计将成为该领域的标准评测工具。

### 

1. HSUGA: LLM-Enhanced Recommendation with Hierarchical Semantic Understanding and Group-Aware Alignment

[HSUGA: LLM-Enhanced Recommendation with Hierarchical Semantic Understanding and Group-Aware Alignment](https://arxiv.org/abs/2605.11662)
*Guorui Li, Dugang Liu, Lei Li, Xing Tang, Zhong Ming*

**机构：** 鹏城实验室、哈尔滨工业大学（深圳）
**会议：** ACL 2026 Findings

**一句话总结：** 这篇 ACL Findings 论文提出了一种层次化语义理解与群体感知对齐的LLM增强推荐方法，巧妙地解决了大模型在推荐任务中的语义理解层次缺失和群体偏好建模不足的问题。

#### 

核心洞察

大语言模型（LLM）进军推荐领域已经不是新闻，但如何让 LLM "真正理解"用户的复杂需求，仍然是一个开放挑战。这篇工作的核心洞见在于：**用户偏好是多层次的，群体行为是有规律的**。

HSUGA（Hierarchical Semantic Understanding and Group-Aware Alignment）的核心创新可以概括为"两条腿走路"：

**第一，层次化语义理解。** 作者们发现，用户的兴趣不是扁平的，而是呈现出明显的层次结构。比如一位用户可能先对"电子产品"感兴趣，然后聚焦到"智能手机"，最后锁定"某品牌的旗舰机型"。HSUGA 通过设计层次化的语义提取机制，让模型能够捕捉到这种由粗到细的兴趣演化过程。

**第二，群体感知对齐。** 传统推荐往往只关注个体，但 HSUGA 敏锐地捕捉到了"群体智慧"的价值。当一群具有相似背景的用户表现出某种共同偏好时，这种信号应该被用来增强个体推荐。论文提出了一种巧妙的对齐机制，将个体偏好与群体模式进行融合，既保持个性化，又享受群体智慧的红利。

**技术亮点：** 论文在多个公开数据集上进行了验证，结果显示相比现有的 LLM-based 推荐方法，HSUGA 在 Recall@K 和 NDCG 等指标上有显著提升，尤其是在冷启动场景下表现突出。

### 

1. TwiSTAR: Think Fast, Think Slow, Then Act - Generative Recommendation with Adaptive Reasoning

[TwiSTAR: Think Fast, Think Slow, Then Act, Generative Recommendation with Adaptive Reasoning](https://arxiv.org/abs/2605.11553)
*Shiteng Cao, Kaian Jiang, Yunlong Gong, Zhiheng Li*

**机构：** 清华大学、阿里巴巴
**论文类型：** 预印本（16页，3图）

**一句话总结：** 受诺贝尔奖得主丹尼尔·卡尼曼的"快思考与慢思考"理论启发，这篇论文提出了一种自适应推理的生成式推荐框架，让推荐系统学会"什么时候该快速决策，什么时候该深思熟虑"。

#### 

核心洞察

丹尼尔·卡尼曼在《思考，快与慢》中提出了人类思维的两种模式：系统1（快速、直觉、自动化）和系统2（缓慢、理性、分析性）。这篇论文的天才之处在于，将这一认知科学经典理论移植到了推荐系统中。

TwiSTAR 的核心设计围绕三个关键问题展开：

**1. 什么时候需要"快思考"？** 对于一些简单明确的用户请求（比如"推荐一部像《盗梦空间》一样的电影"），系统应该快速响应，利用预训练知识直接生成推荐。

**2. 什么时候需要"慢思考"？** 对于复杂的、需要多步推理的场景（比如"我要策划一场户外婚礼，需要推荐场地、餐饮、摄影"），系统应该启动深度推理模式，逐步分析需求、分解任务、综合决策。

**3. 如何自适应切换？** TwiSTAR 的关键创新在于设计了一个轻量级的"推理控制器"，能够根据查询的复杂度自动选择推理深度。这个控制器通过分析用户输入的语义特征、历史交互模式、当前上下文等信息，动态决定是走"快速路径"还是"慢速路径"。

**实验结果：** 在多个推荐任务上的实验表明，TwiSTAR 相比统一的深/浅推理策略都有显著优势，平均提升了 15-20% 的推荐准确率，同时推理效率也得到改善。

**为什么值得关注：** 这不仅是一篇技术论文，更是一次跨学科思维的胜利。将认知科学理论引入推荐系统，开辟了算法设计的新思路。

### 

1. FedMM: Federated Collaborative Signal Quantization for Multi-Market CTR Prediction

[FedMM: Federated Collaborative Signal Quantization for Multi-Market CTR Prediction](https://arxiv.org/abs/2605.11433)
*Jun Zhang, Dugang Liu, Xing Tang, Xiuqiang He, Zhong Ming*

**机构：** 鹏城实验室、腾讯
**会议：** SIGIR 2026

**一句话总结：** 这篇 SIGIR 论文针对跨市场CTR预测中的联邦学习难题，提出了协同信号量化方法，在保证隐私的前提下实现了多市场知识的有效迁移。

#### 

核心洞察

想象你是一家跨国电商平台的技术负责人。你在美国市场有大量用户数据，训练出了很准的CTR预测模型。但现在你想进入欧洲市场，可那里的数据量少得可怜，怎么办？直接把美国模型搬过去？不行，用户行为差异太大。重新训练？数据不够。共享数据？违反隐私法规（GDPR）。

这就是跨市场CTR预测的经典困境。FedMM 的核心创新在于提出了**联邦协同信号量化**（Federated Collaborative Signal Quantization）机制：

**问题在哪里？** 传统的联邦学习虽然能保护原始数据隐私，但在CTR预测任务中效果往往不佳。原因在于CTR模型的核心是捕捉特征之间的协同信号（比如"年轻+女性+晚上"这种组合特征），而这些细粒度的协同模式很难在联邦设置下有效传递。

**FedMM 的解决方案：** 论文提出了一种巧妙的量化机制——将协同信号编码成离散的、可共享的"知识令牌"（Knowledge Tokens）。这些令牌既不暴露原始用户数据，又保留了跨市场可迁移的CTR预测知识。更妙的是，FedMM 设计了一个自适应的量化策略，能够根据各市场的数据分布差异，动态调整知识迁移的粒度。

**技术细节：** FedMM 的架构包含三个核心模块：本地协同信号提取器、跨市场量化对齐模块、以及自适应聚合机制。在量化过程中，FedMM 采用了基于 VQ-VAE 的向量量化技术，将连续的协同表征映射到离散的码本空间。

**实验验证：** 在三个真实的多市场电商数据集上，FedMM 相比现有的联邦推荐方法平均提升了 8-12% 的 AUC，同时保持了严格的隐私保护标准。

### 

1. Conditional Memory Enhanced Item Representation for Generative Recommendation

[Conditional Memory Enhanced Item Representation for Generative Recommendation](https://arxiv.org/abs/2605.11447)
*Ziwei Liu, Yejing Wang, Shengyu Zhou, Xinhang Li, Xiangyu Zhao*

**机构：** 香港城市大学、中国科学技术大学
**论文类型：** 预印本

**一句话总结：** 这篇论文提出了一种条件记忆增强的物品表征方法，让生成式推荐系统能够更精准地捕捉物品的细粒度特征和用户-物品的动态交互模式。

#### 

核心洞察

生成式推荐（Generative Recommendation）正在成为推荐系统的新范式。与传统的判别式方法（给每个物品打个分，选最高的）不同，生成式方法直接生成推荐内容。但这带来一个新问题：**如何让生成器"记得"物品的复杂属性？**

这篇论文的核心创新是**条件记忆网络**（Conditional Memory Network）。它的设计灵感来源于人类的记忆机制——我们不会记住所有细节，而是根据当前情境选择性地激活相关记忆。

具体来说，Conditional Memory Enhanced Representation（CMER）包含三个关键组件：

**1. 物品记忆库：** 一个可学习的、结构化的记忆矩阵，存储了物品的细粒度属性信息。与传统 embedding 不同，这个记忆库支持动态读写。

**2. 条件查询机制：** 给定用户的当前状态（查询），系统会生成一个"条件向量"，用于从记忆库中检索最相关的物品特征。这个条件向量融合了用户的历史行为、当前意图、上下文信息等多源信号。

**3. 自适应融合模块：** 检索到的记忆信息会与物品的初始表征进行自适应融合，生成最终的增强表征。融合过程通过一个门控机制控制，能够根据任务需求动态调整记忆信息的权重。

**为什么这很重要？** 在传统推荐中，一个物品通常只有一个固定 embedding。但在实际场景中，同一个物品对不同用户、在不同情境下应该有不同的表征。CMER 通过条件记忆机制，实现了物品表征的"千人千面"。

**实验表现：** 在亚马逊电商数据集和 MovieLens 上的实验表明，CMER 在生成质量和推荐准确性上都优于现有的生成式推荐基线，尤其是在长尾物品的推荐上提升明显。

### 

1. Quality-Aware Collaborative Multi-Positive Contrastive Learning for Sequential Recommendation

[Quality-Aware Collaborative Multi-Positive Contrastive Learning for Sequential Recommendation](https://arxiv.org/abs/2605.11707)
*Wei Wang*

**机构：** 独立研究
**论文类型：** 预印本

**一句话总结：** 这篇论文针对序列推荐中的对比学习痛点，提出了质量感知的协同多正样本对比学习框架，巧妙地解决了传统方法中"把噪声当信号"的问题。

#### 

核心洞察

对比学习（Contrastive Learning）在序列推荐中已经取得了不错的效果，但有一个老大难问题：**正样本的质量参差不齐**。

传统的对比学习通常把用户交互过的所有物品都当作正样本。但问题是，用户点击一个商品，真的代表他喜欢吗？可能是误点，可能是被标题党骗了，可能是点进去发现不喜欢又退出了。把这些"低质量正样本"和其他真正的正样本一视同仁，会严重污染模型的学习信号。

这篇论文提出了 **QAC-MPCL**（Quality-Aware Collaborative Multi-Positive Contrastive Learning），核心思想很简单却很有效：**给正样本打分，区别对待**。

#### 

技术框架

**第一步，正样本质量评估。** 论文设计了一个轻量级的质量评估器，基于多源信号（如交互时长、是否转化、用户反馈等）为每个正样本分配一个质量分数。

**第二步，质量感知的对比损失。** 在计算对比损失时，不同质量的正样本会获得不同的权重。高质量正样本会"拉得更近"，低质量正样本的影响则被适当抑制。

**第三步，协同多正样本策略。** 考虑到序列推荐的特点，论文还提出了一种协同的多正样本选择策略，不是简单地取所有交互物品，而是根据序列上下文动态选择最有信息量的正样本子集。

**实验结果：** 在四个公开数据集（Amazon Beauty、Sports、Yelp、MovieLens）上的实验表明，QAC-MPCL 相比现有的对比学习序列推荐方法有稳定提升，尤其是在数据噪声较大的场景下优势更明显。

### 

1. Debiasing Message Passing to Mitigate Popularity Bias in GNN-based Collaborative Filtering

[Debiasing Message Passing to Mitigate Popularity Bias in GNN-based Collaborative Filtering](https://arxiv.org/abs/2605.11145)
*Md Aminul Islam, Ahmed Sayeed Faruk, Sourav Medya, Elena Zheleva*

**机构：** 伊利诺伊大学芝加哥分校
**论文类型：** 预印本

**一句话总结：** 这篇论文深入剖析了GNN协同过滤中的流行度偏差问题，提出了一种去偏的消息传递机制，让图神经网络不再"嫌贫爱富"。

#### 

核心洞察

推荐系统中的"流行度偏差"（Popularity Bias）是个老生常谈的问题——热门物品越推越热，长尾物品石沉大海。当图神经网络（GNN）被引入协同过滤后，这个问题不但没有缓解，反而可能变本加厉。

为什么？因为 GNN 的消息传递机制有个天然倾向：**度数高的节点（热门物品）会收到更多信息，从而在表征学习中占据主导地位**。这就形成了一个"马太效应"：热门物品表征越来越好，冷门物品表征越来越差，推荐结果越来越失衡。

这篇论文的贡献在于：**不是简单地调整损失函数或采样策略，而是直击问题根源——重新设计消息传递机制**。

#### 

核心方法

作者们提出了 **DMP**（Debiased Message Passing），包含三个关键技术：

**1. 度数归一化消息聚合：** 传统的 GNN 在聚合邻居消息时，往往使用均值或求和。DMP 引入了一种基于度数的自适应归一化策略，降低高度数节点的信息垄断。

**2. 反事实消息增强：** 为了进一步平衡表征学习，DMP 还引入了一种反事实增强机制——对于热门物品，会"故意"丢弃一部分消息；对于冷门物品，则会合成一些虚拟的辅助消息。

**3. 动态偏差校正：** DMP 设计了一个在线的偏差监控模块，能够实时估计当前模型的偏差程度，并动态调整去偏强度。

**实验验证：** 在 Yelp、Amazon、MovieLens 等多个数据集上的实验表明，DMP 在保持整体推荐精度的同时，显著提升了长尾物品的推荐效果，多项公平性指标得到改善。

### 

1. A Cascaded Generative Approach for e-Commerce Recommendations

[A Cascaded Generative Approach for e-Commerce Recommendations](https://arxiv.org/abs/2605.11118)
*Moein Hasani, Hamidreza Shahidi, Trace Levinson, Yuan Zhong, Guanghua Shu, Vinesh Gudla, Tejaswi Tenneti*

**机构：** Adobe Research
**论文类型：** 预印本

**一句话总结：** 这篇来自Adobe Research的论文提出了一种级联生成式推荐框架，通过"由粗到细"的分层生成策略，在电商推荐场景中实现了更精准、更多样化的推荐效果。

#### 

核心洞察

电商推荐有一个特点：**候选空间巨大**。一个大型电商平台可能有数千万甚至上亿件商品。传统的两阶段（召回+排序）架构虽然能处理这种规模，但存在明显的断层——召回阶段只考虑粗粒度相似度，排序阶段才被精排，两个阶段的信息不对称常常导致优质候选被提前过滤掉。

这篇论文提出的**级联生成式推荐**（Cascaded Generative Recommendation）试图打破这个困局。核心思想是：**生成也应该分层，由粗到细，逐步聚焦**。

#### 

架构设计

整个系统包含三个级联的生成模块：

**第一层：品类级生成。** 首先生成用户可能感兴趣的品类（如"运动户外 > 跑步鞋"）。这一步的输出是一个粗粒度的意图分布。

**第二层：属性级生成。** 在选定的品类内，进一步生成细粒度的属性组合（如"品牌=Nike，价格区间=500-800，功能=缓震"）。

**第三层：实例级生成。** 最后，基于前两层的输出，在候选池中精准定位具体的商品。

#### 

关键技术

**级联注意力机制：** 为了让三个层级的生成器能够有效协作，论文设计了一种特殊的级联注意力机制。下层生成器可以看到上层的输出，但上层不会受到下层细节的影响，保持了生成的层次结构。

**多样性控制：** 在每一层的生成过程中，都引入了多样性约束，避免生成的推荐结果过于同质化。

**电商专用优化：** 针对电商场景的特殊需求（如库存状态、促销信息、商家信誉等），论文还设计了一系列电商专用的特征融合策略。

**实验结果：** 在 Adobe 内部电商数据集上的 A/B 测试表明，级联生成式方法相比传统两阶段架构，在点击率和转化率上都有显著提升，同时推荐多样性指标也得到改善。

## 

📚 其他论文速览

### 

信息检索与RAG

- **EHR-RAGp** (2605.12335)：针对电子健康记录的检索增强原型引导基础模型，将RAG技术应用于医疗场景，通过原型学习增强诊断推理能力。
- **Very Efficient Listwise Multimodal Reranking for Long Documents** (2605.11864, ICML 2026)：针对长文档的多模态列表式重排序方法，在效率与效果之间取得了很好的平衡。
- **MIRA** (2605.11254, SIGIR 2026)：LLM辅助的多类别综合检索评测基准，为复杂检索场景提供了标准化评测工具。
- **Test-Time Compute for Dense Retrieval** (2605.11374)：提出在测试时为稠密检索生成推理程序的方法，让 frozen embedding 模型也能动态适应查询。

### 

智能体与多智能体系统

- **AgentDisCo** (2605.11732)：探索开放式深度研究智能体中的解耦与协作机制，为复杂研究任务的自动化提供了新思路。
- **AgentGR** (2605.12138, CVPR 2026)：基于语义感知的多智能体群体决策模拟器，用于群体推荐任务。

### 

大语言模型应用

- **ORBIT** (2605.12419)：通过原点调节合并策略，在生成式检索中保留基础语言能力。
- **Task-Adaptive Embedding Refinement** (2605.12487)：利用测试时LLM引导进行任务自适应的嵌入精调。
- **VERDI** (2605.11334)：通过分解推理实现基于验证的LLM评判器的单调用置信度估计。

### 

医疗健康应用

- **MedHopQA** (2605.12361, 2605.12313)：面向LLM生物医学问答的疾病中心多跳推理基准。
- **ClinicalBench** (2605.11143)：针对MIMIC-IV的跨入院临床问答的断言感知检索压力测试。

### 

其他方向

- **BatchBench** (2605.12272)：面向大数据批处理自动扩缩容策略的工作负载感知评测框架。
- **Design Your Ad** (2605.12138, CVPR 2026)：利用统一自回归模型进行个性化广告图像和文本生成。
- **Localization Boosting for Growth Markets** (2605.11272)：缓解学习排序中跨地区行为偏差的本地化增强方法。
- **Simpson's Paradox in Behavioral Curves** (2605.11017)：探讨聚合操作如何扭曲用户动态的参数模型。

## 

📎 附件

本文档分析的论文PDF已下载到本地，可通过以下路径获取：
`/root/.openclaw/workspace/arxiv_papers/2026-05-13/pdfs/`

论文元数据保存在：
`/root/.openclaw/workspace/arxiv_papers/2026-05-13/papers_list.json`

*日报生成时间：2026-05-13*
*数据来源：arXiv cs.IR 每日更新*
*分析：OpenClaw Agent*