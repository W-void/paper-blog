---
title: "【推荐系统 Paper 日报】2026-09-26"
date: 2026-09-26
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2789811359"
---

# 【推荐系统 Paper 日报】2026-09-26

## 📊 今日概览

本期覆盖 arXiv cs.IR 方向 9 月 25 日（Fri, 25 Sep 2026）公告的论文，今日共 30 篇，其中推荐系统相关 11 篇。今天堪称"生成式推荐日"：Semantic ID 相关论文一口气来了 4 篇（包括同一团队的姊妹篇），工业界还有 OneTrans-V2 统一三级漏斗、AgentX 自主研究框架、CMRec 跨国家 code-mixing 等重磅落地工作，含金量很高。

## 🔥 推荐系统论文深度解读

### 1. From Interests to Semantic IDs: Retrieval-Grounded Credit Assignment for Generative Recommendation

📄 [arXiv:2609.29983](https://arxiv.org/abs/2609.29983) | 作者：Mengdan Zhu, Yufan Zhao, Yao Zhao, Sophie Di, Tao Di, Yulan Yan, Sridhar Iyer, Liang Zhao

**🗣️ 大白话：** 生成式推荐现在流行"先推理再出答案"——模型先写一段用户兴趣分析，再据此生成下一个物品的 Semantic ID。但训练时奖励只看最终 ID 对不对，中间那段推理写得好不好根本没人管，等于让模型瞎猜哪个推理步骤有用。这篇的解法很聪明：把推理拆成一条条"兴趣假设"，每条假设扔给一个冻结的检索器当查询去搜目标物品——搜到了就说明这条假设靠谱，单独给它发奖励。相当于把"考试只看总分"改成"每道小题单独批分"。

**🔬 专业讲解：** 论文针对 reasoning-enhanced GR 用 GRPO + 精确匹配 SID 奖励时的两个失效模式：(1) group 内全部 rollout 未命中目标时 advantage 全零、无学习信号；(2) 共享相同 SID 奖励的 rollout 获得相同 advantage，无论其推理轨迹差异多大，形成 credit-assignment gap。方法将每条 trace 结构化为 history summary + interest hypotheses + final SID，用 frozen retriever 将每条 hypothesis 作为独立可验证的目录查询，以 top-K 命中作为 span 级奖励信号，且检索通道不更新 final SID span，从而实现差异化 advantage。三个 Amazon Reviews 数据集上一致提升 SID 推荐效果；Video Games 上的 oracle 分析进一步揭示了 interest-conditioned SID decoding 的潜力。

---

### 2. Learning Better Reasoning for Generative Recommendation with Semantic IDs

📄 [arXiv:2609.29973](https://arxiv.org/abs/2609.29973) | 作者：Mengdan Zhu, Yufan Zhao, Sophie Di, Yao Zhao, Tao Di, Yulan Yan, Sridhar Iyer, Liang Zhao

**🗣️ 大白话：** 同一团队的另一篇（应该是姊妹工作）。核心观点：给推荐模型加"思考"不一定是好事——如果推理内容不准确或没信息量，反而会把后续的物品生成带偏。Evo-Rec 的思路是"让模型自己挑好的思考过程"：先采样多条候选推理链，只保留那些真的帮模型预测对了 ground-truth 物品的，用它们做 SFT 打底，再用强化学习继续优化，并约束生成必须落在商品目录内、奖励对齐排序指标。一句话：推理也要择优汰劣。

**🔬 专业讲解：** 提出三阶段框架：(1) 语义 ID 对齐——将 SID 与文本及行为上下文对齐，使模型具备理解和生成 item identifier 的能力；(2) 推理轨迹筛选——采样多条候选 reasoning trace，仅保留能改善 ground-truth item 预测的样本，通过 SFT 提供更强的推理初始化；(3) RL 优化——采用 catalog-constrained item generation 防止幻觉物品，配合 ranking-aware 推荐反馈优化推理策略。在三个 Amazon Review 基准上全面超越判别式、生成式及 reasoning-enhanced 推荐基线。

---

### 3. LSF-SR: Latent Semantic Fusion for Sequential Recommendation via Flow-based Conditional Variational Autoencoders

📄 [arXiv:2609.29815](https://arxiv.org/abs/2609.29815) | CIKM 2026 | 作者：Shih-Hong Chen, Josh Jia-Ching Ying, Vincent S. Tseng

**🗣️ 大白话：** 序列推荐里老生常谈的问题：LLM 提供的文本语义很丰富，但和协同过滤信号"尿不到一个壶里"。这篇用 CVAE 加 Normalizing Flows 做融合，学出一个灵活的隐空间，让语义相近的物品在流形上自然聚堆。效果实在：五个公开数据集上 Recall@20 最高提升 12.98%，NDCG@20 最高提升 14.13%。

**🔬 专业讲解：** 针对 LLM 语义信号与协同信号对齐不足的问题，提出 flow-based CVAE 融合框架：条件融合模块（planar/radial flow 增强）学习柔性隐空间，鼓励语义相似物品在 latent manifold 上聚类，实现 item ID embedding 与 LLM 语义表示的互补融合。在五个公开基准上稳定超越 SOTA 基线。

---

### 4. Anatomy of a Decision: Uncertainty-aware Hierarchical Intent Learning via Flow Matching for Multimodal Recommendation

📄 [arXiv:2609.29609](https://arxiv.org/abs/2609.29609) | WISE 2026 | 作者：Yuchen Miao, Zijun Wang, Ke Liu, Siyang Xu

**🗣️ 大白话：** 用户意图本来就是个"薛定谔的猫"——有时候用户自己都不知道想买啥。现有方法通常学一个静态、扁平的意图集合，忽略了多模态特征里的不确定性。UHIFlow 用 flow matching 给视觉和文本模态的不确定性定量，再据此动态搭意图层级：用户意向模糊就给粗粒度意图，偏好明确就上细粒度。有点"看人下菜碟"的意思，而且是合理的看人下菜碟。

**🔬 专业讲解：** 两个模块：(1) CUSM（Cross-modal Uncertainty Synergistic Modeling）用 conditional flow matching 量化视觉/文本模态不确定性并做跨模态协同对齐；(2) UHIG（Uncertainty-guided Hierarchical Intent Generation）以量化的不确定性为引导，动态构建个性化意图层级——不确定用户生成 coarse-grained intent，偏好清晰用户生成 fine-grained intent。三个真实数据集上显著超越 SOTA。

---

### 5. OneTrans-V2: Unifying Retrieval, Pre-rank, and Fine-rank with One Transformer in Industrial Recommender

📄 [arXiv:2609.28589](https://arxiv.org/abs/2609.28589) | 作者：Hannan Cao, Jun Guo, Haolei Pei 等 21 人

**🗣️ 大白话：** 工业级推荐经典痛点：召回、粗排、精排三套模型各自训练、各自服务，用户行为序列被反复编码三遍，优化目标还互相打架。OneTrans-V2 直接一个 Transformer 统吃整个漏斗：序列只编码一次作为共享上下文，三级联合训练互相成就，还内置了精排到粗排的知识蒸馏。线上成绩单：GMV +9.74%，同硬件预算下吞吐 3.2 倍。这是今天最" industrial"的一篇。

**🔬 专业讲解：** 关键设计：(1) 稀疏 MoE 扩展共享 backbone，配合 μP 风格参数化稳定 scaling；(2) DCGR（Decision-Conditioned Generative Retrieval）——预测描述即将发生交互的 decision prefix 并以此条件化生成物品，让业务目标通过单一生成过程引导多路召回；(3) SNT（Sequence-Native Training）围绕用户终身行为序列组织训练，将序列编码成本摊销到多次曝光。在大型工业推荐系统全三级部署，GMV +9.74%，3.2× 吞吐。

---

### 6. Decoupled Learning and Selection in Slate Recommendation for Privacy and Stability Under Noisy Scores

📄 [arXiv:2609.29453](https://arxiv.org/abs/2609.29453) | RecSys 2026 | 作者：Sam Urmian, Qinyi Liu, Mohammad Khalil

**🗣️ 大白话：** 列表推荐（一次给用户推荐一组物品）怎么在"分数有噪声"和"隐私要保护"的前提下保持结果稳定？这篇把问题形式化成"随机打分器 + 确定性选择器"两段式，证明差分隐私可以经由后处理穿过选择器，还给出了一个"边际证书"：只要分数扰动低于最小贪心决策边际的一半，就能保证列表排序不变。偏理论但很扎实。

**🔬 专业讲解：** 两个核心贡献：(1) privacy-scope contract——端到端 DP 保证仅在 selector 输入为公开/独立、先前私有输出或单独核算时成立，fixing raw state 只能得到条件保证；(2) logged margin certificate——有界 score-induced objective movement 小于最小贪心决策边际一半时可证明 ordered slate 不变。固定边际实验显示近线性指数 scaling（经验斜率 -0.220 vs 独立噪声参考 -1/4），在 OULAD、MovieLens-25M、Amazon Musical Instruments 上验证。

---

### 7. Cross-Country Code-Mixing for Generative Recommendation

📄 [arXiv:2609.28972](https://arxiv.org/abs/2609.28972) | CIKM 2026 Short | 作者：Yuan Gao, Hao Deng, Haibo Xing, Yi Xu, Lingyu Mu, Jinxin Hu, Yu Zhang, Xiaoyi Zeng

**🗣️ 大白话：** 跨国家电商推荐的大麻烦：各市场用户/物品 ID 空间完全隔离，知识只能靠参数共享"暗中传功"。这篇从多语言 NLP 的 code-switching（混用语言）借来灵感，CMRec 先用多模态内容+行为共现学一个共享语义 codebook，再在数据层面合成"混国家序列"，还有 context-aware loss 给混入样本按合理性加权。线上 A/B：广告收入 +1.77%，订单 +2.64%，对数据稀疏市场帮助尤其大。

**🔬 专业讲解：** 现有跨国家 GR 的知识迁移停留在参数级（data-level 缺失）。CMRec 三步：(1) 从多模态内容与跨国家行为共现学习 shared semantic codebook；(2) dual-constrained（静态内容 + 动态价格/受众/热度）context-aware code-mixing 做 token 级替换合成混合序列；(3) context-aware loss 按混入样本在当前序列的 plausibility 重加权。两个真实多国数据集 + 线上 A/B 验证。

---

### 8. Advancing Model Research in AgentX: Long-Horizon Autonomy for Industrial Recommender Systems

📄 [arXiv:2609.30001](https://arxiv.org/abs/2609.30001) | Technical Report（37 页）| 作者：Shuang Yang, Zijie Zhuang, Changxin Lao 等 23 人

**🗣️ 大白话：** 这篇讲的是"让 AI 自己做推荐系统研究"。AgentX-Model 用双 Agent 架构：Research Agent 负责读论文、写提案、决定下一个研究问题；Model Agent 负责多轮实验、返回代码和测量结果。两者接力，让后续实验能建立在前面发现之上。636 个完成的改模型实验里 560 个 AUC 超过业务基线，最新五次线上 A/B 拿到获客效率 +10-15%、观看时长 +0.3-0.8% 等收益——而且时长模型用的 FLOPs 和参数还少了约 10%。推荐系统研究自动化这条线，工业界已经跑起来了。

**🔬 专业讲解：** 双 Agent 架构 + 沙箱化（business inputs / prediction tasks 定义边界）。研究循环围绕四个动作组织：Reproduce、Follow-up、Composition 驱动常规研究，Diagnose 负责收集证据选择修复方案（包括业务反馈与线上评估暴露的问题，如 PCOC 度量的预测偏差）。生产评估：636 个 model-changing 实验 560 个 AUC 超基线；五个最新线上 A/B 报告获客效率 +10-15%、目标人群广告花费 +15-20%、观看时长 +0.3-0.8%（时长模型约省 10% FLOPs/参数）；另设计 dependency-aware historical-replay benchmark 评估研究资源分配。

---

### 9. ScalarLens: Numerical Embeddings with Stable Coordinates and Contextual Responses for CTR Prediction

📄 [arXiv:2609.29182](https://arxiv.org/abs/2609.29182) | 12 pages, 5 figures | 作者：Heng Yao, Tianying Liu, Yulou Shu 等

**🗣️ 大白话：** CTR 模型里数值特征（价格、年龄）的 embedding 通常假设"一个数只有一个表示"。但同一个数值区间在不同上下文里含义可能完全相反。ScalarLens 的解法：用单调局部网格从标量本身构建稳定坐标（值的位置不变），再用有界低秩动态产生上下文相关的响应（怎么解读随样本变）。1539 组实验、19 种表示方法对比，27 个设置里 25 个排第一。把数值 embedding 重新定义成"测量问题"——坐标属于值，响应属于样本——这个视角很漂亮。

**🔬 专业讲解：** 动机：Criteo 验证集上同一数值区间在类别/数值上下文中携带符号相反的残余点击证据（即使移除了加性主效应）。方法：monotone local mesh 构建仅依赖 focal scalar 的稳定坐标 + bounded low-rank dynamics 生成 contextual response，坐标严格不变、不替换类别 token 与 CTR backbone。1539 次主实验（19 表示 × 3 数据集 × 9 backbone × 3 seeds）中 25/27 设置排名第一；控制实验证明增益不能由 scale correction、额外局部容量或通用 conditioning 复现；共享标准化下的完整重跑仍显著优于 DEER、DAES、NaryDis。

---

## 📋 其他论文速览

- **SEEK: Skill-Routed Evaluation with Evolvable Knowledge for Industrial Search**（arXiv:2609.29803）：工业搜索质量评估框架，用技能路由 + 可演化知识让 LLM 自动评估在页面级体验与多维标准间对齐。
- **EvLink: Source-Grounded Evidence Linking for Graph RAG**（arXiv:2609.29695）：EMNLP 2026，证据链接检索器，解决 Graph RAG 中"图可达≠证据支持"的问题。
- **SmallReason-ColBERT**（arXiv:2609.29652）：EMNLP 2026，仅 32M 参数的 late-interaction 检索器，在推理密集检索（BRIGHT）上追平 150M+ 推理调优基线。
- **OBLIQ-IR: Training a Dense Retriever for Oblique Queries**（arXiv:2609.29649）：EMNLP 2026，训练稠密检索器处理"斜向查询"——相关性由文档表面看不到的隐含属性决定。
- **A Systematic Multi-Domain Evaluation of Document Retrievers**（arXiv:2609.29455）：跨多领域系统评估文档检索器，弥补现有对比研究局限于单一基准/领域的碎片化问题。
- **Asymmetric Dynamic Routing**（arXiv:2609.29282）：超图 RAG 的非对称动态路由，按查询复杂度分配推理深度，解决"静态检索谬误"带来的算力浪费。
- **X-Rec Technical Report**（arXiv:2609.29180）：生成式推荐下一物品预测的检索技术报告，突破 U2I 确定性向量与语义 ID 自回归两种范式的局限。
- **Seek: Self-Evaluative Exploration for Knowledge Retrieval**（arXiv:2609.28980）：CIKM 2026，免训练迭代检索框架，通过自我评估反复探索语料，挽回单次检索永久漏掉的相关文档。
- **The Fellowship of the Query: Learning Retrieval Actions**（arXiv:2609.28653）：用轨迹微调训练小模型做 RAG 的下一步动作控制器（分解/检索/改写/验证/停止）。
- **Return or Revise? Learning When Revision Helps Retrieval-Augmented QA**（arXiv:2609.30087）：学习"直接返回草稿答案还是用检索证据修订"的决策，用草稿置信度估计修订收益。
- **An Empirical Study of VLM Pipelines for Long-Document QA**（arXiv:2609.29933）：EMNLP 2026 Industry Track，长文档 QA 中 VLM 流水线的喂入方式/检索器/静态与 agentic 取舍的实证研究。
- **Fair Feed Ranking for Participatory Budgeting**（arXiv:2609.29819）：GoodIT '26，参与式预算场景下的公平信息流排序——提案展示顺序即议程设置权力。
- **C3M: Cross-Session Multimodal Memory Maintenance**（arXiv:2609.29735）：跨会话多模态记忆维护，在有界预算下保存并恢复长程任务的图文证据。
- **SALI**（arXiv:2609.29721）：文本到视频检索中的 shot 级 late interaction，用电影语法知识捕捉跨镜头人物关系。
- **Stochastic Semantic Evidence Graphs**（arXiv:2609.29703）：面向 Agentic AI 的随机语义证据图，将不确定性传播与治理引入证据链评估。
- **Ingest-Time Fact Compilation**（arXiv:2609.29661）：把"重建语料当前有效状态"的工作从查询时挪到入库时，降低含修订语料 QA 的成本。
- **An Exploratory Ablation of a Small MLA–SSM Hybrid Language Model**（arXiv:2609.29618）：MLA+SSM 混合小模型的单种子探索性消融。
- **CodeGraph**（arXiv:2609.29474）：CIKM 2026，面向源代码的开放分类学知识图谱，用 Wikidata 做锚定。
- **ASIRF**（arXiv:2609.29191）：NeurIPS 2026 GlobalSouthAI，按输入域动态检索脱敏定义的 Agentic 敏感信息脱敏框架。
- **Claim-Gated Source-Risk Auditing for Generative Search**（arXiv:2609.29145）：生成式搜索的声明门控来源风险审计，检测答案遗漏的关键来源关系。
- **Reinforcement Learning with Verifiable Rewards for Small Search Agents**（arXiv:2609.28765）：将 RLVR 推广到开放域 QA 搜索 Agent——奖励不再那么明确的场景还能不能用。
