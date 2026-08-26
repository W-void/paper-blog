---
title: "【推荐系统 Paper 日报】2026-08-26"
date: 2026-08-26
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2783062558"
---

# 【推荐系统 Paper 日报】2026-08-26

## 📊 今日概览

arXiv cs.IR 公告日期 **Wed, 26 Aug 2026**，今日共收录 **50 篇**论文，其中与推荐系统直接相关的有 **17 篇**。本期亮点：两篇关于 Carousel 推荐评估的工作（Kang 的博士研究和 N2DCG 改进）、多篇工业界实践报告（微信多模态嵌入、直播广告生成式推荐、短视频观看时长预测），以及 LLM 与推荐系统融合的新思路（跨域序列推荐的负迁移缓解、群体推荐的记忆增强推理）。

---

## 🔥 推荐系统论文深度解读

### 1. Rethinking Semantic Alignment in LLM-Enhanced Collaborative Filtering: A Spectral Decoupling Approach

📄 [arXiv:2608.24363](https://arxiv.org/abs/2608.24363) | 作者：Yedong Jin, Shaowen Peng, Tsunenori Mine, Shoko Wakamiya, Eiji Aramaki

**🗣️ 大白话：** 现在流行把大语言模型的语义表示和推荐系统的协同表示"对齐"到同一个空间里，但这篇论文发现——对齐反而可能把有用的信息弄丢了！协同信号喜欢低频的"平滑"部分，而语义信号的有用信息藏在那些不显眼的高频分量里。强行对齐，语义里的"宝藏"就被压没了。

**🔬 专业讲解：** 作者从频谱分析的角度重新审视 LLM 增强的协同过滤。发现协同表示由用户-物品同质性主导，集中在低频平滑分量；而语义嵌入的非主奇异分量包含有用信息。实验表明，对齐操作会将学习到的表示 increasingly 集中在主导的协同和主语义子空间中，减少了与非主语义分量的重叠。基于此，提出 **UniSpecRec**，通过对协同和语义表示分别进行信号特定的频谱滤波，在各自空间保留两种表示，无需跨空间对齐或额外可训练参数即可组合预测。在多个基准上验证了有效性、效率和泛化性。

---

### 2. Tlow: Flow-based Item Tokenizer for Recommendation

📄 [arXiv:2608.24176](https://arxiv.org/abs/2608.24176) | 作者：Nian Li, Chonggang Song, Jingtao Ding, Lingling Yi, Yong Li, Qingmin Liao

**🗣️ 大白话：** 生成式推荐系统里，物品通常被编码成一串 token ID。这篇工作想了个巧妙的办法——用"流模型"把物品语义嵌入变成一个标准正态分布，这样 tokenization 就变得又简单又好，还能解决新物品的冷启动问题。微信上线实测：CTR 提升了 10% 以上！

**🔬 专业讲解：** 针对现有 RQ-VAE tokenizer 解码效率低（codebook 间依赖）、OPQ 难以处理维度相关性和分布复杂性的问题，提出 **Tlow**（flow-based item Tokenizer）。通过流模型将原始语义嵌入变换到标准正态分布的潜在空间，实现维度独立性和分布简洁性的双重优势；同时引入 codebook guidance 对齐 codebook 空间与 token 嵌入空间。在四个公开数据集上的离线实验验证了有效性，跨域和多模态推荐上的改进证明了简化嵌入空间中物品 tokenization 的泛化能力。微信多模态检索任务的在线实验显示，基于 token ID 的检索模型全局 CTR 提升 **10.32%**，新物品 CTR 提升 **11.64%**。

---

### 3. Native Multimodal Representation Learning for Click-Through Rate Prediction in E-Commerce Scenarios

📄 [arXiv:2608.24091](https://arxiv.org/abs/2608.24091) | 作者：Chao Yi, Feifan Yang, Jiawei Feng, Sishuo Chen, Zhangming Chan, Xiang-Rong Sheng, Han Zhu

**🗣️ 大白话：** 电商推荐里的多模态 CTR 预测，通常是先在一个任务上预训练多模态编码器，再拿来给 CTR 模型用。但预训练和 CTR 任务的目标不一样，效果总差点意思。直接端到端联合训练呢？也不行——因为用户点击行为里既有语义因素也有非语义因素，编码器学不到"干净"的监督信号。这篇论文的解决思路是：先从 CTR 数据里"挖掘"出那些最能用多模态解释的高质量样本，再用这些样本去微调编码器。

**🔬 专业讲解：** 现有两阶段范式（多模态预训练 → CTR 模型集成）因训练目标和数据分布差异限制了多模态表示在下游 CTR 任务中的效果。端到端联合训练虽直观，但分析发现用户行为由多模态语义和非多模态因素共同驱动，导致模糊监督和编码器更新不一致。为此提出 **Mine-Then-Train** 方法：从 CTR 数据中挖掘高质量、多模态可解释的训练样本，用于微调多模态编码器以更好对齐用户点击偏好。离线实验和在线实验均验证了有效性。

---

### 4. TAGR: Temporally Adaptive Generative Recommendation for Industrial Live-Streaming Advertising

📄 [arXiv:2608.24034](https://arxiv.org/abs/2608.24034) | 作者：Wencai Ye, Guangyi Liu, Chaoyi Wang, Wenbin Luo, Shengyu Wang, Mingjie Sun, Peng Wang, Quanming Yao, Wenjin Wu, Peng Jiang

**🗣️ 大白话：** 直播带货推荐跟普通推荐不一样——主播在换、商品在换、用户在换，一切都变得特别快。传统生成式推荐模型用的是静态物品 ID，根本追不上直播间的变化。TAGR 从三个层面做了"时间自适应"：物品 token 定期刷新、用户意图多粒度建模、偏好优化策略周期性更新。上线实测 revenue 涨了 16%！

**🔬 专业讲解：** 针对直播广告场景中内容、商品和用户反馈快速变化的 freshness 需求，提出 **TAGR** 三层次时间自适应生成式推荐框架：
- **Token 层**：Live Semantic-Collaborative ID (LSID) 基于当前直播场景和推广商品定期刷新活跃广告的 SID，同时保留稳定的层次化 token 词汇表用于自回归生成。
- **意图层**：Intent-Aware Generation (IAG) 在多时间粒度上建模直播间进入历史作为主意图序列，将辅助行为作为独立输入，并用请求后意图证据和业务价值加权 next-token 预测。
- **对齐层**：Intermittent On-Policy Preference Optimization (IOPO) 周期性地从当前策略采样新鲜候选组，进行行为和价值对齐的偏好更新，并与监督 NTP 维护交错进行。

在大规模电商直播广告平台部署后，直播间进入率和购物车点击率分别提升 **8.5%** 和 **7.4%**，收入提升 **16.1%**。

---

### 5. RecGPT-Mobile-V2 Technical Report

📄 [arXiv:2608.24295](https://arxiv.org/abs/2608.24295) | 作者：Lingqing Zhang, Bin Zhang, Weipeng Huang, Chengfei Lv 等（28 位作者）

**🗣️ 大白话：** 这是一份来自工业界的技术报告，讲的是怎么在手机端做个性化 Query 预测——就是把用户的点击、收藏、购买等行为翻译成明确的搜索意图。核心挑战是：行为轨迹 noisy 且多尺度，同一个轨迹可能对应多个有效 Query，而且简单实例和复杂实例需要的推理能力不一样。RecGPT-Mobile-V2 设计了一个分阶段框架，让模型"该简单时简单、该复杂时复杂"，最后用蒸馏压缩到端上部署。

**🔬 专业讲解：** RecGPT-Mobile-V2 是一个端到端框架，将意图质量和执行效率作为耦合目标进行分阶段设计：将异构交互转换为保留证据的轨迹 → 通过领域适配和监督对齐建立推荐原生基础能力 → 在分组 rollout 满足 grounding 和 utility 标准后应用推理成本优化。将得到的 teacher 模型蒸馏为 compact student，通过低比特执行、结构化压缩和预算感知的端-云路由部署。在 CoT 消融中，证据聚焦的短推理链将 ROUGE-L 从 0.228 提升到 0.315，Jaccard 从 0.174 提升到 0.248；完整奖励公式在 RL 比较中将 Query 质量从 73.2% 提升到 78.6%，硬失败率从 3.6% 降至 1.6%，中位 CoT 长度从 62 降至 14 token。

---

### 6. Adaptive Item-based Collaborative Structures via Noise Rescheduling in Diffusion for Generative Recommendation

📄 [arXiv:2608.23400](https://arxiv.org/abs/2608.23400) | 作者：Jiaqi Wang, Tianying Liu, Heng Chang, Jihong Guan, Wengen Li, Shuigeng Zhou

**🗣️ 大白话：** 离散扩散模型（DDM）最近被用来做生成式推荐，把用户历史当成 token 序列来生成。但这些方法有个问题：只关注用户级别的序列模式，忽略了物品之间的协同过滤信息——比如经常一起被买的物品应该有关联。这篇论文把物品共现矩阵塞进扩散过程里，还设计了一个自适应的噪声调度机制，让模型在 denoising 时知道"哪些物品应该先恢复"。

**🔬 专业讲解：** 现有 DDM 方法在以下两方面缺乏显式的 item-based CF 信息：(1) 物品表示通常是语义导向的，缺少扩散训练的协同先验；(2) denoising 过程使用统一噪声调度，对所有 token 一视同仁，忽略了物品级别的自适应结构依赖。提出 **ANR-DiffRec**：首先显式引入物品共现矩阵指导语义 ID 生成，为离散扩散训练提供结构化协同先验；其次提出基于物品的 adaptive noise rescheduling 机制，根据局部上下文可恢复性和行为感知物品依赖动态调整 denoising 权重。该策略联合建模 intra-item 结构上下文和 inter-item 协同信号，实现扩散训练中的结构感知去噪。在多个基准上超越 SOTA 生成式推荐模型。

---

### 7. Towards a Densing Law for User Representation Learning at Billion-Scale Capacity

📄 [arXiv:2608.23392](https://arxiv.org/abs/2608.23392) | 作者：Bin Dou, Junru Zhang, Zhaoyi Yuan, Wuliang Huang, Letian Gong, Baokun Wang, Huan Li, Yu Cheng, Weiqiang Wang

**🗣️ 大白话：** 用户表示学习在工业界通常靠堆数据、堆序列长度、堆模型尺寸来扩展。但作者发现，到了十亿级别，原始文本行为的扩展会出现瓶颈——加更多数据效果反而 diminishing returns。tokenization 能突破这个瓶颈，但 tokenization 的配置（容量多大？）该怎么随数据规模调整？这篇论文提出了一个"Densing Law"，发现 tokenization 最小充分容量和数据规模在对数空间近似线性关系。

**🔬 专业讲解：** 在十亿级容量的支付宝数据集上进行原始 vs. tokenized 扩展对比实验，揭示原始数据扩展瓶颈和 tokenization 带来的持续增益。通过理论分析和系统实验，总结出最小充分 tokenization 配置在不同数据规模下的定量扩展模式：最小充分 tokenization 容量与输入数据规模（以 token 计）的对数之间存在近似线性关系，且扩展斜率随 tokenization 方法和数据来源系统变化，反映了表示空间冗余度和来源内独特性的差异。基于此提出 **ALGN**（adaptive variable-length tokenization），改进容量分配。在多个数据来源、tokenization 方法和下游任务上验证了 Densing Law 的泛化性和可靠性。

---

### 8. Hierarchical Exponential-Gaussian Mixtures for Watch-Time Distribution Prediction

📄 [arXiv:2608.23356](https://arxiv.org/abs/2608.23356) | 作者：Sofia Gulevskaia, Mikhail Trapeznikov, Aleksandr Poslavsky, Alexander D'yakonov

**🗣️ 大白话：** 短视频推荐里，预测用户会看多久（watch-time）很关键。但观看时长分布有个特点：大量零值（用户划走）、长尾、多模态。之前最好的方法是 EGMN（指数-高斯混合网络），但作者在大规模复现中发现它有方差崩溃、组件冗余、组件失活等问题。这篇论文提出了 HEGM，用层次化分解、KL 方差正则化等手段解决了这些问题，还在生产环境做了 1.5 个月的 A/B 测试验证。

**🔬 专业讲解：** EGMN 建模条件 WT 分布而非单点估计，但大规模复现揭示其存在方差崩溃、组件冗余和组件失活问题。提出 **HEGM**（Hierarchical Exponential-Gaussian Mixture），通过层次化 skip-watch 分解、KL-based 方差正则化、结构化初始化、移除强制高斯偏移和熵正则化来解决这些失效模式。在公开和大规模工业数据集上，HEGM 改进了排序精度和阈值事件预测，同时保持有竞争力的点估计精度，并显著改善混合稳定性和可解释性。1.5 个月生产 A/B 测试确认了统计显著的 engagement 提升。

---

### 9. A Dual-Expert Strategy Integrating LLMs to Mitigate Negative Transfer in Cross-Domain Sequential Recommendation

📄 [arXiv:2608.23131](https://arxiv.org/abs/2608.23131) | 作者：Hyeongjun Yun, Kihyuk Song, Jaegul Choo, Chung Park

**🗣️ 大白话：** 跨域序列推荐（比如同时预测用户在电影和音乐平台的行为）里，用 LLM 做推荐有个麻烦事：LLM 擅长处理文本 token 的自回归模式，但物品级别的协同信号容易被忽略。这导致跨域知识转移时"帮倒忙"——也就是负迁移。这篇论文搞了个双专家架构：一个专家只看单域信息，另一个看跨域信息，然后用门控机制动态融合，用单域信号去抑制跨域噪声。

**🔬 专业讲解：** 现有 LLMRec 方法主要建模 token 级物品文本的自回归模式，忽略物品级协同信号，导致跨域语义错位和负迁移。提出 **DuELRec**（Domain-gated Dual Experts with LLMs for Cross-Domain Sequential Recommendation）：
- 领域门控双专家框架，配备物品感知注意力变换模块，将文本子 token 聚合为物品级表示并强制块级注意力掩码；单域专家将自回归注意力限制在同一域内，跨域专家允许跨域注意力；门控机制自适应融合二者输出。
- 双采样 token-to-item 对比学习目标，通过将 token 级文本转换为物品级表示，从单域和跨域物品池中进行随机负采样，使 LLM 捕获物品级协同信号。

在两个真实世界数据集的十个域上，超越 26 个 SOTA 方法。

---

### 10. Cascading Relevance-driven Recommendation Network for CTR Prediction in Trigger-Introduced Recommendation

📄 [arXiv:2608.22973](https://arxiv.org/abs/2608.22973) | 作者：Kaixuan Chen, Wenwen Wang, Xing Fang, Yang Huang, Jing Wang

**🗣️ 大白话：** 电商里有个场景叫"触发式推荐"——用户点了一个商品（触发物），下面展示相关目标商品。这跟搜索不一样，触发物的意图比搜索词更模糊。这篇论文的 CRRN 模型专门加强了触发物和目标物之间的交互和相关性建模，用个性化门控提取交互特征，用级联注意力块融合即时兴趣和个人兴趣，还用类别关联来增强相关性。

**🔬 专业讲解：** 针对 Trigger-Introduced Recommendation (TIR) 场景中触发物包含较强但模糊的即时兴趣、现有方法缺乏触发相关性的问题，提出 **CRRN**（Cascading Relevance-driven Recommendation Network）：
- Trigger-Target Interaction 层：基于个性化门控提取触发物和目标物的交互特征。
- Cascading Interest Fusion 模块：显式估计用户触发意图，用级联注意力块自适应融合即时兴趣和个人兴趣。
- Category-assisted Pairwise Loss：用触发物和目标物之间的类别关联指导增强触发相关性。

在工业和公开数据集上超越近期 SOTA，在线 A/B 测试进一步验证有效性。

---

### 11. Rethinking Item Tokenization in Generative Recommenders: From Fixed Atoms to Semantic Subwords

📄 [arXiv:2608.22734](https://arxiv.org/abs/2608.22734) | 作者：Xinrui Miao, Mingjia Yin, Jiaqing Zhang, Wei Guo, Yong Liu, Yuyang Ye, Hao Wang, Enhong Chen

**🗣️ 大白话：** 生成式推荐里物品通常被编码成固定长度的语义 ID（比如 4 个 token）。但作者发现这有个问题：模型花太多注意力在"一个物品内部的 token 之间是什么关系"，而不是"不同物品之间的行为规律"。于是他们提出把物品表示成可变长度的"语义子词"——encoder 端用短编码减少内部注意力开销，decoder 端保留固定长度保证预测稳定性。

**🔬 专业讲解：** 提出 **SST**（Semantic Subword Tokenization）解决生成式推荐中的 Intra-item Attention Overload 问题：
- **IST**（Item-level Subword Tokenization）：将稳定的相邻原子 token 合并为紧凑的语义子词 token，减少 encoder 中的 intra-item 重组。
- **BCA**（Behavior-induced Co-occurrence Augmentation）：注入粗粒度语义前缀迁移信号，将释放的建模容量引导向 inter-item 行为规律。

Encoder 端用可变长度语义子词表示历史物品，decoder 端保留固定长度目标解码。在三个公开数据集和三个生成式推荐 backbone 上验证，优于固定长度和可迁移可变长度 SID 基线。

---

### 12. From Click Modeling to Offline and Off-Policy Evaluation in Carousel Recommendation

📄 [arXiv:2608.22022](https://arxiv.org/abs/2608.22022) | 作者：Jingwei Kang

**🗣️ 大白话：** 这是一篇博士研究概述，聚焦于 Carousel（轮播/多行推荐）界面。Carousel 跟普通列表推荐不同——它同时展示多个可横向滑动的行，用户行为不仅受物品偏好影响，还受行组织、视口约束和物品上下文的影响。Kang 的研究目标是建立从点击建模到离线评估再到 off-policy 评估的完整链路。

**🔬 专业讲解：** Carousel 界面中排名与展示的紧密耦合使用户反馈解释复杂化。Kang 的博士研究包括：(1) 用户与 Carousel 交互的行为研究；(2) 优先关注观察变量间数学关系而非潜在行为假设的点击模型设计框架；(3) 使用离散选择模型表示点击选择；(4) 开发 Carousel 专用的离线指标；(5) 从日志交互中估计推荐策略性能的 off-policy 评估方法。预期贡献是将 Carousel 点击建模与离线和 off-policy 评估连接起来的系统性工作。

---

### 13. Enhancing Group Recommendation with Memory-Augmented Reasoning in LLM Agent

📄 [arXiv:2608.21939](https://arxiv.org/abs/2608.21939) | 作者：Qimeng Niu, Bowen Hao, Zixuan Zhang, Shuyu Qu, Hongzhi Yin

**🗣️ 大白话：** 群体推荐（比如给一群朋友推荐餐厅）的核心难点是：群体偏好会随时间演化，而且群体决策过程很复杂。现有 LLM 方法把交互历史当固定文本处理，忽略了动态演化，也缺乏显式的群体决策建模。这篇论文提出了 AGR——一个带记忆模块和推理模块的 LLM Agent，能动态管理群体/用户历史，并通过多步推理生成可解释的推荐。

**🔬 专业讲解：** 提出 **AGR**（LLM-based Agent for Group Recommendation）：
- **Memory Module**：采用基于 token 的哈希表动态管理群体和用户的交互历史，支持插入、更新、检索、遗忘无关记录和总结演化画像。
- **Reasoning Module**：基于检索到的动态画像执行多步推理，包括群体兴趣收集、群体共识精炼、多维度评估和可解释推荐生成。

采用 RFT（Reinforcement Fine-Tuning）范式：先用 SFT 赋予模型调用 Memory 和 Reasoning 模块的基本能力，再用 GRPO（Group Relative Policy Optimization）增强其自主协调这些模块的能力。在 LastFM 和 Douban 数据集上显著超越 SOTA。

---

### 14. Revisiting N2DCG: An Empirically Grounded Reformulation of Carousel Recommendation Evaluation

📄 [arXiv:2608.21877](https://arxiv.org/abs/2608.21877) | 作者：Jingwei Kang, Santiago de Leon-Martinez, Maarten de Rijke, Harrie Oosterhuis

**🗣️ 大白话：** N2DCG 是用来评估 Carousel 推荐的指标，但它从单列表搜索借来的假设在二维 Carousel 布局上并不成立。这篇论文揪出了两个大问题：理想排名违反了 Carousel 的约束，折扣函数也不反映真实的用户浏览行为。于是他们重新设计了 N2DCG，用基于真实眼动数据的折扣函数，让它更靠谱。

**🔬 专业讲解：** N2DCG 的两个主要局限：(1) 用于归一化的理想排名违反 Carousel 约束；(2) 折扣函数不反映二维布局中的经验性用户浏览行为。提出 reformulated N2DCG，通过尊重约束进行适当归一化，并使用基于经验数据的折扣函数。在真实世界眼动数据上验证，证明 reformulated 指标更好地反映用户经验行为，并更好地预测基于经验检验模式模拟的 Carousel 布局比较结果。

---

### 15. Why didn't more people see it? Recommendation: Transparency for providers

📄 [arXiv:2608.21641](https://arxiv.org/abs/2608.21641) | 作者：Meysam Varasteh, Robin Burke

**🗣️ 大白话：** 推荐系统的可解释性研究大多站在"用户"视角——为什么给我推这个？但这篇论文关注另一个被忽视的群体：内容提供者（创作者）。他们想知道自己的内容为什么有/没有获得曝光。作者训练了一个代理模型来近似推荐系统的曝光分布，通过量化每个特征的贡献来解释驱动曝光的因素。

**🔬 专业讲解：** 提出 surrogate modeling 方法在系统层面解释物品曝光：训练代理模型近似推荐器产生的曝光分布，通过量化每个特征的贡献来解释驱动推荐模型在整个用户群上决策的因素。在两个数据集和三个推荐模型上评估，代理模型以高保真度捕获所有三个推荐器的全局行为，且最具影响力的因素在不同模型和领域间有意义地变化。

---

### 16. Auditing Return Conditioning as a Control Knob: An Offline Diagnostic for Decision Transformer Recommendation

📄 [arXiv:2608.24815](https://arxiv.org/abs/2608.24815) | 作者：Jingyu Wang | 会议：CONSEQUENCES '26 @ RecSys 2026

**🗣️ 大白话：** Decision Transformer (DT) 做推荐时，用 return-to-go (RTG) 作为条件来控制推荐行为。但 RTG 干预到底能不能真正控制推荐？这篇论文做了系统的离线审计：改历史上下文里的 RTG vs 只改当前 RTG，效果差很多；打乱 RTG 顺序也会大幅削弱效果。有意思的是，在 MovieLens 上能控制 Crime 类型的推荐，但在 MyAnimeList 上却不行——说明 RTG 控制不是万能的。

**🔬 专业讲解：** 使用 RTG 局部性阶梯（locality ladder）在 MovieLens 25M 和 MyAnimeList 2020 上评估 Decision Transformer。发现 K=20 覆盖完整上下文的干预将 Crime 预测占比从验证集 5th 到 95th 百分位移动 +23.61±2.96 个百分点，而仅改变当前槽位仅移动 +1.77±1.17 个百分点；打乱 RTG 模型基本消除此响应。但在 MAL 上相同协议未产生 Drama 响应。提出四项检查：干预局部性、无 RTG 基线、奖励检查和 RTG-内容消融。

---

### 17. The Disconnect Between Better Descriptive Reasoning Trace Quality and Recommendation Effectiveness

📄 [arXiv:2608.23154](https://arxiv.org/abs/2608.23154) | 作者：Gustavo Penha, Juan Elenter, Claudia Hauff, Hugues Bouchard, Paul Bennett, Mounia Lalmas

**🗣️ 大白话：** 生成式推荐里，有人觉得让 LLM 生成详细的推理链（Chain-of-Thought）能提升推荐效果。但这篇论文做了一个控制实验：对比了用自然语言标题 vs 语义 ID（SID），以及不同 SID 对齐程度下的推理质量。结果发现——更好的推理链质量并没有带来更好的推荐效果！自然语言标题产生的推理更 grounded、更可解释，但推荐效果反而下降。SID 对齐改善了推理质量，也没改善推荐效果。

**🔬 专业讲解：** 使用 Qwen3-1.7B backbone 在三个 Amazon 产品域上进行 2×2 因子研究（物品表示：Title vs. SID × 语义 grounding：最小 vs. 大量 SID 对齐）。发现显式描述性推理链在标准 SFT 和 RL 训练下降低了传统离线推荐效果，尽管自然语言标题产生更 grounded 和可解释的痕迹。大量 SID 对齐改善了描述性痕迹质量但未改善传统离线推荐效果，而更丰富的奖励信号部分恢复了性能。总体表明，在所研究的训练目标和评估协议下，改善描述性推理链质量本身不足以持续改进传统离线推荐效果。

---

## 📋 其他论文速览

以下论文虽与推荐系统相关度较低，但涉及 IR/RAG/表示学习等方向，值得关注：

- **EviGraph**（2608.24667）：可验证证据构建的信息检索 Agent。
- **CodeHID**（2608.24089）：生成式代码检索的地址化层次代码索引学习。
- **RetrievalFormer**（2608.24079）：双编码器 Transformer 用于高效近似最近邻检索。
- **SQLite is Enough**（2608.24060）：用 SQLite 实现词汇、语义和混合搜索（scrydb）。
- **AdaWidth**（2608.23862）：查询自适应嵌入宽度用于稠密检索。
- **WeMM-Embedding**（2608.24053）：微信多模态嵌入技术报告。
- **RAGSentinel**（2608.23965）：可认证几何共识用于鲁棒 RAG。
- **Robustness of IR Models to Collection Growth**（2608.23419）：信息检索模型对集合增长的鲁棒性分析。
- **Evaluating Modern RAG**（2608.23176）：文本、多模态、稠密和迟交互 RAG 管道的评估。
- **Hypergraph Embedding Indexing**（2608.22980）：超图嵌入索引用于高效稠密向量检索。
- **FashionKG-RAG**（2608.22688）：知识图谱增强的 RAG 用于时尚领域。
- **Retrieval Needs Multivectors**（2608.21494）：多向量检索的指数级分离理论分析。
