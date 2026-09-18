---
title: "【推荐系统 Paper 周报】2026-09-18"
date: 2026-09-18
authors: [wangshuli]
tags: [推荐系统, Paper周报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2787547662"
---

# 【推荐系统 Paper 周报】2026 W38（2026-09-14 ~ 09-18）

> 本周报基于 2026-09-14 ~ 09-18 共 6 篇《推荐系统 Paper 日报》（其中 09-17 有两篇）汇总而成。

## 📊 本周概览

本周 cs.IR 领域约更新 140 篇论文，其中推荐系统直接相关约 65 篇，整体呈现出两条鲜明主线：**一是生成式推荐（GR）正式进入"落地竞赛"阶段**——天猫 VARG、Instagram LIGE-GR、快手 UniRec、抖音 SequenceO1 等一批工业论文全部带着线上 A/B 数据出场，讨论焦点从"能不能生成"转向"怎么接进存量系统"；**二是 LLM/Agent 与推荐的关系开始出现"分工分化"**——一部分论文让 LLM 当生成器（偏好理由、标题），另一部分让 Agent 当诊断员和审计员（自动找推荐系统的茬、审计 LLM 推荐的幻觉与合规性）。此外，本周还有一批"反直觉"的校准与消融研究，给做排序的同学泼了几盆有价值的冷水。

## 🧭 方向性归纳

### 一、生成式推荐：从论文走向生产线

本周 GR 方向最热，而且清一色是"落地视角"：

- [VARG: Value-Aware and Ranking-Aligned Generative Retrieval for Dynamic E-commerce Search](https://arxiv.org/abs/2609.14493)（天猫 App 搜索）：在语义 ID 之外加入按价值排序的第三个 token，让候选生成阶段就携带商业价值先验，生成结果直接进现有精排器，14 天 20% 流量 A/B 拿到 GMV +1.45%。
- [LIGE-GR: A Smooth Leap from Ranking to Generative Recommendation in the LLM Era](https://arxiv.org/abs/2609.18148)（Instagram/Meta）：思路是"不推倒重来"——把逐 item 打分的排序系统泛化为整页榜单的 listwise 生成与联合评估框架，老模型、价值函数、serving 基建全部保留。
- [Addressing Cross-Stage Decoupling of Semantic and Collaborative Signals in Generative Recommendation](https://arxiv.org/abs/2609.13678)（RecSys 2026）：解决 GR 的"两阶段脱节"——tokenization 阶段被文本语义主导、生成阶段又丢掉语义，提出协同信号文本化注入 + 可学习 code embedding 双向补齐。
- [Self-Evolving Memory for Generative Recommendation](https://arxiv.org/abs/2609.15598)（CIKM 2026）：给共享自回归参数外挂一块自进化的稀疏记忆，让小众用户的兴趣演化不被多数派模式"挤压"，直击 GR 的演化冲突问题。
- [SequenceO1: End-to-End Ultra-Long (100K) Sequence Modeling in Recommendation with Low-Rank Caching](https://arxiv.org/abs/2609.08443)（抖音已部署）与 [OneLA: Scaling Linear-Attention Decoding to Large Beams in Generative Recommendation](https://arxiv.org/abs/2609.12399)：分别从超长序列建模和大束解码两个方向解决 GR 的工程瓶颈，前者靠压缩与缓存摊薄 100K 序列的存储与计算成本，后者靠共享 prompt 状态的 GPU 融合内核拿到 1.54-2.46x 端到端加速。
- [Preference-Drift-Aware Subsequence Learning for Long-Sequence Generative Recommendation](https://arxiv.org/abs/2609.12556)：用可微子序列边界切分偏好漂移，是 GR 长序列建模中"时间感知"的代表。

这一周的趋势很清楚：**GR 的竞争已经从架构创新转向落地工程**——ID 稳定性、下游兼容性、解码成本、多 epoch 协同更新，这些"不性感"的问题成了论文的主角。天猫选择把价值编码进 ID，Instagram 选择把生成嫁接到排序，快手（UniRec，[arXiv:2609.11052](https://arxiv.org/abs/2609.11052)）选择两阶段联合优化，三条路线殊途同归：**都不谋求替换存量系统，而是做增量改造**。

### 二、LLM + 推荐：当生成器，也当审计员

- [SARA: Scaling Articulated Rationales for MLLM-based Recommendation](https://arxiv.org/abs/2609.17639)（快手）：从 2.4 亿直播用户挖掘"偏好理由"文本信号，7B 多模态模型泛化到全站 1000 万作者，生成正/负理由接入生产排序，是"让用户说为什么"的规模化首例。
- [Generate to Explore, Select to Exploit: Aligning LLM-based Headline Generation with Personalized Recommendation](https://arxiv.org/abs/2609.15094)（亿级 DAU 平台）：LLM 负责"多样性生成"，轻量选择器负责"精准性利用"，解耦后 CTR +2.57%，避免了 LLM 直接生成最佳标题时的模式坍塌。
- [ReliGRec: Reliability-Oriented LLM-Based Generative Recommendation via User-Risk-Aware Prompt Routing](https://arxiv.org/abs/2609.16560)：给用户估"弱风险分"，高风险用户在推理时路由到谨慎 prompt，把鲁棒性从训练时加权升级为生成时控制。
- [AURA: Agentic Diagnosis and Refinement for Production Recommender Systems at Scale](https://arxiv.org/abs/2609.16625)（大型流媒体平台）：Agent 读生产日志发现推荐失败模式，再带着代码库上下文直接给出代码级改进——"自愈型推荐系统"的第一份生产级参考。
- 审计方向三连：[Evaluating Brand Retrieval and Ranking in Large Language Model Recommendations](https://arxiv.org/abs/2609.16304) 发现 LLM 会系统性漏掉知名品牌、推荐显眼度与"市场可见度"强相关而与传统人气关系不大；[Understanding AI Provider Recommendations in Local Service Markets](https://arxiv.org/abs/2609.18341) 发现不联网时 AI 推荐的医生 4-11% 才真实存在、被推荐理财公司的 SEC 违规率是基线 3.6 倍；[Following the Preference, Missing the Optimum: Compliance Without Optimization in AI Housing Recommendation](https://arxiv.org/abs/2609.10856) 发现 AI 租房推荐 39% 被严格支配——"合规但非最优"。
- [Reproducing Transparent and Scrutable Recommendations: Exploring Open-Weight Models via Natural-Language User Profiles](https://arxiv.org/abs/2609.19831)（BlackboxNLP@EMNLP 2026 复现专题）：独立复现验证了"自然语言用户画像"推荐的有效性——性能不打折、透明可干预是真的，还做了机制可解释性分析。

这一方向最有意思的结构是**正向与反向的同时成熟**：正向应用（SARA、GESE、ReliGRec）在解决"LLM 怎么干活"，反向审计（AURA、三篇审计论文）在回答"LLM 靠不靠谱"。二者其实是同一枚硬币：正因为 LLM 开始深度介入推荐决策，幻觉、支配、品牌偏向这些问题才第一次变得可测量、也必须测量。

### 三、长序列与用户行为建模：100K 时代的共识与冷水

- [SequenceO1](https://arxiv.org/abs/2609.08443)（抖音）与 [ChronicleRec: Pre-training Temporally Anchored Tokens for Lifelong User Modeling](https://arxiv.org/abs/2609.12375) 给出了高度趋同的答案：**先压缩再推理**——用原型/时间锚定 token 把远期历史压缩成可缓存的表示，近期行为保留细节，远期粗化。
- [MIMA: Multi-Interest Recommendation via Multi-Positive Exclusive Assignment](https://arxiv.org/abs/2609.12842) 用匈牙利匹配解决多兴趣坍缩：单正样本范式让所有正样本涌向同一个最佳兴趣向量，排他分配让每个正样本只监督一个兴趣，A/B 收益可观。
- [LazFormer: Scaling Transformers for Industrial Recommendation via Transferable Generative Pre-training](https://arxiv.org/abs/2609.14978) 提供了工业级 Transformer 排序 scaling 的完整 recipe：生成式预训练 + 残差适配器 + 稀疏/稠密参数的非对称多 epoch 策略。
- 而泼冷水的是 [Dense Feature Representation over Sequence Modeling: A Solution to the KDD Cup 2026 UniRec Challenge](https://arxiv.org/abs/2609.19787)：逐组件消融显示，真正涨分的是稠密特征表示（-0.0095 AUC）和正交化优化器，各种花式序列建模组件贡献全部不超过 0.0005、在种子波动范围内。

这组对比是本周最值得玩味的张力：一线团队在拼命把序列做到 100K，比赛复盘却显示"在这个数据规模上序列建模的边际收益约等于零"。两者并不矛盾——超长序列的价值在于线上真实分布中捕获长尾兴趣，而榜单数据可能恰恰放大了稠密特征的权重。做技术选型时，值得先想清楚自己的场景属于哪一边。

### 四、检索、排序基础设施与多目标平衡

- [Efficient Swing Computation for Retrieval in Large-Scale Recommender Systems](https://arxiv.org/abs/2609.16850)（SIGMOD 2027）：经典 Swing 相似度的 ASC/K-ASC 算法，在十亿边图上数量级加速，且带严格概率误差保证——老算法的理论补课也能中 SIGMOD。
- [Recommendation Retrievers Need Verifiers: Universal Generative Reranking for Sequential Recommendations](https://arxiv.org/abs/2609.12270)：一个 next-token cross-entropy 训练的生成式验证器，就能跨四种召回器统一提升 Recall@10，"召回器需要验证器"的提法值得关注。
- [UniRec: Cross-stage Multi-Task Fusion with Preference Alignment for Cascaded Recommender Systems](https://arxiv.org/abs/2609.11052)（快手全量）：两阶段融合 + 双轴偏好对齐，解决"上游过滤掉的恰是下游喜欢的"，时长 +0.616%。
- 多目标平衡的两篇工业范本：[Balancing Trial and Reorder: A Hybrid Sequential Transformer-GBDT Ranker for On-Demand Delivery](https://arxiv.org/abs/2609.16407)（Wolt）用一个模型替掉 4 个排序模型，trial 率 +5.5%；[PinDCO: Whole-Page Aware Dynamic Creative Optimization at Scale](https://arxiv.org/abs/2609.11943)（Pinterest）把整页瀑布流效果纳入创意优化，CTR +3.09%。
- [PCap: Personalized Retrieval-Stage Diversity Capping in Facebook Marketplace](https://arxiv.org/abs/2609.16452)（Meta）：把多样性约束从重排前移到召回阶段，熵打分 + 用户分桶 + 个性化类目配额。
- [InitGen: Candidate Generation for Interaction Initiation in Intelligent Assistants](https://arxiv.org/abs/2609.11953)（OPPO 小布）：用加权偏好优化解决候选生成的反馈稀疏与归属难题，CTR 相对 +69.1%。

### 五、多样性、透明度与破茧

除了 PCap 的召回级多样性，本周还有两个"让推荐可被看见"的工作：[FacetCRS: Multi-Faceted Preference Learning for Pricking Filter Bubbles in Conversational Recommender System](https://arxiv.org/abs/2609.20175) 把去信息茧房从排序阶段的事后干预前移到对话交互的过程之中，用实体/词汇/上下文/评论四个切面建模动态偏好；加上前述 UPR 复现工作验证的"可编辑自然语言画像"，**透明度正在从论文里的道德诉求变成可复现、可落地的工程能力**。

### 六、隐私、遗忘与鲁棒性

- [SURF: Subtractive Updates for Recommender Forgetting](https://arxiv.org/abs/2609.18695)：只遗忘 item 的"邻域"训辅助模型、推理时做减法，GDPR 级别的遗忘效果接近全量重训，时间只要 2%。
- [FedHUR: Learning Hierarchical Utility-Guided Client Relations for Personalized Federated Recommendation](https://arxiv.org/abs/2609.11632)：联邦推荐首次引入层次化效用引导的客户端关系学习，"谁能帮谁"比"谁和谁参数像"更有信息量。

### 七、评测、校准与避坑指南

本周校准/评测方向的"避坑"密度罕见地高：

- [Odds-Shift Slippage in One-vs-Rest Rankers: Diagnosing and Repairing Reweighting-Induced Top-K Errors](https://arxiv.org/abs/2609.13810)：`scale_pos_weight` 抗类别不平衡背后，GBDT 实际实现的 log-odds shift 远不到位（slippage），Santander 上 MAP@7 能从 0.808 崩到 0.117——做重加权训练必读。
- [How Calibration Content Shapes Attention-Based Reranking](https://arxiv.org/abs/2609.17764)：注意力重排器的标配"空 query 校准"在长指令 prompt 下会把相关性信号一起减掉，反而伤性能，免训练插值校准可修复。
- [ESCIM: On Predicting Post-Click Conversion Rate via Counterfactual Inference](https://arxiv.org/abs/2510.04816)（ICDM 2025）：用结构因果模型对未点击样本做"点击干预"反事实推断生成伪标签，替代启发式的 entire-space CVR 建模。
- 理论小而美：[TF-IDF and BM25 Are Exact KL Divergences](https://arxiv.org/abs/2609.14016) 把两大经典检索打分统一为 KL 散度；工具向：[FINALLY: A Dataset Recommender System for Recommender-Systems Research](https://arxiv.org/abs/2609.08941) 帮研究者构建满足约束的数据集集合。

## 🔍 横向对比与观察

**1）GR 落地的三条路线，本质是同一个问题的三种答案。** 面对存量系统，天猫 VARG 选择"改造输入"（价值进 ID）、Instagram LIGE-GR 选择"改造输出"（pointwise 泛化为 listwise）、快手 UniRec 选择"改造中间"（两阶段联合优化）。三者都刻意回避"推倒重来"，这说明工业界对 GR 的态度已经从"技术验证"转为"风险管理"——谁能把生成式能力平滑嫁接进成熟基建，谁就赢得落地权。相比之下，SCRec 和 LION 关注的 tokenization 脱节、演化冲突问题，则是纯学术视角下 GR 的下一个瓶颈。

**2）LLM 的角色分化，是本周最值得记住的结构性变化。** 生成侧（SARA 的理由、GESE 的标题、UPR 的画像）与监督侧（AURA 的诊断、品牌/服务商/租房三篇审计）几乎同步成熟。特别是审计类工作共享一个方法论雏形：把 LLM 的开放生成当作"随机检索+排序过程"做重复采样统计（品牌推荐），或与官方注册库/帕累托前沿对照（服务商、租房）。可以预期，"LLM 推荐审计"会很快从论文话题变成平台合规的标配能力。

**3）超长序列的"热"与消融实验的"冷"互为镜像。** SequenceO1、ChronicleRec、LazFormer 都押注"压缩-推理"范式——近期细节 + 远期梗概已成为事实标准；而 KDD Cup 复盘提醒我们，在不少真实场景里，正交化优化器和稠密特征仍是 AUC 的主要来源。这组张力背后是数据规模与分布的差异：序列建模的红利集中在兴趣长尾明显、时间跨度大的场景，选型前先确认自己站在哪一边。

**4）"反直觉校准"三连击值得排序团队集体传阅。** Odds-shift slippage（重加权没 shift 到位）、空 query 校准被 prompt 内容污染、KDD Cup 的时间泄漏（本地验证 AUC 虚高 0.014）——三个坑都不新，但都是第一次被系统量化。它们共同指向一个老道理：排序系统的性能问题，往往不在模型架构，而在那些"大家都这么干"的默认操作里。
