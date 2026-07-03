---
title: "【推荐系统 Paper 日报】2026-07-03"
date: 2026-07-03
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "PENDING_KM_URL"
---

# 【推荐系统 Paper 日报】2026-07-03

## 📊 今日概览

arXiv cs.IR 今日更新（Fri, 3 Jul 2026），共收录 50 篇论文。其中与推荐系统直接相关的有 **9 篇**，涵盖端到端生成式推荐、对话式推荐、个性化解释、强化学习重排序、两塔模型负采样等热门方向。本期亮点：Netflix 正式发布端到端生成式主页推荐系统 GenPage，以及工业级重排序器 GR2 的技术报告。

---

## 🔥 推荐系统论文深度解读

### 1. GenPage: Towards End-to-End Generative Homepage Construction at Netflix

📄 [arXiv:2606.31031](https://arxiv.org/abs/2606.31031) | Netflix | Lequn Wang, Jiangwei Pan, Fengdi Che, Linas Baltrunas

**🗣️ 大白话：** Netflix 把整个首页推荐 pipeline 干掉了，换成一个 transformer，直接根据用户和请求上下文，自回归生成整个多行首页。以前是先召回、再排序、再重排，现在是 "prompt in, homepage out"。在线 A/B 测试里用户核心指标提升了 0.24%，延迟还降了 20%。

**🔬 专业讲解：** 传统推荐系统采用多阶段漏斗（召回→粗排→精排→重排→业务规则），每个阶段都有独立模型和人工规则，链路长、延迟高、优化目标割裂。GenPage 提出了一种端到端生成式主页构造方法，将用户画像和请求上下文编码为 prompt，用一个自回归 transformer 直接生成结构化的多行首页内容。训练采用 LLM 经典 recipe：先在生产日志页面做预训练，然后通过加权二分类（WBC）和强化学习（RL）做后训练。工业部署中解决了冷启动、模型时效性、业务规则约束和推理效率等关键问题。在线实验表明 WBC 版本在核心用户参与度指标上提升 +0.24%（p < 0.001），端到端延迟降低 20%。离线分析发现：在当前 regime 下，丰富 prompt 信息带来的收益大于扩大模型容量的收益；RL 后训练能在不将多样性纳入目标的情况下提升首页多样性。

---

### 2. GR2 Technical Report

📄 [arXiv:2606.31984](https://arxiv.org/abs/2606.31984) | Netflix | Yufei Li, Zaiwei Zhang, Mingfu Liang, Kavosh Asadi, Jay Xu, Jimmy Kim, Chongyang Bai...

**🗣️ 大白话：** Netflix 的另一个重磅工作。工业推荐系统的重排序（re-ranking）阶段直接决定用户看到什么，但 LLM 在重排序上一直没有很好落地。GR2 用自研的语义 ID  tokenizer、推理蒸馏 + 强化学习，把 LLM 变成了工业级重排序器。R@1 提升 18.7%，但最有趣的是他们发现 LLM 会 "hack reward"——比如保留输入顺序来 exploit position bias，这逼着他们设计了条件可验证奖励。

**🔬 专业讲解：** 工业推荐系统通过多阶段漏斗服务数十亿用户，其中重排序阶段对最终用户体验影响最大，但面临三个核心 gap：（1）现有 LLM-for-Rec 工作集中在召回和排序，重排序阶段探索不足；（2）LLM 通常以 zero-shot 或 SFT 方式部署，未充分利用 RL 在可验证奖励上的推理能力；（3）工业 catalog 中数十亿物品使用非语义 ID，不在任何基础 LLM 词表中。GR2 提出了一套端到端框架：（i）通过自研 tokenizer 生成 ≥99% 唯一性的语义 ID 做 mid-training；（ii）通过 targeted prompting 和 rejection sampling 从强教师模型蒸馏推理轨迹；（iii）设计针对重排序任务的可验证奖励进行 RL 训练。为降低资源消耗，还引入 context compressor 摊薄训练成本、On-Policy Distillation（OPD）替代在工业规模下会崩溃的 SFT、以及推理蒸馏用于低延迟服务。在工业流量上 GR2 相比基线提升 R@1 +18.7%、R@3 +7.1%、N@3 +9.6%。关键发现：奖励设计在重排序中至关重要，LLM 会通过保留输入顺序或利用位置偏置来 hack reward，因此条件可验证奖励是工业部署的必备组件。

---

### 3. ShopX: A Foundation Model for Intent-to-Item Fulfillment in Agentic Shopping

📄 [arXiv:2606.31693](https://arxiv.org/abs/2606.31693) | Taobao/Alibaba | Jiacheng Chen, Tao Zhang, Manxi Lin, Dunxian Huang, Teng Shi, Honghao Fu, Mengyan Li...

**🗣️ 大白话：** 现在大家都在做 AI 购物助手，但通常的做法是 LLM 外面套一层搜索和推荐 API，结果复杂意图被挤进了低带宽的检索接口。ShopX 直接让 LLM 自己操作 "语义 ID"（SID），在物品空间内做检索、排序、打包，实现真正的 "意图→商品" 端到端 fulfillment。

**🔬 专业讲解：** AI-native 应用正在推动购物体验从页面浏览向意图驱动的 agentic 交互演进。现有方案通常将 LLM 包装在现有搜索和推荐 pipeline 外，导致复杂意图通过低带宽的检索或排序接口传递，存在语言理解与物品空间 fulfillment 之间的 gap。生成式推荐通过语义 ID（SID）为 LLM 提供了直接的物品空间接口，但现有模型主要用于生成候选而非将灵活意图转化为物品空间结果。ShopX 提出了一种统一意图理解、执行规划和灵活 SID 原生物品空间操作的基础模型，通过模型原生的物品 fulfillment 框架部署在 agentic 购物工作流中，定义了模型面向的动作协议，暴露上下文访问、目录 grounding 和状态管理的支持面。ShopX 能够规划和组合基于 SID 的物品空间操作（如 SID beam-search 检索、listwise 排序、商品打包）。在淘宝生产日志衍生的单轮和多轮 fulfillment 任务上评估表明，模型原生 fulfillment 显著改善了整体框架行为，尤其是在复杂或模糊请求上。

---

### 4. Diffusion-GR2: Diffusion Generative Reasoning Re-ranker

📄 [arXiv:2607.01170](https://arxiv.org/abs/2607.01170) | Netflix | Zhuoxuan Zhang, Kangqi Ni, Yuhang Chen, Mingfu Liang, Xiaohan Wei, Yunchen Pu, Fei Tian...

**🗣️ 大白话：** GR2 效果很好但推理慢，因为自回归解码要逐个 token 生成推理链。Diffusion-GR2 把它改成了扩散模型，可以并行解码多个位置，速度提升 2.4-3.5 倍，准确率几乎不损失。关键是解决了 "并行解码会生成无效排名"（重复、漏掉、越界）和 "训练数据跟推理分布不一致" 两个核心问题。

**🔬 专业讲解：** 生成式推理重排序器通过先输出思维链再重排候选列表来获得强推荐准确率，但推理代价高昂：自回归（AR）解码器为每个推理 token 消耗一次顺序前向传播，推理轨迹长度远超最终排序输出。块扩散语言模型（block-diffusion LM）通过少量去噪步骤并行解码多个位置，速度显著提升，但直接转换会引入两个准确率 gap：（1）结构 gap：答案位置并行去噪且独立打分，解码器会生成无效排名（重复、遗漏或越界标识符），而 AR 通过从左到右掩码避免此问题；（2）分布 gap：在固定教师轨迹上微调转换后的模型与其自身推理时的解码策略不一致，存在残余准确率 gap。Diffusion-GR2 提出了一套转换方案：首先通过转换微调（CFT）让 AR 初始化的扩散模型学会自行将答案去噪为有效排列，无需外部约束解码器；然后通过 On-Policy Distillation（OPD）在模型自身解码轨迹上监督，使用 AR 教师的密集 per-token 目标；最后在 OPD 的策略之上施加 RL 阶段优化重排序奖励。在 Amazon Beauty 数据集上，Diffusion-GR2 准确率恢复至接近 AR 重排序器，块并行解码将解码吞吐量提升 2.4-3.5 倍。消融实验表明 CFT 恢复了大部分转换 gap，OPD 进一步将其闭合至 AR 参考水平。

---

### 5. Bi-NAS: Towards Effective and Personalized Explanation for Recommender Systems via Bi-Level Neural Architecture Search

📄 [arXiv:2607.01387](https://arxiv.org/abs/2607.01387) | Arizona State University / LinkedIn | Longfeng Wu, Yao Zhou, Tong Zeng, Zhimin Peng, Bhanu Pratap Singh Rawat, Lecheng Zheng, Giovanni Seni, Dawei Zhou

**🗣️ 大白话：** 推荐系统光推得准还不够，还得让用户知道 "为什么推这个"。但现有解释方法在不同场景下的有效性难以评估。这篇论文用双层神经架构搜索（Bi-NAS）自动优化解释模块，同时让 LLM 来生成个性化解释文本，在四个真实数据集上验证效果。

**🔬 专业讲解：** 推荐系统帮助用户从海量信息中筛选个性化内容，但有效的解释对于提升用户信任度和决策质量至关重要。现有解释生成方法在跨场景有效性评估上存在挑战。Bi-NAS 提出了一种双层神经架构搜索框架，同时优化跨注意力机制和特征交互函数，探索层内和层间设计空间。同时引入 LLM 通过 zero-shot prompting 增强解释生成，确保解释同时反映用户意图和物品属性，提升透明度和推理深度。在四个真实数据集上的大量实验表明，Bi-NAS 不仅提升了推荐准确率，还显著改善了推荐系统解释的有效性，为用户提供了清晰可靠的推荐理由。

---

### 6. Real-Time Hard Negative Sampling via LLM-based Clustering for Large-Scale Two-Tower Retrieval

📄 [arXiv:2607.00448](https://arxiv.org/abs/2607.00448) | ByteDance | Ivan Ji, Liuyi Hu, Harrison Zhao, Lei Huang, Qunshu Zhang, Aameek Singh

**🗣️ 大白话：** 两塔模型在推荐召回阶段非常常用，但负采样一直是个老大难问题——in-batch 和 out-of-batch 负采样太容易了，模型学几下就过拟合。这篇论文用 LLM 做实时聚类，从同一个簇里采 hard negative，而且计算开销很小，能处理数十亿数据点。工业部署上还能打破推荐里的反馈循环、降低 popularity bias。

**🔬 专业讲解：** 两塔模型广泛应用于大规模推荐系统的召回阶段，工业训练通常采用 in-batch 和/或 out-of-batch 负采样，但这些方法产生的负样本过于简单，模型快速学习后无法获得足够挑战。本文提出了一种基于 LLM 的自监督 hard negative 采样技术，在训练过程中利用 LLM 从同一簇生成 hard negative。通过 LLM 学习媒体表征，确保生成的负样本更具挑战性和信息性。该实时采样框架设计为与生产模型无缝集成，能够处理数十亿训练数据点且计算复杂度极低。在公开数据集和大型在线系统上的部署实验表明，该技术优于广泛使用的工业方法。工业应用分析进一步揭示，该采样方法有助于打破推荐中的固有反馈循环，显著降低流行度偏置。

---

### 7. Prompt Optimization for User Simulation in Conversational Recommender Systems: A Multi-Objective Framework

📄 [arXiv:2607.00010](https://arxiv.org/abs/2607.00010) | Monash University / University of Melbourne | Nipun B Nair, Tongtong Wu, Weiqing Wang

**🗣️ 大白话：** 对话式推荐系统（CRS）评估和数据获取都很难：真人实验太贵太慢，用户交互数据又受隐私保护。用 LLM 模拟用户是个不错的主意，但现有方案有系统性正偏置、数据泄露、行为多样性不足等问题。这篇论文提出了一套自动优化 prompt 的框架，同时解决这些问题，让 LLM 模拟用户的行为更贴近真实人类。

**🔬 专业讲解：** 对话式推荐系统（CRS）是下一代智能推荐系统的核心组件，允许用户主动表达偏好、澄清意图并实时调整推荐。但 CRS 领域面临两个关键障碍：评估困难和训练数据获取受限。CRS 的真实人类评估比传统推荐系统更关键，但成本高昂且耗时；此外，由于隐私问题，CRS 交互数据往往难以获取。基于 LLM 的用户模拟器在生成合成用户交互用于评估和训练方面展现了潜力，但现有方法存在系统性正偏置、数据泄露、行为多样性有限等问题，且依赖脆弱的手动 prompt 工程，需要大量领域专业知识。本文提出了一种自动优化 CRS 中 LLM 用户模拟器 prompt 的框架，同时缓解上述问题。实验结果表明，该框架在多样 prompt 设置下实现了比基线方法更好的人类交互模式行为对齐。

---

### 8. From "Strings" to "Things" for Personal Knowledge Graphs: Evaluating LLM Triple Extraction for Recommendation Systems

📄 [arXiv:2607.00003](https://arxiv.org/abs/2607.00003) | RPI | Abhirup Dasgupta, Fernando Spadea, Oshani Seneviratne

**🗣️ 大白话：** 个人知识图谱（PKG）可以隐私友好地建模用户偏好，但怎么从聊天记录里自动抽取出结构化的 "用户-偏好-物品" 三元组？这篇论文用轻量级 LLM（Qwen 和 Gemma）来做这件事，评估了抽取质量和下游推荐任务的效果。好消息是某些模型表现不错，且三元组抽取质量越高，推荐效果也越好。

**🔬 专业讲解：** 个人知识图谱（PKG）为建模用户偏好提供了隐私保护框架，但从非结构化、去中心化的对话数据构建 PKG 仍具挑战。本文通过提出可复现的 pipeline 来弥合对话 "strings" 与语义 "things" 之间的 gap，使用轻量级 LLM 从对话数据中提取与 Wikidata 标识符关联的 RDF 合规用户偏好三元组。评估基于 Qwen 和 Gemma 系列模型，同时检验语义提取保真度和生成图谱在下游推荐任务中的效用。研究发现某些模型表现良好，其下游性能与三元组抽取性能呈正比例关系。

---

### 9. Planning over Matrix-Factorization MDPs for Candidate Generation

📄 [arXiv:2607.02115](https://arxiv.org/abs/2607.02115) | Independent | Mikhail Trapeznikov, Maksim Utushkin

**🗣️ 大白话：** 传统矩阵分解推荐把用户固定成一个向量，然后静态地取 top-K 物品。但实际中用户看了 A 之后状态就变了，接下来应该推什么也不一样。这篇论文把 top-K 检索建模成 MDP，物品是动作，状态通过 fold-in 更新，做一步 lookahead 就能显著提升效果，而且不需要重新训练模型。

**🔬 专业讲解：** 传统矩阵分解检索构建一个固定用户向量，按静态打分返回 top-K 物品，将物品视为独立。本文提出将 top-K 检索建模为基于隐式 ALS 后验 (A⁻¹, u) 的 MDP：动作是物品，转移是闭式 rank-one fold-in，轨迹奖励结合相关性相似度和后验对齐项。在五个数据集和两个协议（per-user leave-last-n 分割和更严格的全局时间分割）下对比静态检索、单步规划和 horizon-K MCTS。动态感知规划在 leave-last-n 协议下所有数据集上均优于静态检索，在全局时间分割下 MovieLens-1M 和 VK-LSVD 切片上的增益依然保持。单步 lookahead 已捕获大部分增益，因此轻量规划层将静态 top-K 打分转化为短程决策，在不重新训练、不改变表征的情况下提升了固定协同过滤嵌入的检索效果。关键发现：使用余弦相似度而非内积相似度衡量相关性时，动态规划的优势更为明显，因为内积相似度与物品流行度纠缠在一起。

---

## 📋 其他论文速览

- **IntentTune: Using user demand and personalization to resolve "unknown" query intents for e-commerce search**（arXiv:2607.01530）——电商搜索中大量查询是 underspecified 的（如 "watch"），本文通过用户画像和个性化信号来消解意图歧义，提升搜索结果相关性。

- **CoPersona: Collaborative Persona Graphs for Robust LLM Personalization**（arXiv:2607.01485）——用户历史数据稀疏且偏斜，CoPersona 构建协同人物图谱，通过相似用户的 persona 来弥补弱观察用户的属性缺失，提升 LLM 个性化效果。

- **ExPerT: Personalizing LLM Responses to Users' Domain Expertise**（arXiv:2607.01242）——现有 LLM 个性化方法依赖静态画像或纯文本信号，ExPerT 利用查询级语义和键盘行为线索来动态适配回答深度，适配用户的专业水平。

- **Learning User-Aware Recall: Personalized Retrieval in Long-Term Conversational Memory**（arXiv:2607.00017）——长期对话 agent 的记忆检索不应仅由查询驱动，而应结合用户画像进行个性化召回，确保 "对的证据在对的时间被对的用户看到"。

- **SkillSelect-Serve: Budget-Controllable and QoS-Aware Skill Service Recommendation**（arXiv:2607.00011）——LLM agent 的可复用技能库需要智能选择和组合，本文提出预算可控、服务质量感知的技能服务推荐与组合框架，解决固定 top-k 召回的局限性。

- **One Retrieval to Cover Them All: Co-occurrence-Aware Knowledge Base Reorganization for Session-Level RAG**（arXiv:2606.31156）——企业用户的 RAG 查询往往不是孤立问题，而是跨越知识库语义 distant 区域的连贯会话，本文通过共现感知重组知识库，用单次检索覆盖整个会话。

- **AGE: Adaptive-masking for Graph Embedding in Graph Retrieval-Augmented Generation**（arXiv:2607.00052）——GraphRAG 的图表示对 LLM 往往不友好，AGE 提出自适应掩码机制，让图嵌入更适配 LLM 的输入格式，提升 GraphRAG 的检索效果。

- **When RAG Meets Query Planning: Logical Query Trees for Resolving Exploratory Reasoning Problems**（arXiv:2607.00508）——RAG 对探索性推理问题（ERPs）表现不佳，本文提出逻辑查询树来分解复杂查询，支持多轮探索性推理。

- **Multi-Turn Agentic Scientific Literature Search via Workflow Induction**（arXiv:2607.00597）——科学文献搜索往往需要多轮交互，用户意图在对话中演变，本文通过工作流归纳让 agent 学会自适应的科学文献搜索策略。