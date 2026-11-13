---
title: "【推荐系统 Paper 周报】2026-11-13"
date: 2026-11-13
authors: [wangshuli]
tags: [推荐系统, Paper周报, arxiv]
km_source: "https://km.sankuai.com/md/2798347622"
---

# 【推荐系统 Paper 周报】2026 W46（2026-11-09 ~ 11-13）

> 📅 周报周期：2026年11月9日 - 2026年11月13日
> 🔬 论文来源：arXiv cs.IR 每日论文速递
> 🤖 自动生成：小美 🌸 | arXiv cs.IR 周报系统

### 📊 本周概览

本周 cs.IR 共跟踪推荐系统及用户行为建模相关论文约 45 篇，最大的主线依然是**生成式推荐的工业化纵深**：从周一的 RedMall（电商部署 GMV +1.08%）、Shopify SID-LLM（搜索推荐一套模型打天下），到周二字节的 SepLRM/RecoGEM（基础模型范式 + 生产级服务系统）、周五快手系的 TriGen/ReSID，工业界正在把生成式推荐从"跑通"推进到"跑好、跑省、跑得久"。第二条主线是**评测方法论的集体觉醒**：Scaling Law 预测全量 A/B、INTENT 七格评测、IntentTwin 审计离线基准混淆、KuaiRecV2 直指离线-线上不一致——同一周内四篇工作从不同角度拍桌子说"现在的离线评测信不过"，并且都给出了修补方案。此外 LLM 推荐的成本工程（SlimFM、LAAM、SimRec）、多模态推荐（LUMIR、MPIUR、IntentLens）和 POI 推荐的 agentic 化（SHARP）也各有扎实进展。

---

### 一、生成式推荐工业化：部署、服务、可控性三线并进

#### 代表论文

- [RedMall: Generative Recommendation for Large-Scale E-commerce](https://arxiv.org/abs/2611.08519)：大规模电商场景的生成式推荐完整方案——层次化 Semantic ID + 稀疏 MoE + exposure-aware loss + GRPO 混合 LambdaRank 的 RL 阶段。线上广告场景 ADVV +2.24%、推荐场景 GMV +1.08%，属于"能赚钱"的那种改进。
- [Generative Search and Recommendation at Shopify](https://arxiv.org/abs/2611.08804)（SID-LLM）：把搜索和推荐统一成"生成语义 ID"一个任务，目录+行为数据联合预训练，RL 提升搜索相关性、专家模型蒸馏优于纯联合训练，multi-token prediction + 轻量 ranker 满足线上延迟。单模型追平 Shopify 原有多模型搜索栈，离线在线双赢。
- [SepLRM: A Foundation Model Paradigm for Recommendation](https://arxiv.org/abs/2611.10356)（字节跳动）：直击大推荐模型 scaling ROI 递减的痛点——多个端到端模型重复支付长序列编码成本。解法是"推荐基础模型（RFM）+ 垂域模型（VM）"分层：RFM 把末层 encoder 状态导出为与候选无关的共享 KV Cache（比 logits 或聚合 user embedding 保留更多细粒度行为信息），各 VM 在 KV 接口上做候选条件化查询，能力迁移率接近 100%。配套 LG-Store 分布式 KV 存储，已在字节两个工业场景上线。
- [RecoGEM: A Serving System for Production-Scale Generative Recommendation](https://arxiv.org/abs/2611.12296)：生成式推荐服务化的"踩坑实录 + 系统蓝图"——runtime-engine 解耦架构，把候选状态转移、索引热更新等 GR 特有逻辑剥离到专用 runtime，执行引擎利用 GR 序列短、候选大、步形可预测的特点做针对性优化。生产环境跑了 9 个月，支撑 10+ GR 模型家族，单实例 1000+ QPS、P99 < 35ms，吞吐 2.88 倍于 baseline。
- [SteerGR: Steering Generative Recommendation via Sparse Autoencoders](https://arxiv.org/abs/2611.08790)：给生成式推荐装方向盘——用 SAE 找到模型内部与"游戏概念"对应的特征，直接放大/抑制即可控制推荐方向，无需重训。SAE steering 从 LLM 社区走向工业推荐的第一步。
- [TriGen: A Generative Paradigm for Trigger-Induced Recommendation](https://arxiv.org/abs/2611.16395)（快手系）：主流生成式推荐只看长期历史，接不住"点开一条视频后立刻刷出一波新推荐"的瞬时意图。TriGen 用触发序列尾部注入 + dynamic gating 在"持久品味"与"即时冲动"间自适应仲裁 + 逐解码步的触发引导，六个国家线上 A/B 收入与 GMV 显著提升，已全量部署。
- 相邻进展：[PHiT](https://arxiv.org/abs/2611.09006)（诊断发现推荐 CoT 里只有"分析历史"一步有正贡献，据此提出从历史直接构造思考 token 的便宜方案）、[Adaptive Semantic ID Construction](https://arxiv.org/abs/2611.11549)（RecSys '26，AST 自适应分叉树让 SID 层级与模型隐式学到的层次对齐）、[TS-GEAR](https://arxiv.org/abs/2611.12180)（淘宝近场电商生成式广告检索）、[RoutingTrie](https://arxiv.org/abs/2611.11016) / [LEGIT](https://arxiv.org/abs/2611.10357)（约束生成式检索解码空间的工程组件）。

#### 横向对比

把这一周的生成式推荐论文排成时间线，能看到工业化进程的完整光谱：**周一还在证明"能部署"（RedMall），周二开始回答"怎么部署得省"（SepLRM）和"怎么服务得住"（RecoGEM），周三打磨"怎么构造更好的 SID"（AST），周五已经在解"怎么接住瞬时意图"（TriGen）和"怎么救回长尾"（ReSID）**。特别值得注意的是两条基础设施级工作的出现：SepLRM 的共享 KV Cache 范式本质上是在把推荐界的"基础模型分工"制度化——序列编码一次付费、多场景复用，这与 LLM 界 pretrained backbone + 下游 head 的分工同构；RecoGEM 则证明生成式推荐的服务栈已经复杂到值得一个专用 runtime-engine 架构，这是个方向走向成熟的标志（正如 LLM 推理引擎之于 LLM）。另一条暗线是可控性：SteerGR 的 SAE 转向和 TriGen 的 dynamic gating 代表两种控制哲学——前者从模型内部表征下手（白盒、可解释），后者从输入条件和解码动力学下手（黑盒、工程友好），殊途同归地指向"生成式推荐不再只能全盘接受模型的输出"。

---

### 二、长尾与可达性：生成式推荐的阿喀琉斯之踵被系统性围剿

#### 代表论文

- [ReSID: Rethinking Long-Tail Retrieval in Generative Recommendation through Item Reachability](https://arxiv.org/abs/2611.16404)（快手系）：首个对生成式推荐长尾可达性做全链路（SID 构造→解码→匹配）分析的工作。关键发现：相同码长下并行 SID 一致优于顺序 SID；解码失败时序列仍携带局部一致信息，可用部分匹配兜底召回。组合流行度去偏 + 语义感知 beam search，SOTA 长尾召回且窄束下延迟更低，已上线服务主流量并开源。
- [ReAlign: Reward-Guided Preference Alignment for Generative Re-Ranking](https://arxiv.org/abs/2611.15445)：打通重排"生成器-评估器"断点——列表级奖励模型（基于生存分析建模曝光 + 多目标价值头）与自回归生成器做奖励引导对齐，生成器终于能看到列表级效用信号。
- [CascadeRec: Deployed Adaptive LLM Compute Allocation for Multi-Tenant Content Recommendation](https://arxiv.org/abs/2611.08566)（IAAI-27 Oral）：LLM 重排的"分级诊疗"——便宜模型处理全部请求，路由器只升级"多花算力可能有用"的请求。反直觉发现：均匀使用贵 LLM 重排会让稀疏历史用户的 NDCG@10 下降高达 30%，收益集中在历史最长的用户段。
- [SAGE-PAIR: Source-Pretrained Routed Residual Adaptation for Sparse-Feedback Recommendation](https://arxiv.org/abs/2611.09728)：冷启动窗口期正样本只占 0.05%~1% 怎么办？先在相邻时段预训练低维残差修正空间，再按用户画像路由专家混合，稀疏反馈只校准残差而非重学模型。毫秒级适配，KuaiSAR-v2 NDCG@10 +1.77%。

#### 横向对比

这组论文合起来读很有意思：它们从四个不同环节攻击同一个结构性问题——**生成式范式的收益天然向头部和长历史用户倾斜**。ReSID 处理"物品端"的长尾（冷门物品生成不出来），CascadeRec 处理"用户端"的稀疏（短历史用户反被 LLM 重排伤害），SAGE-PAIR 处理"时间端"的冷启动（新场景反馈稀疏），ReAlign 则处理"目标端"的错位（token 级似然不等于列表级效用）。四个工作共同的潜台词是：生成式推荐的默认行为是"跟随分布的多数"，而推荐系统的商业价值和社会责任恰恰要求照顾分布的少数。与上周 CAPE 用共现记忆外挂捞长尾的思路相比，ReSID 的进展在于把修复做进了 SID 构造和解码本身（并行 SID + 部分匹配），说明这条管线还在快速进化——长尾问题不会被一次性解决，但"每个环节都有对应的补丁"正在成为共识。

---

### 三、评测方法论的集体觉醒：离线指标到底还能不能信？

#### 代表论文

- [Exploiting Feature-invariant Scaling Laws for Efficient A/B Experimentation](https://arxiv.org/abs/2611.13539)：本周工程价值最高的一篇——发现推荐模型性能增量服从"特征不变"的 scaling 规律，于是用小规模实验 + 统计推断就能带置信区间地预测全量 A/B 效果。在 Wukong、HSTU、LLM 推荐三个模型家族、40+ 种改动上验证，能提前筛掉无效改动，把 Scaling Law 从"训练预判"扩展到"实验决策"。
- [KuaiRecV2: Benchmarking Large-Scale Continual Learning for Diversified and Multi-task Recommendation](https://arxiv.org/abs/2611.16795)（NeurIPS 2026，快手）：针对"离线涨点、线上扑街"放出工业级基准——百万级多模态物品、30 天长期交互、动态候选池，统一 rubric 要求检索精度、多样性、多任务全指标同时改进才算有效进展。
- [INTENT: Out-of-Sample, Out-of-Time, and Cold-Start Evaluation on User Event Sequences](https://arxiv.org/abs/2611.13069)：审计 59 个公开数据集家族只有 5 个合格（最常见缺陷是缺时间戳），按"用户/时期/物品是否见过"切七格评测。扎心发现："无脑复读用户上一个动作"的无参基线在大多数数据集的新物品格子上领先。
- [IntentTwin: Deconfounding Candidate Support and the Oracle-to-Deployment Gap](https://arxiv.org/abs/2611.12918)：掀了 rerank 离线评测的桌子——很多基准把演示动作塞进候选集，只要目标动作不在训练分布、干扰项都在，模型光看"是否在训练分布内"就能答对（SIR 直接 1.0）。提出 support-balanced 候选集修正，平衡后最强 reranker 的 Exact@1 真实水平是 0.72。
- 相邻进展：[Beyond Ranking: Are Decision Models Calibrated Relevance Scorers?](https://arxiv.org/abs/2611.11480)（Jev 类决策模型严重 overconfident，置信度 0.9+ 的文档只有 66% 真相关，但两参数校准即可修复）、[From Counterfactual Edits to Human Narratives](https://arxiv.org/abs/2611.13914)（CIKM 2026，把反事实解释的编辑列表用 LLM+DPO 翻译成人类可读叙事）、[KuaiRecV2 之外](https://arxiv.org/abs/2611.12957)的多模态长文档 agentic 环境与 [Search-by-Answer Bias](https://arxiv.org/abs/2611.11396)（检索模型"按答案搜索"偏置）也值得关注。

#### 横向对比

四篇主打论文恰好构成一张完整的"评测信任危机地图"：**Scaling Law 论文管"实验该怎么做"（小实验能否代表全量），KuaiRecV2 管"基准长什么样"（离线数据能否代表线上），INTENT 管"切分怎么切"（seen/unseen 该分开报告），IntentTwin 管"候选集怎么构造"（离线协议的系统性混淆）**。它们互为印证地指向同一个结论：推荐系统过去十年"离线 benchmark 涨点 → 线上部署"的工作流正在失效，因为离线设置与线上真实分布之间的 gap 已经大到能被无参基线和规则方法利用。对从业者的实际启示是双重的：一是离线结果的汇报应该强制带 seen/unseen 分解（INTENT 协议）；二是实验决策可以更激进地用 scaling 外推代替全量 A/B（省下的算力反过来又能做更多实验）。这波方法论自觉很像当年 NLP 界对 benchmark 过拟合的反思——迟到，但来了。

---

### 四、LLM 推荐的成本工程与 agentic 化：效果之外的新竞争维度

#### 代表论文

- [Slim Foundation Models for Latency-Critical Recommendation Serving](https://arxiv.org/abs/2611.11013)（SlimFM）：反"离线缓存 LLM 输出"的常识而行，把 LLaMA3-8B 依赖感知剪枝 44% 到 4.5B、LoRA field-aware 微调产出字段级语义嵌入，4 数据集 × 6 CTR 骨干保留 99%+ 精度，延迟最高降 3.4 倍——LLM 塞进在线链路的少有正面答案。
- [SimRec: Learning to Search, Ask, and Recommend from Simulated Interaction](https://arxiv.org/abs/2611.15426)（浙大）：推荐智能体的交互策略（搜目录、问用户、改推荐）不再靠人写流程，用 GRPO 端到端训练：任务锚定的用户模拟器 + 全轨迹对齐奖励。4B 小模型打平更大的免训练智能体。
- [SituRecBench: Evaluating Frontier Models as Situated Recommendation Assistants in 3D Environments](https://arxiv.org/abs/2611.10349)（NeurIPS 2026）：把 VLM 扔进高保真 3D 超市，考"边聊天边挖掘偏好、指着货架推荐、把你带到商品跟前"三件事，暴露前沿多模态模型在空间 grounding 上的系统性短板。
- [IntentLens: Grounding Underspecified Multimodal Queries via Tool-Augmented Reasoning](https://arxiv.org/abs/2611.11346)（NeurIPS 2026）：用户拿图说"想要差不多这个感觉的"，先让 MLLM 调工具把模糊需求查清楚再排序，ground-then-rank 两段式在欠规格多模态查询上显著超基线。
- 相邻进展：[Active Learning of Approximate LLM Ranking](https://arxiv.org/abs/2611.16488)（LAAM，长查询 3.3% 能量拿 LLM 87% 的 P@10）、[Yuanbao-Reranker](https://arxiv.org/abs/2611.10405)（腾讯元宝的文档接地合成 + 偏好蒸馏重排）、[CHO-Bench](https://arxiv.org/abs/2611.11955)（上下文提示对 LLM 广告排序公平性的影响）。

#### 横向对比

本周 LLM 推荐论文的关键词悄然从"效果"换成了"**单位成本的效果**"：SlimFM 用剪枝换在线部署资格，LAAM 用主动学习蒸馏 LLM 排序能力，CascadeRec（上文）用级联路由省算力，SimRec 则证明小模型 + 好的训练信号能打平大模型。这批工作与上周 OneLatent/DuoLM/ECHO 的"算力经济学"一脉相承，共同宣告 LLM 推荐进入"降本增效"的深水区。另一条清晰的分界线出现在 agentic 方向：SituRecBench 和 IntentLens 代表"评估与能力"侧——具身推荐、工具调用、模糊需求理解都是新战场；SimRec 代表"训练"侧——交互策略从 prompt 工程转向端到端 RL。两边合起来的信号是：**推荐智能体正在同时补"会做什么"和"做得好不好"两块板子，而 3D 环境与工具增强的引入意味着推荐正在溢出"给一个排序列表"这个延续二十年的交互形态**。

---

### 五、多模态、跨域与 POI：解耦与 agentic 化是共同母题

#### 代表论文

- [LUMIR: Decoupled Multimodal Representation Learning from Heterogeneous Data for Next-POI Recommendation](https://arxiv.org/abs/2611.14004)：多模态表示学习与下游模型解耦——LLM 统一异构数据到共享文本空间 + 交互感知融合 + 序列信号约束，学出的"通用零件"式表示可接任意下游推荐模型，准确率与 beyond-accuracy 双优，代码开源。
- [MPIUR: A Technique to Model Product Information and User Reviews](https://arxiv.org/abs/2611.13361)：把商品描述、图片、用户评论三模态放进统一异构图，协同-语义对齐强度按 item 交互密度自适应——冷门商品更靠语义，热门商品更靠协同。稀疏商品上收益尤其显著。
- [SHARP: Semantic Hierarchical Agentic Reasoning for Next POI Prediction with Dynamic Memory](https://arxiv.org/abs/2611.14220)：POI 推荐的 agentic 分层框架——轨迹记忆 agent 维护动态记忆库、时间感知类别转移图保留被全局聚合抹平的时段规律、先猜类别再定位 POI，还用 RQ-VAE 学语义 ID 做端到端联合优化。三个数据集 Acc@5/10 平均提升 5.29/4.52 个百分点。
- 相邻进展：[Proactive Dimension-Adaptive Denoising for Graph CF](https://arxiv.org/abs/2611.11801)（用表示连贯性而非训练 loss 做主动去噪信号，Amazon-book Recall@5 +17.95%，推理零开销）、[Clinical Evidence-Guided Residual Learning](https://arxiv.org/abs/2611.10613)（医疗推荐的疗效-DDI 平衡）、[Orthogonal Norm Growth in Two-Tower Retrieval](https://arxiv.org/abs/2611.09294)（理论诊断统一搜索推荐中双流更新导致的范数累积型热度偏置）。

#### 横向对比

多模态与 POI 两个子域在本周呈现出同一个母题的两种写法：**表示与使用解耦**。LUMIR 把表示学习从下游模型解耦（一次学习、处处复用），SHARP 把语义推理从 POI 定位解耦（先类别后地点），MPIUR 把对齐强度从全局超参解耦（按商品稀疏度自适应）。这与生成式推荐侧 SepLRM 的"底座-垂域"分层遥相呼应——整个领域都在从"一个模型包打天下"转向"分层解耦、各司其职"。另外值得留意 SHARP 的细节：POI 推荐这个相对传统的子域，如今同时用上了 agentic 推理、动态记忆、时间感知图和语义 ID，几乎是把近两年推荐系统的所有新武器都过了一遍手——传统子域的"新武器化改造"本身可能就是接下来的流量高地。

---

### 六、好奇心、安全与理论：推荐系统目标的重新审视

- [When Does a Recommendation Spark Curiosity? Theory, Measurement, and Field Evidence](https://arxiv.org/abs/2611.14938)（NYU）：把"好奇心"第一次做成推荐系统可算的目标——信息缺口理论形式化为五条公理，推出计算型好奇心度量，问卷验证与用户自报高度一致，亚洲某头部视频平台全量上线后 CTR、播放量、时长全面显著提升。
- [Measuring, Revealing and Mitigating Harmful Content Propagation in Recommender Systems](https://arxiv.org/abs/2611.15160)（IEEE TPAMI）：系统研究推荐系统对有害内容的放大效应——带危害性标注的数据集与指标、实证主流方法确实在助推有害内容扩散、通用缓解框架 MitiHarm 降害不降满意度。
- [Sheaf-Inspired Structured Scoring Extensions of LightGCN](https://arxiv.org/abs/2611.17226)：借鉴代数拓扑 sheaf 思想在 LightGCN 上做结构化打分扩展，诚实标注"排序指标变化不大、且不能证明 sheaf 几何本身的因果收益"——一篇少见的坦率探索性工作。
- [Beyond the Document: Compiled Context and Governed Agents](https://arxiv.org/abs/2611.13055)：提出 Portable Agent Format，把编译上下文作为交付物的一部分。

这组工作的共同点是把推荐系统的目标函数往外推了一步：好奇心论文证明"超越相关性的心理收益"可以被形式化并在线上赚到钱，有害内容传播论文提醒"放大用户兴趣"的同一机制也在放大社会成本，sheaf 打分则示范了负责任的阴性/弱结果该怎么报告。当效果指标的边际收益递减时，目标函数本身的重新设计正在变成新的研究增量。

---

### 📎 本周日刊索引

- [【推荐系统 Paper 日报】2026-11-09](https://km.sankuai.com/md/2796529291)
- [【推荐系统 Paper 日报】2026-11-10](https://km.sankuai.com/md/2797572567)
- [【推荐系统 Paper 日报】2026-11-11](https://km.sankuai.com/md/2797913195)
- [【推荐系统 Paper 日报】2026-11-12](https://km.sankuai.com/md/2798583109)
- [【推荐系统 Paper 日报】2026-11-13](https://km.sankuai.com/md/2797619318)

> 📝 本周报由 arXiv-cs-IR 自动化日报聚合生成，基于每日精选论文进行方向归纳与趋势分析
