---
title: "【推荐系统 Paper 日报】2026-09-15"
date: 2026-09-15
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2786576007"
---

M_SPANID='0.15.1' # 【推荐系统 Paper 日报】2026-09-15

M_SPANID='0.15.2' ## 📊 今日概览

M_SPANID='0.15.3' arXiv cs.IR 今日（公告日期 2026-09-15，周二）共更新 35 篇论文，其中推荐系统相关 8 篇。今天工业界气息浓厚：天猫的生成式检索 VARG 和亿级 DAU 平台的标题生成框架 GESE 都带着实打实的线上 A/B 数据来了，理论侧还有一篇把 TF-IDF 和 BM25 统一成 KL 散度的小而美工作。

M_SPANID='0.15.4' ## 🔥 推荐系统论文深度解读

M_SPANID='0.15.5' ### 1. Self-Evolving Memory for Generative Recommendation

M_SPANID='0.15.6' 📄 [arXiv:2609.15598](https://arxiv.org/abs/2609.15598) | M_SPANID='0.15.7' CIKM'26 | 未列出作者

**🗣️ 大白话：** 生成式推荐有个痛点——大家共用一套模型参数，但每个用户的兴趣变化速度和方向都不一样。结果是多数派用户的模式越学越强，小众用户的兴趣被"挤压"得越来越没人管，作者管这叫"演化冲突"。他们的解法是给模型外挂一块自进化的稀疏记忆（LION），不同行为模式在记忆里各过各的，互不踩踏。

**🔬 专业讲解：** 论文指出持续重训和蒸馏式适配在共享自回归参数空间中直接更新，会导致异质偏好漂移被主导模式淹没。作者提出三条设计原则：隔离记忆（isolated memorization）、强化演化（reinforced evolution）、可扩展应用（scalable application），并实现为稀疏 Key-Value 记忆层：稀疏激活保证不同模式演化隔离，consolidation loss 在持续适配中强化欠表示偏好动态的学习。在多期评估、用户/物品分组评估、演化收敛分析等多种持续演化设置下均验证有效。

---

### 2. Generate to Explore, Select to Exploit: Aligning LLM-based Headline Generation with Personalized Recommendation

📄 [arXiv:2609.15094](https://arxiv.org/abs/2609.15094) | 工业部署（亿级 DAU 平台） | 未列出作者

**🗣️ 大白话：** 推荐信息流里一个物品配一个固定标题，很难满足所有人。让 LLM 直接"写出最佳标题"又会模式坍塌——写出大家都喜欢的平庸款。GESE 的思路是分两步：让 LLM 天马行空地生成一批覆盖不同兴趣的候选标题（探索），再由一个轻量级实时反馈选择器根据当下上下文挑一个最合适的（利用）。

**🔬 专业讲解：** 框架在展示层解耦个性化：生成侧用 GSPO（Group Sequence Policy Optimization）+ 分层奖励，把 LLM 当概率化探索器，最大化潜在用户兴趣的语义覆盖；选择侧用轻量实时反馈感知的选择器做利用。已在日活过亿的商业平台部署，CTR +2.57%、停留时长 +0.87%。"多样性生成 + 精准性选择"的解耦范式值得做 LLM 内容生成与推荐对齐的团队参考。

---

### 3. LazFormer: Scaling Transformers for Industrial Recommendation via Transferable Generative Pre-training

📄 [arXiv:2609.14978](https://arxiv.org/abs/2609.14978) | 工业推荐 | 未列出作者

**🗣️ 大白话：** 工业排序模型从零开始同时训稀疏和稠密参数，又贵又慢。预训练能救，但直接搬参数有两个坑：预训练和排序用的特征不一致导致负迁移；多 epoch 训练让稀疏 embedding 过拟合。LIFM（LazFormer）给出的方案是：生成式预训练打底 + 残差适配器搬运稠密参数 + 非对称多 epoch 策略（稀疏参数每轮重置、稠密参数持续累积）。

**🔬 专业讲解：** 三个核心模块：(1) 生成式预训练自回归生成序列特征，为排序阶段提供稀疏+稠密参数的良好初始化；(2) transferable residual adapter 以残差方式注入排序专属特征，解决特征不一致的负迁移；(3) request-aware ranking 模块集成长序列压缩、混合稀疏注意力，高效建模用户长序列；(4) 非对称多 epoch 训练缓解稀疏参数过拟合同时保留稠密参数的累积收益。是工业级 Transformer 排序模型 scaling 的一套完整 recipe。

---

### 4. VARG: Value-Aware and Ranking-Aligned Generative Retrieval for Dynamic E-commerce Search

📄 [arXiv:2609.14493](https://arxiv.org/abs/2609.14493) | 天猫 App 搜索 | 未列出作者

**🗣️ 大白话：** 生成式检索要真上电商主搜，光"相关"不够，还得懂个性化和商业价值。VARG 给物品 ID 加了第三个 token——按价值排序，让候选生成阶段就带着业务价值先验。最终生成的候选直接进现有精排器，不用改造下游。14 天 20% 流量 A/B：GMV +1.45%。

**🔬 专业讲解：** VARG-ID 用 RQ-VAE 构建语义前缀，双向 query-item 对比学习增强相关性，价值排序的第三 token 提供细粒度物品地址+价值先验；三阶段 SFT 依次学习物品标识映射、query 语义检索、个性化检索，其中 LO-SFT（局部序数监督）学习第三 token 编码的簇内局部排序；Prefix-GRPO 用合法性/用户行为/排序器优势/相关性四类门控奖励+前缀感知 token 加权对齐业务价值。每日商品与模型协同更新保持 ID 稳定。离线千万级商品验证，在线 GMV +1.45%、IPV +0.22%、PCTR +0.31%。

---

### 5. P3Rec: Distilling Prior–Posterior Preference Reasoning for LLM-based Recommendation

📄 [arXiv:2609.13993](https://arxiv.org/abs/2609.13993) | 未标注会议 | 未列出作者

**🗣️ 大白话：** 把 LLM 的偏好推理蒸馏给小模型时，多数工作只看一个视角。其实"先验偏好"（稳定长期兴趣，但对当前决策帮助有限）和"后验偏好"（与目标物品相关的细粒度兴趣，但容易过度依赖目标线索）是互补的。P3Rec 把两种知识都蒸馏进来，还用兴趣熵自适应校准用户表示。

**🔬 专业讲解：** 从用户侧提取 target-agnostic 先验偏好与 target-conditioned 后验偏好，从物品侧（语义+前序交互）提取物品中心偏好表示；通过先验偏好吸收（prior preference absorption）与后验引导蒸馏（posterior-guided preference distillation）渐进内化到行为表示；再以兴趣熵刻画历史兴趣分散度，对比检索优化前自适应校准用户表示。兼顾偏好推理完整性与在线推理效率。

---

### 6. Addressing Cross-Stage Decoupling of Semantic and Collaborative Signals in Generative Recommendation

📄 [arXiv:2609.13678](https://arxiv.org/abs/2609.13678) | RecSys 2026 Main Track | 未列出作者

**🗣️ 大白话：** 生成式推荐的"两阶段脱节"问题：tokenization 阶段基本被文本语义主导，协同信号插不进去；生成阶段又基于交互数据重新嵌入，把原始语义丢了。SCRec 做双向补齐——把协同信号文本化注入 tokenization，生成阶段再用可学习的 code embedding 动态校准语义先验。

**🔬 专业讲解：** 三个组件：(i) collaborative-enhanced tokenization 把文本化的协同信号显式注入语义 tokenization，不引入额外对齐任务；(ii) semantic-guided generation 用可学习 code embedding 动态再校准语义先验；(iii) manifold alignment 解决离散 codebook 索引嵌入空间与稠密连续语义空间的几何失配。框架通用，额外训练与推理开销极小，实验验证了有效性、鲁棒性与泛化性。

---

### 7. PCGNet: Unifying Shared and Specific Information for Fashion Matching Recommendations

📄 [arXiv:2609.13339](https://arxiv.org/abs/2609.13339) | 未标注会议 | 未列出作者

**🗣️ 大白话：** 时尚搭配推荐（买上衣推裤子）有两难：既要单品之间"配得上"，又要符合这个用户的口味。现有模型常把这两件事简单解耦，而真实数据又稀疏又噪。PCGNet 用图学习统一建模"兼容性"和"个性化偏好"，从图里自己挖自监督信号。

**🔬 专业讲解：** 多目标图学习框架：对比式互信息最大化提取并对齐共享模式与视图特定模式，捕捉兼容性与个人偏好的复杂交互；correlation-aware neighbor sampling 与可学习全局图增强从图中挖掘自监督信号，提升稀疏/噪声交互下表示的稳定性；最后 BPR 排序损失+多视图互信息损失联合优化打分。两个基准数据集上四项指标全面超越 SOTA。

---

### 8. Odds-Shift Slippage in One-vs-Rest Rankers: Diagnosing and Repairing Reweighting-Induced Top-K Errors

📄 [arXiv:2609.13810](https://arxiv.org/abs/2609.13810) | 未标注会议（代码已开源 oddslip） | 未列出作者

**🗣️ 大白话：** 做 top-K 排序的都爱用 `scale_pos_weight = 负样本/正样本` 来抗类别不平衡，但这背后有个鲜有人量化的坑：理论上加权重 shifts 了 log-odds，但实际模型（尤其是 GBDT）根本 shift 不到位，论文称之为"odds-shift slippage"。后果可能很惨——Santander 数据集上 MAP@7 从 0.808 直接掉到 0.117。

**🔬 专业讲解：** 基于 Elkan 恒等式分析 per-label 正类权重对 log-odds 的理论 shift 与有限学习器实际实现的差距；证明叶子步长被 cap 在 c 的 booster 在 T 轮、学习率 η 下最多实现 Tηc nat 的 shift，无 cap 时饱和单元输出恒为 1.0，任何可分映射都无法校准。实测理想 odds shift 仅解释 23%（LightGBM 对）~98%（MLP 对）的损失，其余为 slippage。修复方案：解析反演仅在 shift 完整实现且无饱和时有效；per-label isotonic regression 校准可将 Santander 恢复至 0.784，但正样本稀缺的标签需映射到先验而非透传。对工业排序做重加权训练的团队是必读的避坑文。

---

## 📋 其他论文速览

- **IROH: Insightful Ranking Of Humor**（arXiv:2609.15618）：JOKER 2026 幽默检索任务冠军系统，三阶段混合检索+LoRA 蒸馏 LLM judge，发现轻量校准好的 7B judge 能打赢 31B。
- **The Magnitude Mirage: Rethinking Confidence for Reasoning-Intensive Retrieval**（arXiv:2609.15578，EMNLP 2026）：相似度分数高低≠置信度，推理型检索上基于分数阈值的弃答近乎随机；改用分数分布信号（Score Gap 等）可零成本修复。
- **Beyond Retrieval: Scaffolding Children's Online Learning**（arXiv:2609.15568）：面向儿童的搜索系统应是脚手架式学习体验而非单纯检索任务。
M_SPANID='0.15.8' - **Benchmarking Embedding Models for ESG Data**（arXiv:2609.15434）：ESG 领域 14 个 embedding 模型检索/RAG 基准，Qwen3 系列最优。
M_SPANID='0.15.9' - **Clean Scores, Buried Evidence, and Confident Wrong**（arXiv:2609.15319）：对前沿 Agentic QA 的"凭证式"审计——把证据藏深后准确率骤降，模型能把准确数字和自信的编造解释混在一起。
M_SPANID='0.15.10' - **ProLiVis 2.0**（arXiv:2609.15236）：蛋白质互作网络文献可视化，提出引用-信任模型为互作证据加权。
M_SPANID='0.15.11' - **Top-K Is Not a Budget for Hybrid Retrieval**（arXiv:2609.15143）：DiBud 把"访问预算"而非固定截断深度作为混合检索融合的输入，增量式认证 RRF 精确前缀。
M_SPANID='0.15.12' - **Route Me If You Can**（arXiv:2609.14885）：QueryRoute 查询改写选择基准——3757 查询、11 候选系统，oracle 上限很大但现有选择器只能吃下一部分。
M_SPANID='0.15.13' - **EviQE: Evidence Selection for LLM-Based Query Expansion**（arXiv:2609.14875）：LLM 查询扩展的关键不在怎么生成，而在读哪些文档——多改写器池化证据+相关性选择效果最佳。
M_SPANID='0.15.14' - **Beyond Benchmark Scores**（arXiv:2609.14579，CIKM 2026）：合成 query 与真实用户 query 分布差异巨大（6.8 词 vs 15.7 词），在合成集上调优的 RAG 配置上线即跳水。
M_SPANID='0.15.15' - **The Wisdom of the Loudest**（arXiv:2609.14575）：对 Reddit Answers 的大规模审计——生成式搜索系统性偏爱显眼、正式、指令式的声音，经验性第一人称叙事在筛选和合成中被削弱。
M_SPANID='0.15.16' - **TF-IDF and BM25 Are Exact KL Divergences**（arXiv:2609.14016）：证明了 TF-IDF 与 BM25 都可精确解释为两个概率模型间的 KL 散度，给经典检索打分一个统一的理论基础。
M_SPANID='0.15.17' - **Pre-retrieval Query Clustering for Adaptive Top-k Retrieval in RAG**（arXiv:2609.13489，CIKM 2026 应用赛道）：离线聚类查询并总结每簇的饱和检索深度，在线常数时间完成 query 自适应 top-k。
M_SPANID='0.15.18' - **Mixture-of-Experts LLMs Can Be Strong and Efficient Retrievers**（arXiv:2609.13486）：MoE 检索器以更少激活参数打赢同级稠密检索器（BEIR 最高 +3.0 nDCG@10），query 编码时还能动态减 expert 省时间。
M_SPANID='0.15.19' - **Decoupling Error Attribution in Cloud-Native Graph-RAG**（arXiv:2609.13324）：Graph-RAG 错误归因框架，发现数据完整性（而非算法推理）才是主要瓶颈，还有个"参数知识掩蔽效应"。
M_SPANID='0.15.20' - **Self-Indexing Attention**（arXiv:2609.13205）：1-bit sign-magnitude 索引统一 prefill/decode 的 token 检索，5% 注意力密度下接近稠密注意力，最高 10.3x 解码加速。
M_SPANID='0.15.21' - **CiteGuard-RAG**（arXiv:2609.15830）：以验证为中心的引用约束 RAG 系统，句级 grounding 校验+单轮重生成，引用有效率 98.3%。
M_SPANID='0.15.22' - **Question's Gambit: The First Move Matters in Agentic Deep Search**（arXiv:2609.14412）：深度研究 Agent 的"第一手检索"很关键——先分解线索、补齐开局上下文，gpt-5 准确率 83.1%→90.5%。
- **ClinAgent**（arXiv:2609.13860，CIBB 2026）：ReAct 式临床试检对话检索 Agent，整合 ClinicalTrials、PubMed 与本地分析工具。
- **AlgoRAG**（arXiv:2609.14572）：面向理论计算机科学教学的 RAG，数学实体识别+记号感知检索，179 道考题 100% 成功率。
- **Semantic Knowledge Technologies**（arXiv:2609.14121）：反思语义 Web 的失败教训，提出"语义知识技术"扩展纲领。
- **Cost Characterization of Vertically Partitioned Federated Knowledge Graphs**（arXiv:2609.13664，ISWC 2026 Workshop）：纵向切分联邦知识图谱四种划分策略的成本刻画，设计问题可归约为跨 silo 路径长度与负载均衡两个矛盾轴。
- **FedV-KGQA in Practice**（arXiv:2609.13661，ISWC 2026 Poster）：联邦 KGQA 实践经验——锚定与图增强比 embedding 模型选择更重要。
