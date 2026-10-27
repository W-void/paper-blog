---
title: "【推荐系统 Paper 日报】2026-10-27"
date: 2026-10-27
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2794803299"
---

# 【推荐系统 Paper 日报】2026-10-27

## 📊 今日概览

今天是 arXiv cs.IR 的丰收日：2026-10-27 公告共 **47 篇**论文，其中推荐系统及相关方向（含 CTR 预估、个性化检索）多达 **13 篇**，堪称近期最密集的一天。亮点集中在三条线：一是**推荐系统理论反思**——同一个团队一天连发两篇，从"幻影相关性"角度质疑共现相似度的根基；二是**生成式推荐**持续火热，扩散模型、循环深度、语义 ID 各有新打法；三是 **LLM Agent 与推荐的融合**出现了反向输出——把记忆选择建模成推荐问题，很有意思。

## 🔥 推荐系统论文深度解读

### 1. Do Similarity Measures Measure Similarity? How User Activity Creates Phantom Correlation in Recommender Systems

📄 [arXiv:2610.35765](https://arxiv.org/abs/2610.35765) | 11 pages | Marco Favier, Noah Daniëls, Jens Leysen, Sander Marinus, Bart Goethals

**🗣️ 大白话：** 协同过滤的祖传假设是"两个人买了同样的东西，说明这两样东西相似"。但这篇论文泼了盆冷水：哪怕每个用户买东西完全随机、毫无偏好可言，只要用户之间买东西的**数量**不一样多，标准的相似度指标照样能算出"强关联"。作者把这种纯由活跃度差异制造的假相关命名为**幻影相关性（phantom correlation）**——你算出来的 item 相似度，可能一大半只是"有人特别能剁手"的副产品。

**🔬 专业讲解：** 作者从最小形式化假设出发，证明独立消费叠加异质活跃度恰好等价于一个 Rasch 模型，并推导出每类相似度度量下关联强度随 item 流行度的依赖关系。将这个理论零假设基线与真实 benchmark 数据集对比，可以量化主流相似度度量（cosine、co-occurrence 等）中有多大比例是幻影成分。这对协同过滤的解读和设计都有实质影响：item 共现不能直接等同于共享偏好，去偏（de-biasing user activity）应当成为相似度计算的前置步骤。理论功底扎实，是那种"返璞归真"式的好工作。

---

### 2. Theoretically Sound Item Similarity Measures for Recommender Systems

📄 [arXiv:2610.34402](https://arxiv.org/abs/2610.34402) | Noah Daniëls, Joey De Pauw, Bart Goethals

**🗣️ 大白话：** 还是安特卫普这个团队（Bart Goethals 组今天连发两篇）。 neighborhood-based 协同过滤里用的 item 相似度公式，大多是几十年攒下来的"土办法"——好用，但没人说得清为什么好用。这篇干脆从概率建模和参数估计出发，把相似度设计变成一个有原则的推导过程，顺手挖出了两个被埋没的度量（基于 Bernoulli 和多项分布），还证明了大名鼎鼎的 cosine 相似度其实是某个特定优化问题的解——老江湖第一次拿到了"理论户口"。

**🔬 专业讲解：** 论文的核心贡献是把 item-item 相似度统一到概率视角：对共现矩阵做显式的分布假设与参数估计，而非启发式定义。消融实验系统性地检验了四个关键因素：偏差项（bias）的处理、概率平滑（probabilistic smoothing）、对"未知"共现的正确建模（区别于零共现）、以及分布族的选择。结果表明这些细节对最终相似度质量影响显著，而两个从 Bernoulli/多项分布推导出的新度量在实验中具备竞争力。与上一篇（phantom correlation）互为表里：一篇诊断现有度量的病灶，一篇给出从分布出发的建法，建议连读。

---

### 3. Agent Memory as Recommendation: Recommender-System Design for Long-Term Memory of LLM Agents

📄 [arXiv:2610.34673](https://arxiv.org/abs/2610.34673) | 12 pages | Xinyu Zhang, Weiwei Sun

**🗣️ 大白话：** 视角反转的神来之笔：现在大家都在用 LLM 帮推荐系统，这篇反着来——用推荐系统的方法去解决 LLM Agent 的长期记忆问题。Agent 跨会话服务用户时，每次请求只能把几条记忆塞进有限的上下文窗口，选哪几条直接决定回答对不对。作者把这个选择形式化成"带预算的 slate 推荐"：请求是用户、存储的记忆是 item、上下文窗口是 slate——推荐系统几十年的老手艺（召回→排序→组 slate）直接搬过来用。

**🔬 专业讲解：** 在这个形式化下，作者把准确率分解到级联的每个阶段所控制的 completeness（完备性：slate 是否装下了回答所需的全部证据），并据此设计 AgentMemRec：候选生成、learning to rank、slate 构造全流程零 LLM 调用。在 LongMemEval 多会话问题上超过 A-Mem、HippoRAG 2、Mem0、Zep 等一众记忆方法 10~31 个点；在 LoCoMo 上甚至不需要写入口的 LLM 调用。它还能以 3.2 倍低的成本打平每查询 64 次 LLM 调用的 reranker。分解分析显示收益主要来自 slate 更常完整地包含全部证据。对做 Agent 记忆系统的人来说，这篇提供了少见的设计空间统一视角。

---

### 4. Cross-Domain Sequential Recommendation with Representation-Level User Transfer

📄 [arXiv:2610.35550](https://arxiv.org/abs/2610.35550) | CIKM'26 Full Paper | Abdulaziz Samra, Nikita Sukhorukov, Alexey Grishanov, Alexey Vasilev, Evgeny Frolov

**🗣️ 大白话：** 跨域序列推荐的落地痛点：一方面各业务方的数据是隔离的（不能把原始行为数据直接拉通），另一方面大量用户根本没有跨域行为。这篇的解法很"工程友好"：跨域只传**用户表示**——用一个轻量 adapter 把源域的用户向量投影到目标域的 embedding 空间，拼进目标域的序列里。用户在源域没数据？模型自动退化为纯目标域序列推荐，毫无压力。

**🔬 专业讲解：** 关键设计是迁移发生在 representation level 而非 data 或 item embedding level，规避了跨域 ID 空间对齐和原始数据合规问题。joint training 使共享用户与未共享用户都能受益：共享用户获得跨域兴趣注入，未共享用户仍享受多域数据共同训练带来的表征质量提升。实验覆盖 benchmark 对比和更贴近工业的可扩展两种 setup，两类用户均有一致增益。CIKM'26 full paper，实用主义路线的优秀范例。

---

### 5. Unified Heterogeneous Feature Interaction via Effective-Rank Scaling for Recommender Systems

📄 [arXiv:2610.35318](https://arxiv.org/abs/2610.35318) | 9 pages | Ao Zhang, Haochuan Li, Boya Du, Jian Yang, Qihang Fang, Yulin Xu

**🗣️ 大白话：** 一篇工业味很浓的排序模型论文。现状是序列特征和行为/上下文特征各用各的模块，信息只能单向流动；硬把所有 token 塞进一个 self-attention 又低效，因为序列和非序列特征的有效秩（effective rank）天然不同。HiRank 用门控序列注意力 + 有效秩缩放把它们统一到一个 backbone 里双向融合，再做场景感知聚合避免多场景负迁移。线上 A/B：**每用户订单量 +2.27%**。

**🔬 专业讲解：** 技术亮点有三：(1) 有效秩视角为"为什么异质特征不该用同构 attention"提供了量化依据——不同信息密度的 token 混在一起会让高阶交互效率低下；(2) 场景感知聚合把异质低阶 token 压缩成紧凑表示，再通过可学习投影生成场景感知的复合 token，使全局视图信息密度更均匀，高阶 self-attention 才有的放矢；(3) 参数规模上表现出良好的 scaling 行为。对做多场景多任务工业排序的同学，这套"按有效秩组织异质特征交互"的思路值得借鉴。

---

### 6. DPE-Rec: Diversity-Preserving and Efficient Diffusion Language Model Recommendation for Bundle Construction

📄 [arXiv:2610.34700](https://arxiv.org/abs/2610.34700) | Pingchuan Ma, Bohan Jiang, Chengshuai Zhao, Dawei Li, Zhen Tan, Huan Liu

**🗣️ 大白话：** 套装（bundle）推荐本质是"补全一个没买完的组合"，天然无序—— diffusion LLM 的双向注意力恰好对无序生成有先验优势。但直接用有两个坑：置信度引导的解码会把"语义分叉"的决策拖到最后，伤害多样性；一步出太多 token 又伤质量。DPE-Rec 用"语义分叉感知的 GRPO"保多样性，用"伪轨迹蒸馏"把学习聚焦到高质量解码实际走过的子空间，换来可靠的多 token 一步解码。结果：推荐性能平均 +63%，快版推理平均快 25.6 倍。

**🔬 专业讲解：** 两个组件的定位很清晰：semantic-fork-aware GRPO 通过自回归 rollout 优先对语义分叉决策给予奖励信号，避免 refinement token 过早约束组合空间；pseudo-trajectory distillation 将随机 corruption 空间的学习压缩到紧凑的轨迹诱导子空间，从而支持多 token 并行揭示而不掉点。这是 diffusion LLM 在推荐场景里第一批认真处理"解码动力学与推荐质量权衡"的工作，对生成式推荐的解码策略研究有参考价值。

---

### 7. Decision-Native Recommendation with Large Language Models

📄 [arXiv:2610.34124](https://arxiv.org/abs/2610.34124) | 12 pages | Daoxuan Liu, Jiayi Liao, Jiancan Wu, An Zhang, Xiang Wang, Xiangnan He

**🗣️ 大白话：** 生成式推荐的老毛病：LLM 输出的是文本，可能对不上任何一个候选 item、对候选顺序敏感、还不知道自己有多大把握。这篇提出"决策原生推荐"新范式：直接在给定候选上做 item 选择 + 输出校准的置信度。DICE 方法在树结构注意力下一次前向完成所有候选打分（候选乱序结果不变），top-1 准确率超所有 baseline，比生成式方法端到端快约 6 倍，置信度还能用于选择性推荐和按置信度分配算力。

**🔬 专业讲解：** 技术核心是 Direct Item Choice Estimation：从交互历史学习候选集上的个性化 next-item 分布，配合树结构注意力在孤立候选分支间共享历史计算，实现顺序一致的单次前向打分。三大约束（有效候选选择、重排序一致性、置信度校准）构成了对"决策原生"范式的可验证定义。选择性推荐实验说明校准置信度有实际 downstream 价值（低置信样本离线路由补算）。思路与生成式路线形成互补，可能启发更多"LLM 表征 + 判别式决策头"的工作。

---

### 8. CRIM: Composable and Reusable Item Memory for Efficient Personalized Retrieval

📄 [arXiv:2610.35323](https://arxiv.org/abs/2610.35323) | Haolin Li, Haipeng Zhang, Mang Li, Zhaohui Xia, Xun Zhu, Miao Li, Yu Zhang, Ji Wu

**🗣️ 大白话：** 用 LLM 做个性化检索/推荐的隐藏成本：用户历史越长，prompt 越长，同样的 item 文本被反复编码。CRIM 的思路是把"item 语义编码"和"请求级历史建模"解耦：每个 item 用少量可学习 summary token 压成紧凑的连续记忆，**与用户和 query 无关，可以跨请求缓存复用**；推理时按交互顺序拼装缓存记忆即可。配合"少量 item 现场重编码"的联合训练机制，在 MovieLens-1M 等数据集上达到 SOTA 检索效果，同时推理成本显著降低。

**🔬 专业讲解：** 工程价值在于把 KV 侧的重复计算摊销掉：item memory 一次编码、多次组合，request-dependent 的上下文建模只发生在记忆拼装层。REC token 在历史段内引入预测监督，缓解纯缓存导致的表征僵化；cached + sampled live re-encoding 的混合训练让 item/request 两个编码器都能被检索目标持续优化，周期性 cache refresh 维持一致性。新发布的 LazSeq 数据集也值得留意。

---

### 9. LoopGR: Parameter-Efficient Scaling for Generative Recommendation via Recurrent Depth

📄 [arXiv:2610.34157](https://arxiv.org/abs/2610.34157) | Huizhe Zhang, Yudong Li, Liang Chen, Chengxiang Zhuo, Zang Li

**🗣️ 大白话：** 生成式推荐想吃 scaling 红利，但模型太大、推理太贵都不行。LoopGR 给出第三条路：不加宽不加深"层数"，而是加**循环深度**——共享的生成解码器和轻量上下文更新器交替循环，参数不涨、计算深度涨。推理时用"循环轨迹自蒸馏"从高预算教师蒸馏出低预算学生（对齐预测分布和演化方向）。相比代表性 encoder-decoder baseline，性能更强的同时模型体积最多省 52%。

**🔬 专业讲解：** 核心洞察是把"计算深度"从"参数量"中解耦，recurrent depth 成为生成式推荐新的 scaling 维度。分层循环设计中 shared decoder 承载用户-物品交互历史的表达性建模，轻量 context updater 负责逐轮状态更新；蒸馏阶段同时约束预测分布与 hidden state 演化方向（evolution direction），保证低预算推理不偏离高预算的迭代动力学。对推理成本敏感的工业生成式推荐系统，这是一条务实的扩容路径。

---

### 10. MIDA: Multi-Interest Decoding with Adaptive Aggregation for Session-based Recommendation

📄 [arXiv:2610.34192](https://arxiv.org/abs/2610.34192) | IEEE TKDE | Linjiang Guo, Nitin Bisht, Shiqing Wu, Guandong Xu

**🗣️ 大白话：** 有个反直觉的观察：会话推荐模型在历史更长时反而表现变差——解码器太偏心最近的 item，远处的语义相关交互被浪费了。MIDA 作为轻量的编码器无关框架，在解码端做两件事：在**原始 item embedding** 上做可微多兴趣聚类（不让编码器的偏好扭曲语义结构），再用一个由平均聚类大小条件化的门控融合"稳定性/可塑性"两条分支。多个 benchmark 上稳定超越 SOTA。

**🔬 专业讲解：** 设计哲学是 two-space decoupling：聚类语义结构保留在 raw embedding 空间（编码器学到的关系偏置会污染聚类几何），序列上下文信息则保留在 encoder 输出空间用于聚合。gate 以 average cluster size 为条件，让聚类结构直接决定聚合行为，形成跨阶段的结构耦合。这个解耦思路对所有"先表征后聚类/检索"的多兴趣方法都有普适参考价值。

---

### 11. Towards a Unified Framework of Optimal Input-Side Dimensional Configuration for Deep CTR Prediction

📄 [arXiv:2610.35695](https://arxiv.org/abs/2610.35695) | 13 pages | Chaohua Yang, Fuyuan Lyu, Xing Tang, Dugang Liu, Xiuqiang He, Zhong Ming

**🗣️ 大白话：** CTR 模型的性能不只取决于特征交互结构，还取决于交互之前"输入侧怎么配"——选哪些样本、哪些特征、哪些 embedding 单元。以往工作都是在这三个维度上各选各的，互相不知道对方的存在。OptIDC 把样本/特征/embedding 单元三个层级的选择统一到一个框架里联合学习，再用 selection-weighted Optimal Transport 对齐粗细粒度的选择决策，避免跨层级"打架"。模型无关，四个数据集上 AUC 稳定更高。

**🔬 专业讲解：** 方法论上，论文观察到三个输入维度的选择机制共享同一基本形式，独立优化忽略了跨层依赖。OptIDC 的关键创新是选择加权 OT 机制：通过有限测度上的传输对齐粗粒度（样本级）与细粒度（embedding 单元级）选择，显式缓解跨层级冲突同时保留各层级语义。作为 model-agnostic 插件可接入现有 CTR 模型，工程接入成本低。

---

### 12. Discovering Topics from Linear Autoencoders

📄 [arXiv:2610.34739](https://arxiv.org/abs/2610.34739) | 12 pages | Jutiyakhun Srisoparp, Donlapark Ponnoprat

**🗣️ 大白话：** 线性推荐器和主题模型都在偷偷学"共现"，但很少有人研究这两家人是什么关系。这篇证明：在隐因子模型假设下，闭式解线性自编码器的权重矩阵里就藏着主题——不用额外训练，直接从训练好的推荐器里"白嫖"出可解释的主题，用来解释推荐结果。还提出了新的 item/user 归一化，防止热门 item 和超活跃用户霸占主题。六个数据集上主题质量超过所有专门的主题模型。

**🔬 专业讲解：** 理论贡献是建立了线性推荐器（closed-form linear autoencoder）与 LDA 类主题模型的显式联系：共现结构下的隐因子等价于自编码器权重矩阵的特定分解。归一化设计针对流行度偏置（popular items / very active users dominating topics），与今天同一批次的 phantom correlation 论文形成呼应——活跃度/流行度偏差是本周理论线的共同敌人。推荐性能与调参后的最佳线性推荐器持平，属于"免费可解释性"的高性价比工作。

---

### 13. How Much Fresh Data Should CTR Recalibration Use? A Temporal Evaluation of Post-hoc Calibration

📄 [arXiv:2610.33168](https://arxiv.org/abs/2610.33168) | 10 pages | Rui Liu

**🗣️ 大白话：** CTR 模型上线后，下游系统消费的是校准过的概率，但校准器的评估却还在用随机切分——这在时间序列场景是自欺欺人。这篇在 Avazu 4000 万曝光上做了非常严谨的滚动时间实验，结论出乎意料：**校准器不是数据越新鲜越好**——6 小时的切片在约三分之一的场景反而让校准变差，12 小时的切片把伤害从 13-17 例降到 3-5 例，且把 12 小时切片降采样到 1 小时的数据量（拟合快 20-25 倍）仍能保留 88% 的收益。别再迷信"最新鲜的数据"了。

**🔬 专业讲解：** 实验设计是本文最大亮点：两个滚动时间 origin + 随机切分对照，三种子，Platt scaling 和 isotonic regression 双校准器，逐测试天重拟合。关键发现：(1) 随机切分会把 LR 的 ECE 低估到时间切分的 55-62%，且 ECE 不随时间距离单调；(2) 存在最优切片宽度而非单调收益，印象量本身不能解释宽切片优势（降采样实验证明）；(3) slice-ECE 门控跨 origin 无泛化收益，模拟拍卖中校准对利润的影响仅 -0.21%~+0.26%。对工业校准管道的 fitting 窗口选择给出了直接的实证指引。

---

## 📋 其他论文速览

- **ACARE: Agent-Context-Aware Reranker for Iterative Search**（arXiv:2610.35840）：为迭代式搜索设计的 Agent 上下文感知重排器。
- **SLIDE: Search-to-List Item Distillation for Single-Rollout Generative Retrieval**（arXiv:2610.34764）：搜索到列表的 item 蒸馏，单次 rollout 完成生成式检索。
- **Octen-WebGR: Scaling Generative Retrieval to 200 Million Web Pages**（arXiv:2610.35256）：把生成式检索 scale 到 2 亿网页的工程实践。
- **PinGER: Token-Efficient Generative Retrieval with Semantic IDs**（arXiv:2610.33435）：基于语义 ID 的 token 高效生成式检索。
- **LoopGR 之外的生成式推荐补充——CRIM 已解读**：个性化检索的记忆复用思路与语义 ID 检索殊途同归。
- **SkillQR: Agentic Skill Discovery for Reason-Intensive Query Rewriting**（arXiv:2610.33768）：面向推理密集型 query 改写的 Agent 技能发现。
- **CA-HNM: Constraint-Aware Hard Negative Mining for Dense Retrieval**（arXiv:2610.35045）：用结构化领域模型约束的难负例挖掘。
- **Useful Diversity or Hallucinated Variety? Persona-Conditioned Synthetic Query Generation for E-Commerce Search**（arXiv:2610.35102）：追问电商搜索合成 query 的多样性是真多样还是幻觉。
- **When Fusion Order Matters: Insights on Progressive Multimodal Representation Learning for Cross-modal Retrieval**（arXiv:2610.35125）：跨模态检索中渐进式融合顺序的影响分析。
- **Hallucination-Aware Multi-Agent RAG via Internal Attention Rewards**（arXiv:2610.35056）：用内部注意力奖励做幻觉感知的多 Agent RAG。
- **Reinforcement Learning for Controller Parameters in the Auto-Bidding System at Pinterest**（arXiv:2610.33248）：Pinterest 自动出价系统的控制器参数强化学习，广告工程向。
- **Lessons from Luck: Do LLM-Written Lessons Carry Chance into an Agent's Next Decision?**（arXiv:2610.33029）：追问 Agent 自我反思笔记里的"运气"会不会污染后续决策。
