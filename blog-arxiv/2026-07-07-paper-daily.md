---
title: "【推荐系统 Paper 日报】2026-07-07"
date: 2026-07-07
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2773342124"
---

# 【推荐系统 Paper 日报】2026-07-07

## 📊 今日概览

arXiv cs.IR 于 **Tue, 7 Jul 2026** 更新，今日共收录 **34 篇**论文，其中**推荐系统相关 5 篇**。本期亮点：从 Agent 化推荐系统的全景调研，到 LLM 推荐中的长度偏差问题，再到工业界快手推送系统的异构生成推荐架构，覆盖学术前沿与工业实践，干货满满。

## 🔥 推荐系统论文深度解读

### 1. Evaluation and Explainability of Unsupervised Scholarly Collaboration Recommendations

📄 [arXiv:2607.04529](https://arxiv.org/abs/2607.04529) | 无会议信息 | Md Asaduzzaman Noor, John W. Sheppard, Jason A. Clark

**🗣️ 大白话：** 学术界怎么给人推荐合作者？这篇论文比较了 TF-IDF、LDA/BERTopic 话题模型、以及 SciBERT 嵌入三种方法，发现 TF-IDF 在有充分信息时最强，但信息减少后掉得很快；话题模型和嵌入方法更稳定，能捕捉语义层面的相似性。文章还探讨了两种可解释性方案：基于话题的内在解释，和用 LLM 生成的后验解释。

**🔬 专业讲解：** 论文提出了一种受控实验设置——通过部分移除研究者之间的出版物重叠，同时保留历史合著关系作为后验评估的代理真值，从而评估模型在超出简单词汇匹配之外的行为。实验结果表明，TF-IDF 在完整信息下表现最佳，但随着重叠度降低显著下降；而基于话题和嵌入的方法表现更稳定，说明它们捕捉了更广泛的分布相似性。可解释性方面，文章提供了话题级内在解释和基于检索的 LLM 后验解释两种视角，在透明度和可读性之间存在互补权衡。

---

### 2. Autonomous Information Seeking: A Roadmap for Agentic Recommender Systems

📄 [arXiv:2607.04433](https://arxiv.org/abs/2607.04433) | 无会议信息 | Xinyu Lin, Yashar Deldjoo, Sunhao Dai, Honghui Bao, Xiaopeng Ye, Fatemeh Nazary, Wenjie Wang, Tommaso Di Noia, Jun Xu, Tat-Seng Chua

**🗣️ 大白话：** 这是一篇关于 Agent 化推荐系统的全景综述。随着 LLM Agent 涌入推荐领域，推荐系统正从静态排序管道转向能自主推理、规划和交互的智能系统。论文提出了一个基于自主性级别的统一分类框架，将现有方法分为三大范式：Agent 辅助推荐、Agent 即推荐器、Agent 即用户模拟器，并深入分析了每个范式的架构设计和评估方法论。

**🔬 专业讲解：** 论文的核心贡献是提出了一个以自主性级别为根基的统一分类法，将 Agent 化推荐系统组织为三个核心范式。自主性框架按主动性、上下文感知、交互灵活性和适应性四个维度递增排列。在此基础上，论文分析了每个范式如何采用不同的 Agent 架构，以及 Agent 如何增强用户画像、记忆、工具使用、工作流和优化机制等关键组件。评估方面，论文涵盖了自动化指标、LLM 评判和模拟评估等方法，并讨论了它们在捕捉推理质量、用户体验和系统行为方面的局限性。最后，论文指出了终身用户建模、上下文抽象、多模态对齐、可控性、可信性、隐私、可扩展性和效率等开放挑战。

---

### 3. LBR: Towards Mitigating Length Bias in Large Language Models for Recommendation

📄 [arXiv:2607.04270](https://arxiv.org/abs/2607.04270) | 无会议信息 | Hongchen Li, Bohao Wang, Jingbang Chen, Weiqin Yang, Hang Pan, Bingde Hu, Can Wang, Jiawei Chen

**🗣️ 大白话：** LLM 做推荐时，物品描述长短不一会导致"长度偏见"——长描述占更多 token，获得更多注意力，而输出时按 token 数求和打分又天然对长物品不利。这篇论文提出的 LBR 框架，通过长度感知注意力校准和有效信息长度归一化，解决了这个问题，在 Amazon 数据集上平均 NDCG@5 提升 16.82%。

**🔬 专业讲解：** 论文识别了 LLM 推荐中一个被忽视的问题：Length Bias。输入端，较长的物品描述占据更多上下文 token，在用户偏好建模过程中获得不成比例的聚合注意力；输出端，基于自回归对数似然求和的解码机制天然对长物品不利。传统长度归一化甚至会引入额外偏差并降低推荐性能。为此，论文提出了 LBR（Length Bias Reduction），一个轻量级且模型无关的框架：输入端通过 Length-Aware Attention Calibration 引入长度相关的注意力偏移量来中和注意力倾斜；输出端通过 Effective Information Length Normalization 用基于前缀树分支结构的信息论长度替代朴素 token 计数。在 Amazon 三个真实数据集和两个代表性 LLM 推荐器上的实验表明，LBR 显著缓解了长度偏见，同时持续提升推荐准确性和公平性，训练和推理开销可忽略不计。代码已开源：https://github.com/Void-JackLee/LBR

---

### 4. Beyond Item Order: Temporal Gap Tokenization for Generative Recommendation with Semantic IDs

📄 [arXiv:2607.03918](https://arxiv.org/abs/2607.03918) | 无会议信息 | Chengkai Huang, Tianqi Gao, Hongtao Huang, Quan Z. Sheng, Lina Yao

**🗣️ 大白话：** 基于语义 ID（Semantic ID）的生成式推荐很火，但现有方法只把用户历史看成物品序列，忽略了两次交互之间的时间间隔。这篇论文提出的 ChronoSID，把时间间隔也编码成 token 塞进模型，让推荐器能感知时间——比如间隔很久可能意味着兴趣漂移了。在 Amazon 数据集上效果稳定提升。

**🔬 专业讲解：** 现有基于语义 ID 的生成式推荐方法将用户历史构建为静态物品标识符序列，忽略了连续交互之间的经过时间，导致时间盲视问题。论文提出 ChronoSID，从两个互补角度将时间信号注入标准三阶段语义 ID 管道：首先，引入 Time-Aware Field-Aware Masked Auto-Encoding (TA-FAMAE)，通过辅助时间间隔预测目标正则化物品表示学习；其次，将历史交互间隔离散化为固定对数尺度的间隔 token，并与语义 ID 元组交错作为序列到序列生成器的编码器输入。这种设计在保留紧凑 SID 生成范式的同时，使模型能够捕捉时间感知转换模式。Amazon 评论基准实验表明 ChronoSID 一致优于 ReSID 和其他竞争性生成推荐基线。消融实验验证了两种时间组件的贡献，诊断分析表明在长间隔场景下增益更明显，因为用户兴趣更可能漂移。

---

### 5. HGenPush: A Heterogeneous Generative Recommendation Architecture for Industrial Push Notification Systems

📄 [arXiv:2607.03362](https://arxiv.org/abs/2607.03362) | 无会议信息 | Xiao Liang, Jiali Feng, Xin Feng, Yiqing Wang, Baolin Ye, Siyao Feng, Zhihui Deng, Cunyi Zhang, Huajin Sun, Xuanping Li, Kaiqiao Zhan, Yanan Niu, Kun Gai

**🗣️ 大白话：** 快手团队把生成式推荐落地到推送通知系统。他们提出的 HGenPush 框架能同时推荐视频和作者（异构推荐），还能并行生成多个语义 ID（不用自回归），并根据用户反馈优化内容质量。上线后日活用户提升了 0.181%——在快手这种量级的平台上，这是实打实的业务收益。

**🔬 专业讲解：** 论文针对短视频平台推送通知场景，提出端到端异构生成推荐架构 HGenPush。首先设计了混合用户行为理解模块，整合多场景和多视角行为来精确捕捉用户兴趣；然后设计了双分支异构生成推荐模块，在统一框架内整合视频推荐和作者推荐；为提升生成效率，设计了轻量级多 token 预测方法，摒弃自回归范式；最后设计了用户消费偏好对齐模块，利用用户反馈作为奖励信号引导模型生成更高质量内容。HGenPush 已部署于快手推送通知系统，实现日活用户显著增长 0.181%。该工作展示了生成式推荐在工业场景中的实际价值和落地路径。

## 📋 其他论文速览

- **Do All Visual Tokens Matter Equally?**（arXiv:2607.04605）：提出视觉-语言检索中保留对象证据的 token 合并方法，提升检索效率同时保持关键视觉信息。
- **Submitted and Diagnostic Analysis of Full-Text Temporal Retrieval**（arXiv:2607.04088）：LongEval-Sci 竞赛中对全文时序检索的诊断分析，探讨时间维度对检索的影响。
- **UniSGR**（arXiv:2607.04068）：统一语义 ID 生成和排序的框架，将生成和判别目标融合到一个模型中。
- **Claim2Source at CheckThat! 2026**（arXiv:2607.04043）：基于验证的重排序改进多语言科学主张-来源检索。
- **Patient-Conditioned Dual Hypergraph Reasoning**（arXiv:2607.04025）：用于可审计中医处方支持的双超图推理，将中医诊断与推荐结合。
- **Enhancement of E-commerce Sponsored Search Relevancy with LLM**（arXiv:2607.03886）：用 LLM 增强电商赞助搜索的相关性。
- **Next-Gen Sponsored Search: InvAwr-RAG**（arXiv:2607.03880）：基于库存感知 RAG 的生成式 AI 搜索查询优化。
- **The Powerless Noise**（arXiv:2607.03615）：实验设置如何影响噪声方法的报告效果——提醒研究者注意实验配置偏差。
- **Relevance-Based Embeddings**（arXiv:2607.03515）：通过重量级排序器的调用实现轻量级候选检索。
- **SentAttack**（arXiv:2607.03456）：句子级黑盒对抗攻击方法，针对密集检索模型。
- **TRIAGE**（arXiv:2607.03447）：可信检索仪表化和图评估框架。
- **Improving Access to Historical Archives with Real-time RAG**（arXiv:2607.03440）：实时 RAG 改善历史档案访问。
- **AI Overviews in Academic Search**（arXiv:2607.03421）：评估 AI 生成的学术搜索摘要质量。
- **HETERQA**（arXiv:2607.03028）：多异构源记录检索基准测试。
- **Long-Term Optimization for Large-Scale Generative Retrieval**（arXiv:2607.02818）：基于 Off-Policy REINFORCE 的大规模生成检索长期优化。
- **CanniUplift**（arXiv:2607.05242）：电商 uplift 建模中缓解卖家和激励蚕食的全局框架。
- **Curated retrieval vs open web search**（arXiv:2607.05217）：公共 AI 信息服务中策展检索与开放搜索的覆盖率-信任度权衡。
- **On the Complexity of Entrywise Power Matrix Factorization**（arXiv:2607.04875）：逐元素幂矩阵分解的复杂度分析。
- **MTEB-PT**（arXiv:2607.04581）：巴西葡萄牙语文本嵌入基准测试。
- **Progressive Disclosure for LLM-Maintained Wiki**（arXiv:2607.04576）：LLM 维护 Wiki 知识库的渐进式披露策略。
- **The New Shape of Search**（arXiv:2607.04282）：对话式 AI 如何重组信息搜索行为。
- **Conductance-Repair Evidence Graphs**（arXiv:2607.04070）：前瞻性安全检索的传导修复证据图。
- **Candidate-Constrained RAG for LongEval-RAG**（arXiv:2607.04008）：LongEval-RAG 竞赛中候选约束的检索增强生成系统设计。
- **Two-dimensional Fourier compressed sensing**（arXiv:2607.03611）：固定读出预算下的二维傅里叶压缩感知。
- **Beyond Post-Quantization: Native Hash Learning**（arXiv:2607.03328）：用专用 HASH token 实现原生哈希学习，超越后量化方法。
- **From Judgments to Issues**（arXiv:2607.03325）：法律推理的结构化抽取与引用幻觉控制。
- **Taste-aware music retrieval from audio embeddings**（arXiv:2607.03296）：从音频嵌入中实现品味感知的音乐检索。
- **Agentic and Generative AI for Open-Source Intelligence**（arXiv:2607.03233）：开源情报和网络调查中的 Agent 和生成式 AI 综述。
- **Where do LLMs Fall Short in CBT-Guided Affective Reasoning?**（arXiv:2607.02885）：LLM 在认知行为疗法引导情感推理中的不足之处分析。