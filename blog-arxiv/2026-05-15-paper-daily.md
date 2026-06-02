---
title: "【推荐系统 Paper 日报】2026-05-15"
date: 2026-05-15
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2762258360"
---


# 【推荐系统 Paper 日报】2026-05-15

> 本期覆盖 arXiv cs.IR 最新论文（截止 2026-05-14），共筛选出 30+ 篇推荐系统相关论文。本期重点方向：**生成式推荐（Generative Recommendation）**、**LLM × 推荐系统**、**序列推荐**、**协同过滤去偏**、**联邦推荐**。

---

### 📊 今日概览

本周 arXiv cs.IR 共收录 125 篇论文，其中推荐系统方向占据半壁江山。核心趋势呈现三大脉络：**① 生成式推荐（Generative Recommendation）**持续火热，LLM 推理能力与 Semantic ID 的结合催生了大量新方法；**② LLM 融入推荐系统**从"简单 prompt 注入"走向"深度架构融合"，包括用户画像生成、组推荐模拟、CTR 预测等；**③ 推荐系统公平性与可解释性**受到重视，从去偏、因果推理到可信推荐均有突破。SIGIR 2026 已接收多篇重磅论文，工业界（美团、字节、阿里等）也贡献了多项实践工作。

---

### 🔬 推荐系统论文深度解读

#### 1. Task-Aware Automated User Profile Generation for Recommendation Simulation Using LLMs

**arXiv:** [2605.13497](https://arxiv.org/abs/2605.13497) | **SIGIR 2026** ✅
**作者:** Xinye Wanyan, Chenglong Ma, Danula Hettiachchi, Ziqi Xu, Jeffrey Chan
**日期:** 2026-05-14（今日最新）

**大白话解读：** 推荐系统需要大量用户交互数据来训练和评估，但真实数据稀缺。现在流行用 LLM 模拟用户行为，但模拟效果好不好，关键取决于用户画像好不好。这篇论文提出 APG4RecSim 框架，能自动从真实行为数据中生成"像人"的用户画像，不用人工手动编写。实验证明生成的画像能大幅改善模拟质量（nDCG@10 提升 7%）。

**专业讲解：** 传统 LLM 用户模拟框架包含 profile/memory/action 三模块，但已有工作主要优化 memory 和 action，忽视了 profile 生成这一关键瓶颈。APG4RecSim 通过最小监督构建真实、连贯且稳健的用户画像。在三个基准数据集上，APG4RecSim 在 discrimination、ranking 和 rating 任务上均取得最优综合性能，且生成的画像对流行度偏见和位置偏见具有鲁棒性。

---

#### 2. A Standardized Re-evaluation of Conversational Recommender Systems on the ReDial Dataset

**arXiv:** [2605.13053](https://arxiv.org/abs/2605.13053) | **SIGIR 2026** ✅
**作者:** Ivica Kostric, Krisztian Balog
**日期:** 2026-05-14（今日最新）

**大白话解读：** 对话式推荐系统（就像跟 AI 聊天让它帮你推荐电影）已经研究了很久，但大家用的实验方法不一致，导致结果很难横向比较。这篇论文对 7 种主流方法在统一条件下重新评测，发现了一个有意思的现象：**很多性能提升其实来自 LLM 本身的强大能力，而不是推荐架构的创新**。

**专业讲解：** 论文揭示了"粒度差距"——细粒度排序（Recall@1）对实现细节极其敏感；同时发现近 50% 的报告准确率来自"重复捷径"（repetition shortcuts），在新颖性评估中这些优势消失。此外，用户中心效用指标显示传统 Recall 经常高估系统的实际对话效果。这为对话式推荐系统的评估提供了透明、可控的基线。

---

#### 3. MLPs are Efficient Distilled Generative Recommenders

**arXiv:** [2605.12617](https://arxiv.org/abs/2605.12617)
**作者:** Zitian Guo, Yupeng Hou, Clark Mingxuan Ju, Neil Shah, Julian McAuley
**日期:** 2026-05-12

**大白话解读：** 生成式推荐模型（用 Semantic ID 自回归生成推荐）效果很好但太慢了。这篇论文发现：生成式推荐的瓶颈不在模型本身，而在于**解码策略太复杂了**。他们提出用简单的 MLP 替代复杂的 Transformer 解码器，通过知识蒸馏把 Transformer 学到的东西"教给" MLP，结果速度提升 8.74 倍，精度完全不输。

**专业讲解：** SID-MLP 框架通过识别生成式推荐中"第一层 token 最难预测，后续 token 预测难度急剧下降"的特性，用 MLP 替代 attention-heavy 的 Transformer 解码器。位置特定的 MLP 头部通过蒸馏从自回归教师模型学习，消除密集 attention 开销。实验表明 SID-MLP 匹配教师模型精度同时加速 8.74x，且支持即插即用的不同骨干和分词器设置。

---

#### 4. TwiSTAR: Think Fast, Think Slow, Then Act

**arXiv:** [2605.11553](https://arxiv.org/abs/2605.11553)
**作者:** Shiteng Cao, Kaian Jiang, Yunlong Gong, Zhiheng Li
**日期:** 2026-05-12

**大白话解读：** 生成式推荐有两派：一派"快但不够准"（直接生成），一派"准但太慢"（链式推理）。这篇论文提出一个"聪明"的折中方案——不是对所有用户都走慢路径，而是让系统自己判断：简单的用户历史就快处理，复杂的历史走推理路径。

**专业讲解：** TwiSTAR 框架为 LLM 配备三种工具：快速 SID 检索器、轻量级候选排序器、慢速推理模型。关键创新是注入协作常识——将 item-to-item 知识转化为自然语言解释，让慢速模型更有依据。一个通过监督预训练+强化学习训练的 planner，动态决定每次调用哪个工具。在三个数据集上均优于强基线，在保持准确率的同时降低了推理延迟。

---

#### 5. Conditional Memory Enhanced Item Representation for Generative Recommendation

**arXiv:** [2605.11447](https://arxiv.org/abs/2605.11447)
**作者:** Ziwei Liu, Yejing Wang, Shengyu Zhou, Xinhang Li, Xiangyu Zhao
**日期:** 2026-05-12

**大白话解读：** 生成式推荐中，每个物品被编码为一串 Semantic ID token，但这些 token 嵌入之间的关系很微妙——直接拼在一起会丢失信息，用额外网络增强又可能引入噪声。这篇论文提出 ComeIR，用一个"条件记忆"模块来智能地重建这些 token 嵌入。

**专业讲解：** ComeIR 框架通过三层机制解决 item 表征构建的瓶颈：MM-guided token scoring 自适应估计每个 SID 内 code 的贡献度；dual-level Engram memory 同时捕捉 item 内 code 组合模式和 item 间转移模式；memory-restoring prediction head 在 SID 解码时复用记忆。实验显示 ComeIR 有效且灵活，扩大条件记忆还能带来可扩展的性能增益。

---

#### 6. FedMM: Federated Collaborative Signal Quantization for Multi-Market CTR Prediction

**arXiv:** [2605.11433](https://arxiv.org/abs/2605.11433) | **SIGIR 2026** ✅
**作者:** Jun Zhang, Dugang Liu, Xing Tang, Xiuqiang He, Zhong Ming
**日期:** 2026-05-12

**大白话解读：** 像亚马逊、Netflix 这样的平台要服务多个国家/地区，但各国数据不能直接合并（隐私问题），而且不同市场的商品 ID 完全不同。这篇论文提出 FedMM，用"离散码本"机制在保护隐私的前提下，让不同市场之间共享有用的协作信号。

**专业讲解：** FedMM 采用双层码本机制：第一层全局联邦码本通过聚合更新捕获跨市场共享的协作模式；第二层本地码本学习市场特定语义。通过残差量化变分自编码器（RQ-VAE）对每个市场的协作嵌入进行量化，学习的离散代码整合通用和特定信号后输入下游 CTR 模型。在基准数据集上显著提升推荐性能同时保证隐私。

---

#### 7. Debiasing Message Passing to Mitigate Popularity Bias in GNN-based Collaborative Filtering

**arXiv:** [2605.11145](https://arxiv.org/abs/2605.11145)
**作者:** Md Aminul Islam, Ahmed Sayeed Faruk, Sourav Medya, Elena Zheleva
**日期:** 2026-05-11

**大白话解读：** GNN 做协同过滤效果很好，但它有个"势利"的毛病——热门商品被推荐得太多，冷门商品被严重忽视。现有去偏方法要么不够直接，要么依赖静态启发式规则。这篇论文提出 DPAA，直接在消息传递过程中自适应地调整权重，让冷门商品也有机会被推荐。

**专业讲解：** DPAA 框架在消息传递中直接集成自适应、嵌入感知的交互权重和逐层权重。交互级权重来自表征感知的流行度信号，通过平滑过渡从预训练到训练中嵌入来稳定。同时引入逐层权重放大高阶邻居，暴露出具有多样化且曝光不足物品的远程交互。在真实和半合成数据集上优于现有最好的去偏方法。

---

#### 8. HSUGA: LLM-Enhanced Recommendation with Hierarchical Semantic Understanding

**arXiv:** [2605.11662](https://arxiv.org/abs/2605.11662) | **ACL 2026 Findings** ✅
**作者:** Guorui Li, Dugang Liu, Lei Li, Xing Tang, Zhong Ming
**日期:** 2026-05-12

**大白话解读：** 用 LLM 增强序列推荐时，通常直接把用户的历史交互序列喂给 LLM 来理解用户偏好。但问题是：序列太长了 LLM 处理不了，而且所有用户用同一个策略，活跃用户和沉默用户不分。这篇论文提出 HSUGA，对用户偏好做分层理解，并根据用户活跃度自适应调整语义利用强度。

**专业讲解：** HSUGA 引入两个核心插件：Hierarchical Semantic Understanding（HSU）执行两阶段偏好挖掘，通过约束编辑操作建模偏好演化，提升用户语义提取的可靠性；Group-Aware Alignment（GAA）根据用户活跃度水平调整语义利用强度，对活跃用户给予较弱对齐（因为已有丰富行为数据），对稀疏用户给予强指导。在三个基准数据集上验证了有效性和兼容性。

---

#### 9. RecRM-Bench: Benchmarking Multidimensional Reward Modeling for Agentic Recommender Systems

**arXiv:** [2605.11874](https://arxiv.org/abs/2605.11874)
**作者:** Wenwen Zeng, Jinhui Zhang, Hao Chen 等
**日期:** 2026-05-12

**大白话解读：** LLM Agent 正在重塑推荐系统，用强化学习优化这些 Agent 是个好方向，但当前奖励模型只关注最终交互结果，忽略了中间能力（比如能不能正确理解用户指令）。这篇论文构建了 RecRM-Bench，目前最大最全面的 Agent 推荐系统多维奖励基准，包含 100 万条结构化条目。

**专业讲解：** RecRM-Bench 涵盖四个核心评估维度：指令遵循、事实一致性、查询-物品相关性、细粒度用户行为预测。从语法合规到复杂意图理解和偏好建模，提供全面评估。论文还提出了多维奖励模型构建系统和混合奖励函数框架，为开发可靠和高能力的 Agent 推荐系统奠定了坚实基础。

---

#### 10. Beyond Centralization: User-Controlled Federated Recommendations in Practice

**arXiv:** [2605.12527](https://arxiv.org/abs/2605.12527)
**作者:** Manel Slokom, Alejandro Bellogin
**日期:** 2026-04-10

**大白话解读：** 联邦推荐系统把数据留在用户设备上，保护隐私。但大多数研究只停留在理论层面，这篇论文做了一个真实的**53 天现场实验**，22 个用户参与。结果发现：用户确实更喜欢个性化（CTR 65.37% vs 62.07%），而且会主动调整推荐设置（满意度 3.93/5，248 次设置变更）。

**专业讲解：** 论文展示了用户控制、隐私保护和有效个性化可以在一个实际系统中结合。用户能理解交互如何影响推荐（通过即时反馈），并据此调整行为。这是目前少数几个将联邦推荐系统部署到真实用户中的实证工作之一。

---

#### 11. LASAR: Latent Adaptive Semantic Aligned Reasoning for Generative Recommendation

**arXiv:** [2605.10207](https://arxiv.org/abs/2605.10207)
**作者:** Yiwen Chen, Fuwei Zhang, Zehao Chen 等
**日期:** 2026-05-11

**大白话解读：** 大模型通过"链式思考"（CoT）展示出强大的推理能力，但逐 token 生成推理文本太慢了。最近流行"隐式推理"——在连续隐藏空间中做多步推理，又快又准。这篇论文将这一范式引入生成式推荐，提出 LASAR，几乎零延迟就能完成推理，比生成显式 CoT 快约 20 倍。

**专业讲解：** LASAR 通过 SFT-then-RL 框架解决三个挑战：(1) 通过两阶段训练桥接 SID 符号和连续隐式推理；(2) 通过显式 CoT 语义对齐和双向 KL 散度约束缓解表征漂移；(3) GRPO-based RL 阶段动态分配每样本的推理步数。实验显示 LASAR 超越所有基线，平均推理步数减半同时提升推荐质量。

---

#### 12. Every Preference Has Its Strength: Injecting Ordinal Semantics into LLM-Based Recommenders

**arXiv:** [2605.10323](https://arxiv.org/abs/2605.10323) | **SIGIR 2026** ✅
**作者:** Jiwon Jeong, Donghee Han, Sungrae Hong, Woosung Kang, Mun Yong Yi
**日期:** 2026-05-11

**大白话解读：** 现有的 LLM 推荐系统把用户评分简单粗暴地转成"看过"或"没看过"，丢失了评分的"强度"信息（比如 5 星和 1 星都是"看过"）。这篇论文提出 OSA，把评分的强度信息显式地注入 LLM，让模型能区分"喜欢"和"非常喜欢"。

**专业讲解：** OSA 将序数偏好级别表示为数值文本 token，用其 token 嵌入作为语义锚点来对齐 LLM 隐空间中的用户-物品交互表征。通过跨序数级别的强度感知对齐，OSA 在将协作信号与 LLM 集成时保留了偏好语义。在多数据集上始终优于现有基线，在成对偏好评估中表现尤为突出。

---

#### 13. AgentGR: Semantic-aware Agentic Group Decision-Making Simulator for Group Recommendation

**arXiv:** [2605.10367](https://arxiv.org/abs/2605.10367)
**作者:** Yangtao Zhou, Wenhao You, Hua Chu, Shihao Guo, Jianan Li, Zhifu Zhao, Qingshan Li
**日期:** 2026-05-11

**大白话解读：** 组推荐（给一群人推荐一个共同的项目）比个人推荐更难，因为要模拟群体决策的复杂性。这篇论文提出 AgentGR，让 LLM Agent 扮演群体中的不同角色，模拟真实的群体讨论过程来做推荐。

**专业讲解：** AgentGR 引入语义元路径引导的链式偏好推理机制，整合高阶协同过滤信号和文本语义来改进用户偏好画像。同时识别群体话题和领导力来显式建模群体决策影响因素，通过两种多 Agent 模拟策略（静态工作流用于效率，动态对话用于精度）模拟群体级决策动态。在两个真实数据集上显著优于 SOTA 基线。

---

#### 14. Personalized Deep Research: User-Centric Framework for Knowledge Discovery

**arXiv:** [2605.10530](https://arxiv.org/abs/2605.10530) | **SIGIR 2026** ✅
**作者:** Xiaopeng Li, Wenlin Zhang, Yingyi Zhang, Pengyue Jia, Yejing Wang, Yichao Wang, Yong Liu, Huifeng Guo, Xiangyu Zhao
**日期:** 2026-05-11

**大白话解读：** Deep Research Agent 可以自动做学术研究，但目前的系统不管你是专家还是小白，用的都是同一套搜索策略。这篇论文提出 PDR，让研究 Agent 根据用户的知识水平和兴趣来调整搜索深度和广度，做出真正"个性化"的研究报告。

**专业讲解：** PDR 将用户画像建模与迭代查询开发、双阶段（私有/公共）检索和上下文感知合成统一到一个框架中。系统能自主对齐研究子目标与用户意图，优化证据收集的停止标准。实验表明 PDR 显著改善检索效用和报告相关性，有效弥合了通用信息检索与个性化知识获取之间的差距。

---

#### 15. UxSID: Semantic-Aware User Interests Modeling for Ultra-Long Sequence

**arXiv:** [2605.09040](https://arxiv.org/abs/2605.09040)
**作者:** Hongwei Zhang, Qiqiang Zhong, Jiangxia Cao, Yiyang Lv, Huanjie Wang, Liwei Guan, Jing Yao, Yiyu Wang, Junfeng Shu, Zhaojie Liu, Han Li
**日期:** 2026-05-09

**大白话解读：** 用户行为序列越来越长（可能上万次交互），但现有方法要么逐个物品搜索（太慢），要么压缩所有行为（丢失信息）。这篇论文提出 UxSID，走第三条路：按"语义组"共享兴趣记忆。在大规模广告 A/B 测试中带来 0.337% 的收入提升。

**专业讲解：** UxSID 利用 Semantic ID 和双级注意力策略，在不依赖物品特定模型的高成本下捕获目标感知偏好。这个端到端架构平衡了计算效率和语义意识，在大型广告 A/B 测试中实现了 0.337% 的收入提升和 SOTA 性能。

---

#### 16. A General Framework for Multimodal LLM-Based Multimedia Understanding in Large-Scale Recommendation Systems

**arXiv:** [2605.09338](https://arxiv.org/abs/2605.09338) | **SIGIR 2026 short** ✅
**作者:** Yiming Zhu, Xu Liu, Ziyun Xu, Zheng Wu, Joena Zhang, Sirius Chen, Chenheli Hua, Silvester Yao, Qichao Que, Wentao Shi, Junfeng Pan, Linhong Zhu
**日期:** 2026-05-10

**大白话解读：** 推荐系统经常忽略多媒体内容的丰富语义信号（比如商品的图片、视频、描述），限制了用户偏好建模的准确性。这篇论文提出一个通用框架，用多模态 LLM 来理解这些复杂数据，并在工业级大规模系统上验证了效果。

**专业讲解：** 采用三部件架构：内容解释（LLaMA2 生成描述性标题）→ 表征提取（转化为 tokenized 分类特征）→ 系统级管道集成。实验显示离线 AUC 提升 0.35%，在线指标提升 0.02%，证明了在延迟受限的大规模架构中集成 MM-LLM 的可行性。

---

#### 17. UserGPT: A Generative Paradigm for Personalized User Understanding

**arXiv:** [2605.08766](https://arxiv.org/abs/2605.08766)
**作者:** Yunyi Xuan, Hao Yi, Fengling Mao, Daye Cai, Leikun Liang, Xingsheng He, Jiangnan Xie, Guoshuai Wang, Yushan Han, Wenwen Guo, Xiaoxiao Xu, Lin Qu
**日期:** 2026-05-09

**大白话解读：** 从海量数字足迹中理解用户是个难题。传统方法靠人工特征工程预测离散属性，但结果往往是碎片化且不连贯的。这篇论文提出 UserGPT，让 LLM 把用户的长而嘈杂的行为历史总结成连贯的"叙事"，压缩率高达 97.9% 但关键信息不丢失。

**专业讲解：** UserGPT 包含用户行为模拟引擎生成真实复杂轨迹，数据驱动语义化模块将异构行为日志转化为结构化语义输入，以及课程驱动的后训练策略（SFT + DF-GRPO）。在 HPR-Bench 上，UserGPT 在标签预测（Avg@10=0.7325）和摘要生成（Acc_EX=0.7528）上表现优异。

---

#### 18. DCGL: Dual-Channel Graph Learning with LLMs for Knowledge-Aware Recommendation

**arXiv:** [2605.07314](https://arxiv.org/abs/2605.07314) | **SIGIR 2026** ✅
**作者:** Xinchi Zou, Tongzhenzhi Su, Jianjun Li, Yuan Fu, Chang Liu, Zhiying Deng, Zhiwei Shen
**日期:** 2026-05-08

**大白话解读：** 知识图谱（KG）做推荐能捕捉物品间隐藏关系，但现有的 KG+LLM 方法有个问题：直接把 ID 嵌入和 LLM 语义嵌入拼在一起，信号会互相干扰。这篇论文提出 DCGL，用"双通道"架构把语义和行为分开建模，互不干扰，再根据交互频率动态融合。

**专业讲解：** DCGL 双通道架构结构性地解耦语义信息和用户行为模式，防止早期干扰；多级对比学习增强对 KG 噪声的鲁棒性；动态融合机制根据交互频率自适应平衡语义泛化和行为特异性。在四个真实数据集上始终优于 SOTA，在稀疏场景下改善尤为显著。

---

#### 19. Quality-Aware Collaborative Multi-Positive Contrastive Learning for Sequential Recommendation

**arXiv:** [2605.11707](https://arxiv.org/abs/2605.11707)
**作者:** Wei Wang
**日期:** 2026-05-12

**大白话解读：** 对比学习做序列推荐很流行，但对比视图的构建质量参差不齐。现有方法要么用启发式规则增强，要么用可学习增强但不保证多样性。这篇论文提出 QCMP-CL，用"质量感知"机制来自适应地给不同视图分配不同权重，质量高的多贡献，质量少的少贡献。

**专业讲解：** QCMP-CL 引入可学习的协同序列增强模块，在两个互补的协同上下文中生成两个增强视图（基于相同目标序列和相似序列），增强视图多样性同时保持意图一致性。质量感知机制从增强操作的置信度估计每个视图质量，自适应分配权重。在三个真实数据集上优于 SOTA 对比学习序列推荐基线。

---

#### 20. PRISM: Refracting the Entangled User Behavior Space for E-Commerce Search

**arXiv:** [2605.07296](https://arxiv.org/abs/2605.07296)
**作者:** Haoqian Zhang, Ziyuan Yang, Yi Zhang
**日期:** 2026-05-08

**大白话解读：** 电商搜索中，用户行为信号（点击、购买等）不是干净独立的，而是被曝光机制、反馈循环和语义匹配"纠缠"在一起的。这篇论文提出 PRISM，不再假设偏好和相关性是两个独立信号，而是显式建模它们之间的交互。

**专业讲解：** PRISM 引入偏好修正模块迭代精炼用户偏好（在相关性感知约束下），改善对行为混杂的鲁棒性；LLM 驱动语义锚定机制利用正负原型校准相关性表征；偏好条件化证据路由模块自适应聚合多源行为信号。在两个公开电商基准上持续优于强基线。

---

#### 21. RRCM: Ranking-Driven Retrieval over Collaborative and Meta Memories for LLM Recommendation

**arXiv:** [2605.07129](https://arxiv.org/abs/2605.07129)
**作者:** Shijun Li, Wooseong Yang, Yu Wang, Tianxin Wei, Joydeep Ghosh
**日期:** 2026-05-08

**大白话解读：** LLM 做推荐的好处是能理解语义，但坏处是上下文窗口有限，塞太多行为数据和物品信息会溢出。这篇论文提出 RRCM，让 LLM 自己决定"该不该查"和"查什么"，而不是固定地塞所有信息进去。

**专业讲解：** RRCM 从轻量级用户历史上下文开始，学习直接推荐、检索协作证据、检索物品元数据或两者交织。所有记忆以自然语言表示并通过统一检索接口访问。使用 GRPO 优化记忆读取策略，使检索决策直接由最终 top-k 推荐质量驱动。实验显示显著优于传统基线和多样 LLM 推荐方法。

---

#### 22. An Embarrassingly Simple Graph Heuristic Reveals Shortcut-Solvable Benchmarks for Sequential Recommendation

**arXiv:** [2605.07125](https://arxiv.org/abs/2605.07125)
**作者:** Haoyu Han, Li Ma, Hanbing Wang, Bingheng Li, Daochen Zha, Chun How Tan, Huiji Gao, Xin Liu, Stephanie Moyerman, Sanjeev Katariya, Hui Liu, Jiliang Tang
**日期:** 2026-05-08

**大白话解读：** ⚠️ **这是一篇"打假"风格的论文**。序列推荐领域越来越卷，各种复杂模型层出不穷。但作者做了一个令人"尴尬"的实验：用一个超简单的图启发式方法（只看最后 1-2 个交互物品，从图里找候选），结果发现这个方法在多个基准数据集上**打败了大多数复杂模型**。

**专业讲解：** 该简单启发式方法（无序列编码器、无生成目标、无训练）在 Amazon Review Sports 和 CDs 上相对 NDCG@10 分别提升 38.10% 和 44.18% 超越最佳竞争基线。作者识别出三类"捷径结构"使得下一物品预测比预期更容易：低分支局部转移、特征平滑转移、不依赖长用户历史。论文呼吁在评估新模型时更谨慎地选择数据集和进行数据集级诊断分析。

---

#### 23. Bridging Textual Profiles and Latent User Embeddings for Personalization

**arXiv:** [2605.06981](https://arxiv.org/abs/2605.06981)
**作者:** Zhaoxuan Tan, Xiang Zhai, Yan Zhu, Meng Jiang, Mohamed Hammad
**日期:** 2026-05-07

**大白话解读：** 个性化系统需要用户表征，现有方法要么是黑盒嵌入（效果好但不可解释），要么是文本画像（可解释但难以优化）。这篇论文提出 BLUE，用强化学习把两者统一起来——让 LLM 生成的文本画像"靠近"正样本、"远离"负样本。

**专业讲解：** BLUE 通过 RL 框架统一两种用户表征形式：LLM 生成文本画像，嵌入模型提供奖励信号。引入文本空间监督信号基于下一物品预测，确保学到的画像既语义有意义又对下游检索高效。在 Amazon Reviews 2023 和 Google Local Reviews 上优于强基线，跨领域迁移效果突出。

---

#### 24. TRACE: Tourism Recommendation with Accountable Citation Evidence

**arXiv:** [2605.07677](https://arxiv.org/abs/2605.07677)
**作者:** Zixu Zhao, Sijin Wang, Yu Hou, Yuanyuan Xu, Yufan Sheng, Xike Xie, Wenjie Zhang, Won-Yong Shin, Xin Cao
**日期:** 2026-05-08

**大白话解读：** 旅游推荐是个高风险场景——推荐错了，用户真金白银就浪费了。这篇论文构建了 TRACE 数据集，要求推荐系统不仅要推荐对，还要给出**可验证的证据**（比如其他游客的真实评价），而且被拒绝后要能灵活调整。

**专业讲解：** TRACE 包含 10,000 个多轮旅游推荐对话，覆盖 2,400 个 Yelp POI 和 34,208 条评论。作者揭示了"三能力差距"：LLM 零样本在封闭集 Recall@1 和拒绝恢复上领先但引用密度低；非 LLM 检索器表面逐字锚定准确但精度低；多评论合成在恢复上失败。Grounding Score 与人类引用精度高度一致（Spearman rho=+0.80）。

---

#### 25. SuperIntelligent Retrieval Agent: The Next Frontier of Information Retrieval

**arXiv:** [2605.06647](https://arxiv.org/abs/2605.06647)
**作者:** Zeyu Yang, Qi Ma, Jason Chen, Anshumali Shrivastava
**日期:** 2026-05-07

**大白话解读：** 检索增强 Agent 越来越流行，但大多数还是"新手模式"——不断试探性地发查询，直到找到证据。这篇论文提出 SIRA，它能一步到位地找到目标证据，而不是像新手一样反复试探。

**专业讲解：** SIRA 将"超级智能"定义为将多轮探索性搜索压缩为单次语料库区分检索动作。在语料库侧，LLM 离线丰富每个文档的搜索词汇；在查询侧，预测查询中省略的证据词汇；文档频率统计作为工具调用过滤掉不存在、过于常见或不太可能产生检索裕度的词。最终检索是结合原始查询和验证扩展的单个加权 BM25 调用。在 10 个 BEIR 基准上超越密集检索器和 SOTA 多轮 Agent 基线。

---

### 📋 其他论文速览

| # | arXiv | 标题 | 亮点 |
| --- | --- | --- | --- |
| 1 | [2605.12763] | UniRank: Unified List-wise Reranking via Confidence-Ordered Denoising | 列表级重排序新框架 |
| 2 | [2605.10950] | Continuous Flood Nowcasting | 多传感器遥感框架 |
| 3 | [2605.10109] | NumColBERT: Non-Intrusive Numeracy Injection | 数值注入检索模型 |
| 4 | [2605.10097] | H-MAPS: Hierarchical Memory-Augmented Proactive Search | SIGIR 2026 Demo |
| 5 | [2605.09928] | OpenZL: Using Graphs to Compress Smaller and Faster | 图压缩数据库 |
| 6 | [2605.09836] | ReCoVR: Closing the Loop in Interactive Composed Video Retrieval | 视频检索 |
| 7 | [2605.09830] | Loom: Hybrid Retrieval-Scoring Outfit Recommendation | 服装搭配推荐 |
| 8 | [2605.09794] | LLM Agents Enable User-Governed Personalization | 跨平台个性化 |
| 9 | [2605.09236] | Nautilus Compass: Black-box Persona Drift Detection | LLM Agent 漂移检测 |
| 10 | [2605.08538] | Human-Inspired Memory Architecture for LLM Agents | Agent 记忆架构 |
| 11 | [2605.08222] | Historical Tabular Image to Knowledge Graphs | 历史表格转 KG |
| 12 | [2605.08217] | Retrieval Mechanisms Surpass Long-Context Scaling in Time Series | 时间序列检索 |
| 13 | [2605.07770] | FAVOR: Efficient Filter-Agnostic Vector ANNS | 向量近似搜索 |
| 14 | [2605.07517] | LARAG: Link-Aware Retrieval for RAG Systems | 超链接文档检索 |
| 15 | [2605.07358] | A Comprehensive Survey on Agent Skills | Agent 技能综述 |
| 16 | [2605.07249] | MLAIRE: Multilingual Language-Aware IR Evaluation | 多语言 IR 评估 |
| 17 | [2605.07210] | DiffRetriever: Parallel Representative Tokens for Retrieval | 扩散语言模型检索 |
| 18 | [2605.07158] | Topic Is Not Agenda: Citation-Community Audit of Text Embeddings | 文本嵌入审计 |

---

*以上论文均来源于 arXiv cs.IR 最新提交，筛选标准为与推荐系统、协同过滤、个性化、用户建模直接相关。*
*数据截止时间：2026-05-14*