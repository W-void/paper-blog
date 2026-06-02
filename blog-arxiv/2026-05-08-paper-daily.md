---
title: "【推荐系统 Paper 日报】2026-05-08"
date: 2026-05-08
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2760875908"
---


# 【推荐系统 Paper 日报】2026-05-08

> 📅 日期：2026-05-08（周五）｜来源：[arxiv cs.IR](https://arxiv.org/list/cs.IR/recent)

---

### 今日概览

今天 arxiv cs.IR 共收录 **26 篇**新论文（2026-05-08），研究方向相当多元：**生成式推荐**继续是热门赛道，多篇工作围绕 Semantic ID 的表达能力与多模态融合展开；**工业级推荐与广告**方向有腾讯、淘宝等大厂贡献的落地实践；**RAG 与信息检索**方向则有多篇探讨 Agentic Search 和检索可靠性的新思路。整体来看，推荐系统研究正在向"生成+多模态+价值对齐"三个维度深度演进。

---

### 今日推荐系统论文解读

#### 🌟 重点推荐

---

##### 1. [Expressiveness Limits of Autoregressive Semantic ID Generation in Generative Recommendation](https://arxiv.org/abs/2605.06331)

**Yupeng Hou, Haven Kim, Clark Mingxuan Ju 等 | UCSD / Snap Inc.**

**🗣️ 先聊聊这篇在解决什么问题**

生成式推荐（Generative Recommendation, GR）现在很火，思路是把推荐变成"生成文字"的问题——给每个商品分配一个由 token 序列构成的"Semantic ID"，模型逐 token 自回归生成目标商品。听起来很优雅，但本文作者发现了一个被忽视的结构性缺陷：**树状解码空间带来的概率耦合问题**。

简单说，自回归解码会形成一棵树，树上距离相近的商品（前缀相同的 SID）会被模型赋予相似的概率，导致它**无法区分树上紧挨着的两个商品**，哪怕这两个商品对当前用户的相关性差异很大。这是协同过滤模型不会遇到的问题。

**🔬 解决思路：Latte**

提出在每个 Semantic ID token 前插入一个**潜变量 token（Latent Token）**，把原来的单棵解码树变成"多棵树"。不同的潜变量对应不同的树，同一个商品在不同树里距离各异，打破了原来的固定概率耦合关系。

**📐 专业解读**

- **理论分析**：形式化证明了自回归 SID 生成的表达能力上界：对于任意一棵 Semantic ID 树，树上路径距离相近的两个 item，其预测概率之差会被树结构约束——即使用户对两者偏好差异显著，模型也无法表达。
- **方法设计**：Latte（Latent Token before Each Semantic ID）在每个 SID token 之前注入一个可学习的潜变量 token，使得同一 item 在不同潜变量条件下走不同的解码路径，从而构成多棵条件树，有效扩展了模型的表达空间。
- **实验结果**：在多个公开数据集上 NDCG@10 平均提升 **3.45%**，代码已开源。

---

##### 2. [Unified Value Alignment for Generative Recommendation in Industrial Advertising](https://arxiv.org/abs/2605.05803)

**Xinxun Zhang, Yuling Xiong 等（腾讯微信视频号广告团队）**

**🗣️ 先聊聊这篇在解决什么问题**

GR 进工业广告系统，遇到了一个很实际的障碍：原来的生成式推荐只关心"用户喜欢什么"（内容相关性），但广告系统还要追求 GMV、eCPM 等商业价值。怎么在生成 token 序列的每一步都"知道"当前选择的商业价值？这三个阶段（token化、解码、在线服务）目前是割裂的。

**🔬 解决思路：UniVA**

三管齐下：

1. **Commercial SID Tokenizer**：在构建 Semantic ID 时直接注入价值属性（点击率、转化率等），让 token 本身就携带价值信息
2. **Generation-as-Ranking SID Decoder**：用监督学习 + eCPM 感知强化学习联合优化解码过程，让生成即排序
3. **Value-Guided Personalized Beam Search**：在线 beam search 阶段复用排序 logits 作为价值引导，并用个性化 trie tree 限制解码路径

**📐 专业解读**

UniVA 的核心贡献是构建了从 tokenization → generation → serving 的价值对齐闭环。RL 训练阶段以 eCPM 增量作为奖励信号，personalized trie tree 保证了工程上的实时可行性（每个请求独立构建有效 SID 路径，避免无效解码）。在腾讯微信视频号广告平台的在线 A/B 测试中，**Hit Rate@100 离线提升 37.04%，GMV 在线提升 1.5%**。

---

##### 3. [TriAlignGR: Triangular Multitask Alignment with Multimodal Deep Interest Mining for Generative Recommendation](https://arxiv.org/abs/2605.05249)

**Yangchen Zeng, Hao Peng 等**

**🗣️ 先聊聊这篇在解决什么问题**

Semantic ID 这条技术路线有两个深层问题一直没被认真面对：

- **SID Content Degradation (SCD)**：RQ-VAE 量化压缩会丢失视觉语义，SID 只剩骨架，多模态信息大量流失
- **SID Semantic Opacity (SSO)**：模型会"背"SID 序列，但不理解 SID 代表什么，所以会产生幻觉、泛化差

本文的目标是让 SID "看得见图片、理解得了兴趣"。

**🔬 解决思路：TriAlignGR**

三角对齐框架——SID、Text、Image 三者互相监督：

1. **CMSA**：让 VLM 生成图文描述 + 多模态 embedding 直接编码图像，把视觉信息注入 SID 构建过程
2. **MDIM**：用 LLM Chain-of-Thought 挖掘隐式用户意图（如"买降噪耳机"背后是"注重生产力的生活方式"），让 SID 携带深层兴趣语义
3. **Triangular Multitask**：8 个互补的生成任务共享一个自回归损失，包括 VisDesc→SID、VisDesc→Title 两个新颖的视觉-语义任务，完整封闭 SID-Text-Image 三角

**📐 专业解读**

TriAlignGR 在架构上是一个统一的 seq2seq 框架，所有 8 个任务共享 decoder 权重，无需额外的 task tower 或复杂的 loss 加权。CMSA 解决了 SID 的视觉缺失问题，MDIM 则通过 CoT 抽象用户兴趣到语义层面，使 SID 空间更具判别性。本文的思路与 Latte (上文) 有互补性——Latte 从解码树结构入手，TriAlignGR 从 SID 语义质量入手。

---

##### 4. [Light-FMP: Lightweight Feature and Model Pruning for Enhanced Deep Recommender Systems](https://arxiv.org/abs/2605.06441)

**Nghia Bui, Yue Ning, Lijing Wang | Stevens Institute of Technology**

**🗣️ 先聊聊这篇在解决什么问题**

工业推荐系统的特征维度动辄数百万，大模型精度高但训练慢，小模型快但精度差——能不能做一个"两全其美"的方案？Light-FMP 给出了一个三阶段剪枝框架。

**🔬 解决思路**

- **预训练（Pretraining）**：在小数据子集上用 Hard Concrete Distribution 高效训练掩码层，找出重要特征
- **剪枝（Pruning）**：同时剪模型结构和特征，大幅削减参数量
- **继续训练（Continued Training）**：用剩余数据 + 领域适配参数继续微调

精华在于用"硬混凝土分布"学习二值掩码，既能做梯度下降，又能实现真正的稀疏化，不是常见的 L1 正则"软剪枝"。

**📐 专业解读**

Hard Concrete Distribution 的技巧是将连续的松弛变量通过 sigmoid + stretch 映射到接近 0/1 的分布，实现近似离散的特征选择，同时保持可微。与 DARTS 系列的连续化 NAS 思路类似，但用于特征选择场景。实验在多个真实推荐数据集上验证了在效率-精度帕累托前沿的优越性。

---

##### 5. [Effective Knowledge Transfer for Multi-Task Recommendation Models](https://arxiv.org/abs/2605.05730)

**Guohao Cai, Jun Yuan, Zhenhua Dong | 华为诺亚方舟实验室**

**🗣️ 先聊聊这篇在解决什么问题**

CVR（转化率预估）是推荐系统的核心指标，但"用户购买"这个行为太稀疏了，数据远比"用户点击"少得多，导致 CVR 模型训练不稳定。EKTM 的思路是：用其他任务（点击、加购等）的知识来补充 CVR 模型的"学习资粮"。

**🔬 解决思路：EKTM**

- **Router 模块**：汇聚所有任务的信息，形成"共享知识池"
- **Transmitter 模块**：每个 CVR 任务独立地从 Router 提取适合自己的知识，完成跨任务知识转化
- **Enhanced 模块**：确保迁移过来的知识真正提升本任务性能，而非带来负迁移

**📐 专业解读**

EKTM 的设计思路与 PLE（Progressive Layered Extraction）类似，但更显式地建模了"知识传递"的方向和强度。Router-Transmitter 的解耦设计保证了各 CVR 任务可以选择性地汲取相关知识，避免强相关任务信息的干扰。已在某商业平台主流量场景全量上线，**eCPM 提升 3.93%**。

---

##### 6. [Bridging Passive and Active: Enhancing Conversation Starter Recommendation via Active Expression Modeling](https://arxiv.org/abs/2605.05855)

**Yiqing Wu, Haoming Li 等 | SIGIR 2026**

**🗣️ 先聊聊这篇在解决什么问题**

对话搜索系统里有个"对话入口"（Conversation Starter），推荐系统负责推荐用户可能想问的问题。传统做法是靠"曝光-点击"反馈循环迭代，但这会陷入回音壁：热门问题越来越热，冷门问题永远推不出去，而且无法捕捉用户"自由意志"式的主动查询。

**🔬 解决思路：PA-Bridge**

"主动表达"（用户自己输入的 query）包含了系统偏见之外的真实意图！但问题是：自由输入的 query 和推荐候选的 starter 格式差异很大（分布偏移），传统 ID-based 流行度统计也不适用于开放文本。PA-Bridge 用**对抗分布对齐器**弥合主动 query 和被动 starter 的分布差异，用**语义离散化器**把开放文本"ID化"以支持大规模流式训练中的流行度去偏。

**📐 专业解读**

对抗对齐的思路借鉴了 domain adaptation 的框架，将 active query 和 starter 视为两个域，通过对抗损失使特征提取器无法区分两个域来实现对齐。语义离散化将文本 embedding 映射到有限的语义码本（codebook），使得基于 ID 的流行度统计可以泛化到文本上。在线 A/B 测试 Feature Penetration Rate 提升 **0.54%**，已被 **SIGIR 2026** 接收。

---

##### 7. [Beyond Long Tail POIs: Transition-Centered Generalization for Human Mobility Prediction](https://arxiv.org/abs/2605.05771)

**Dingyang Lyu, Zhengjia Xu 等 | 澳大利亚墨尔本大学**

**🗣️ 先聊聊这篇在解决什么问题**

Next-POI 预测（预测用户下一个会去哪里）的主流难点被认为是"长尾 POI"问题（有些地点访问太少，训练数据稀疏）。但本文指出，即使是热门地点，很多预测也会失败——真正的瓶颈在于**转移稀疏性（Transition-Level Sparsity）**：从地点 A 到地点 B 的路径在训练集里从没出现过，即使 A 和 B 各自都很热门。

**🔬 解决思路：RECAP**

将问题形式化为**组合泛化（Compositional Generalization）**：从可见的 source-destination 对中学习可迁移的转移信号，泛化到未见的组合。

- 利用**全局转移图中的多跳传递性**：即使 A→B 没见过，但 A→C→B 有，就能合理推断
- 利用**用户历史轨迹中的重访证据**：用户的个人习惯是个重要先验
- **Warm-transition holdout 训练**：刻意在训练时遮掉频繁转移，强迫模型学习泛化而非记忆

**📐 专业解读**

Compositional generalization 在 NLP 里是成熟课题，本文将其引入 mobility prediction 是新颖的迁移。多跳传递性通过图神经网络在全局转移图上传播实现，warm-transition holdout 则是一种类似"数据增强"的训练策略，类似 NLP 里的 compositional split。

---

##### 8. [Dynamic Graph with Similarity-Aware Attention GNN for Recommender Systems](https://arxiv.org/abs/2605.05238)

**Aadarsh Senapati 等**

**📝 快速速览**

传统协同过滤基于静态用户-物品二部图，无法建模用户偏好随时间演化，也缺乏显式的用户相似性建模。本文提出 **DG-SA-GNN**，在二部图上引入动态图结构（捕捉偏好变化）和相似性感知注意力机制（建模用户-用户关系），通过多相似度传播和注意力聚合实现更准确的个性化推荐。

---

### 其他论文速览

> 📌 今日其他值得关注的 cs.IR 论文（2026-05-08）

#### 🤖 Agentic Search & RAG

[Superintelligent Retrieval Agent (SIRA)](https://arxiv.org/abs/2605.06647)
定义了"检索超级智能"——把多轮探索式搜索压缩成单次语料库判别式检索行动，让智能体像专家而非新手一样使用知识库。

[Beyond Semantic Similarity: Direct Corpus Interaction for Agentic Search](https://arxiv.org/abs/2605.05242)
质疑传统语义相似度检索范式，提出让智能体直接与语料库交互而非仅依赖 embedding 相似度，更适合复杂推理型搜索。

[A Case-Driven Multi-Agent Framework for E-Commerce Search Relevance](https://arxiv.org/abs/2605.05991)
工业级电商搜索相关性评估的多智能体框架，来自全球电商搜索团队的技术报告。

[AgenticRAG: Agentic Retrieval for Enterprise Knowledge Bases](https://arxiv.org/abs/2605.05538)
企业知识库的智能体 RAG 框架，支持多步推理和工具调用。

[OBLIQ-Bench](https://arxiv.org/abs/2605.06235)
专门暴露现代检索器在隐式查询场景下的瓶颈的 benchmark，作者包括 Omar Khattab（DSPy 作者）。

#### 📚 RAG 可靠性与质量

[Towards Dependable RAG Using Factual Confidence Prediction](https://arxiv.org/abs/2605.05244)
在 RAG 链路中引入事实置信度预测，提升生成结果的可信赖性。

[RAG over Thinking Traces](https://arxiv.org/abs/2605.03344)（收录于本周）
对思维链轨迹建索引，辅助推理任务的 RAG 检索效果提升。

[Text-Graph Synergy: Bidirectional Verification for RAG](https://arxiv.org/abs/2605.05643)
文本与图谱双向验证补全框架，提高 RAG 的准确性和召回率。

[SURE-RAG: Sufficiency and Uncertainty-Aware Evidence Verification](https://arxiv.org/abs/2605.03534)（收录于本周）
充分性+不确定性感知的证据验证机制，用于选择性 RAG 生成。

#### 🔍 检索与向量表示

[EnterpriseRAG-Bench](https://arxiv.org/abs/2605.05253)
面向公司内部知识库的 RAG 基准测试，覆盖真实企业场景的问答评测。

[GATHER: Zero-Shot Cell-Type Annotation via Hyper-Entity Retrieval](https://arxiv.org/abs/2605.06403)（SIGIR 2026）
将 IR 技术应用于生物信息学细胞类型注释，跨领域应用的有趣尝试。

[AdaGATE: Multi-Hop RAG with Gap-Aware Token Efficiency](https://arxiv.org/abs/2605.05245)
多跳 RAG 中的间隙感知高效 token 组装方法。

#### 🎯 其他应用

[Career-Aware Resume Tailoring via Multi-Source RAG](https://arxiv.org/abs/2605.05257)
用 RAG 辅助简历个性化定制，多源检索 + 溯源追踪。

[Revisiting Uncertainty for Partially Relevant Video Retrieval](https://arxiv.org/abs/2605.06083)（ICML 2026）
视频检索中的不确定性建模，基于证据学习的新方法。

[Open-SAT: LLM-Guided Query Embedding for Satellite Image Retrieval](https://arxiv.org/abs/2605.05344)
卫星图像的开放词汇目标检索，LLM 引导的查询嵌入精化。

[Addressing PII Detection via LLMs in HTTP Traffic](https://arxiv.org/abs/2605.06305)（IEEE EuroS&PW 2026）
用 LLM 检测 HTTP 流量中的 PII（个人隐私信息）。

[Securing the Agent: Multitenant Enterprise Retrieval](https://arxiv.org/abs/2605.05287)（ACM CAIS '26）
企业级多租户 RAG 的安全框架，vendor-neutral 设计。

[PRAISE: Prefix-Based Rollout Reuse in Agentic Search Training](https://arxiv.org/abs/2604.03675)
智能体搜索训练中的前缀 rollout 复用，提升训练效率。

---

> 📎 本文档由 arxiv cs.IR 每日论文速递自动生成 | 如有遗漏或错误，欢迎反馈

**📥 完整 Markdown 文件下载：**

> 📎 **附件**（15.36KB）：[daily_report_20260508.md](https://km.sankuai.com/api/file/attachment/2760875908/235922936812)