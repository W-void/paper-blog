---
title: "【推荐系统 Paper 日报】2026-09-29"
date: 2026-09-29
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2789884201"
---

# 【推荐系统 Paper 日报】2026-09-29

## 📊 今日概览

今天 arXiv cs.IR 周二更新（公告日期 2026-09-29），共 55 篇论文，其中推荐系统相关约 34 篇。今天是"生成式推荐 + 评测方法论"双主场：SPRINT 把生成式推荐压到单次前向传播、OneTrans-V2 用一个 Transformer 统一召回/粗排/精排全线涨 GMV，而 CIKM oral 的 Recall Ceiling 论文则给 LLM reranker 泼了一盆冷水——oracle 评测把 NDCG 高估了 92%-95%。另外 FRAME@RecSys 方法论专场（tie 处理、claim 校准）和工业界四连发（AgentX、YouTube Shorts、Kuaishou、腾讯）也值得细品。

## 🔥 推荐系统论文深度解读

### 1. SPRINT: Single-Step Generative Recommendation via Average Probability Velocity

📄 [arXiv:2609.34306](https://arxiv.org/abs/2609.34306) | Zhuo Cai, Shoujin Wang, Peilin Zhou, Min Xu, Julian McAuley, Fang Chen

**🗣️ 大白话：** 语义 ID（SID）生成式推荐现在要一个 token 一个 token 地吐（或者并行吐完再反复修正），线上延迟根本扛不住。这篇论文问：能不能一次前向传播直接把整个 item 生成出来？答案是能——只要别追生成"过程"，直接学每个位置 token 的最终概率就行。速度比最快的 AR/NAR 方法快 8-10 倍，精度还平均高出 7.77%。

**🔬 专业讲解：** 作者提出 average probability velocity 视角：将 SID 生成视为 token 生成概率的流动过程，证明其平均速度完全由各 token 的平均生成概率决定，因此可用双向 Transformer 在单次前向中直接参数化全部 token 概率。由于各位置概率独立生成会丢失 token 间一致性，进一步设计 dual-level flow contrastive objective：token 级把目标 SID 各 token 的生成概率排到负样本之上，SID 级将整个 SID 的 token 打分作为整体以捕获物品级 token 一致性。实验上相对第二快的 AR/NAR 方法取得 8.39-10.04× 加速和 7.77% 平均精度提升，对延迟敏感的在线推荐场景极具落地价值。

---

### 2. The Recall Ceiling of LLM Recommendation Reranking

📄 [arXiv:2609.27953](https://arxiv.org/abs/2609.27953) | CIKM 2026 (Oral) | Zhaohui Wang

**🗣️ 大白话：** 很多 LLM 推荐重排论文的评测有个隐藏外挂：把正确答案偷偷塞进候选集里再打分。这篇论文一算账：这种 oracle 协议把 NDCG@10 高估了 92%-95%。根因是"召回天花板"——真实检索在 K=100 时只覆盖 2%-19% 的相关物品，重排器再强也翻不出候选集的天。低召回场景下，与其卷重排器，不如卷召回。

**🔬 专业讲解：** 论文证明在 leave-one-out 评测下 E[NDCG@k] ≤ Recall@|W_π|（W_π 为重排器候选窗口），召回率构成闭式候选重排的确定性上界。系统性实验中，prompt 工程、168× 参数规模缩放、序列模型、监督神经重排器、LoRA 微调、混合检索、score-aware prompting、LLM+CF 融合——在真实检索条件下没有任何一种策略显著超过 CF 基线；给上游 CF 分数只会让 LLM 复现 CF 的排序。作者据此提出 RAEP（Recall-Aware Evaluation Protocol）：先判定召回率区间，再在允许有效区分的位置评测重排。这篇是给"LLM reranker 刷榜研究"的一记方法论警钟，也解释了为什么很多离线好看的 reranker 上线没用。

---

### 3. OneTrans-V2: Unifying Retrieval, Pre-rank, and Fine-rank with One Transformer in Industrial Recommender

📄 [arXiv:2609.28589](https://arxiv.org/abs/2609.28589) | 快手 | Hannan Cao, Jun Guo, et al.

**🗣️ 大白话：** 工业推荐系统是召回→粗排→精排三层流水线，三套模型各自为政，用户行为序列要被重复编码三遍。OneTrans-V2 直接用一个 Transformer 把三层全包了：序列只编码一次、三段互相蒸馏、MoE 扩容、还能用"决策前缀"把业务目标注入同一个生成式过程。结果：GMV +9.74%，同硬件预算下吞吐是原级联的 3.2 倍。

**🔬 专业讲解：** 在 OneTrans 模型级统一的基础上，V2 做了四件事：1) 用户行为序列编码一次作为共享上下文，保留各阶段专属候选特征与计算；2) 联合训练 + fine-rank 到 pre-rank 的 in-model 知识蒸馏；3) 稀疏 MoE 扩容共享骨干并以 μP 参数化稳定 scaling；4) DCGR（Decision-Conditioned Generative Retrieval）预测即将到来的交互的决策前缀并以此为条件生成物品，让业务目标统一驾驭单一生成过程。配合 Sequence-Native Training 以终身行为序列组织训练、把编码成本摊销到各次曝光。这是生成式推荐在工业级全链路落地的又一标杆案例。

---

### 4. Beyond the Beam: Constructive Repair and Candidate Completion for Generative Recommendation

📄 [arXiv:2609.33745](https://arxiv.org/abs/2609.33745) | Zijun Zhao, Peng Zhang, et al.

**🗣️ 大白话：** 生成式推荐靠生成物品 ID 来"召回"，但商品库一扩容，新商品的合法 ID 可能根本不在 beam 里——模型永远推荐不到它。这篇论文搞了一套" constructive 修复"：先用整数流规划算出最小改动的 ID 分配修复方案，再用"生成似然 + 协同证据"联合打分把候选补全到 beam 之外，还能证明补全结果就是全局 Top-K。T5 上 Recall@10 提升 15.5%-46.3%。

**🔬 专业讲解：** 论文系统刻画了 fixed generator 下 identifier assignment 的可修复性：output-invariance certificates 识别所有可行分配共享的失败；公共有效前缀下，耦合支持/排序约束给出新物品数量的精确可行区间。BB 方法以 integral flow 求解 minimum-replacement 修复，推理时用生成似然与协同证据定义统一分数驱动排序、候选优先级和停止条件，保留前缀边界指导候选补全并在停止条件满足时认证全局 Top-K。对商品库频繁上新、冷启动物品进不了 beam 的电商场景，这套"带证书的构造性修复"是生成式推荐工程化的重要一环。

---

### 5. Beyond a Scalar: Distributional Serving Interfaces for Watch-Time Prediction

📄 [arXiv:2609.28383](https://arxiv.org/abs/2609.28383) | Xuan Liu, Jingbin Qian, Zhanyu Liu, Hefeng Zhou

**🗣️ 大白话：** 短视频推荐全靠"预估观看时长"排序，但现有模型对外只吐一个数——预估看了多少秒。下游任务想问"用户会不会看完？会不会快滑？"就没法回答了。DSI 提议别只给一个标量，直接把观看时长的完整概率分布打包成一个紧凑的"服务接口"：完成概率、各阶段时间尺度、不确定性，下游接个轻量读出头就能用。三个数据集 MAE 全场最低。

**🔬 专业讲解：** DSI 由三部分组成：distribution provider 学习观看比例导出的四种观看状态及事件时间的联合分布（基于视频时长的规则剔除不兼容组合，restoration loss 保住秒级精度）；低维 summary 压缩为事件概率、时长相对时间尺度和不确定性统计；任务定制的轻量 readout（value/ranking 两种）与原始上下文拼接训练。provider 参数冻结后，同一套 summary 可为任意新目标挂线性头。在 KuaiRec、KuaiRand-1K、WeChat21 上击败九个最强基线 1.9%-8.5% MAE，且 summary 携带的信息显著超越"均值+视频时长"组合。这篇的"接口设计"视角对做预估服务的团队很有启发：serving 时暴露的表示形式本身就是建模决策。

---

### 6. EvoSkillRec: Skill-Genome Evolution for Recommender Architecture Discovery

📄 [arXiv:2609.34552](https://arxiv.org/abs/2609.34552) | Xiaopeng Li, Kuo Cai, et al.（含 Ruiming Tang, Wenwu Ou 等腾讯系作者）

**🗣️ 大白话：** 推荐模型的新架构（特征交叉、时间注意力、专家路由）过去靠人类专家拍脑袋。最近流行让 LLM 自动改代码，但放开了改经常改出非法或没用的架构，好的创新也留不下来。EvoSkillRec 把推荐器拆成原子化的"技能"（带类型、语义注释和实现代码），架构=技能基因组，好的变异被晋升进技能库反复复用——进化不再是一次性赌博，而是可持续的积累。

**🔬 专业讲解：** 框架在两个耦合空间中演化：constrained skill-space 对验证过的技能做变异、重组、特化与复用；open-ended code-space 由 LLM planner/synthesizer 基于历史进化轨迹与积累经验发明新技能模块。autoresearch controller 负责评估候选、诊断失败、检索相关技能、晋升验证过的创新，并在两个空间间自适应分配 proposal 预算。在 CTR、多任务、多域学习（含生成式排序模型在 FLOPs 约束下的质量-算力协同优化）上持续验证有效。与 AutoResearch、AgentX 一脉相承，这篇把"推荐架构自动科研"从一次性脚本推进到了可累积的技能库范式。

---

### 7. Advancing Model Research in AgentX: Long-Horizon Autonomy for Industrial Recommender Systems

📄 [arXiv:2609.30001](https://arxiv.org/abs/2609.30001) | 快手 | Shuang Yang, Zijie Zhuang, et al.

**🗣️ 大白话：** 工业推荐团队做实验，最贵的不是跑一个实验，而是决定下一个实验跑什么。快手把这件事也交给了 Agent：一个 Research Agent 写提案、一个 Model Agent 跑实验，围绕"复现→跟进→组合→诊断"四种动作形成长周期研究循环。636 个改模型实验里 560 个 AUC 超过业务基线，最近五次线上 A/B 收获拉新效率 +10-15%、观看时长 +0.3-0.8%。

**🔬 专业讲解：** AgentX-Model 用业务输入和预测任务定义沙箱，双 Agent 架构中 Research Agent 基于论文和实验发现产出经独立评审的提案，Model Agent 执行多轮调研返回代码、测量结果与未决问题；前者的后续研究问题由上轮结果驱动，实现实验间的长程知识积累。四个动作中 Diagnose 专门采集选择修复方案的证据（含 PCOC 度量的预测偏差等线上反馈问题）。依赖感知的历史回放基准进一步评估研究调度策略，初步发现当 Agent 已能分析并选择具体候选时，更复杂的调度并无一致增益。这是继 Spotify、KuaFu 之后又一篇"LLM 自动科研在推荐系统落地"的重磅工业报告。

---

### 8. Mend the Measurement Gap: Latent User Preference Modeling for Short-Form Video Recommendation

📄 [arXiv:2609.32839](https://arxiv.org/abs/2609.32839) | RecSys 2026 | Google/YouTube 团队

**🗣️ 大白话：** 短视频推荐拿"观看时长"当用户喜好，但同样看 10 秒钟，可能是真享受、可能是懒得划走、可能是没在看了。直接优化原始互动信号，优化的是测量误差而不是用户价值。YouTube Shorts 的做法：把观测行为看作"隐状态"的带噪测量，训练一个因子化隐价值模型输出"真喜好分"，线上主指标"用户享受度"提升 2.67%。

**🔬 专业讲解：** FLVM（Factorized Latent Value Model）将观测行为建模为低维因子化潜价值状态的噪声测量：受限基线路径吸收视频时长、用户倾向、会话上下文等测量混杂因子的可预测变异；路由潜路径估计与偏好相关的价值优势（advantage），从混杂效应中剥离真实偏好信号；异构反馈由结构化输出头建模。产出的 latent value score 可作为排序特征或排序分接入现有系统。在 YouTube Shorts 在线 A/B 中除离线指标改善外，主观看享受指标 +2.67%。与上面 DSI 一篇合看，"把 serving/训练目标从标量升级为结构化表示"正在成为时长建模的新共识。

---

### 9. What Gets Measured Gets Managed: Sign-aware Recommendation Needs Sign-aware Evaluation

📄 [arXiv:2609.33346](https://arxiv.org/abs/2609.33346) | Minchan Kim, Jungmin Hwang, Hyunwoo Park

**🗣️ 大白话：** 一批新模型号称能利用"负反馈"（踩过的、不喜欢的），但你去看它们的推荐结果——照样把用户讨厌的东西排在前列。更讽刺的是，传统指标（Recall/NDCG）根本测不出来：它们给"没看过的"和"讨厌的"同样打零分。这篇提出带符号的指标，把"推荐了用户讨厌的东西"明确扣分，排行榜立刻重新洗牌。

**🔬 专业讲解：** 经验诊断显示 SOTA 图基 sign-aware 推荐器在排序阶段是 paradoxically valence-blind 的：线性探针证明 valence 信息存在于学到的嵌入中，但内积打分函数取不出来——训练时用了符号信息，推理时丢掉了。根因在评测盲区：Recall/HR/NDCG 对负样本和未观测物品统一赋零效用。作者提出 Signed Recall/HR/NDCG 家族显式惩罚不喜欢内容的曝光，系统重评后传统榜单高分方法多数不能保护用户免于讨厌内容；proof-of-concept 辅助损失证明这些指标还能提供可操作的训练信号。评测方法论文今年在 RecSys 圈井喷，这篇的"负效用归零"盲点修得尤其扎实。

---

### 10. Learning Better Reasoning for Generative Recommendation with Semantic IDs

📄 [arXiv:2609.29973](https://arxiv.org/abs/2609.29973) | Mengdan Zhu, Yufan Zhao, et al.

**🗣️ 大白话：** 让生成式推荐先"写推理"再出答案（先总结用户兴趣，再生成下一个物品的语义 ID）很流行，但推理本身不保证加分——胡思乱想反而会带偏推荐。Evo-Rec 的解法很务实：同时采样多条推理链，只保留"用了之后真的更容易预测出正确物品"的那几条来训练，再用强化学习继续打磨。

**🔬 专业讲解：** Evo-Rec 三阶段：1) 将语义 ID 与其文本/行为上下文对齐，使模型理解并生成物品标识符；2) 采样多条候选推理轨迹，仅保留提升 ground-truth 物品预测概率的轨迹用于 SFT，获得更强的推理初始化；3) 通过带目录约束的物品生成和排序感知反馈的 RL 进一步优化推理策略。在三个 Amazon Review 基准上全面超越判别式、生成式与推理增强基线。同组姊妹篇（2609.29983）进一步解决 RL 信用分配问题：用冻结检索器把每条"兴趣假设"当作目录查询独立验证，命中 top-K 才给 span 级奖励，弥补了 exact-match SID 奖励稀疏且无法区分推理质量的 gap。

---

### 11. Tie Handling Is Part of the Evaluation Protocol: An Order-Invariance Audit for Tie-Heavy Recommender Scores

📄 [arXiv:2609.26977](https://arxiv.org/abs/2609.26977) | FRAME@RecSys 2026 | Chengkun Guo, Han Chen, et al.

**🗣️ 大白话：** 离线评测一个隐秘的坑：当很多物品得分完全相同时，谁排前面取决于排序代码怎么写。常见实现先把正确答案存第一个再稳定排序——于是正确答案每次都赢。同一份评分，换个 tie-break 规则，NDCG@10 能从 0.85 直接掉到 0.17。你的 SOTA 里可能藏着一行排序代码的功劳。

**🔬 专业讲解：** 论文定义 row-order invariance（输入候选顺序置换不改变最终排序）并审计之：在 3 万行 Amazon Beauty 数据上，attribute-overlap 分数在 input-order tie-break 下 NDCG@10=0.85，换成 user/item ID 哈希 tie-break 后跌至 0.17；均匀随机 tie-break 的解析期望与 100 个随机哈希种子均值吻合；少数平局的 residualized 分数则几乎不受影响，物品流行度分数同理。作者推导了相关物品在等分候选中随机排位时的期望 Hit Rate 与 NDCG，并给出实用报告清单。做评测框架的同学请自查 `argsort` 的稳定性。

---

### 12. TailSpec-EASE: Knowledge-Graph-Regularized Linear Recommendation for Web Long-Tail Discovery

📄 [arXiv:2609.26143](https://arxiv.org/abs/2609.26143) | WISE 2026 | Jianru Shen

**🗣️ 大白话：** 推荐系统爱推爆款，长尾物品没数据没人爱。这篇的思路很"性价比"：不搞重型 GNN，在强线性模型 EASE 上注入一个"物品知识图谱谱先验"，且越冷门的物品先验权重越大——用语义知识补统计数据的缺。Amazon 图书数据上 CPU 训练 37 秒，效果反超 GPU 上要跑 43 分钟的 KGAT。

**🔬 专业讲解：** TailSpec-EASE 将关系感知的谱 KG 先验注入局部闭式重构目标，先验强度随物品流行度自适应——长尾物品获得更强语义引导。在四个公开基准上与经典、线性、graph-CF、KG 神经网络和分数级 KG 基线全面对比，取得整体精度、长尾表现与训练成本的良好平衡：NDCG@20 相比无 KG 版本最高提升 24%，所有尾部指标提升经 paired bootstrap 显著；耗时对比中 37 秒（CPU）vs KGAT 2584 秒（GPU）vs LightGCN 15800 秒（CPU）且 NDCG 和长尾召回更高，全局闭式 EASE 溢出的目录上也依然可行。轻量级路线在长尾场景的代表作。

---

## 📋 其他论文速览

- **Mitigating Popularity Bias in Recommendation with Global Listwise Learning and Progressive Bi-Weighting**（arXiv:2609.35041，ACM TOIS）：Mult-BiW 把多项式似然与 IPS 结合做全局 listwise 去偏，BiW 双重加权 + 渐进式策略缓解激进重加权伤表征的问题，全面超越 SOTA。
- **Recommendation Ranking Off-Policy Evaluation under Ranking-Dependent Examination**（arXiv:2609.35034）：把点击分解为"看到 × 感兴趣"，提出 LE-IIPS 与 ED-DR 估计器，排序位置依赖的曝光结构下 OPE 更稳。
- **No Attention, No Problem: Rethinking Session-based Recommendation with Pure Convolution**（arXiv:2609.34802）：NextConvRec 纯卷积（深度可分离+逐点卷积）替代注意力做会话推荐，平均性能 +1.73%、单会话推理时间 -16.7%。
- **Eval4DiRec: A Unified Evaluation Framework for Diffusion-based Recommender Systems**（arXiv:2609.34404，ACM TKDD）：首个扩散推荐统一评测框架，覆盖 5 场景 14 个模型，统一协议下重排座次。
- **Measuring and Mitigating Identity-Cue Preference Drift in LLM-based Recommender Systems**（arXiv:2609.34229）：prompt 里塞身份线索（性别/地域等）会把推荐推向群体刻板印象，PromptShift 无训练地把 Drift 降 62% 且指标不降反升。
- **Overview and Analysis of the RecSys Challenge 2026: Conversational Music Recommendation**（arXiv:2609.33045）：16 个参赛系统的共同套路是 retrieve-rerank-generate + 异构候选源 + 意图检测 + 全多轮上下文建模。
- **MM-VeriRec: Failure-Guided Fusion for Verifiable Agentic Multimodal Recommendation**（arXiv:2609.31718，AMI@MM 2026）：把多模态推荐失败转成可操作标签（文本陷阱跟随/视觉忽视/虚假接受），按失败模式路由修复。
- **Data Processing for Offline Evaluation in Recommender Systems: a Survey**（arXiv:2609.31696）：系统梳理离线评测前的数据处理决策（数据集选择、交互表示、切分协议），揭示 support-driven 过滤主导、切分协议标注不一致的现状。
- **DP-Rec: Dynamic Patching for Efficient Long-Sequence Recommendation**（arXiv:2609.32215，RecSys 2026）：借鉴 Byte Latent Transformer，用对比熵惊喜度把交互序列切成动态 patch 再压缩编码，长序列下效率-精度全面占优。
- **FARE: Fair Exposure Constrained Uncertainty Aware Financial Content Personalization**（arXiv:2609.31890，ICLR 2026 Workshop）：把"声量占比（SOV）公平约束排序"当深度 RL 问题解，把 CTR 预估不确定性纳入状态空间，金融内容个性化两全其美。
- **Cross-Country Code-Mixing for Generative Recommendation**（arXiv:2609.28972，CIKM 2026）：CMRec 借鉴 NLP 码转换，用共享语义码本在数据层面合成跨国混合行为序列，小市场国家推荐质量大涨，线上广告收入 +1.77%。
- **LSF-SR: Latent Semantic Fusion for Sequential Recommendation**（arXiv:2609.29815，CIKM 2026）：用带归一化流的 CVAE 融合物品 ID 嵌入与 LLM 语义信号，五个数据集 Recall@20 最高 +12.98%。
- **Anatomy of a Decision: UHIFlow**（arXiv:2609.29609，WISE 2026）：条件流匹配量化多模态不确定性，动态构建个性化意图层级——拿不准的用户给粗粒度意图，偏好清晰的给细粒度。
- **Decoupled Learning and Selection in Slate Recommendation for Privacy and Stability**（arXiv:2609.29453，RecSys 2026）：slate 推荐的形式化分解：随机打分学习器 + 确定性选择，DP 保证经后处理穿透，margin 证书保证噪声下 slate 不变。
- **A Flexible Recommendation System for Individuals and Groups**（arXiv:2609.27998）：GNN 学用户"个人/群体成员"双表征，差分分析定行为画像，统一个人推荐与群推荐两范式。
- **When LLM-Based User Profiling Adds Value in Production Streaming Recommendation**（arXiv:2609.27183）：生产数据上系统对比四种语义用户画像策略——LLM 生成自然语言画像贵，什么时候值得花这个钱，这篇给了答案。
- **Calibrating Reproduced Claims in Recommender Systems**（arXiv:2609.26975，FRAME@RecSys 2026）：提出 claim calibration——复现研究应报告"支持原结论的最强主张"及其成立条件，附五对论文的案例分析。
- **Robust Fusion of Semantic and Behavioural Signals for LLM Reranking in Personalised Search**（arXiv:2609.25825，USRW@RecSys 2026）：把行为统计特征塞进 LLM 重排 prompt 会诱发捷径学习，双样本特征 dropout 训练让增益在线保留、离线也不塌。
- **Algorithmic Harms Associated with Generative Model-Augmented Recommendation Systems**（arXiv:2609.33073，KDD 2025 OARS Workshop）：生成式模型进推荐平台后的算法危害分类学扩展，强调需要预见"内源性危害"（如净化偏差）。
- **Can Generative Retrievers Learn Semantic IDs Without Forgetting How to Speak?**（arXiv:2609.35430）：SpeakGR 用在策略蒸馏正则防止检索微调把语言模型"带哑"，语言漂移降 81-94% 且检索不掉。
