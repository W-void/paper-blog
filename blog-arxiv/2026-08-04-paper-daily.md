---
title: "【推荐系统 Paper 日报】2026-08-04"
date: 2026-08-04
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2778538258"
---

# 【推荐系统 Paper 日报】2026-08-04

## 📊 今日概览

arXiv cs.IR 公告日期：**Tue, 4 Aug 2026**，今日共收录 **45** 篇论文，其中推荐系统相关论文 **15** 篇。本期亮点满满：抖音（Douyin）发布两篇重磅技术报告（自触发推送推荐系统 + 多模态 Embedding 模型），生成式推荐领域出现知识蒸馏、层次化策略优化、指数奖励加权、协作记忆增强等多篇突破性工作，更有知识图谱可解释推荐和多智能体超图 POI 推荐等创新方向。工业界落地信号强烈。

---

## 🔥 推荐系统论文深度解读

### 1. A Self-Triggered Agentic Push Recommendation System

📄 [arXiv:2608.01949](https://arxiv.org/abs/2608.01949) | Douyin（已全量上线） | Zhao-Yu Zhang, Qingying Chen, Chunyuan Zheng, Jing Zhou, Jian Sun, Siqi Chen, Leiying Chen, Chuan Zhou, Huiyou Jiang, Xin Tao, Haoxuan Li, Zhouchen Lin

**🗣️ 大白话：** 推送通知是 App 让用户回来的核心手段，但"什么时候推、推不推"一直是难题。传统方法要么固定时间轮询（要么算力浪费、要么错过最佳时机），要么离线算好频次（不够灵活）。抖音团队把这个问题变成了"AI 自己决定什么时候唤醒自己"——系统不仅决定是否发推送，还决定下一次什么时候再检查，形成一个自我驱动的闭环。实验结果非常亮眼：用户活跃天数提升 0.28%，推送权限关闭率降低 1.91%，而且过滤代理还把计算开销砍掉了近 80%。

**🔬 专业讲解：** 本文提出 **STEPS**（Self-Triggered End-to-end Agentic Push Recommendation System），将推送推荐重构为一个自触发的 Agentic 过程。系统包含两个基于 Decision Transformer 的 Agent：
- **Planning Agent**：通过门控序数回归方法调度下一次系统调用时间；
- **Execution Agent**：基于轨迹奖励决定是否发送推送。
此外还引入了一个轻量级 **Filtering Agent**，用于控制计算开销并防止不合理的规划行为。在线 A/B 测试显示，STEPS 在 Douyin（10 亿+用户）全量部署后，用户活跃天数提升 0.2843%，推送权限关闭率降低 1.9089%，Filtering Agent 减少计算开销 79.42%。这是首个将"自触发"机制引入大规模推送推荐的完整工业落地工作。

---

### 2. Douyin Multimodal Embedding Model Technical Report

📄 [arXiv:2608.02148](https://arxiv.org/abs/2608.02148) | Douyin（已部署） | Haonan Chen, Chu Li, Zhicheng Wang, Yuanwei Liu, Yuanjiang Wang, Shaohua Jiang, Zhicheng Dou

**🗣️ 大白话：** 多模态 Embedding 是现代搜索和推荐的基石——把图文视频都变成向量，才能做相似度匹配。但工业级场景有两个矛盾需求：既要能扛住十亿级索引的高效检索，又要能区分细微语义差异（比如"红色连衣裙"和"粉色连衣裙"）。对比学习模型快但粗，CoT 模型精但慢。抖音的 DME 模型搞了个两阶段训练：先用大规模对比学习打基础，再通过"隐式推理"和"交叉重建"两种机制提升语义精细度——关键是这两个机制只在训练时用，推理时和常规对比模型一样快。2B 和 9B 版本在 MMEB-v2 上都刷到了 SOTA。

**🔬 专业讲解：** 本文提出 **Douyin Multimodal Embedding (DME)**，一个两阶段训练的多模态 Embedding 模型：
- **Stage 1**：大规模对比预训练，建立统一的多模态 Embedding 空间；
- **Stage 2**：通过两种机制补充"语义充分性"（semantic sufficiency）：
  - **Evidence-Grounded Typed Latent Reasoning**：在隐空间组织检索证据进行潜在推理；
  - **Cross-Conditional Reconstruction**：通过交叉方向自回归重建强化对侧语义。
两个机制仅作用于训练阶段，查询侧推理开销与标准对比编码器相当。DME 的 2B/9B 版本在 MMEB-v2 上分别达到 74.8/78.4（同类规模 SOTA），在 Douyin 内部离线评估集上带来 2.92% 相对提升，在线 A/B 测试中带来 0.1% Lifetime 增益，已部署于 Douyin 的生成式搜索、图像搜索和 AI 搜索场景。

---

### 3. SmartGR: Hierarchy and Beam-Aware Knowledge Distillation for Generative Recommendation

📄 [arXiv:2608.02048](https://arxiv.org/abs/2608.02048) |  | Ziheng Zhang, Yu Cui, Bohao Wang, Yong He, Chao Yu, Chuan Yuan, Wujie Sun, Can Wang, Jiawei Chen

**🗣️ 大白话：** 生成式推荐模型（GR）越大效果越好，但推理成本也高得吓人。知识蒸馏可以把大模型的能力 transfer 给小模型，但现有方法没考虑到 GR 的两个特殊性：一是语义 ID 的层次结构导致不同层级蒸馏难度不一样，二是束搜索时前缀剪枝会让排序信息丢失。SmartGR 针对性地做了两件事：按层级做蒸馏、在束搜索时保留排序偏好。效果上性能提升 8.6%，推理加速 2.39 倍。

**🔬 专业讲解：** 本文提出 **SmartGR**，针对生成式推荐的知识蒸馏框架，包含两个核心组件：
- **Hierarchy-Aware SID Distillation**：将教师模型的建模能力按语义 ID 层级分解并传递，解决不同层级蒸馏难度不平衡问题；
- **Beam-Aware Ranking Distillation**：在束搜索过程中蒸馏教师模型的排序偏好，避免前缀剪枝导致的信息损失。
在四个基准数据集上的实验表明，SmartGR 相比基线平均提升 8.6% 的推荐性能，同时实现 2.39 倍的推理加速。

---

### 4. Hierarchical Residual Policy Optimization for Generative Recommendations

📄 [arXiv:2608.00750](https://arxiv.org/abs/2608.00750) | 在线 A/B 测试（大规模商业系统） | Kaifeng Guo, Yiming Yang, Jingtong Gao, Guolei Zeng, Fukang Yang, Yukang Liang, Peng Jiang, Qingpeng Cai, Xiangyu Zhao

**🗣️ 大白话：** 生成式推荐模型训练完后，通常还要用用户反馈做后训练（post-training）来提升效果。但问题是用户反馈只针对最终展示的商品，中间那些 token 层级（语义 ID 的每个位置）没有明确信号。HRPO 把商品级反馈拆解成 token 级的"残差信用"，让每个 token 都知道自己该往哪优化，而且用 clip 和 KL 正则保证训练稳定。不仅在公开数据集有效，还在一个大规模商业系统上做了在线 A/B 测试验证。

**🔬 专业讲解：** 本文提出 **Hierarchical Residual Policy Optimization (HRPO)**，一种将商品级反馈转换为密集 token 对齐学习信号的生成式推荐后训练框架：
- 首先通过基于特征的用户聚类进行组级奖励平滑，估计 SID 前缀级效用；
- 然后将效用分解为残差 token 信用并累积为"信用到期"信号；
- 最后通过 **Residual-Return Policy Optimization (RRPO)** 优化残差信用，使用 clipped updates、组归一化优势和 KL 正则化保证稳定性。
在公开数据集和大型商业系统的在线 A/B 测试中均取得一致的会话级效用和业务指标提升。

---

### 5. Exponential Reward Weighting for Fine-Tuning Generative Recommenders under Sparse and Noisy Feedback

📄 [arXiv:2608.00816](https://arxiv.org/abs/2608.00816) | 大规模工业数据集验证 | Keertana Chidambaram, Sanath Kumar Krishnamurthy, Qiuling Xu, Ko-Jen Hsiao, Moumita Bhattacharya

**🗣️ 大白话：** 推荐系统的反馈又稀疏又 noisy——用户只 interacted 了极少商品，而且点击不一定等于喜欢。用 PPO 或 DPO 做后训练时，很容易"过优化"一个本来就不准的奖励模型，导致推荐质量反而下降。Exp-RSFT 的思路很简单：直接用原始日志奖励做加权训练，权重是 exp(r/λ)，λ 控制对 noise 的鲁棒性。理论上证明了这个方法的最优性 gap 可以分解为"覆盖成本"和"噪声成本"，λ 正好平衡这两者。实验发现性能随 λ 呈倒 U 型，而 PPO/DPO 经常过优化。

**🔬 专业讲解：** 本文提出 **Exponential reward-weighted fine-tuning (Exp-RSFT)**，一种直接基于日志奖励进行加权优化的生成式推荐后训练方法：
- 每个日志交互的权重为 exp(r/λ)，温度 λ 作为对奖励噪声的正则化；
- 理论分析表明 Exp-RSFT 的次优性可分解为覆盖成本（日志策略的局限）和噪声成本（不完美反馈）；
- λ 平衡了这两个竞争效应，在最优地利用高奖励行为和对噪声的鲁棒性之间取得 tradeoff。
在三个公开基准和一个大规模工业数据集上的实验验证了理论预测：性能随 λ 呈倒 U 型趋势，而 PPO 和 DPO 经常过优化不可靠的奖励模型。

---

### 6. Collaborative Memory Augmentation for Generative Recommendation

📄 [arXiv:2608.01315](https://arxiv.org/abs/2608.01315) |  | Enze Liu, Zhen Tian, Wayne Xin Zhao

**🗣️ 大白话：** 生成式推荐把推荐当成序列生成任务来做，但现有方法只关注单个用户的历史序列，没用上"和你相似的人也喜欢什么"这种跨用户协作信号。OMEGA 的做法是：先把用户序列压缩成紧凑的向量表示，存到一个全局的"协作记忆库"里；推荐时根据当前用户的序列和候选商品，从这个库里检索最相关的记忆，再用门控交叉注意力融合到生成过程中。相当于给生成式推荐加了一个"群众智慧"外脑。

**🔬 专业讲解：** 本文提出 **OMEGA**（cOllaborative MEmory augmentation framework for Generative recommendAtion），通过外部记忆增强生成式推荐：
- **Latent Context Compression**：使用可学习查询 token 将序列用户行为蒸馏为紧凑表示，显著降低存储开销；
- **Collaborative Memory Bank**：聚合压缩表示作为全局行为模式的显式仓库；
- **Target-Aware Retrieval**：同时考虑序列级和商品级相似性的轻量级检索机制；
- **Context-Aware Integration**：通过门控交叉注意力机制自适应融合检索到的协作记忆与局部用户上下文。
在多个真实世界数据集上显著优于现有先进 GR 模型。

---

### 7. GARDRec: Decision-Level Graph Grounding for Large Language Model Recommendation

📄 [arXiv:2608.00669](https://arxiv.org/abs/2608.00669) |  | Yong Wang, Hongliang Sun, Jinlan Liu, Hua Zhang, Dianbo Sui, Dianhui Chu, Zhiying Tu

**🗣️ 大白话：** 大语言模型做推荐有个问题——知识图谱通常只是当"提示词素材"用，没有真正参与到排序决策中。GARDRec 把图谱信号注入到决策阶段：用图谱传播得到语义-结构化的商品表示，结合用户历史的时间权重和一阶邻居构建个性化图谱上下文，再通过显式的交互和匹配特征做最终排序。这样 LLM 不仅"看了"图谱，还真的"用了"图谱来做决策。

**🔬 专业讲解：** 本文提出 **GARDRec**，一种面向 LLM 基于 next-item 排序的图 grounding 自适应推理与决策感知推荐框架：
- 从文本节点特征和图谱传播构建语义-结构化商品表示；
- 从时间加权历史和一阶邻居推导个性化图谱上下文；
- 通过连续多模态提示将图谱派生表示与冻结 LLM 对齐；
- 通过后期决策分支注入显式交互和匹配特征，结合候选间注意力和受限生成似然支持最终排序。
在三个公开基准和多种 LLM backbone 上验证了有效性。

---

### 8. HyperAgent4POI: Dynamic Semantic Message Passing on Multi-Agent Hypergraphs for Missing-Modality Recommendation

📄 [arXiv:2608.01846](https://arxiv.org/abs/2608.01846) |  | Jinze Wang, Yuze Liu, Tiehua Zhang, Jiong Jin, Zhu Sun

**🗣️ 大白话：** POI（地点）推荐通常依赖文字描述和图片来理解地点语义，但现实中很多 POI 缺图片或缺描述。HyperAgent4POI 用了一个很巧妙的思路：把每个 POI 当成一个"智能体"（Agent），在超图结构里做动态语义消息传递——既能补全缺失的模态，又能通过语义超边模式指导关联强度。更妙的是推理时可以把 LLM 结果缓存下来，不用每次调用大模型。在 60% 模态缺失率下还能比最强基线提升 8.2%。

**🔬 专业讲解：** 本文提出 **HyperAgent4POI**，利用动态语义消息传递（DSMP）进行模态补全和软关联优化的多智能体超图 POI 推荐框架：
- 持久节点智能体共享冻结 Llama backbone，通过角色特定适配器生成节点到超边消息；
- 语义超边模式指导软关联评分和模态补全；
- 最终节点表示可缓存用于在线排序，无需 LLM 调用。
在三个真实世界 LBSN 数据集上，不同模态缺失率下均取得一致的排序提升。

---

### 9. X-KGRank: A Knowledge Graph RAG Framework for Explainable Recommendations via Pattern Mining and LLM Re-Ranking

📄 [arXiv:2608.01732](https://arxiv.org/abs/2608.01732) |  | Meenakshi Rajpurohit, Jainish Patel

**🗣️ 大白话：** 推荐系统给的推荐用户看不懂，这是个大问题。协同过滤能捕捉行为信号但没解释，LLM 能生成解释但会 hallucination。X-KGRank 用知识图谱把两者结合起来：从 MovieLens 构建了一个包含评分、类型、共评关系的知识图谱，用 LightGCN 做排序，再根据商品流行度决定走 KG 路径解释还是直接用预训练知识——长尾商品用 KG（有 1855 个长尾商品），流行商品走捷径，这样 KG 调用减少约 50%。最后用 LLM 做重排序和解释生成。

**🔬 专业讲解：** 本文提出 **X-KGRank**，一种统一结构协同过滤与 LLM 解释的知识图谱 RAG 推荐框架：
- 从 MovieLens-1M 构建异构知识图谱（9762 节点，999264 边），包含 RATED、HAS_GENRE、CO_RATED 三种关系；
- 使用内容感知 SBERT 初始化和 rating-weighted BPR 目标训练 LightGCN 排序器；
- 采用流行度选择性路由策略：长尾商品（1855/3704）通过 KG 路径 grounding，流行商品使用预训练知识，减少约 50% 的 KG 增强生成；
- 在 99-sample 协议下，NDCG@10 = 0.2956，Recall@10 = 0.5371，相比强流行度基线提升 17.1%。

---

### 10. Unpaired Modality-Agnostic Generative Recommendation

📄 [arXiv:2608.02477](https://arxiv.org/abs/2608.02477) |  | Weihao Shen, Wei Chen, Fuwei Zhang, Meng Yuan, Yuqin Lan, Guojun Liu, Qingsong Hua, Wei Lin, Fuzhen Zhuang

**🗣️ 大白话：** 多模态生成式推荐通常要求每个商品同时有图片和文字，但很多商品只拍了图没写描述，或者只有文字没图片。UnpairGR 的突破在于：把模态特定的处理限制在轻量级输入投影层，后面的 Transformer 和残差码本全部共享——这样图片-only、文字-only、图文都有的商品都能训练到同一个语义 ID 空间里。不需要特征插补、模态专用码本或 fallback 映射。

**🔬 专业讲解：** 本文提出 **UnpairGR**（Unpaired Modality-Agnostic Generative Recommendation）：
- 将模态特定处理限制在轻量级输入投影层，后续 Transformer 和残差码本在所有观测条件下共享；
- 配对观测通过可靠性引导的跨模态共识建立关联，单模态观测直接优化相同的表示和码本；
- 学习到的 tokenizer 固定后可为单一自回归推荐器提供稳定目标。
在三个基准数据集上，在完全观测和不完全观测设置下均一致提升推荐性能。

---

### 11. MODE: Mutual Optimality in Direct Effects of Reciprocal Recommendations in Matching Markets

📄 [arXiv:2608.01731](https://arxiv.org/abs/2608.01731) |  | Yoji Tomita

**🗣️ 大白话：** 双边匹配平台（招聘、交友）的推荐有个经典矛盾：太照顾冷门用户可能导致推荐质量下降，太追求热门又会让机会集中在少数人手里。MODE 提出了"直接效应互最优"的概念：给定其他用户的推荐，为每个用户计算对其而言最优的推荐列表，并且这些最优之间是相互兼容的。相比现有方法，MODE 处理速度更快、匹配数更高。

**🔬 专业讲解：** 本文提出 **MODE**（Mutual Optimality in Direct Effects），一种在双边匹配市场中计算互最优互惠推荐的方法：
- 形式化"直接效应最优性"概念：给定其他用户的推荐，为个体用户推荐列表的最优性；
- 提出 MODE 方法计算直接效应中的互最优推荐；
- 在合成和真实数据上的实验表明，MODE 在直接效应互最优性、处理速度和预期匹配数方面均优于现有方法。

---

### 12. Between-User Collapse Under Popularity-Biased Feedback: A Centered-Covariance Theorem and Computable Phase Boundary

📄 [arXiv:2608.02548](https://arxiv.org/abs/2608.02548) |  | Sahil Medepalli

**🗣️ 大白话：** 流行度偏差的 BPR 训练会让用户嵌入"塌缩"到一起——大家的表示越来越像。这篇论文从理论上证明了：在流行度偏差反馈下，用户间的协方差会收敛到一个与 item noise 相关的稳态，并推导出了一个可计算的"相边界"——训练超参数的哪些组合会导致塌缩、哪些不会。好消息是：在实际部署的正则化强度下，这种塌缩很小，不影响推荐质量。这个边界可以直接从已训练模型的嵌入、交互计数和超参数算出来。

**🔬 专业讲解：** 本文研究流行度偏差 BPR 训练如何重塑协同过滤嵌入的用户间几何结构：
- 使用均值中心化用户协方差 C 衡量用户间可区分性；
- 证明在流行度偏差反馈和静态商品下，C 收敛到与 item-noise 协方差 Q 成比例的稳态，用户间分布塌缩至噪声底；
- 推导训练超参数 (α, λ_neg, γ, d) 的可计算相边界，分离收缩与扩张区域；
- 发现部署尺度正则化下的预测收缩是真实且策略驱动的，但量级小，不影响推荐指标。

---

### 13. SPEAR: Selection-aware Personalized End-to-end Adaptive Rewriting and Retrieval for Community Search

📄 [arXiv:2608.01738](https://arxiv.org/abs/2608.01738) | 得物（Dewu）已全量部署 | Wenbin Wu, Yuzhong Wu, Yufan Xu, Kuan Fang, Xing Xu, Cheng Ye, Xiaobin Hu

**🗣️ 大白话：** 电商搜索里，改写（query rewrite）和检索通常是分开优化的，导致改写好的 query 检索出来不一定准。直接端到端的话，模型会学到一个捷径——用泛化词改写（比如"手机"→"电子产品"），这样路径分数高但偏离了用户真实意图。SPEAR 用三个组件分别堵死三个漏洞：双路 Embedding 防止召回语义被 CTR 信号污染、乘法门控让改写分数高必须同时满足置信度和相关性、动态改写选择器让改写偏好和相关性校准都能按请求自适应。得物社区搜索已经全量上线，CTR 提升 0.259，阅读深度提升 0.733。

**🔬 专业讲解：** 本文提出 **SPEAR**，一种面向电商社区搜索的选择感知个性化端到端自适应改写与检索框架：
- **Dual-Embedding Backbone**：通过辅助损失和梯度隔离保护召回侧语义不被 CTR 驱动的排序信号侵蚀；
- **Multiplicative Gating Aggregator**：仅当改写置信度和商品相关性都强时才给高分，消除泛化词捷径；
- **Dynamic Rewrite Selector**：联合生成请求特定的改写权重和用户-查询条件化的尺度/偏置项。
在 10 万工业搜索会话上的离线评估显示，改写语义相似度@10 提升 +18.2，点击召回@10 提升 +99.5。在线 A/B 测试 CTR 提升 +0.259，平均阅读深度提升 +0.733，已在 Dewu 社区搜索平台全量部署。

---

### 14. Auditing Semantic Gains in Sequential Recommendation: A Lightweight Recovery Test

📄 [arXiv:2608.01260](https://arxiv.org/abs/2608.01260) |  | Kong Wang, Zhongke He, Xiang Chen, Hongwei Zeng, Kai Deng, Long Wang, Kehua Yang

**🗣️ 大白话：** 最近很多"语义化"或"生成式"推荐模型宣称比纯 ID 基线强很多，但这些提升到底来自语言模型的推理能力、语义 ID 生成、还是更强的离线商品表示？LIME-Rec 设计了一个轻量级审计方案：把 SASRec（序列专家）、ItemCF（协同专家）和一个基于 BGE 冻结嵌入的语义专家融合起来，发现这个简单组合就能超过很多复杂模型。进一步实验表明，随机打乱商品文本嵌入会导致性能下降 13-17%，说明提升确实依赖真实的 item-text 对应关系，而非额外的表示容量。

**🔬 专业讲解：** 本文提出 **LIME-Rec**，一种轻量级可审计的恢复测试框架：
- 组合三个独立专家：SASRec 序列专家、ItemCF 共现专家、基于冻结 BAAI/bge-base-en-v1.5 的语义专家；
- 通过可审计的分数级融合和有界历史校准组合全目录分数；
- 融合门和校准头仅在验证数据上拟合，无需服务时 LLM 推理。
在 Amazon Beauty、Toys 和 Sports 上，LIME-Rec R@10 达到 0.0996/0.1105/0.0593，超越最强基线 7.0%-12.0%。随机打乱 item-text 嵌入使 R@10 降低 13.6%-17.5%，表明语义增益依赖真实的 item-text 对应关系。

---

### 15. GRACE: Generative Recommender Acceleration Engine for Real-Time Ads Retrieval

📄 [arXiv:2608.00938](https://arxiv.org/abs/2608.00938) |  | Zhou Fang, Yuhang Huang, Ang Zhang, Yihan He, Ruichao Xiao, Chao Li, Yavuz Yetim, Sibyl Yang, Xiaohan Wei, Fei Tian, Liang Wang, Liyuan Li, Nathan Yan, Gaoxiang Liu

**🗣️ 大白话：** 把生成式推荐用到广告实时检索上有两大难题：一是生成的广告必须满足广告主的定向规则（比如只推给特定人群），二是要在 GPU 上扛住高并发、低延迟、宽束搜索。GRACE 从这两个角度同时发力：用基于掩码和 Bloom filter 的"生成式目标匹配"（GTM）把最终广告级匹配通过率从 23.55% 提升到 40.42%；同时针对 Encoder-Decoder Transformer 做了全套内核优化——交叉注意力延迟降低 68 倍，自注意力降低 23-25 倍，整体解码器延迟降低 11.1 倍。

**🔬 专业讲解：** 本文提出 **GRACE**，面向广告生成式检索的加速引擎：
- **Generative Target Matching (GTM)**：扩展目录约束解码，通过基于定向规则导出的掩码和 Bloom filter 匹配器对 SID 前缀进行个性化过滤，最终广告级目标匹配通过率从 23.55% 提升至 40.42%；
- **Decoder 优化**：针对宽束、短序列的 Encoder-Decoder Transformer，覆盖注意力内核、KV Cache 和束搜索优化。在 NVIDIA GH200 上，相比 FlashAttention-2/3 基线，交叉注意力延迟降低 68.0 倍，自注意力延迟降低 23.4-25.8 倍，整体解码器延迟降低 11.1 倍。

---

## 📋 其他论文速览

- **Between-User Collapse Under Popularity-Biased Feedback**（arXiv:2608.02548）：理论分析流行度偏差 BPR 训练下用户嵌入塌缩的相边界。
- **Beyond the Final Prompt**（arXiv:2608.02556）：测量对话内上下文对 AI 回答的影响。
- **Requirement--Evidence Alignment for Compositional E-Commerce Queries**（arXiv:2608.02500）：电商组合查询的需求-证据对齐。
- **Syntax Meets Semantics**（arXiv:2608.02457）：科学公式的语法与语义理解。
- **Advancing Relevance Measurement with Vision-Language Models for Web-Scale Search**（arXiv:2608.02446）：用视觉-语言模型提升网页搜索相关性度量。
- **Disentangled Contrastive Learning for Zero-Shot Multilingual Dense Retrieval**（arXiv:2608.02189）：零样本多语言稠密检索的解耦对比学习。
- **Real-Time Hybrid Retrieval in Hyperbolic Space for RAG on Edge Devices**（arXiv:2608.01450）：双曲空间实时混合检索用于边缘设备 RAG。
- **UniHEAR**（arXiv:2608.01147）：统一异构源注意力检索用于知识型视觉问答。
- **Tevatron Meets Megatron**（arXiv:2608.00916）：专家并行 LLM 重排序器训练。
- **Floor, Ceiling, and the Fusion Gap**（arXiv:2608.01704）：机器预测群体阅读注意力的上限分析。
- **PHA-Net**（arXiv:2608.00551）：基于原型的层次对齐网络用于文本-视频检索。
- **A Context-Aware Cultural Heritage Guide Powered by LLMs**（arXiv:2608.00549）：LLM 驱动的上下文感知文化遗产导览。
- **CeQe**（arXiv:2608.00452）：基于语义证据的词法检索 grounding。
- **Hierarchical BM25**（arXiv:2608.00229）：十亿级文档词法搜索。
- **UEmbed**（arXiv:2608.02583）：统一稀疏与稠密多模态 Embedding。
- **Structured Memory for Edge Language Models**（arXiv:2608.02560）：边缘语言模型的结构化记忆与语料检索。
- **Token-Native Storage**（arXiv:2608.02376）：Agent 语言原生的读写存储。
- **Do Static Embeddings Add Value to Hybrid Dutch Retrieval?**（arXiv:2608.02112）：静态嵌入对荷兰语混合检索的价值。
- **Fetch-then-Explore**（arXiv:2608.02097）：解耦选择与提取的搜索 Agent。
- **BIP! Ranker**（arXiv:2608.02004）：大规模图引用影响指标软件库。
- **Diagnosing Search Behavior in Long-Horizon Search Agents**（arXiv:2608.01913）：长程搜索 Agent 的搜索行为诊断。
- **Multimodal Embeddings for 3D Similarity Search**（arXiv:2608.01852）：3D 相似度搜索的多模态嵌入。
- **HindSearch**（arXiv:2608.01597）：轨迹级后见批判用于搜索增强强化学习。
- **V-Mem**（arXiv:2608.01543）：模态路由检索用于长期多模态 Agent 记忆。
- **Deep Agentic Search for Repository-Level Code QA**（arXiv:2608.01507）：仓库级代码问答的深度 Agentic 搜索实证研究。
- **Join Indices for Search Engines**（arX8:2608.01173）：Lucene 段上的可剪枝并行半连接。
- **Verification Without Sufficiency**（arXiv:2608.00585）：多跳 RAG 中逐块过滤的不足与分解修复。
- **Unleashing LLMs for Real-Time Enterprise Deployments**（arXiv:2608.00419）：LLM 实时企业级部署蓝图。
- **Retrieval-Based Cross-Domain Generalization in Optical Networks**（arXiv:2608.00044）：光网络中基于检索的跨域泛化。
