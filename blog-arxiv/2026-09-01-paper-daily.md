---
title: "【推荐系统 Paper 日报】2026-09-01"
date: 2026-09-01
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2784136281"
---

# 【推荐系统 Paper 日报】2026-09-01

## 📊 今日概览

arXiv cs.IR 于 2026年9月1日（周二）更新，本期共收录 50 篇论文，其中推荐系统相关论文 14 篇。本期亮点：生成式检索持续火爆，涵盖电商检索、个性化生成式检索、生成式推荐早期 beam 剪枝修复等多个方向；此外协同过滤图结构分析、多模态推荐 Agent 化、CTR 模型子群竞争优化等方向也有扎实工作。

## 🔥 推荐系统论文深度解读

### 1. Generative Retrieval for E-commerce: Jointly Learning Embedding and Codebook with Same Product Cluster

📄 [arXiv:2608.30606](https://arxiv.org/abs/2608.30606) | cs.IR, cs.AI | Songtao Fang, Zihao Xu, Shaowei Wei, Jin Zhang, Zhuojun Wang

**🗣️ 大白话：** 电商场景下做生成式检索，以前都是先训练一个 embedding 模型，再训一个 codebook 把 embedding 映射成商品 ID。这种两阶段做法有个大问题：第一步出了偏差，第二步根本纠正不回来。而且 codebook 只看 embedding 本身，不管 query 和商品之间的交互关系，导致同类商品可能被分到不同的 ID 簇里。这篇论文提出直接联合训练 embedding 和 codebook，还加了"同类商品"的监督信号，结果检索效果显著提升。

**🔬 专业讲解：** 本文针对 e-commerce 生成式检索中的 cascaded training 问题，提出联合训练策略。核心贡献包括：(1) 同时优化 embedding model 和 codebook，消除两阶段误差累积；(2) 引入 same product cluster 信息作为额外监督信号，约束同类商品在 codebook 映射后的一致性。实验证明该方法在提升检索性能的同时改善了 embedding 和 codebook 的学习质量，对工业界电商检索系统有直接参考价值。

---

### 2. Preference Shapes Relevance: Cross-component Hierarchical Semantic Alignment for Personalized Generative Retrieval (CHAP)

📄 [arXiv:2608.30553](https://arxiv.org/abs/2608.30553) | cs.IR, cs.AI | Gaoming Zhang, Angqing Jiang, Jianchun Song, Kena Qi, Dayao Chen, Wei Lin, Defu Lian

**🗣️ 大白话：** 生成式检索现在很火，但有个核心痛点：商品的 Semantic ID 是从内容生成的，跟用户搜索意图对不上。而且现有的生成式检索不太建模用户行为序列，推理还慢得要命（beam search 自回归解码）。这篇 CHAP 框架从层次化视角解决这些问题：先对齐 query 的隐空间和商品的量化路径，再用离散 SID + 连续表示联合建模用户行为。最巧妙的是引入了残差级联生成机制，把多步 Transformer 解码器压缩到单次推理，速度起飞还不丢信息。三个公开数据集 + 工业私有数据集 + 线上 A/B 实验全部验证有效。

**🔬 专业讲解：** CHAP 提出 Cross-component Hierarchical Semantic Alignment 框架，解决个性化生成式检索中 query-item 语义鸿沟和推理延迟瓶颈。Hierarchical Semantic Alignment 模块同步多粒度语义对齐；个性化框架融合离散 SID 结构引导与连续表示细粒度修正；Residual Cascading Generation 将多步解码压缩为单次推理。在三个公开数据集、一个工业数据集及在线 A/B 测试中均验证了有效性，代码已开源。

---

### 3. Beyond Ranking Accuracy: Evaluating LLM-Cited Feature Rationales for Next Basket Repurchase Recommendation

📄 [arXiv:2608.30333](https://arxiv.org/abs/2608.30333) | cs.IR, cs.AI | Yanan Cao, Anay Dombe, Murali Mohana Krishna Dandu, Shreeranjani Srirangamsridharan, Sinduja Subramaniam, Yogananth Mahalingam, Evren Korpeoglu, Kannan Achan

**🗣️ 大白话：** 下一篮复购推荐一般被当成排序问题做，但排序准就够了吗？用户还想看"为什么推荐这个"。这篇论文用 LLM 生成基于特征的推荐理由（比如"你上个月买了这个，差不多该复购了"），然后在两个公开 grocery 数据集和一个私有零售数据集上评测。结论很有意思：LLM 当排序器不如监督模型，但 LLM 引用的特征确实携带了有意义的排序信号——通过 feature-masking 实验验证。所以 LLM 更适合当"解释组件"而不是主排序器，理由质量应该单独评估。

**🔬 专业讲解：** 本文系统评估 LLM 在 next-basket repurchase recommendation 中的双重角色：作为排序器和作为解释生成器。构建了 cadence/frequency/recency 等复购特征，通过 cross-model feature-masking 协议对比 LLM-cited 特征与模型归因方法。关键发现：(1) off-the-shelf LLM 排序能力不及监督 ranker；(2) LLM-cited 特征在部分设置下携带 outcome-grounded 排序信号，但效果数据集依赖且不稳定。结论指向 LLM 作为 validated explanation component 的实用路径。

---

### 4. CAMIE: Co-Engagement-Aware Multimodal Item Embeddings for Snap Dynamic Product Ads Retrieval

📄 [arXiv:2608.30255](https://arxiv.org/abs/2608.30255) | cs.IR | Xiaodong Liu, Siman Wang, Congfei Zhang, Hsiang-wei Chao, Xiao Bai, Wen Zhang, Jingxiao Ma, Zhe Liu, Yunzhi Zhou, Yajun Wang, Jinchao Li, Yu Zhang

**🗣️ 大白话：** Snap 的动态商品广告（DPA）里做 I2I 检索有个麻烦：视觉、文本、多模态三套编码器各搞各的，检索栈碎片化。而且只靠内容训练的 embedding 跟用户实际的"共交互"行为对不齐。CAMIE 用 LLM/MLLM 骨干网络统一多模态表示，然后用从用户旅程中挖掘的"共交互商品对"做 fine-tune。效果很硬核：线上 CTR +0.390%、CVR +10.832%（vs 多模态对照组），已全量上线。

**🔬 专业讲解：** CAMIE 是 Snap DPA 检索系统的生产级框架。基于 LLM/MLLM 骨干网络的原生多模态接口统一 item 表示空间，通过 symmetric in-batch InfoNCE 目标在 co-engaged item pairs 上 fine-tune。离线指标 Recall@10 超越商业多模态 embedding 模型，同 checkpoint 支持纯文本检索几乎无损。线上作为两个 content-based I2I 编码器的 drop-in 替换，各项指标全面提升，已部署生产。

---

### 5. The Language of the Question Selects the Market: Query Language and Exit IP as Separable Factors in Commercial Recommendations

📄 [arXiv:2608.30052](https://arxiv.org/abs/2608.30052) | cs.IR, cs.CL, cs.CY | Dmitrij Żatuchin

**🗣️ 大白话：** 用 ChatGPT 问商业问题，它推荐哪个市场的产品，其实在你提问的那一刻就被"语言"决定了。作者跑了 234 次实验，4 个出口国家 × 6 种查询语言，发现三件事：(1) 同一问题问 6 遍，top 推荐经常变，系统本身不稳定；(2) 查询语言（而不是地理位置）决定是否出现本地供应商；(3) 语言和位置是可分离的——固定语言只换 IP，市场变了但回答语言不变。结论是：生成式搜索界面的商业推荐存在系统性语言偏差。

**🔬 专业讲解：** 本文通过 234 次受控实验（4 出口国家 × 6 查询语言 × 6 次重复），揭示了生成式搜索界面在商业推荐中的三个结构性发现：(1) top 推荐的系统级不稳定性；(2) query language 作为本地供应商是否出现的决定因素；(3) language 与 location 的可分离性——前者决定品牌出现与否，后者决定市场归属。还通过 minority language 中间层和 negative control 排除了替代解释，指向 nationally regulated categories 可能是根因。

---

### 6. The Edge Spectrum of Choice-Derived Item Graphs: Strong and Weak Edges Encode Different Relations in Collaborative Filtering

📄 [arXiv:2608.29578](https://arxiv.org/abs/2608.29578) | cs.IR | Keigo Sakurai, Takahiro Ogawa, Miki Haseyama

**🗣️ 大白话：** 图协同过滤里大家都假设"边越强，关系越相似"，但这篇论文说：对于从选择模型导出的商品图，这个假设是错的！强边和弱边编码的是质上不同的关系。强边集中在被点击商品的 slate 内竞争者上（正好是排序梯度想推开的），弱边则不是。作者把这个形式化为 smoothing operator 和 ranking gradient 之间的符号错配，并证明了 co-click 图天然不会有这种错配。在 MIND 和 EB-NeRD 上验证了诊断的三个预测。

**🔬 专业讲解：** 本文揭示 choice-derived item 图中的 "edge spectrum" 现象：强边编码 slate 内竞争关系（与排序梯度方向相反），弱边编码不同关系。形式化为图平滑算子与排序梯度间的符号错配，并证明 co-click 图构造上免疫此错配。诊断解释了三个经验观察（drop-in 操作子不优于 co-click、标量修复失败、仅 edge-magnitude-aware 操作子有效），并将 neighbor cutoff k 重新定义为语义开关而非稀疏化超参。提供了可复用的部署前诊断协议，代码已开源。

---

### 7. Agents as Knowledge Integrator and Utilizer in Multimodal Recommendation (AgentMMRec)

📄 [arXiv:2608.29410](https://arxiv.org/abs/2608.29410) | cs.IR | Jinfeng Xu, Zheyu Chen, Shuo Yang, Jinze Li, Puzhen Wu, Zewei Liu, Zheng Lin, Jianheng Tang, Jing Yang, Wei Wang, Xiping Hu, Edith Ngai

**🗣️ 大白话：** 多模态推荐以前的做法是直接把视觉和文本特征塞进 item 表示，但这些信号跟推荐目标不一定对齐。这篇 AgentMMRec 换了个思路：用两个 Agent 协作——Integrator Agent 从训练交互和商品内容中推断用户偏好和商品属性，存到"知识记忆"里；Utilizer Agent 消费这些记忆去精修模态图、构建行为感知同构图、重排候选列表。关键区别是：生成的知识先转成图结构和模型表示再做推荐，不是直接用 LLM 做特征增强或重排。三个 Amazon 数据集上 Recall 和 NDCG 都稳定提升，还能迁移到已有 backbone 上。

**🔬 专业讲解：** AgentMMRec 提出 Agent-based 多模态推荐框架，核心创新在于知识集成视角：Integrator Agent 推断 behavior- and multimodal-aware 偏好/属性并存入可复用知识记忆；Utilizer Agent 在冻结评估时记忆下消费记忆，精修模态专属 item-item 图、构建行为感知同构图并重排候选。与直接 LLM 特征增强和纯 LLM 重排的区别在于知识先转化为图结构和模型表示再服务推荐。在稀疏和 item cold-start 场景均有效，且知识可迁移至已有 backbone。

---

### 8. Personalized Recommender Systems for Gym Workouts: A Reinforcement Learning Approach

📄 [arXiv:2608.29409](https://arxiv.org/abs/2608.29409) | cs.IR | Roan Rosema, Helma Torkamaan, Masoud Mansoury

**🗣️ 大白话：** 健身房推荐系统光推荐"做什么运动"是不够的，还得告诉你做几组、几次、多大重量，而且用户还会跳过某些动作。这篇论文把推荐从"动作选择"扩展到"完整处方"——动作、组数、次数、负荷全包。用 RL 框架做了 4 个环境：纯动作 vs 完整处方 × 有无跳过行为。合成用户实验显示，完整处方任务带来更高奖励和用户参与度，说明健身推荐得做得更实际才行。

**🔬 专业讲解：** 本文将 workout recommendation 从 exercise selection 扩展至 full prescription（exercise + sets + repetitions + load），提出基于 RL 的四环境框架。skip-enabled 环境利用用户跳过行为进行在线个性化。合成用户实验表明 full-prescription 环境产生更高奖励和参与度，验证了现实化任务建模在个性化健身推荐中的重要性。

---

### 9. TAAL: Mitigating Early Beam Pruning in Generative Recommendation via Temporal Autoregressive Alignment

📄 [arXiv:2608.29179](https://arxiv.org/abs/2608.29179) | cs.IR, cs.AI | Lianjie Li, Zhiying Tu, Dianhui Chu, Hongliang Sun

**🗣️ 大白话：** 生成式推荐把商品编码成层次化 Semantic ID，然后用自回归解码检索下一个商品。但标准 next-token 预测有个致命问题：92%-97% 的检索失败发生在前两步 beam search——正确的 SID 在早期就被剪掉了！TAAL 的做法是：训练时从历史转移构造 (c1, c2) 联合软目标，对齐早期前缀分布；推理时用 PMI 校准候选分数，降低高频前缀的影响。在 Amazon Beauty/Instruments/Yelp 上 NDCG@10 分别提升 39.5%、6.7%、28.6%，而且 beam 越窄效果越明显。

**🔬 专业讲解：** TAAL 针对 generative recommendation 中 early beam pruning 问题（91.9%-96.6% 检索失败于前两步解码）。训练阶段构造 (c1,c2) soft target 并通过 forward KL 对齐早期前缀分布；推理阶段用 PMI 校准候选分数抑制高频前缀。在 Amazon Beauty/Instruments/Yelp 上 NDCG@10 分别提升 39.5%/6.7%/28.6%，full-SID 存活率提升 3.9%-16.6%。Beam-width 分析显示 beam 越窄相对增益越大（B=5 时达 39.4%）。

---

### 10. MERIT: Mitigating Exposure Bias in Generative XMC for User-Interest Propensity Modeling

📄 [arXiv:2608.28931](https://arxiv.org/abs/2608.28931) | cs.IR, cs.LG | Abhinav Mahajan, Arindam Sarkar, Prakash Mandayam Comar

**🗣️ 大白话：** 电商平台要把用户匹配到 25 万+ 个兴趣类别上，用自回归语言模型做听起来不错，但有个坑：teacher-forced 训练下，推理时早期错误会像滚雪球一样越滚越大，导致过度推荐相关标签而漏掉真正不相关的兴趣。MERIT 用 self-correction 目标解决这个 exposure bias——把 gold 标签和 hard-negative 混洗，让模型在训练时就看到错误前缀并学会纠正。在 25 万+ 标签的私有数据集上 global recall 提升 11.9%，线上 A/B 测试用户转化率 +0.26%。

**🔬 专业讲解：** MERIT 针对 e-commerce user-interest propensity modeling 中的 exposure bias（teacher-forcing 下早期错误 steer 后续输出趋向共现标签）。提出 permutation-invariant multi-target loss，在 shuffled gold/hard-negative mixtures 上训练，使生成器在错误前缀下仍能纠正。分类位置上的监督产生 propensity-aligned hidden states，支持双向检索（users→interests 和 interests→users）。私有数据集 250k+ 标签上 global recall +11.9%，Hit@k +6.1%，线上 A/B 用户转化 +0.26%。

---

### 11. PRIME: Mitigating Subgroup Optimization Competition in Shared CTR Top Networks with Plug-in Residual Input-Conditioned Mixture of Expert

📄 [arXiv:2608.30449](https://arxiv.org/abs/2608.30449) | cs.LG, cs.IR | Heng Yao, Siyun Hou, Tianying Liu, Yulou Shu, Yong He, Chuan Yuan, Kaibin Qiu, Guowei Chen, Jiayu Zhao, Chao Yu, Ke Ding

**🗣️ 大白话：** CTR 模型的 top network 通常是所有样本共享一个 MLP，但不同用户/商品/场景子群的学习信号不一致，更新同一组参数时梯度方向互相打架。这篇在 Avazu 上测了 4 个模型 4 个语义字段，发现语义子群间梯度余弦相似度比随机分组低 0.23-0.37。PRIME 的做法是：在 Dense 层之上叠加低秩残差 MoE，零残差初始化保证起步时跟 Dense baseline 完全一致，然后 input-dependent routing 做样本专属 logit 修正。13 个 CTR 架构 × 5 个种子配对实验，AUC 稳定提升，还在 FiBiNET 和 DCNv2 上全面超越 APG 且参数更少、推理更快。

**🔬 专业讲解：** PRIME 量化了 CTR 模型 shared top network 中 subgroup optimization competition（语义子群梯度余弦相似度降低 0.23-0.37）。提出 Plug-in Residual Input-conditioned Mixture of Experts：Dense-anchored 低秩残差专家 + 零残差初始化（函数保持）+ input-dependent routing + multi-bag aggregation + EMA load biases。在 13 个 CTR 架构和 5 个 paired seeds 上，Avazu/Criteo 中位 AUC 增益 +0.0022/+0.0066，LogLoss 降低 0.0011/0.0081。代码已开源。

---

### 12. Adaptive Doubly Robust Off-Policy Evaluation for Ranking Policies under Diverse User Behavior

📄 [arXiv:2608.29600](https://arxiv.org/abs/2608.29600) | cs.LG, cs.IR | Kosuke Iguchi, Ren Kishimoto

**🗣️ 大白话：** 排序策略的离线评估（OPE）很难做，因为候选集组合爆炸导致 IPS 方差巨大。之前有 AIPS 通过自适应边际化降低方差，但只用了 IPS 没用 reward model 做残差修正。这篇提出 ADR（Adaptive Doubly Robust），把 adaptive importance weighting 和 reward regression 结合，用 control-variate 修正。在 10000 次模拟实验中，ADR 在各种数据量和排序长度下都比 AIPS 和传统排序 OPE 估计器的 MSE 更低。

**🔬 专业讲解：** 本文提出 Adaptive Doubly Robust（ADR）估计器，针对 ranking OPE 中 AIPS 的局限（长排序时精度下降、未利用 reward model）。ADR 结合 adaptive importance weighting 与 reward regression 的 control-variate 修正，在真实用户行为模型观测下无偏，并在充分条件下方差低于 AIPS。10000 次合成实验验证了在不同 logged-data 大小和排序长度下的 MSE 优势。

---

### 13. FISICA: A Deployed Service for Plantar-Pressure and Posture Assessment with Ontology-Grounded Recommendation

📄 [arXiv:2608.29336](https://arxiv.org/abs/2608.29336) | cs.CV, cs.HC, cs.IR | Juhwan Song, Heejung Kim, Juntae Noh, Jonghak Ryu, Huiju Park, Junseong Lee, Dohyeon Ahn, Byungwoo Jo

**🗣️ 大白话：** FISICA 是一个已经上线生产的体态评估和推荐服务：站一下拍两张照片，就能拿到足底压力数据、体态坐标、3D 虚拟人、可视化报告，以及推荐的鞋和运动方案。硬件是个 634 个力敏元件 + 4 个称重传感器的定制秤。推荐部分用规则引擎而非 LLM——LLM 只负责解释结果。方法贡献在 3D avatar：不是把角度映射到 rig 上调增益，而是用同一函数测 avatar 和真人然后求解到一致。生产环境推荐延迟 2.16-2.26 秒，规则部分 1 秒内。

**🔬 专业讲解：** FISICA 是部署中的足底压力和体态评估推荐服务。硬件为 634 力敏元件（1cm 网格）+ 4 load cells 的定制秤。方法贡献为 sampling-invariant 脊柱度量下的 avatar 求解（正常 vs 驼背记录分离 7.2° vs 单关节 0.9°）。推荐采用 rule-based evaluator（LLM 仅解释存储结果），通用 API 中位数 0.023s，足底分析 0.45s，推荐 2.16-2.26s。产品目录含 699 鞋款 + 10500 条类型化事实，关键点 PCK@0.2 达 0.960。

---

### 14. Can Large Language Models Identify Meaningful Touchpoints in Conversion Attribution?

📄 [arXiv:2608.28649](https://arxiv.org/abs/2608.28649) | cs.CL, cs.AI, cs.IR | Jinqi Wu, Sishuo Chen, Zhangming Chan, Yong Bai, Chao Yi, Han Zhu, Shuodian Yu, Lei Zhang, Sheng Chen, Chenghuan Hou, Jian Xu, Chaoyou Fu

**🗣️ 大白话：** 转化归因里"找到有意义的触点"对电商推荐和广告很关键，但现在主要靠协同过滤启发式规则，跟用户语义意图对不上。通过人工标注，作者发现很多语义相关的隐式触点被现有规则漏掉了。于是系统评估了 LLM 在识别这些隐藏关联上的能力：LLM 确实能挖出一批隐式相关触点，但选择性能还有提升空间。进一步分析了不同 prompting 策略和底座模型的影响，并用 LLM 归因的转化标签增强工业 CVR 模型训练，取得显著离线提升。

**🔬 专业讲解：** 本文系统评估 LLM 在 conversion attribution touchpoint selection 中的能力。通过人工标注揭示现有协同过滤规则与用户语义意图间的语义鸿沟。评估发现 LLM 有效识别隐式相关触点但仍有改进空间。分析了 prompting 策略和底座模型对识别性能的影响，提供了从机械规则匹配到人 aligned 语义推理的路线图。将 LLM 归因转化标签用于工业 CVR 模型训练，取得显著离线性能提升，展示了 LLM 在转化归因中的实用潜力。

---

## 📋 其他论文速览

- **MULTI3IR: A Benchmark for Multi-perspective Multi-domain Multi-modal Information Retrieval**（arXiv:2608.30949）：多视角多领域多模态信息检索基准
- **Learning from What You Retrieve: Online RL Fine-Tuning for Semantic Retrieval**（arXiv:2608.30753）：在线 RL 微调语义检索
- **Local-to-Global Sentence-Level Graph Reranking for Scientific Synthesis**（arXiv:2608.30525）：科学综述的句级图重排
- **HF-SID: High-Fidelity Semantic IDs for Generative Retrieval in Location-Based Services**（arXiv:2608.30479）：位置服务的生成式检索高保真 SID
- **PEARL: Front-Loading Relational Chains for Multi-Hop Table Retrieval**（arXiv:2608.30291）：多跳表格检索的关系链前置
- **SetMIR: Multi-Interest Retrieval as Set Prediction**（arXiv:2608.30251）：多兴趣检索作为集合预测
- **Doc-REFRAG: Rethinking Multimodal Document Retrieval-Augmented Generation**（arXiv:2608.30163）：多模态文档 RAG 重新思考
- **Understanding before verifying: Claim normalization for automated citation verification**（arXiv:2608.30145）：引用验证的声明规范化
- **E-SENS: Exclusion-Sensitive Penalization for Negative-Constraint Retrieval**（arXiv:2608.30130）：负约束检索的排除敏感惩罚
- **Demand-Side Measurement for Generative Engine Optimization**（arXiv:2608.30023）：生成式引擎优化的需求侧测量
- **ICEGR: An Intent-Coherent End-to-End Generative Retrieval Framework for E-commerce Search**（arXiv:2608.29652）：意图一致的电商搜索生成式检索
- **RePair: Turning Retrieval Failures into Counterfactual Hard Pairs**（arXiv:2608.29604）：检索失败转化为反事实困难对
- **Content Exploration Beyond the Feed: Creator Supply and the Shared Corpus**（arXiv:2608.29430）：内容生态探索与创作者供给
- **Database-Augmented RAG for Automated Repair of REST API Misuses**（arXiv:2608.29290）：REST API 误用修复的数据库增强 RAG
- **Book Readership During Movie Releases: An Exploratory Analysis**（arXiv:2608.29019）：电影上映期间的阅读行为探索
- **Configurable Semantic Chunking for Biomedical Information Extraction in RAG**（arXiv:2608.31139）：生物医学 RAG 的可配置语义分块
- **InsightToast: Proactive Information Retrieval & Glanceable Visualization**（arXiv:2608.31115）：主动信息检索与可视化侧信道
- **Learning to Evaluate Before Improving: Automatic Rubric Induction for Automatic Research Agents**（arXiv:2608.31076）：自动评测标准归纳
- **ECGQuest: Benchmarking and Fine-Tuning Language Models for Electrocardiography**（arXiv:2608.30893）：心电图的 LLM 基准与微调
- **Playability-Aware Audio-to-Tablature Guitar Transcription via Diffusion Models**（arXiv:2608.30854）：吉他可玩性感知的扩散模型转录
- **Hi-Q: Hierarchical Evidence-guided Query Refinement for Multi-Hop QA**（arXiv:2608.30468）：多跳问答的层次证据引导查询精修
- **CHASE: How Content Ecosystems Are Reshaped When Ranking Is the Only Target**（arXiv:2608.30466）：内容生态系统在纯排序目标下的重塑
- **Beyond Polarization: The Generative Constraint of Chain-of-Thought in Pointwise Reranking**（arXiv:2608.30398）：CoT 在 pointwise 重排中的生成约束
- **RSLM: Training-Free Vector Quantization for Approximate Nearest Neighbor Search**（arXiv:2608.30384）：免训练向量量化的 ANN 搜索
- **Spatial Matryoshka Training for Multi-Granularity Visual Document Retrieval**（arXiv:2608.29951）：多粒度视觉文档检索的空间套娃训练
- **REIGN: Refurbished Embeddings with Integrated Guidance Networks for Efficient Context-Length Scaling**（arXiv:2608.29899）：高效上下文长度扩展的嵌入修复
- **You Know What I Mean: A Benchmark for Agentic Conversational Reference Grounding**（arXiv:2608.29834）：对话引用消解基准
- **LLMs Interpret, Embeddings Organize, Graphs Emerge: Agent-Driven Compilation of Scientific Knowledge**（arXiv:2608.29612）：Agent 驱动的科学知识汇编
- **SnapBench: Benchmarking Snap-and-Ask Multimodal Retrieval for Mobile Interactions**（arXiv:2608.29607）：移动端拍问多模态检索基准
- **What Are You Listening to? Temporal Music Grounding for Audio-to-Text LLMs**（arXiv:2608.29480）：音频到文本 LLM 的时序音乐定位
- **Cloud and On-Premises Deployment of Uzbek Legal RAG via Targeted Retriever Fine-Tuning**（arXiv:2608.29284）：乌兹别克法律 RAG 的检索器微调
- **Validating FKG.in: Soundness Assessment in LLM-Augmented Indian Food Knowledge**（arXiv:2608.29249）：印度食物知识库的 LLM 增强验证
- **Context-Aware Interpretable Representations for Retrieval and GCN Classification**（arXiv:2608.29004）：检索与 GCN 分类的上下文感知表示
- **Effective Graph and Rank-based Contextual Embeddings for Textual and Multimedia Data**（arXiv:2608.29001）：图与排序的上下文嵌入
- **ASTRA - Agentic System for Ticket Resolution and Analysis**（arXiv:2608.28790）：工单解决分析的 Agent 系统
- **Weaving Visual Narratives: Agentic Image Bundle Composition Beyond Atomic Visual Matching**（arXiv:2608.28695）：超越原子视觉匹配的图像束组合
