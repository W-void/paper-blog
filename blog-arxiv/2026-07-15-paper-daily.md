---
title: "【推荐系统 Paper 日报】2026-07-15"
date: 2026-07-15
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2774049908"
---

# 【推荐系统 Paper 日报】2026-07-15

## 📊 今日概览

本期 arXiv cs.IR 公告日期为 **Wednesday, 15 July 2026**，共收录 **28 篇论文**（含 New Submissions 10 篇、Cross-lists 11 篇、Replacements 7 篇）。其中与**推荐系统强相关**的论文达 **14 篇**，占比过半，覆盖了生成式推荐、序列推理、冷启动、CVR 预估、个性化视觉等多个热门方向。本期亮点：多家大厂（美团、Meta/Instagram、阿里巴巴天猫、快手）同时释放新工作，推荐系统正加速从"预测下一个"走向"推理为什么"。

---

## 🔥 推荐系统论文深度解读

### 1. Not Only NTP: Extending Training Signal Coverage for Generative Recommendation

📄 [arXiv:2607.12277](https://arxiv.org/abs/2607.12277) | 美团 | Authors: 未完整显示

**🗣️ 大白话：** 现有生成式推荐模型用"预测下一个 token"（NTP）来训练，但这个目标有两个先天缺陷：只看当前一步、只看当前领域。美团这篇工作给 NTP 打了两个补丁——一个叫 TCL 的"时间对比学习"让模型去对齐未来 K 步的行为，一个叫 TDL 的"跨域学习"让模型从其他领域偷师。训练完这俩辅助任务就扔掉，推理零开销。结果在美团四域数据集上 HR@10 涨了 34.3%，线上 CTR +1.8%、GMV +2.1%。

**🔬 专业讲解：** 本文首次系统分析了 NTP 的 temporal locality 和 spatial locality 两大结构性信号缺陷。提出的 NONTP 框架包含 (1) TCL：基于 BYOL 的 EMA 教师-InfoNCE 机制，将隐状态对齐到 K 步未来轨迹；(2) TDL：跨域隐状态均值池化后接入共享预测头，开辟第二条梯度通路。两者均为可丢弃的辅助任务（inference-zero overhead）。在美团四域全排序工业数据集上 HR@10 相对提升 34.3%（对比 NTP）和 18.3%（对比 MBGR）；Amazon Movie-Book-CDs 公开数据集上 HR@10 +2.8%、NDCG@10 +3.7%。线上 A/B 测试 CTR +1.8%、GMV +2.1%（p < 0.01）。消融实验和梯度冲突分析为未来工作指明了方向。

---

### 2. SlimPer: Make Personalization Model Slim and Smart

📄 [arXiv:2607.12281](https://arxiv.org/abs/2607.12281) | Meta (Instagram Reels & Feed) | Authors: 未完整显示

**🗣️ 大白话：** Transformer 做推荐有个大问题——它保留了生成模型里那些按 token 自回归的中间张量，但推荐根本不需要 token 级输出，只需要一组相关性分数。Meta 这篇工作把个性化排序重新定义为"迭代精炼一个紧凑的用户-商品知识库"：每层只查需要的原始多模态用户 token，算显式匹配分，然后精炼知识库。每层 O(N) 复杂度，深度和序列长度解耦。已经在 Instagram Reels 和 Feed 全量上线。

**🔬 专业讲解：** 核心洞察：推荐系统与生成式任务的根本差异在于输出粒度（item-level score vs. token-level generation），因此 Transformer 的按 token 自回归中间张量设计在推荐场景下是过度设计。SlimPer 将个性化排序重新建模为对紧凑统一的 <user, item> 知识基的迭代精炼过程。每层通过选择性查询原始多模态用户侧 token、计算显式相关性匹配分数、并精炼知识基，实现 O(N) 每层开销与固定尺寸中间表征。模型深度与历史长度解耦，request-only 优化进一步通过跨候选共享用户侧 token 副本降低内存。在 Instagram Reels 和 Feed 上实现用户参与度可测提升，同时系统整体简化，支持 10k+ 细粒度用户历史事件建模。

---

### 3. MESH: Scaling Up Retrieval with Heterogeneous Content Unification

📄 [arXiv:2607.12392](https://arxiv.org/abs/2607.12392) | Pinterest | Authors: 未完整显示

**🗣️ 大白话：** 做大检索系统，新鲜和长尾内容永远是痛点。通常大家会为不同内容层级搞一堆专门的检索模型，运维像动物园。Pinterest 发现这叫"异构性的扩展偏差"——模型容量增加时，不同内容层级的收益不平等。他们提出 MESH，用模块化架构加门控偏置校正来统一检索，把新鲜物品的幂律扩展指数提升了 14 倍。在线 fresh-item repins +5.5%，漏斗效率 +55%，用户留存 +0.46%。

**🔬 专业讲解：** 本文提出 Scaling Bias of Heterogeneity 概念：在异构检索系统中，模型容量提升对高频和稀疏内容的收益分布不均。MESH 通过模块化架构与门控偏置校正（gated bias correction）缓解此偏差。核心设计：(1) 特征空间分区为独立域，施加结构性归纳偏置以减少稀疏物品信号与高频交互特征之间的干扰；(2) 受保护的梯度路径改善稀疏内容的扩展行为。在 Pinterest Related Pins（十亿级 item-to-item 推荐）在线评估中，fresh-item repins +5.5%，漏斗效率 +55%，用户留存 +0.46%。异步 serving 策略带来 2.87× 系统吞吐提升。幂律扩展指数在新鲜物品上提升 14 倍。

---

### 4. Where Reasoning Matters: Rethinking Latent Reasoning in Semantic ID-based Generative Recommendation

📄 [arXiv:2607.12425](https://arxiv.org/abs/2607.12425) | Authors: 未完整显示

**🗣️ 大白话：** 基于语义 ID 的生成式推荐把物品编码成一串 token 序列，然后自回归生成。最近有人给这个生成过程加了"隐式推理"——在预测每个 token 前多算几轮。但这里有个问题：每个语义 ID 位置的重要性一样吗？这篇工作发现，前面的 token 通常信息增益更高，后面的 token 贡献递减。于是他们提出 IBA，把推理步骤当预算来分配，多给高信息增益位置，少给低贡献位置。

**🔬 专业讲解：** 通过 position-wise information-gain (IG) 分析发现，早期语义 ID 位置通常具有更高的信息增益，而后期位置的边际贡献递减。基于该观察提出 IBA（Information-Gain Budget Allocation）框架，将 latent refinement 步骤视为有限计算资源，学习在语义 ID 位置间的最优分配。实验在多个公开数据集上均实现优于固定步数分配的策略，获得更好的 accuracy-computation 权衡。

---

### 5. Cheaper is Better: A Discount-Aware Network for Conversion Rate Prediction in E-commerce Recommendation System

📄 [arXiv:2607.12578](https://arxiv.org/abs/2607.12578) | Alibaba Tmall | Authors: 未完整显示

**🗣️ 大白话：** CVR 预估里有个被忽视的维度——折扣率。商品打折力度直接影响用户的购买决策，但现有 CVR 模型完全不建模这个因素。这篇工作提出 DANet，把折扣率当作时间序列做傅里叶变换提取长期趋势，再用分布去偏模块解决不同促销组合的偏差，最后用监督回归辅助任务增强数值精度。离线 AUC +1.61%，线上 pCVR +3.63%、GMV +2.23%。已全量部署在天猫 APP。

**🔬 专业讲解：** DANet 三大核心模块：(1) 时频变换模块：利用傅里叶变换提取物品折扣率的频率谱，捕获长期趋势；(2) 分布去偏模块：缓解用户特定折扣率因购买组合多样化和促销活动导致的偏置，以及不同促销周期的周期性偏差；(3) 监督回归辅助任务：建立显式物品折扣标签，增强数值精度表征。在真实数据集上离线 AUC +1.61%，线上 A/B 测试 pCVR +3.63%、GMV +2.23%。已部署于阿里巴巴天猫 APP。

---

### 6. Learning to Forget: Satiation-Aware Long-Sequence Transducers for Mitigating Post-Purchase Redundancy

📄 [arXiv:2607.12714](https://arxiv.org/abs/2607.12714) | Authors: 未完整显示

**🗣️ 大白话：** 现有序列推荐模型把用户所有交互都当成"正向信号"来积累偏好，但买过一个商品后用户可能短期内不想再看同类商品。这被称为"兴趣退出"而非"兴趣延续"。本文提出 SAM，让模型学会"忘记"：买完立刻抑制相关历史点击，同时根据再购买周期预测慢慢"唤醒"这些兴趣。线上 A/B 测试把购买后重复推荐率（PPRR）降低了 60% 以上。

**🔬 专业讲解：** 提出 Action-Intent Asymmetry 概念：电商场景下购买行为往往标志着特定意图的终止（"Interest Exit"）而非延续。现有模型忽略此区别导致严重的 post-purchase redundancy。SAM 框架三大组件：(1) 双路径交叉注意力架构：在实现意图后反向抑制相关历史点击，同时从长期购买历史中检索个性化补货节奏；(2) 自适应饱和门控单元（ASGU）：生成时间敏感的软掩码，在 purchase 后立即抑制已满足兴趣，并随预测再购买周期临近逐步"唤醒"；(3) 自监督 Time-to-Next-Purchase (TTNP) 辅助任务：无需人工标注学习潜在产品生命周期。工业数据集离线实验和线上 A/B 测试表明 PPRR 降低超 60%。

---

### 7. RecRec: Latent Interests Recursive Reasoning for Sequential Recommendation

📄 [arXiv:2607.12945](https://arxiv.org/abs/2607.12945) | Authors: 未完整显示

**🗣️ 大白话：** 现有序列推荐只做一次前向传播就输出预测，虽然有人尝试了推理增强，但都是把推理和预测绑在一个 d 维状态里，深度受限于这个瓶颈。这篇工作提出 RecRec，把推理和预测完全解耦：先用一个 Context Compressor 把 backbone 的隐状态压缩成一组 latent interests，然后在一个独立的中间隐空间里递归推理。没有 RL，纯监督两阶段训练，推理深度可以任意调整而不需要重新训练。

**🔬 专业讲解：** RecRec 核心架构：(1) Context Compressor：将 backbone 隐状态蒸馏为少量 latent interests，通过 Interest Diversity Regularizer 鼓励每个兴趣捕获用户行为的不同方面；(2) Recursive Reasoner：在独立的中间隐空间中对 latent interests 进行递归推理。Deep supervision 使推理深度可在推理时自由调整，无需重新训练。四个真实数据集上优于 SOTA 推理增强方法，其中三个数据集上增益超过训练时深度。揭示了推理状态结构（reasoning-state structure）作为序列推荐中值得探索的新设计维度。

---

### 8. RecRec: Recursive Refinement for Sequential Recommendation

📄 [arXiv:2607.10541](https://arxiv.org/abs/2607.10541) | Authors: 未完整显示

**🗣️ 大白话：** 这是另一篇同名工作（注意 arXiv ID 不同），也是做递归推理的序列推荐。核心思路是把用户偏好建模为一个持续存在的隐状态，通过共享递归模块根据交互证据迭代更新。关键创新是"证据锚定校正机制"——每次更新都锚定在原始交互上下文上，防止深层递归时的语义漂移。模型只有 3.9M 到 14M 参数，但性能匹敌或超越更深的模型。

**🔬 专业讲解：** 从递归推理视角重新审视序列推荐：用户偏好能否被建模为可通过递归精炼的持久隐状态？RecRec 维护一个紧凑的隐状态并通过共享递归模块根据交互证据进行更新。核心创新：evidence-anchored correction mechanism，通过将每次更新锚定到原始交互上下文来稳定精炼过程，防止深层递归推理中的语义漂移。三个基准数据集上标准评估协议下，以仅 3.9M-14M 参数匹配或超越 SOTA 序列、图和推理增强推荐器。消融实验证实递归精炼和证据锚定校正门均对性能有显著贡献。

---

### 9. Action-Aware Generative Sequence Modeling for Short Video Recommendation

📄 [arXiv:2604.25834](https://arxiv.org/abs/2604.25834) | Kuaishou | Authors: 未完整显示

**🗣️ 大白话：** 短视频推荐有个被忽视的问题：用户可能只喜欢视频里的某几个片段，而不是整个视频。传统模型把视频当整体来处理，粒度太粗。快手这篇工作发现用户动作的时机本身就代表了不同意图，于是提出 A2Gen：把动作按时间维度细化、连成序列、统一处理预测。Context-aware Attention Module 建模动作序列，Hierarchical Sequence Encoder 学习时间模式，Action-seq Autoregressive Generator 生成动作序列。已在快手全量上线，日活 4 亿+用户。

**🔬 专业讲解：** 通过统计分析和动作模式检验证明：用户动作时机可代表不同意图。提出 A2Gen（Action-Aware Generative Sequence Network）三阶段架构：(1) Context-aware Attention Module (CAM)：建模 enriched with item-specific contextual features 的动作序列；(2) Hierarchical Sequence Encoder (HSE)：从用户历史动作中学习时间动作模式；(3) Action-seq Autoregressive Generator (AAG)：通过 CAM 生成动作序列。快手数据集和 Tmall 公开数据集离线实验验证优越性；快手平台大规模线上 A/B 测试：用户观看时长 +0.34%，交互率 +8.1%，整体用户留存（LifeTime-7）+0.162%。已全量上线，每日服务超 4 亿用户。

---

### 10. SlimPer: Learning to Forget — 与 SAM 对比

📄 [arXiv:2607.12714](https://arxiv.org/abs/2607.12714) | 同上第6篇

**🗣️ 大白话：** 这篇工作的核心洞察值得单独强调：推荐模型不应该只学会"记住"，还必须学会"忘记"。SAM 是第一个系统性建模"兴趣饱和"的序列推荐框架，通过显式追踪产品生命周期和再购买节奏，解决了电商推荐里长期存在的"买了还推"问题。这个思路可以扩展到其他领域——比如看完一部电影后应该暂时减少同类型推荐，或者完成一次旅行后应该降低相关内容的曝光。

---

### 11. ViHoRec: A Quality-Controlled Vietnamese Hotel Recommendation Dataset and Cold-Start Benchmark

📄 [arXiv:2607.12946](https://arxiv.org/abs/2607.12946) | Authors: 未完整显示

**🗣️ 大白话：** 越南语的推荐系统研究受限于没有公开的数据集。本文发布了 ViHoRec，包含 18,267 条交互、6,832 用户和 560 酒店，跨三个平台（Agoda、Traveloka、Ivivu）爬取并做了实体对齐、质量审计、隐私保护（HMAC 伪名化）。这个数据集的特点是冷启动问题严重——短历史用户上 BPR-MF 的 Recall@10 只有 0.065，而长历史用户有 0.120。UserKNN 表现最强，说明在小语种、稀疏数据场景下传统方法仍有竞争力。

**🔬 专业讲解：** 贡献：(i) 可复现构建流程：跨平台实体解析和定量质量控制；(ii) 隐私保护发布：HMAC 伪名化；(iii) 公开冷启动基准：时序 leave-last-one-out 划分、数据为中心消融、无依赖基线。公开划分上，短历史用户学习模型退化严重（BPR-MF Recall@10: 0.065 vs 0.120），而 UserKNN 整体最强。数据已公开发布。

---

### 12. What Would You Click? Personalized Video Thumbnail Generation with Preference-aware Highlight Retrieval

📄 [arXiv:2607.12882](https://arxiv.org/abs/2607.12882) | Authors: 未完整显示

**🗣️ 大白话：** 视频封面图很重要，但现有方法都是"一刀切"——给所有用户看同样的封面。这篇工作提出"个性化视频封面生成"这个新任务：第一阶段用偏好感知的 highlight retriever 从视频中选关键帧，平衡个性化和信息量；第二阶段用 VLM 引导的扩散管线把关键帧变成封面。用户研究表明点击率偏好有提升。

**🔬 专业讲解：** 两阶段框架：(1) 个性化 highlight retriever：捕获细粒度用户-视频交互并通过视频摘要纳入视频语义，选择与用户偏好和视频上下文对齐的多样化视觉锚点；(2) VLM 引导扩散管线：通过提取和注入语义基础视觉线索将锚点转换为封面，在保持视觉一致性和保真度的同时提升个性化。两个公开数据集上优于检索和生成基线；用户研究进一步验证点击率偏好提升。代码已开源。

---

### 13. Adaptive Fusion Self-supervised Learning for Recommendation

📄 [arXiv:2407.19692](https://arxiv.org/abs/2407.19692) | Authors: 未完整显示

**🗣️ 大白话：** 图对比学习（GCL）做推荐通常需要数据增强（随机删节点/边或加噪声），这破坏了图本身的结构特性。本文提出 AFGCL，利用图传播过程中自然产生的结构信息来构建对比表征，不需要额外增强。通过自适应融合策略估计不同传播深度对推荐任务的贡献并组合表征。还提出一个融合对比目标，为每个观察到的用户-物品交互构建显式表征。三个数据集上优于 SOTA。

**🔬 专业讲解：** 挑战分析：(1) 数据增强需要额外 GCN 或建模操作，增加时间成本；图增强随机删除节点/边破坏用户-物品图固有属性，特征增强对所有节点施加噪声忽视其独特特征；(2) 现有 GCL 方法使用传统 CL 目标，缺乏从多视角获取更有益 CL 目标并融合可变自监督信号的研究。AFGCL 解决方案：利用图传播自然产生的结构信息构建对比表征；自适应融合策略估计不同传播深度对推荐任务的贡献并自适应组合；为每个观察到的用户-物品交互构建显式表征，提出融合对比目标。三个公开数据集上推荐性能和训练效率均优于 SOTA 基线。

---

### 14. iTIMO: An LLM-empowered Synthesis Dataset for Travel Itinerary Modification

📄 [arXiv:2601.10609](https://arxiv.org/abs/2601.10609) | Authors: 未完整显示

**🗣️ 大白话：** 旅行推荐系统通常只做"规划行程"，但用户在实际旅行中经常需要修改行程。问题是缺乏"需要修改"的行程数据。本文提出 iTIMO，用 LLM 对真实行程做意图驱动的扰动（REPLACE、ADD、DELETE），扰动意图基于三个维度：流行度、空间距离和类别多样性。对主流 LLM 做了全面基准测试，为旅行推荐系统从"静态规划"走向"动态修改"提供了数据集基础。

**🔬 专业讲解：** 将"需要修改行程数据"的生成建模为意图驱动的扰动任务。指示 LLM 用三种操作（REPLACE、ADD、DELETE）对真实行程进行扰动，每个扰动基于三个意图：流行度扰动、空间距离扰动、类别多样性扰动。引入混合评估指标确保扰动有效性。对 iTIMO 上的 SOTA LLM 能力进行了全面基准分析。数据集、代码和补充材料已公开。使传统旅行推荐系统演进为能够处理动态旅行需求的自适应框架。

---

### 15. SkillSelect-Serve: QoS-Aware Budgeted Skill Service Recommendation for LLM Agents

📄 [arXiv:2607.00011](https://arxiv.org/abs/2607.00011) | Authors: 未完整显示

**🗣️ 大白话：** LLM Agent 的技能推荐不是简单的检索——技能有功能、依赖、风险、成本等约束。现有 Top-k 方法只按文本相关性排序，不管任务需求和约束。本文提出 SkillSelect-Serve，把技能当作结构化服务单元，用任务条件化的 suitability estimator 排序，然后用约束投影在 token 预算、聚合风险、工具可用性约束下打包。在 35,353 个技能注册表上，无约束 top-5 只有 9.1% 的任务能塞进 4000 token 的上下文；约束投影后 100% 可交付，命中率只降了 1.14 个点，但风险减半、工具违规率从 44-81% 降到 0。

**🔬 专业讲解：** 核心洞察：技能不同于普通检索项，暴露功能能力、输入输出假设、工具依赖、上下文成本和风险元数据。SkillSelect-Serve 框架：(1) 将原始技能剖析为结构化 Skill Services；(2) 将任务转换为结构化需求对象；(3) 通过校准的任务条件化 suitability estimator 对候选排序；(4) 通过约束投影在 token 预算、聚合风险和工具可用性约束下打包，仅使用部署可观测特征。在 35,353 技能注册表上（经两名独立评估者验证的多正向相关性判断），无约束 top-5 仅 9.1% 任务适配 4000 token 上下文；约束投影恢复 100% 可交付性，命中率损失仅 1.14，优于 retrieve-and-rerank、budget truncation 和 diversity-based selection。同预算下命中率从 0.8864 提升到 0.9091。支持将可复用 agent 技能管理为可发现、可比较和约束感知的服务单元。

---

## 📋 其他论文速览

**IR / 检索相关**

- **Explaining When PRF Fails**（arXiv:2607.12098）：伪相关反馈（PRF）的审计框架，发现只有 20.9% 的查询从 PRF 受益，25.6% 受害。用 LLM reranker 作为用户偏好预测器自动标记，可规模化和可解释。

- **SHEAF**（arXiv:2607.12229）：图近似最近邻搜索的查询难度预测，通过两次浅探针搜索和零查询时 ground truth，在 GPU/CPU 上提升预测相关性最高 1.55×。

- **Transforming LLMs into Efficient Cross-Encoders**（arXiv:2607.11933）：用知识蒸馏将 LLaMA 3 8B 改造成 RAG 重排序器，4-bit 量化后比传统交叉编码器效果更好（answer relevancy +14%、context precision +16%、answer correctness +21%），且没有二次复杂度。

- **Cost-Governed RAG**（arXiv:2607.12188）：多租户 RAG 的成本归因架构，将 embedding、检索和生成成本统一按租户计量。使用 TurboVec 确定性内存公式，99.96% 归因准确率，检索成本比托管向量数据库低 3.1-9.0×。

- **On-Device Deep Research at 4B**（arXiv:2607.12257）：端侧 4B 研究智能体的引用忠实度分析。发现：单源曝光量决定忠实度（400→1500 字符提升 0.45→0.58），检索召回率决定覆盖度（固定在 0.40 时，增加曝光无法修复）。

- **Towards Vision-Free CIR**（arXiv:2607.12621）：纯文本表示图像做组合图像检索（CIR），通过属性增强评分和 LLM 重排序，在 CIRR 上 Zero-shot R@1 达 44.04%（+8.79%）。

- **E-GEO**（arXiv:2511.20867）：电商生成式引擎优化（GEO）测试集，13,747 条多句消费者产品查询，每个配 10 条 Amazon 商品列表。发现存在"通用有效"的 GEO 策略。

- **More Than Efficiency**（arXiv:2601.13525）：PCA 嵌入压缩不仅提升效率，还能改善领域自适应。在 9 个检索器和 14 个 MTEB 数据集上，75.4% 的模型-数据集对中 NDCG@10 提升。

- **SQuTR**（arXiv:2602.12783）：语音查询到文本检索的鲁棒性基准，37,317 条查询，200 个真实说话人，17 类环境噪声。大规模模型在极端噪声下仍大幅退化。

- **Multilingual Semantic Retrieval for Apple Music**（arXiv:2607.10239）：Apple Music 的 305M 参数多语言语义检索系统，Siamese bi-encoder 基于 GTE-multilingual-base。全球线上 A/B 测试转化率 +2.28%，无结果率降低 86%，长尾查询转化率 +7.93%。

- **Hybrid privacy-aware semantic search**（arXiv:2606.26373）：SVD 截断文档几何 + CKKS 加密查询重排序，在 672 维上中位服务器时间从 1689ms 降到 225ms，响应大小降 99.5 倍。

- **SHARD**（arXiv:2606.27976）：单元格密钥残差分割实现抗对齐的私有稠密检索，CKKS 密文-明文重排序，无 top-1 翻转，块打包使查询上传量减少 74-87%。

- **Graph-Constrained Policy Learning**（arXiv:2607.11954）：图约束策略学习用于极端临床代码预测，非推荐系统方向。

- **Research Novelty in IS Journals**（arXiv:2603.22510）：ChatGPT 后信息系统期刊研究新颖性差异，非推荐系统方向。
