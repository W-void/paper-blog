---
title: "【推荐系统 Paper 日报】2026-09-14"
date: 2026-09-14
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2786503338"
---

# 【推荐系统 Paper 日报】2026-09-14

## 📊 今日概览

arXiv cs.IR 于 9月14日（周一）更新了 **50篇** 新论文。其中推荐系统相关论文 **40篇**，占比高达 80%。本期亮点：推荐系统在 Agentic Web 时代的范式转变（两篇重磅 Position Paper）、超长序列建模（100K 序列的 SequenceO1）、多兴趣推荐的匈牙利匹配解法（MIMA）、以及 FedRec 领域首次引入层次化效用引导的客户端关系学习（FedHUR）。

## 🔥 推荐系统论文深度解读

### 1. Who Are We Recommending To? Recommender Systems in the Agentic Web

📄 [arXiv:2609.11945](https://arxiv.org/abs/2609.11945) | Position Paper | Himan Abdollahpouri, Kyle Kretschman, Sai Ravindranath, Jackie Doremus, Mounia Lalmas

**🗣️ 大白话：** 推荐系统一直假设「推荐是给人看的」，但现在 AI Agent 正在替用户做决策——帮你浏览、比价、甚至下单。这篇 Position Paper 提出了一个关键问题：当推荐服务的最终消费者不再是人而是 Agent 时，推荐系统的优化目标、交互协议和评估标准该怎么做？他们把场景分成了「可委托型」（日常购物、旅行）和「体验型」（娱乐、艺术），前者 Agent 是主消费者，后者人仍是最终裁判。

**🔬 专业讲解：** 论文引入了 Delegation Spectrum 概念，沿着偏好可指定性、结果可验证性和决策风险三个维度刻画推荐场景。核心主张是推荐范式正在发生 bifurcation：在可委托场景中，推荐从「面向人的排序」转向「面向 Agent 的证据供给」，需要新的优化目标（如 agent attention economy）和双受众优化框架（同时服务 Agent 和人类用户）。

---

### 2. Recommendation Retrievers Need Verifiers: Universal Generative Reranking for Sequential Recommendations

📄 [arXiv:2609.12270](https://arxiv.org/abs/2609.12270) | 工业实践 | Benyu Zhang, Qiang Zhang, Rui Li, Qunshu Zhang, Devansh Tandon

**🗣️ 大白话：** 多阶段推荐系统中，第一阶段的召回器只能返回有限数量的候选，但排在后面的相关物品可能被截断了。这篇论文提出了一个轻量级生成式验证器，能在不重训召回器的前提下，把那些「被召回器遗漏但实际相关」的候选提升回来。

**🔬 专业讲解：** 核心创新是 post-hoc 生成式验证器——给定召回器的内部状态和候选物品，验证器通过计算物品标识符 token 的似然来评分。它只需要 next-token cross-entropy 训练，不需要负采样或候选池，接口极简。在 Amazon 和 YaMBDa 数据集上，同一个验证器训练流程对 SASRec、GRU4Rec、NextItNet、MiniOneRec 四种召回器都提升了 Recall@10。

---

### 3. SequenceO1: End-to-End Ultra-Long (100K) Sequence Modeling in Recommendation with Low-Rank Caching

📄 [arXiv:2609.08443](https://arxiv.org/abs/2609.08443) | 已部署（抖音） | Lin Guan, Jia-Qi Yang, Zhishan Zhao, Jiaqi Huang, Hangyu Wang

**🗣️ 大白话：** 抖音上了 100K 超长用户行为序列建模方案。核心思路是「先压缩再推理」——用可学习的原型把用户历史压缩成固定大小的表示，然后对近期 10K 和长期偏好分别做注意力建模。关键工程优化包括低秩缓存、多请求批处理和 FlashSA 融合内核。

**🔬 专业讲解：** SequenceO1 采用 compress-then-reason 设计：Sketch Attention (SA) 用 learnable prototypes 做压缩，Target-conditioned STCA 分别建模短时和长时兴趣。通过 low-rank 用户表示缓存 + multi-request 用户级批处理，将 100K 序列的特征存储、通信和计算成本摊薄。线上实验显示全流程离线/在线均有增益。

---

### 4. MIMA: Multi-Interest Recommendation via Multi-Positive Exclusive Assignment

📄 [arXiv:2609.12842](https://arxiv.org/abs/2609.12842) | 工业实践 | Xingyuan Mao, Alin Fan, Shichao Nie, Junfeng Zhang, Yan Xiao

**🗣️ 大白话：** 多兴趣推荐的一个老大难问题是「兴趣坍缩」——学出来的多个兴趣向量越来越像。这篇论文指出根源是单正样本范式：每个实例只给一个正样本，导致所有正样本都去优化同一个最佳匹配的兴趣向量，其他向量被忽略。他们提出用匈牙利匹配做「多正样本排他分配」，每个正样本只监督一个独立兴趣。

**🔬 专业讲解：** MIMA 将同一请求中的共现物品组成正样本集，用因果 Transformer decoder 生成互补兴趣，通过匈牙利算法将每个正样本排他性地分配给一个兴趣进行监督。路由模块估计兴趣激活概率来校准跨通道分数。在三个公开数据集和工业数据集上均显著优于 SOTA，A/B 测试带来可观业务收益。

---

### 5. UniRec: Cross-stage Multi-Task Fusion with Preference Alignment for Cascaded Recommender Systems

📄 [arXiv:2609.11052](https://arxiv.org/abs/2609.11052) | 已部署（快手） | Lingyuan Kong, Jiaqi Cui, Fanjiao Zeng, Congqi Wang, Yu Li

**🗣️ 大白话：** 工业推荐系统通常有「预排序→排序」两阶段，各阶段目标不同。独立优化容易产生「跨阶段不一致」——上游过滤掉的物品恰好是下游喜欢的。UniRec 提出联合优化两阶段的融合模块，并引入偏好对齐机制让上下游信号互通。

**🔬 专业讲解：** 三个关键技术：(1) 两阶段融合 agent 共享嵌入、单计算图训练，梯度双向传播；(2) 双轴偏好对齐——垂直方向从下游传递 pairwise 偏好到上游，水平方向把异构先验信号重组为双向偏好证据；(3) 属性组相对正则化，防止优化过度集中在高回报区域。线上 A/B 测试获得 0.616% 使用时长提升，已全量部署于快手。

---

### 6. FedHUR: Learning Hierarchical Utility-Guided Client Relations for Personalized Federated Recommendation

📄 [arXiv:2609.11632](https://arxiv.org/abs/2609.11632) | 联邦推荐 | Mingzhe Han, Jiahao Liu, Dongsheng Li, Jiankui Zhou, Hansu Gu

**🗣️ 大白话：** 联邦推荐中，客户端之间怎么聚合信息是个核心问题。现有方法基于「参数相似性」构造单一全局关系，但用户关系其实是层次化、多粒度的。FedHUR 提出学习层次化的「效用引导」客户端关系——每个客户端先算出「谁能帮它提升预测」的效用信号，服务端据此检索有用邻居做个性化聚合。

**🔬 专业讲解：** FedHUR 以 item-item filter 为关系构建对象，先聚类客户端本地信息获取全局层次信息，每个客户端计算层次化效用信号，服务端用这些信号检索对当前客户端有用的邻居。在五个真实数据集上持续优于 FedRec 基线，为联邦推荐中的客户端关系学习提供了新范式。

---

### 7. ChronicleRec: Pre-training Temporally Anchored Tokens for Lifelong User Modeling

📄 [arXiv:2609.12375](https://arxiv.org/abs/2609.12375) | 已部署 | Chengkai Huang, Yubin Sheng, Liang Guo, Haoxi Liu, Junwei Pan

**🗣️ 大白话：** 超长用户行为序列建模的另一个方案。ChronicleRec 的核心是「时间锚定压缩」——把用户历史压缩成一组按时间顺序排列的 Chronicle Token，每个 Token 只总结其时间点之前的上下文，保留时序结构。压缩后的 Token 可以缓存，与在线候选评分解耦。

**🔬 专业讲解：** 采用 recency-aware 多粒度合并策略，近期行为保留细节，远期行为粗化。query token 与合并序列交错排列并使用因果编码器，每个 query 只总结其时间锚点之前的上下文。多视野设计在不同分支上掩码不同近期窗口以学习互补兴趣。KuaiRand 和 Tencent AdLive 上超越压缩基线，七日线上 A/B 测试确认生产增益。

---

### 8. Preference-Drift-Aware Subsequence Learning for Long-Sequence Generative Recommendation

📄 [arXiv:2609.12556](https://arxiv.org/abs/2609.12556) | 生成式推荐 | Fei Li, Qingyun Gao, Jianzhe Zhao, Guibing Guo, Beibei Kong

**🗣️ 大白话：** 生成式推荐中，用户偏好会随时间漂移，但现有方法要么全序列建模（贵）要么检索上下文（噪声多）。这篇论文提出「偏好漂移感知的子序列学习」——用可微软边界把序列拆成偏好一致的子序列，分别聚合后再做交叉注意力。

**🔬 专业讲解：** 核心是学习可微的子序列边界，用多维偏好漂移信息区分，然后对每个子序列做线性注意力聚合得到偏好一致表示。交叉注意力机制捕捉近期交互与相关子序列间的依赖关系，门控融合机制自适应结合近期和长期偏好。在推荐准确性和计算效率上均优于现有基线。

---

### 9. OneLA: Scaling Linear-Attention Decoding to Large Beams in Generative Recommendation

📄 [arXiv:2609.12399](https://arxiv.org/abs/2609.12399) | 系统优化 | Xiangrui Yang, Cheng Peng, Yunfeng Zhao, Liang Zeng, Ao Hu

**🗣️ 大白话：** 生成式推荐需要大束解码（几百个候选物品），但线性注意力在束解码时有内存和通信瓶颈——每个束都要维护完整循环状态。OneLA 提出用一个共享 prompt 状态 + 紧凑分歧记录来统一表示所有束的状态，GPU 融合内核跨束复用共享状态，实现 1.54-2.46x 端到端加速。

**🔬 专业讲解：** 将 GR 工作负载中所有束的状态表示为共享 prompt 派生状态 + append-only 分歧转移记录，轻量级祖先索引追踪每条转移记录，fused GPU kernel 跨束复用共享状态。分析显示内存使用和数据传输大幅减少。

---

### 10. MemRetriever: Learning to Search, Reflect, and Retrieve from Long-Term Memory

📄 [arXiv:2609.11951](https://arxiv.org/abs/2609.11951) | 记忆检索 | Ruiyang Jiang, Chunyu Li, Zhiyu Li

**🗣️ 大白话：** 个性化 Agent 的长期记忆检索，传统 top-k 方法在跨会话、多跳、时序问题上效果差。MemRetriever 把记忆访问看作多步搜索过程——每一步推理当前证据是否足够，决定是并行搜索（广度探索）、串行搜索（深度补全）还是反思去噪（过滤评估），直到证据足够才停止。

**🔬 专业讲解：** 用 ReAct 风格的搜索-记忆轨迹做监督预训练，再用 Group Relative Policy Optimization 做 RL 优化。奖励设计鼓励证据覆盖、噪声减少、答案充分性和高效终止。在 LOCOMO、LongMemEval、HotpotQA、MuSiQue 等数据集上持续超越静态检索和监督基线。

---

### 11. PinDCO: Whole-Page Aware Dynamic Creative Optimization at Scale

📄 [arXiv:2609.11943](https://arxiv.org/abs/2609.11943) | 已部署（Pinterest） | Yu Hao, Yuchun Li, Peimeng Sui, Meilin Liu, Tianyuan Cui

**🗣️ 大白话：** Pinterest 上了动态创意优化系统。核心挑战是：生成式 AI 让每个广告活动可以产生大量创意变体，需要高效匹配到最相关受众。PinDCO 用组件融合网络（CCFN）分别建模图片、标题、布局等创意组件，再融合预测广告级 CTR。特别地，考虑到 Pinterest 的瀑布流布局，创意尺寸会影响周围内容和页面级参与度，引入像素感知调整模块（PAM）优化整页效果。

**🔬 专业讲解：** CCFN 对每个创意组件用独立 tower 建模，组件级超参数适应不同建模复杂度。PAM 根据创意尺寸调整分数以鼓励高效屏幕空间利用。轻量级预选择模型做早期剪枝，缓存和动态批处理优化服务效率。线上实验获得 +3.09% CTR 提升。

---

### 12. MemRetriever 相关补充：InitGen — 智能助手交互启动的候选生成

📄 [arXiv:2609.11953](https://arxiv.org/abs/2609.11953) | 已部署（OPPO 小布） | Ruize Shi, Jinhua Chen, Hong Huang, Ziniu Chen, Ruike Zhang

**🗣️ 大白话：** 用户打开智能助手时，系统会先展示一组候选查询（交互启动）。问题在于：生成器通常产生比最终展示多得多候选，反馈信号稀疏且无法可靠归属。InitGen 用加权偏好优化解决这个问题——通过用户活跃度和下游排名分数作为权重，联合生成候选集并使其与用户反馈对齐。

**🔬 专业讲解：** 联合生成候选查询集而非逐个生成，通过 activity weight 降低高活跃用户的支配性，ranking score 作为反馈可靠性估计。滚动窗口更新策略将近期交互数据融入周期性模型更新。线上 A/B 测试 CTR 从 0.95% 提升到 1.61%（相对 +69.1%），已全量部署于 OPPO 小布助手（月活 1.5 亿+）。

---

### 13. FINALLY: A Dataset Recommender System for Recommender-Systems Research

📄 [arXiv:2609.08941](https://arxiv.org/abs/2609.08941) | 工具 | Louis Owie

**🗣️ 大白话：** 推荐系统研究面临数据集选择困难——现有工具难以同时满足实验约束和集合级选择目标。FINALLY 是一个网页工具，帮助研究者构建可配置的数据集集合：支持必需数据集、候选池限制、元数据过滤、随机选择和多样/非多样策略（基于有效协方差和凸包目标）。

**🔬 专业讲解：** 在 420 次推荐实验中验证，所有数据集集合均满足目标大小、去重、快照成员资格等约束。两种策略（有效协方差 vs 凸包）均按预期产生多样/非多样排序，为推荐系统研究提供了实用的数据集选择工具。

---

### 14. Following the Preference, Missing the Optimum: Compliance Without Optimization in AI Housing Recommendation

📄 [arXiv:2609.10856](https://arxiv.org/abs/2609.10856) | 社会影响 | Hsuan Lo

**🗣️ 大白话：** AI 租房推荐系统的一个令人不安的发现：模型几乎完美遵守用户的偏好约束（如价格上限、卧室数量），但 39% 的推荐被严格支配——存在更便宜、通勤更快、房间更大的替代选项。问题不在于违规，而在于「只做到了合规，没有做到最优」。

**🔬 专业讲解：** 对纽约 150 个合成租房场景做审计，构建真实房源池并计算帕累托前沿。主导列表比推荐便宜中位 900 美元/月、通勤快 3.5 分钟。进一步发现偏好方向调整能正确改变推荐方向，但推荐仍比最优贵 606 美元/月。跨 OpenAI 和 Anthropic 模型结果一致。提出 dominance rate 作为可部署的诊断指标。

---

## 📋 其他论文速览

- **Agentic Share-of-Search: A Multi-Agent AI System for Competitive Decision-Making in LLM-Mediated E-Commerce**（arXiv:2609.11190）：多 Agent 系统自动化测量和诊断 AI 电商中的竞争可见度
- **Purchase Advice and Observable Buyer Responses in Real AI Conversations**（arXiv:2609.09878）：审计 317 条真实 AI 对话中推荐对购买决策的影响
- **Recommendation Retrievers Need Verifiers**（arXiv:2609.12270）：推荐召回器的轻量生成式验证器提升 Recall
- **Benchmark Radar**（arXiv:2609.11115）：AI Benchmark 的活体数据库和搜索引擎
- **When Synthetic Data Hurts**（arXiv:2609.10750）：合成数据微调导致 LLM Agent 技能检索灾难性遗忘，提出缓解方案
- **VikingRAG**（arXiv:2609.11390）：结构化文档的高效 RAG，token 消耗仅占 SOTA 的 5-33%
- **TimelyRAG**（arXiv:2609.11572）：重叠演进文档的时间关键问答，引入时间距离到排序
- **Generative Late-Interaction Embeddings**（arXiv:2609.11808）：视觉文档检索的生成式 late-interaction 嵌入
- **REDSI: Addressing the Reproducibility of Differentiable Search Indexing**（arXiv:2609.08860）：DSI 的可复现性和评估一致性研究
- **Q2D-Web: A Large-Scale Benchmark for Retrieval in Agentic RAG Systems**（arXiv:2609.08887）：Agentic RAG 的大规模检索基准
- **PDMR: Passage-Driven Multi-ID Document Retrieval**（arXiv:2609.08762）：生成式检索的多 ID 文档检索框架
