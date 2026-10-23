---
title: "【推荐系统 Paper 周报】2026-10-23"
date: 2026-10-23
authors: [wangshuli]
tags: [推荐系统, Paper周报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2793981848"
---

# 【推荐系统 Paper 周报】2026 W43（2026-10-19 ~ 10-23）

## 📊 本周概览

本周共跟踪 arXiv cs.IR 推荐系统相关论文 34 篇，最大的主线毫无悬念仍是**生成式推荐与 Semantic ID**：从天猫的 SID 拓扑保持、Youku 的前缀均衡解码，到长尾遗忘修复 CAPE 和可控生成 ReGen，工业界几乎每天都在往这条管线上补关键拼图。第二条主线是 **LLM 推荐的算力经济学**——OneLatent 把 CoT 压进隐空间（线上收入 +9.6%）、DuoLM 双模型接力（吞吐 60 倍）、ECHO 蒸馏级联（FLOPs 降 160 倍），都在回答同一个问题：怎么让大模型推荐在线上活下来。此外本周 Meta、LinkedIn、快手、淘宝的量产级系统论文密度罕见地高，agentic 推荐与评测治理体系（UserArena、FAIRGate、自动购买边界）开始成型。

---

## 一、生成式推荐与 Semantic ID：从"能不能用"走向"怎么用得久"

### 代表论文

- **[Don't Rewrite the SID Map: Topology Preservation for Generative Retrieval in Dynamic E-Commerce Search](https://arxiv.org/abs/2610.26105)**（天猫）：生成式检索最怕商品上新——一更新 SID 映射，模型学会的"检索路线"就作废。作者用 67 天真实日志把问题量化：beam=1 时 SID 漂移导致 HitRate 暴跌 41.78–62.05%，且大 beam 会掩盖问题。部署军规极简：**新商品只插入、老商品 SID 冻结、warm-start**——老商品召回 +10%、新商品召回 +109%，天猫三周 A/B 实测 GMV +1.16%。
- **[SPAR: Stepwise Personalized Autoregressive Recommendation with Prefix-Balanced Semantic IDs](https://arxiv.org/abs/2610.27898)**（Youku）：同时攻击生成式推荐两个失效模式——解码时每步都用 PATH Decoder 从压缩长期记忆里捞前缀相关证据；构建时用 RQ-PIB 均衡 SID 兄弟分支的流量负载。Youku 10% 流量 A/B：人均观看时长 +3.95%。
- **[Generative Recommenders Forget the Long Tail](https://arxiv.org/abs/2610.29298)**（CAPE）：生成式推荐把长尾商品"忘掉两次"——检索时被 beam search 提前剪枝，排序时被 likelihood 压到底部。CAPE 作为免训练插件，用共现记忆通道在 beam 之外捞回尾部商品，长尾精度显著提升而整体不降。
- **[Controllable Generative Recommendation via Guided Token Refinement](https://arxiv.org/abs/2610.28642)**（ICDM 2026，ReGen）：把自回归逐 token 生成改成 mask-filling 并行迭代修正，控制信号（如多样性）可以直接施加在高语义层级 token 上而无需重训，配合拓扑约束树保证生成结果映射到真实商品。
- **[Structure-Aligned History Learning with Subspace-Structured Semantic IDs](https://arxiv.org/abs/2610.25093)**（SAHL）：编码时建好的"token→子空间→商品"层级直接拿来当历史重建的监督粒度，逼模型从历史中恢复长期偏好，Amazon 四类目 NDCG@10 较 RPG 提升 18.6%–30%。
- **[OneChord: Distill What You Rank, Recommend in One Pass](https://arxiv.org/abs/2610.25805)**：训练原则直白到名字里——"线上怎么排就照着怎么蒸馏"，一次前向同时产出 SID 证据和商品匹配分，六个 Amazon 数据集全面最优还快 1.04–1.18 倍。
- **[Reasoning Reranking with Semantic IDs as the Sole Item Representation](https://arxiv.org/abs/2610.22797)**（ReRankID）：证明只给 LLM 看 SID 码（不给任何文本），经过分级排序奖励的 RL 后训练，8B 模型就能做出媲美"读 20 倍长度文本"的重排。
- **[Neighborhood-Aware Unlearning for Generative Recommendation](https://arxiv.org/abs/2610.27232)**（NAU）：SID token 是共享的，遗忘某个 item 会误伤语义邻居，而全局指标完全看不出来。NAU 显式控制邻域概率质量再分配，保住 95% 以上重训后效用。
- 相邻进展：**[FineSID](https://arxiv.org/abs/2610.29138)**（快手搜索广告，多模态细粒度 SID 渐进学习 CTR）、**[Evolving Semantic Indexes](https://arxiv.org/abs/2610.28568)**（用本地 LLM 进化搜索自动设计 SID 索引）、**[LSNR](https://arxiv.org/abs/2610.23510)**（学稀疏新闻推荐，注意力聚合 + 索引小一个数量级）。

### 横向对比

把本周这几篇放在一起看，会发现一个清晰的信号：**生成式推荐的竞争焦点已经从"模型容量"转移到"码本生命周期管理 + 解码动力学"**。天猫的拓扑保持和 SPAR 的前缀均衡是一枚硬币的两面——前者在更新时保护树不被重写，后者在构建时让流量均匀分布在树上；再加上 NAU 处理的"遗忘"问题，SID 的**构建—更新—遗忘全生命周期**正在独立成一个子领域。另一条暗线是推理侧的成本压缩：ReRankID 证明重排可以完全甩掉长文本 prompt，OneChord 把 refinement 蒸馏进单次前向——"最后一公里"的竞争已经从效果转向**单位算力效果**。值得警惕的是 CAPE 揭示的结构性短板：beam search 按子树概率质量剪枝，天然歧视长尾，这不是加大 beam 能解决的（实验已验证收效甚微），需要共现记忆这种外挂通道来补——协同过滤的"死记硬背"能力在大模型时代依然是刚需。

---

## 二、LLM+推荐的算力经济学：隐空间推理与蒸馏接力

### 代表论文

- **[OneLatent: Latent Reasoning for Efficient Foundation Recommendation Models](https://arxiv.org/abs/2610.30675)**（快手）：LLM 推荐底座的 CoT 很准但线上扛不住，OneLatent 把显式 CoT 压缩成可学习的 latent token，在隐空间里"思考"完全不吐字。SID@64 比显式 CoT 高 17.44%、推理吞吐提升 17 倍以上；线上 A/B 在快手本地生活广告场景实测**收入 +9.6%**，超越自家上一代 OneRec 和 OneReason。
- **[DuoLM: Fast and Effective Personalized Recommendation with Language Models](https://arxiv.org/abs/2610.24481)**：双模型接力——encoder LLM 离线压缩商品表示，个性化 ranker LLM 在线打分，配合虚拟 token、共享历史计算、CUDA Graph，单张 H100 每秒打 2.64 万个候选分，是 vLLM 部署教师模型的 60 倍吞吐。
- **[ECHO: Efficient Cascade with Homogeneous Operators for Distillation-Guided 100K-Sequence Modeling](https://arxiv.org/abs/2610.28569)**（快手）：10 万条用户终身行为的建模方案——蒸馏筛选器先粗筛、目标感知检索器再精捞，且级联各环节共享同一套相关性参数保证口径一致。序列分支 FLOPs 降约 160 倍，线上 App 时长 +0.613%。
- **[Think Harder Where It Matters](https://arxiv.org/abs/2610.30128)**（LoopRec）：序列推荐不必对每个商品花同样算力——权重共享的递归 block 在每个边界用轻量 gate 做"退出或继续"的逐 item 决策，学到的模式可解释：低频 item 和更近的交互自然获得更深的计算。
- **[Decision4Rec](https://arxiv.org/abs/2610.26035)**：不生成文本、直接输出选项概率的决策模型（Jev 系）进推荐系统，4B 决策模型在稀疏 Amazon 数据集上 NDCG@10 超最强基线 25%–36%，迁移到没见过的 MovieLens 还能涨。
- **[Expert-Guided Rubrics as Dense Reward Signals](https://arxiv.org/abs/2610.26932)**：query 改写这种"好不好没法自动打分"的场景，把少量专家评分固化成 rubric 拼成稠密混合奖励，解决 GRPO 组内同分梯度归零问题，Recall@3 +6%。

### 横向对比

这批工作共享一个哲学：**LLM 推荐的增益不再来自更大的模型，而来自"把算力花在对的地方"的结构设计**。OneLatent 和 LoopRec 都在做"按需思考"——一个把思考搬进隐空间省掉输出 token，一个按 item 分配计算深度省层数；ECHO 和 DuoLM 则是"蒸馏 + 分工"路线在序列建模和打分两个环节的镜像。更值得玩味的是 OneLatent 的 A/B 细节：它击败的是自家已经量产的 OneRec/OneReason，说明**隐空间推理不是学术玩具，而是相对显式 CoT 的帕累托改进**（效果更高、吞吐更高）。对预算有限的团队，DuoLM 的"离线蒸馏、在线轻量化"和 ECHO 的"级联共享参数"是两种可以直接抄的工程范式。

---

## 三、工业系统密集输出：Meta、LinkedIn、快手、淘宝的量产经验

### 代表论文

- **[MAPS: Multi-Agent Personalized Script-Driven Video Advertising](https://arxiv.org/abs/2610.25748)**（快手）：从"挑一个现成广告"到"现场编一个"——画像、脚本、合成、迭代四个智能体闭环，RL 训练脚本智能体。真实 A/B：CTR +2.87%、ARPU **+9.85%**，是 agentic advertising 少有的完整线上落地案例。
- **[Baseline and Incremental: User, Item, and Request Debiasing in Instagram Feed Ranking](https://arxiv.org/abs/2610.27423)**（Meta/Instagram）：学界主流把"基线"当噪声去掉，Instagram 的实战结论相反——**两个都要**。"原始预测 + 单独加权增量项"的双项设计在 13 组对比赢 11 组，已在生产环境跑大半年并被推广到全公司多个场景，直接拉动 DAU 和会话数。
- **[PAIR: Preference-Aligned Intent Retrieval at LinkedIn](https://arxiv.org/abs/2610.30941)**：职业社交推荐的反直觉事实——"长得像你的人"往往不是"对你有用的人"（求职者想联系的是招聘者）。PAIR 直接学意图偏好对齐，用户表示可常数代价增量更新，0.6B 小模型 MAR@100 达 0.45。
- **[MOSS: A Production Framework for Monitoring Semantic Failures](https://arxiv.org/abs/2610.26902)**：把 LLM 打分嵌进搜推持续监控闭环（定向采样 + 策略感知 prompt + 结构化告警 + 归因追问），在某大型零售商跑了 6 个月，真抓出过两个线上缺陷。
- **[UserArena: Benchmarking Interactive User Simulation for Long-Horizon Shopping Agents](https://arxiv.org/abs/2610.30932)**（淘宝/莱顿）：agentic recommendation 的重量级基准——11,010 个真实用户、64,729 条会话轨迹、566,102 个商品，最难得的是支持**用生产环境真实 A/B 结果做离线校验**，模拟器里的结论可以放心外推到线上。

### 横向对比

Meta 的"基线+增量都别扔"与 LinkedIn 的"互补而非相似"本质上在纠偏同一个惯性：**把协同信号（相似性、热度基线）要么当噪声、要么当全部**。两篇都来自超大规模生产环境，结论却都指向"信号分解比信号取舍更重要"。另一组有趣的对照是 MAPS 与 UserArena——一攻一守：前者展示 agentic 生成式广告能真金白银地赚钱（ARPU +9.85%），后者提醒这类系统的评测地基还远没打好，静态数据集评不了多轮交互的 agent。agentic 推荐的商业价值和工程护栏正在同周出现，这个方向的工业化速度比预期快。

---

## 四、跨域与多模态：迁移量应该因人而异

- **[Persona-Guided Cross-Domain Sequential Recommendation](https://arxiv.org/abs/2610.25221)**（PerCDR）：发现 LLM 全局语义跨域桥接经常失效——商品语义其实是域内专属的。解法是换分工："语义做域内、人设做跨域"，用 LLM 推断的用户人设引导行为模式迁移。
- **[Bezier-Guided Adaptive Flow for Cross-domain Sequential Recommendation](https://arxiv.org/abs/2610.30825)**（BGAFlow）：有人购物和刷视频兴趣高度重合、有人完全是两个人，所以用贝塞尔曲线做几何参照，按用户单独估算"该迁移多少"，残差流平滑调整语义轨迹。
- **[Multimodal Decoupling for Diversified Recommendation](https://arxiv.org/abs/2610.26024)**（MOSS）：多模态大模型拆干净内容特征 + 交替双图传播防表征塌缩 + 熵正则均衡类目曝光，准确率-多样性平衡显著优于强基线。
- 相邻：**[CATH](https://arxiv.org/abs/2610.25801)**（缺失模态 POI 推荐，超图组织异构 LLM 智能体分工，还把算力成本算进优化目标）、**[SOAR](https://arxiv.org/abs/2610.29556)**（社交网络 + 评论情感双信号 POI 推荐）。

PerCDR 和 BGAFlow 在同一天隔日给出了相同结论：**跨域迁移量应该 per-user 而不是全局对齐**。更值得注意的是 LLM 在其中的角色变化——从"语义桥梁"降级为"画像/先验提供者"，桥接本身交还给行为建模。这与本周其他方向的趋势一致：LLM 的价值在于它知道"你是什么样的人"，而不是它认识"每个商品是什么"。

---

## 五、评测、公平性与安全边界：治理体系开始闭环

- **[QD-Rec: Open-Ended Evolution of Recommendations via Quality-Diversity](https://arxiv.org/abs/2610.23470)**：把推荐输出从"排序列表"扩展到"带自然语言理由的选项集"，用 Quality-Diversity 存档做开放式进化，面向并购、客户定向等高风险决策场景。
- **[Robustness Analysis of Pareto-based Joint Evaluation of Fairness and Relevance](https://arxiv.org/abs/2610.27850)**（DPFR，ACM TORS）：在"相关性-公平性"平面上画帕累托前沿、以离前沿距离作为联合分数——现有指标和 DPFR 结论并不一致，说明老指标可能不可靠。
- **[FAIRGate: Agentic Runtime Policy Selection and Verified Repair](https://arxiv.org/abs/2610.30359)**：agent 层只负责**从预定义策略库选公平策略**，执行交给确定性约束修复器，校验器验证全部通过才放行——"agent 只选择、不执行"是 agentic 系统安全架构的范本。
- **[Preference Is Not Permission: Personalizing the Auto-Purchase Line in Agentic Commerce](https://arxiv.org/abs/2610.29216)**：购物 agent 该"自作主张"到什么程度？发现现有模型普遍激进（证据不足也敢下单），而每个人的边界用 30–40 条个人标注就能学到 0.79 中位精度，优于所有 prompt×模型组合。
- **[Candidate-dependent residual routing](https://arxiv.org/abs/2610.24200)**：本周罕见的高严谨阴性结果——候选依赖路由对聚合指标几乎零影响，拆开看是"头部精度换尾部召回"两个效应互相抵消，提示路由机制评估需要位置级分解。

把这一组放在一起，能看到评测正在从"指标"走向"治理"：DPFR 管模型选型、MOSS 管线上语义质量、UserArena 管 agent 行为保真度、FAIRGate 管投递公平，整条链路开始闭环。FAIRGate 与自动购买边界两篇共同指向同一原则：**agent 的自由度必须被结构化约束（策略库 + 确定性执行）和个体校准（用户边界）双重限制**。另外要为 candidate-dependent routing 这样的阴性结果点赞——"平均指标没动"掩盖的位置级 trade-off，比十个正向结果更有信息量。

---

## 📎 本周日刊索引

- [【推荐系统 Paper 日报】2026-10-19](https://km.sankuai.com/collabpage/2792941042)
- [【推荐系统 Paper 日报】2026-10-20](https://km.sankuai.com/collabpage/2793501987)
- [【推荐系统 Paper 日报】2026-10-21](https://km.sankuai.com/collabpage/2793225086)
- [【推荐系统 Paper 日报】2026-10-22](https://km.sankuai.com/collabpage/2793625196)
- [【推荐系统 Paper 日报】2026-10-23](https://km.sankuai.com/collabpage/2793667055)
