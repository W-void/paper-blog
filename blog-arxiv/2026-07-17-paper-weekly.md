---
title: "【推荐系统 Paper 周报】2026-07-17"
date: 2026-07-17
authors: [wangshuli]
tags: [推荐系统, Paper周报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2775195078"
---

# 【推荐系统 Paper 周报】2026 W28（07-13 ~ 07-17）

## 本周概览

本周 arXiv cs.IR 密集放出 **126 篇**新论文（含跨域与更新），其中推荐系统强相关约 **50 篇**，工业实践占比创下新高——美团、Meta/Instagram、Pinterest、阿里巴巴天猫、淘宝、快手、Apple TV、Yandex 等厂商同时释放新工作。一个清晰的趋势是：推荐系统正经历从"预测下一个商品"到"规划一段体验"的范式跃迁，生成式推荐不再只是学术概念，而是进入大规模工业验证阶段；与此同时，序列推荐开始从"一次性编码"走向"递归推理"，而系统层面的效率、可控性与鲁棒性也同步被重新关注。

---

## 一、生成式推荐：从概念验证到工业规模化

生成式推荐（Generative Recommendation）是本周最活跃的方向，涉及语义 ID 编码、训练信号扩展、异构特征统一、推理效率优化等多个维度。这个方向已经从"能不能做"演进到"怎么做得更准、更快、更工业友好"。

### 代表性论文

**[Not Only NTP: Extending Training Signal Coverage for Generative Recommendation](https://arxiv.org/abs/2607.12277)**（美团）

现有生成式推荐用 Next Token Prediction（NTP）训练，但美团团队发现 NTP 存在两个结构性盲区：只看当前相邻步骤（时间局部性），以及多域序列中每个目标只受前一步隐状态影响（空间局部性）。本文提出的 NONTP 框架引入两个可丢弃的辅助任务——TCL（时间对比学习，用 BYOL 风格 EMA 教师将隐状态对齐到 K 步未来轨迹）和 TDL（跨域学习，对跨域隐状态做 mean-pooling 后通过共享预测头预测）。推理时零开销丢弃。在美团四域全排序工业数据集上 HR@10 相对提升 **34.3%**（对比 NTP）、**18.3%**（对比 MBGR），线上 A/B 测试 CTR +1.8%、GMV +2.1%。

**[SlimPer: Make Personalization Model Slim and Smart](https://arxiv.org/abs/2607.12281)**（Meta/Instagram）

核心洞察：Transformer 在生成任务中需要逐 token 自回归的中间张量，但推荐只输出 item-level 的相关性分数，token 级中间张量属于过度设计。SlimPer 将个性化排序重新定义为"迭代精炼一个固定大小的 <user, item> 知识库"——每层选择性查询必要 token、计算显式匹配分数、精炼知识库，每层成本固定 O(N)，模型深度与历史长度解耦。已全量部署在 Instagram Reels 和 Feed，支持 **10k+** 细粒度历史事件建模。

**[TMallGS: Scaling Unified Feature and Sequence Modeling for Generative E-commerce Search](https://arxiv.org/abs/2607.13398)**（阿里巴巴天猫）

电商搜索排序的特征异构性（ID、类目、价格、文本、序列等）让统一 Transformer 架构面临挑战。TMallGS 提出五个核心组件：分层分布校准 Tokenization（FSR + DCP）、域自适应门控 Transformer、解耦 FiLM 晚融合、上下文感知偏置网络、误差感知渐进训练。在天猫搜索线上 A/B 测试中 UCTCVR 和 GMV 均取得显著提升。

**[Beyond Semantic IDs: Encoding Business-Value Ranking into Document Identifiers for Generative Retrieval](https://arxiv.org/abs/2607.11392)**（淘宝）

现有生成式检索的 DocID 只编码语义，不编码业务目标（如 GMV）。CRID 将 DocID 解耦为"语义聚类"和"业务价值排序"两部分，无碰撞且支持增量更新。在淘宝 3 亿商品上超越最强嵌入检索基线，全量部署 GMV +1.06%。

**[Where Reasoning Matters: Rethinking Latent Reasoning in Semantic ID-based Generative Recommendation](https://arxiv.org/abs/2607.12425)**

在语义 ID 生成式推荐中，每个商品由多个 token 组成。最近的工作提出在预测每个 token 前多算几步（隐式推理），但问题是每个 token 位置的重要性一样吗？本文通过 Information Gain（IG）分析发现：早期 token 位置信息增益更高，后期递减。提出 IBA 框架，将推理步骤视为有限计算资源，学习向高信息增益位置倾斜的最优分配策略。

**[Tokenizing Numerical and Embedding Features for LLM RecSys](https://arxiv.org/abs/2607.10016)**

推荐系统里有大量数值特征和连续嵌入，但 LLM 擅长处理的是文本 token。本文提出 soft-token fusion 框架，将数值和嵌入特征映射到 LLM 的嵌入空间，使其通过标准 token 接口消费。在 Amazon 三个推荐基准上显著优于 LLM-based 基线。

### 横向对比

生成式推荐本周呈现三条并行推进的主线：

1. **训练信号扩展**：NONTP 的突破在于不改造模型架构，而是发现 NTP 的结构性盲区并用辅助任务补丁。这种"诊断-修补"思路比盲目换架构更务实，对工业落地尤其友好。

2. **表征效率重构**：SlimPer 和 IBA 分别从"架构瘦身"和"推理预算优化"两个角度解决生成式推荐的效率问题。SlimPer 的固定尺寸知识库解耦了深度与历史长度，IBA 则将有限的推理步骤做智能分配。两者可以互补：SlimPer 解决每一层的固定成本，IBA 解决层内的步骤分配。

3. **业务目标对齐**：CRID 把商业价值直接编码进 DocID，这是一个被长期忽视的维度。生成式检索的 DocID 不只是"找到商品"，还要"找到对的商品"——从语义检索到价值检索，这个方向有进一步挖掘空间。

---

## 二、序列推荐：从"一次编码"到"递归推理"

序列推荐本周有三篇同名/近名的 RecRec 论文，加上 SAM 的"学会遗忘"，都在挑战"把用户历史编码一次就输出推荐"的传统范式。这个方向正在经历从"如何更好编码"到"如何更好推理"的转向。

### 代表性论文

**[RecRec: Recursive Refinement for Sequential Recommendation](https://arxiv.org/abs/2607.10541)**

把用户偏好建模为可通过递归精炼的持久隐状态，通过共享递归模块根据交互证据迭代更新。核心创新是"证据锚定校正机制"——每次更新锚定到原始交互上下文，防止深层递归时的语义漂移。仅 3.9M–14M 参数就匹敌或超越 SOTA 序列、图和推理增强推荐器。

**[RecRec: Latent Interests Recursive Reasoning for Sequential Recommendation](https://arxiv.org/abs/2607.12945)**

与上篇同名但不同团队。核心思路是将推理与预测完全解耦：先用 Context Compressor 把 backbone 隐状态压缩为少量"潜在兴趣向量"，再用 Recursive Reasoner 在这些向量上递归推理。无需 RL，纯监督两阶段训练，推理深度可任意调整。四个真实数据集上超越 SOTA 推理增强方法，三个数据集上的增益甚至超越训练时深度。

**[Learning to Forget: Satiation-Aware Long-Sequence Transducers for Mitigating Post-Purchase Redundancy](https://arxiv.org/abs/2607.12714)**（天猫）

现有序列推荐把用户所有交互都当作"正向信号"积累偏好，但买过一个商品后用户可能短期内不想再看同类。SAM 提出"兴趣饱和"概念：购买后通过双路径交叉注意力反向抑制相关历史点击，同时根据再购买周期预测逐步"唤醒"。线上 A/B 测试将购买后重复推荐率（PPRR）降低 **60% 以上**。已在阿里天猫 APP 全量部署。

**[Action-Aware Generative Sequence Modeling for Short Video Recommendation](https://arxiv.org/abs/2604.25834)**（快手）

短视频推荐中，用户动作的时机本身就代表不同意图。A2Gen 将动作按时间维度细化并连成序列统一处理，已在快手全量上线，日活 4 亿+用户，线上 A/B 测试用户观看时长 +0.34%、交互率 +8.1%。

### 横向对比

两篇 RecRec 的对比很有意思：2607.10541 走的是"共享递归模块 + 证据锚定"路线，强调递归过程中不漂移；2607.12945 走的是"推理与预测解耦"路线，强调推理深度可自由调整。前者的参数极简（3.9M–14M），后者更关注推理阶段的灵活性。两条路线可以互补——共享递归模块保证推理稳定性，解耦架构允许推理深度自适应。

SAM 的"学会遗忘"与 RecRec 的"递归推理"形成有趣的对照：RecRec 是在已有偏好上做更深入的推理，SAM 是在购买后主动做"减法"。两者都在扩展序列推荐的状态空间——一个向"更深"推进，一个向"更灵活"推进。快手 A2Gen 则把"动作粒度"作为新的建模维度，把序列推荐从"item 级"下沉到"action 级"。

---

## 三、工业系统优化：效率、可控性与因果推断

本周工业论文密度极高，从 Pinterest 的因果检索到 Apple TV 的增量搜索，从 Meta 的表征精简到淘宝的零权重新闻推荐，都在回答"推荐系统如何在大规模场景下更聪明、更可控、更节省"的问题。

### 代表性论文

**[Deep-learning Causal Retrieval Optimization for Efficient E-commerce Distribution in Pinterest](https://arxiv.org/abs/2607.14161)**（KDD'26，Pinterest）

将电商内容分发建模为早期检索中的因果触发决策问题：不是每次用户浏览都要触发购物候选生成，而是用因果推断判断"这次推购物内容有没有用"。模型与远程检索调用并行运行，不增加端到端延迟。全量上线后砍掉 **85%** 无效购物触发，关键购物指标保持中性，总会话 +0.26%，Pin 收藏 +1.10%。

**[MESH: Scaling Up Retrieval with Heterogeneous Content Unification](https://arxiv.org/abs/2607.12392)**（Pinterest）

发现"异构性的扩展偏差"：模型容量增加时，不同内容层级的收益不平等。MESH 通过模块化架构和门控偏置校正统一检索，把新鲜物品的幂律扩展指数提升 **14 倍**。在线 fresh-item repins +5.5%，漏斗效率 +55%，用户留存 +0.46%。异步 serving 策略带来 2.87× 系统吞吐提升。

**[ZoRRO: A Zero-Weight Personalized Recommender System for Scalable News Recommendation](https://arxiv.org/abs/2607.10910)**

不训练任何模型参数的"零权重"新闻推荐系统，离线效果打平甚至超过深度学习基线，线上速度快了 **600 多倍**。论文还指出：离线指标相近的模型可能产生截然不同的推荐分布，对新闻生态的影响不可忽略。

**[Personalizing Incremental Video Search with Hybrid Text and ID Embeddings](https://arxiv.org/abs/2607.13493)**（Apple TV，RecSys 2026 Industry Track）

增量视频搜索中 query 极度短（1-3 字符前缀），用户意图严重 underspecified。Apple TV 的双空间嵌入方案（TextEmb + IdEmb）在模糊前缀上 NDCG 提升 **+8.63%**，而完整查询仅 +1.46%——个性化在增量搜索场景的价值最大。

**[Long-History User Transformers for Real-Time Ad Ranking](https://arxiv.org/abs/2607.14331)**（Yandex）

把"重模型"和"轻模型"解耦：离线用大 Transformer 编码全部历史存入 feature store，实时只跑轻量模型。缓存表征即使"过时"也 robust，能恢复全量实时 Transformer **72–80%** 的质量。生产 A/B 实验搜索广告排名指标 +2.77%、收入 +2.26%，且未增加 serving 延迟。

**[Cheaper is Better: A Discount-Aware Network for Conversion Rate Prediction in E-commerce Recommendation System](https://arxiv.org/abs/2607.12578)**（阿里巴巴天猫）

CVR 预估中折扣率被长期忽视。DANet 用傅里叶变换提取折扣率长期频率趋势，用分布去偏模块解决促销偏差，再用监督回归辅助任务增强数值精度。离线 AUC +1.61%，线上 pCVR +3.63%、GMV +2.23%。已全量部署天猫 APP。

### 横向对比

Pinterest 的两篇论文值得放在一起看：因果检索（2607.14161）解决的是"什么时候不该推"，MESH（2607.12392）解决的是"怎么让不同内容都推得好"。前者用因果推断做"减法"，后者用模块化架构做"加法"。两者都在同一个 Pinterest 生产系统中运行，说明推荐系统的优化已经从单一指标优化进入"多目标、多约束、多阶段"的精细化阶段。

ZoRRO 和 SlimPer 虽然目标不同（前者做新闻推荐免训练，后者做个性化排序瘦身），但共享一个核心信念：推荐系统不一定需要越来越大的模型。ZoRRO 用零参数实现可接受效果，SlimPer 用固定尺寸表征替代随历史增长的张量。两者都在"做减法"，这个趋势值得注意——在大模型时代，推荐系统的效率优化可能同样重要甚至更重要。

---

## 四、LLM 与推荐的深度融合：评估、可控性与群体偏好

LLM 在推荐系统中的应用不再局限于"用 LLM 生成推荐结果"，而是向评估、可控性、偏好建模等更深层环节渗透。

### 代表性论文

**[User Preference Induction with LLMs for Offline Top-N Recommendation Evaluation](https://arxiv.org/abs/2607.11354)**

离线评估中测试集未观测的交互通常被默认当作"不感兴趣"。本文用 LLM 做两阶段偏好归纳：先总结用户历史为文本画像，再用 LLM 对未观测候选做相关性判断。扩展后的评价更完整，缓解流行度敏感偏差。

**[Consensus vs. Dissent: Dynamic LLM Modeling of Subjective Preferences in Group Recommenders](https://arxiv.org/abs/2607.10235)**

群体推荐中不同群体结构适合不同聚合策略。本文用 LLM 模拟人类对公平、满意度和共识的感知，动态选择最适合的聚合策略。284 人用户研究中满意度得分最高。

**[Can We Steer the Black-Box? Towards Controllability-Centric Evaluation of Recommender Systems with Collaborative Agents](https://arxiv.org/abs/2607.13418)**

提出 CtrlBench-Rec，首个推荐系统可控性多智能体评测框架。形式化三个核心任务：目标内容发现、兴趣画像塑造、流行度偏差缓解。实验发现：系统对引导长尾内容推荐存在**持续抗拒**。这是推荐系统领域第一个可控性标准化工具包。

**[An LLM-powered Agentic Recommendation System for Connected TV Content Discovery](https://arxiv.org/abs/2607.09988)**

用 LLM 做 agent，自然整合 trending topics、突发新闻、文化活动等动态上下文，同时保留传统 ML 在检索效率和个性化精度上的优势。核心贡献在于克服了 LLM 在推荐场景中的实际限制——尤其是推理延迟。

### 横向对比

LLM 在推荐系统中的作用正在分层：

- **评估层**（2607.11354）：LLM 作为更智能的离线评估器，解决传统评估中"未观测=不感兴趣"的偏见。
- **建模层**（2607.10235）：LLM 模拟人类的主观偏好感知，用于群体推荐的策略选择。
- **控制层**（2607.13418）：LLM 作为多智能体评测框架的一部分，量化推荐系统的可控性。
- **执行层**（2607.09988）：LLM 作为 agent 直接参与推荐流程。

这四层是递进的——从"辅助评估"到"参与建模"到"评测系统"到"直接执行"。目前工业落地最成熟的可能是评估层（成本低、可离线），但控制层的"可控制性评测"是一个被长期忽视的需求，随着推荐系统在内容平台上的影响力越来越大，这个方向会变得越来越重要。

---

## 五、多模态与冷启动：从嵌入到封面

**[Stream-aware Side Adaptation for Large Pre-trained Multimodal Embedding Models in Sequential Recommendation](https://arxiv.org/abs/2607.10909)**

像 Qwen3-VL 这样的大预训练多模态嵌入模型在推荐中很有潜力，但直接用效果不理想。Stresa 设计了一个 side adapter，在冻结主参数的情况下适应推荐领域，解决现有 side adapter 随深度增加性能下降的问题。在多个骨干嵌入模型上一致优于标准基线。

**[MMRM: A Multiplex Multimodal Representation Model for Product Ranking in E-commerce Search](https://arxiv.org/abs/2607.11030)**（京东）

用共享骨干 + 任务特定 token 和投影层，从多种协同信号同时学习并生成多路物品表征。已在京东搜索引擎部署，为数百万日活用户带来显著性能提升。

**[What Would You Click? Personalized Video Thumbnail Generation with Preference-aware Highlight Retrieval](https://arxiv.org/abs/2607.12882)**

提出"个性化视频封面生成"新任务：第一阶段用偏好感知 highlight retriever 从视频中选关键帧，第二阶段用 VLM 引导的扩散管线生成封面。用户研究表明点击率偏好有提升。

---

## 六、鲁棒性与安全性：推荐系统的防御视角

**[CoSimRec: Measuring Coordinated-Content Penetration in Recommender Feedback Loops](https://arxiv.org/abs/2607.15114)**

刷量团伙、水军会不会被推荐系统放大？CoSimRec 搭建了一个基于 Agent 的仿真沙盘，让机器人账户、真实用户、推荐算法在同一个闭环中运行。实验发现 popularity-based 和 feedback-sensitive 策略会显著放大协调攻击，而同步感知防御策略能有效降低渗透。这是推荐系统鲁棒性评估的新工具。

**[Normative Alignment of Recommender Systems via Internal Label Shift (NAILS)](https://arxiv.org/abs/2607.10915)**

推荐系统如果只优化点击容易推荐越来越窄的内容。NAILS 提供了一种"不用重新训练模型"的方法，让已有推荐器的输出在类别分布上对齐目标价值观，同时保留用户偏好。为价值驱动的推荐提供了实用机制。

---

## 七、范式演进：从 Raw ID 到 Semantic Planning

**[From Raw IDs to Semantic Planning: How Recommender Systems Utilize Information at Scale](https://arxiv.org/abs/2607.09540)**（RecSys 2026）

这是一篇站得更高的展望性论文。作者把推荐系统二十年的信息利用历程分为三阶段：
1. **ID 主导**：原始 ID 精确、可扩展、语义不可知；
2. **语义 ID**：多模态、上下文、跨域信息封装为语义化编码；
3. **语义规划**：先预测用户"想要什么体验"，再实例化为具体商品或生成内容。

从"推荐一个商品"到"规划一段体验"——这个转变不仅关乎模型，更关乎评估方式和系统目标的重塑。推荐系统需要同时协调用户、平台和创作者三方的利益，而非仅优化平台的商业目标。这篇论文为本周密集的工业实践论文提供了一个概念框架：NONTP、SlimPer、CRID、DANet、SAM 等具体工作，都可以被理解为"语义规划"阶段的不同实现路径。

---

> 📅 **本周统计**：arXiv cs.IR 共更新 126 篇，推荐系统强相关约 50 篇，工业落地论文占比 >60%。
