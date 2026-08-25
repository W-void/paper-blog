---
title: "【推荐系统 Paper 日报】2026-08-25"
date: 2026-08-25
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2782990451"
---

# 【推荐系统 Paper 日报】2026-08-25

## 📊 今日概览

arXiv cs.IR 今日（Tue, 25 Aug 2026）公告 **43 篇**新论文，其中推荐系统及相关领域论文 **18 篇**。本期亮点：扩散模型与推荐系统深度融合（ANR-DiffRec）、用户表征缩放规律（Densing Law）、生成式推荐器中的语义子词分词（SST）等技术方向均有重要进展，CIKM 2026 和 RecSys'26 论文密集亮相。

---

## 🔥 推荐系统论文深度解读

### 1. ANR-DiffRec: 扩散模型遇上物品协同过滤

📄 [arXiv:2608.23400](https://arxiv.org/abs/2608.23400) | 作者：Jiaqi Wang, Tianying Liu, Heng Chang, Jihong Guan, Wengen Li, Shuigeng Zhou

**🗣️ 大白话：** 离散扩散模型（DDM）最近被引入推荐系统，把用户历史建模成 token 生成过程。但有个问题——它只顾着学用户自己的序列，忘了物品之间的"谁和谁常一起买"这种协同信号。好比一个服务员只记得客人每次点的菜，却不知道菜单上哪些菜是经典搭配。本文提出 ANR-DiffRec，一方面用物品共现矩阵指导语义 ID 生成，另一方面给不同物品设计了自适应的噪声调度策略——热门搭配的物品少加点噪声，冷门搭配的多加点，让扩散过程更懂推荐。

**🔬 专业讲解：** 本文识别了 DDM 在推荐中的两个关键缺陷：(1) 物品表征偏重语义，缺乏协同先验；(2) 去噪过程采用均匀噪声调度，忽略物品级结构依赖。解决方案包含两个核心模块：一是显式引入物品共现矩阵引导语义 ID 生成，为离散扩散训练提供结构化协同先验；二是提出基于物品的自适应噪声重调度机制（Adaptive Noise Rescheduling），根据局部上下文可恢复性和行为感知物品依赖动态调整去噪权重。实验在多个 benchmark 上验证了 SOTA 性能。代码已开源。

---

### 2. 用户表征的"缩放定律"：十亿级场景下的 Densing Law

📄 [arXiv:2608.23392](https://arxiv.org/abs/2608.23392) | 作者：Bin Dou, Junru Zhang, Zhaoyi Yuan, Wuliang Huang, Letian Gong, Baokun Wang, Huan Li, Yu Cheng, Weiqiang Wang

**🗣️ 大白话：** 做推荐系统的都知道，用户数据越多越好、模型越大越好——但到了十亿级别，这个规律就失效了。 raw 文本数据堆上去，效果提升越来越小。本文的洞见是：给用户行为做 tokenization（类似 LLM 的 BPE），可以把"稀疏的" raw 数据压缩成"稠密的" token，然后提出一个量化公式——Densing Law——告诉你：给定了数据规模，最少需要多少个 token 才能充分表达用户信息。

**🔬 专业讲解：** 工业级用户表征学习面临两个挑战：(1) 十亿级原始数据规模下的性能瓶颈；(2) 缺乏 tokenization 配置随数据规模缩放的定量分析。本文基于支付宝十亿级数据集开展 pilot study，揭示原始数据缩放存在收益递减瓶颈，而 tokenization 能带来持续提升。进一步推导 User Behavioral Densing Law，刻画数据规模与最小充分 tokenization 容量之间的定量关系。这是一个从工程实践中提炼出的规律性认识，对超大规模用户建模有重要指导意义。

---

### 3. HEGM: 短视频观看时长预测的层次化混合模型

📄 [arXiv:2608.23356](https://arxiv.org/abs/2608.23356) | ICDM 2026 | 作者：Sofia Gulevskaia, Mikhail Trapeznikov, Aleksandr Poslavsky, Alexander D'yakonov

**🗣️ 大白话：** 短视频推荐里，预测用户会看多久是个核心问题。但观看时长分布有个特点：大量零值（用户划走）、长尾（少数视频被看很久）、多模态（不同场景分布不同）。之前的 EGMN 模型虽然 SOTA，但论文作者在实际复现中发现它会"方差崩溃"、组件冗余。本文提出 HEGM，通过层次化的"跳过-观看"分解、KL 方差正则化和结构化初始化，让模型更稳定、更可解释。

**🔬 专业讲解：** 本文针对短视频观看时长（WT）分布的零膨胀、长尾、多模态特性，在 EGMN 大规模复现研究的基础上，识别出三大失效模式：方差崩溃、组件冗余、非活跃组件。HEGM 模型通过四项改进解决这些问题：(1) 层次化跳过-观看分解；(2) KL 基于方差正则化；(3) 结构化初始化；(4) 去除强制高斯偏移和熵正则化。在公开和工业大规模数据集上，HEGM 提升了排序精度和阈值事件预测，同时显著改善混合模型的稳定性和可解释性。

---

### 4. CRRN: 触发式推荐中的级联相关性驱动网络

📄 [arXiv:2608.22973](https://arxiv.org/abs/2608.22973) | 作者：Kaixuan Chen, Wenwen Wang, Xing Fang, Yang Huang, Jing Wang

**🗣️ 大白话：** 电商里有个场景叫"触发式推荐"（Trigger-Introduced Recommendation）：用户点了一个商品（trigger），进入详情页后看到相关推荐（target）。这里的 trigger 比搜索词更模糊、比普通推荐更强。现有方法没充分利用 trigger 和 target 之间的相关性。CRRN 用三层架构：先提取 trigger-target 交互特征，再做多层相关性感知表征，最后用级联网络预测 CTR。

**🔬 专业讲解：** 本文聚焦 Trigger-Introduced Recommendation（TIR）场景，识别其核心挑战：trigger 包含强但模糊的即时兴趣，现有方法依赖大量标注数据且缺乏对 trigger 相关性的探索。CRRN 提出三个核心组件：(1) Trigger-Target Interaction 层，基于个性化特征提取 trigger 与 target 的交互特征；(2) 多层相关性感知表征学习；(3) 级联相关性驱动推荐网络。通过显式建模 trigger-target 交互和相关性，提升用户沉浸式体验。

---

### 5. SST: 生成式推荐器的语义子词分词——从固定原子到语义子词

📄 [arXiv:2608.22734](https://arxiv.org/abs/2608.22734) | CIKM 2026 | 作者：Xinrui Miao, Mingjia Yin, Jiaqing Zhang, Wei Guo, Yong Liu, Yuyang Ye, Hao Wang, Enhong Chen

**🗣️ 大白话：** 生成式推荐器把物品 token 化成固定长度的语义 ID，然后做自回归预测。但有个问题：模型花太多注意力在"把语义 ID 的片段拼回完整物品"上，而不是学习"用户行为序列中物品之间的转移规律"。本文的 SST 方法，把物品表示成可变长度的"语义子词"——类似 NLP 里 BPE 的思想，热门物品用短编码，长尾用长编码，释放模型容量去学真正的行为规律。

**🔬 专业讲解：** 本文识别生成式推荐器中的 Intra-item Attention Overload 问题：细粒度的固定原子 token 导致过多注意力消耗在低级的 intra-item 依赖上，而非高阶 inter-item 行为转移。SST 提出两个核心机制：(1) Item-level Subword Tokenization (IST)，将稳定相邻的原子 token 合并为紧凑语义子词，减少编码器中的 intra-item 重组；(2) Behavior-induced Co-occurrence Augmentation (BCA)，注入粗粒度语义前缀转移信号，引导释放的建模容量关注 inter-item 行为规律。在三个公开数据集上验证有效。

---

### 6. 描述性推理与推荐效果之间的"断裂带"

📄 [arXiv:2608.23154](https://arxiv.org/abs/2608.23154) | RecSys'26 Workshop | 作者：Gustavo Penha, Juan Elenter, Claudia Hauff, Hugues Bouchard, Paul Bennett, Mounia Lalmas

**🗣️ 大白话：** 最近大家热衷于给生成式推荐加"思维链"——让模型一步步解释为什么推荐这个。但本文做了个对照实验，发现：加了显式推理反而降低了推荐效果。因为语义 ID（SID）是模型自己学的 opaque 标识符，不是自然语言，LLM 需要大量对齐才能理解。换句话说，让模型"解释"推荐过程，反而干扰了它本来做得不错的推荐任务。

**🔬 专业讲解：** 本文在 Amazon 三个品类上开展 2×2 因子实验，系统比较语义 ID 与自然语言标题作为物品表征，以及最小/充分 SID 对齐条件下的描述性推理质量。核心发现：引入显式描述性推理轨迹在标准 SFT 和 RL 训练下降低了传统离线推荐效果，即使自然语言标题产生更高质量的推理轨迹。这表明生成式推荐系统中"更好的推理"与"更好的推荐"之间存在非平凡的权衡，为 LLM-based 推荐系统的设计提供了重要警示。

---

### 7. DuELRec: 用大模型做跨域序列推荐，解决负迁移

📄 [arXiv:2608.23131](https://arxiv.org/abs/2608.23131) | CIKM 2026 | 作者：Hyeongjun Yun, Kihyuk Song, Jaegul Choo, Chung Park

**🗣️ 大白话：** 跨域推荐（比如用你在电影网站的评分预测你会买啥书）有个老大难问题：负迁移——从源域学的知识反而拖累目标域。现有 LLM 方法只关注文本 token 的自回归模式，忽略了物品级别的协同信号。本文提出双专家框架：一个专家搞文本，一个专家搞协同，然后用 domain gate 动态融合，让模型知道什么时候用哪种知识。

**🔬 专业讲解：** 本文针对 CDSR 中 LLMRec 的负迁移问题，提出 DuELRec 框架。核心创新包括：(1) domain-gated 双专家架构，分别建模文本和协同信号；(2) item-aware 注意力变换模块，将文本子词聚合为物品级表征；(3) block-level 注意力机制，强制在物品级别而非 token 级别建模。通过显式分离和融合跨域知识，减轻语义不对齐导致的负迁移。CIKM 2026 接收。

---

### 8. 工具检索中的风险感知重排序

📄 [arXiv:2608.22751](https://arxiv.org/abs/2608.22751) | CIKM 2026 | 作者：Qinfei Li, Xiaoxuan Dong, Jin Zhang, Dexu Yu, Wenhao Deng, Junchen Fu, Youhua Li, Hanwen Du, Chunxiao Li

**🗣️ 大白话：** LLM Agent 能调用外部工具（查天气、订机票），但工具检索有个安全隐患：给 Agent 一个能删数据库的 tools，哪怕 query 只是"查天气"，也可能出问题。本文提出风险感知重排序：在检索阶段就考虑工具的风险等级，用一个可调参数平衡"有用"和"安全"，并通过 ToolGraph 传播风险信息。

**🔬 专业讲解：** 本文提出首个面向 LLM Agent 工具检索的风险感知重排序框架。与文档检索不同，工具检索暴露的是可执行动作，同一工具在不同任务中的风险各异。框架在冻结的一阶段检索器之上进行轻量级重排序：(1) 分别建模 query 条件相关性和工具级暴露风险；(2) 通过显式参数控制安全与效用权衡；(3) 在 ToolGraph 上平滑分数；(4) 可选应用规则化安全约束。CIKM 2026 接收。

---

### 9. AGR: 用大模型 Agent 做群组推荐，还带记忆和推理

📄 [arXiv:2608.21939](https://arxiv.org/abs/2608.21939) | 作者：Qimeng Niu, Bowen Hao, Zixuan Zhang, Shuyu Qu, Hongzhi Yin

**🗣️ 大白话：** 群组推荐（比如一群人一起点外卖）的核心难题：怎么把每个人的偏好动态融合成"共识"？现有 LLM 方法把交互历史当固定文本，忽略了群组成员偏好的自然演化。本文 AGR 有两个模块：记忆模块用 token-based hash table 动态管理用户和群组的交互历史（支持插入、更新、检索、遗忘、摘要）；推理模块基于检索到的动态画像进行多步推理，包括群组兴趣共识、个体偏好协商、最终推荐生成。

**🔬 专业讲解：** 本文提出 AGR（LLM Agent for Group Recommendation），包含记忆模块和推理模块。记忆模块通过 token-based hash table 实现动态历史管理，支持 CRUD 操作和遗忘/摘要机制，高效追踪群组和用户画像的演化。推理模块基于检索到的动态画像执行多步推理：Group Interests Consensus → Individual Preference Negotiation → Final Recommendation。显式建模群组决策过程的复杂性，这是传统协同过滤和静态 LLM 方法所缺乏的。

---

### 10. N2DCG 再审视：轮播推荐评估的经验重 formulation

📄 [arXiv:2608.21877](https://arxiv.org/abs/2608.21877) | 作者：Jingwei Kang, Santiago de Leon-Martinez, Maarten de Rijke, Harrie Oosterhuis

**🗣️ 大白话：** 轮播推荐（视频/音乐 App 里横向滑动的那几行）是二维布局，但现有的 N2DCG 指标把一维搜索的假设直接搬过来，不太合理。本文发现两个 bug：一是它的"理想排序"违反了轮播的物理约束（比如一行最多放几个 item）；二是 discount 函数没反映用户真实的浏览行为。作者用眼动数据重新拟合了 discount，让指标更贴近真实用户体验。

**🔬 专业讲解：** 本文识别 N2DCG 的两个根本性局限：(1) 理想排序违反轮播约束（行数、列数、viewport 限制）；(2) 折扣函数未反映用户浏览行为的经验模式。提出 reformulated N2DCG：通过约束感知归一化修正理想排序，基于眼动数据拟合经验折扣函数。在真实眼动数据上验证，新指标更好反映用户行为，更好预测轮播布局的对比实验结果。与 Kang 的另一篇 arXiv:2608.22022（博士论文）形成系列研究。

---

### 11. 为什么推荐 A 而不是 B？基于反事实的成对解释

📄 [arXiv:2608.21662](https://arxiv.org/abs/2608.21662) | 作者：Meysam Varasteh, Veronika Bogina, Noam Koenigstein, Robin Burke

**🗣️ 大白话：** 推荐系统的可解释性研究大多关注"为什么推荐 A"，但用户真正想知道的可能是"为什么 A 排在 B 前面"。本文从人际沟通心理学获得灵感，提出成对排名解释任务：找到用户历史交互中导致 A 排在 B 前面的那些物品。用反事实学习来挖掘这些"关键影响因素"。

**🔬 专业讲解：** 本文提出 recommender systems 中的成对解释新任务："Why is item A ranked higher than item B?" 基于心理学中比较性解释的研究，认为有效的成对解释应植根于推荐算法的实际运行机制。提出基于反事实学习的技术族，挖掘用户画像中对物品相对排名有贡献的物品。在多个数据集上验证可行性，为推荐系统的对比性解释提供算法基础。

---

### 12. 物品提供者的透明度：为什么我的内容没曝光？

📄 [arXiv:2608.21641](https://arxiv.org/abs/2608.21641) | 作者：Meysam Varasteh, Robin Burke

**🗣️ 大白话：** 推荐系统的透明度研究大多站在用户角度（"为什么给我推这个"），但内容创作者（providers）也有知情权："我的内容为什么没得到曝光？" 本文用代理模型（surrogate model）来近似推荐系统的曝光分布，通过量化各特征的贡献，解释驱动推荐模型决策的因素。

**🔬 专业讲解：** 本文提出面向物品提供者的系统级曝光解释方法。不同于解释单个用户-物品对，训练代理模型近似推荐器产生的曝光分布，通过特征重要性量化各因素对曝光决策的贡献。在两个数据集和三个推荐模型上评估，代理模型以高保真度捕获推荐器的全局行为，且最具影响力的因素因模型而异。这是 provider 视角推荐透明度的首次系统性研究。

---

### 13. 多向量嵌入：检索理论上的指数级分离

📄 [arXiv:2608.21494](https://arxiv.org/abs/2608.21494) | 作者：Mihir Agarwal, Viraj Agrawal, Sabyasachi Basu, Ankit Garg, Kirankumar Shiragur

**🗣️ 大白话：** 单向量嵌入（如 DPR）做检索有个理论瓶颈：有些查询-文档关系，单向量需要指数级维度才能区分，而多向量（如 ColBERT）只需要多项式级。本文构造了第一个显式的"难例"家族，证明了单向量与多向量在文档排名任务上的表达能力存在指数级差距，还推出了 ANDOR benchmark 来实际验证这个理论。

**🔬 专业讲解：** 本文延续 Jayaram 的理论工作，首次为文档排名任务提供显式的查询-文档集和关联矩阵家族，证明单向量嵌入需要指数级尺寸才能将所有相关文档排在无关文档之上，而多项式尺寸的多向量嵌入即可。这建立了单向量与多向量在排名任务（而非近似数值分数）上的表达能力指数级分离。受理论构造启发，推出 ANDOR 检索 benchmark，自然实例化这些难例。为现代检索系统的设计提供了理论基础。

---

### 14. 超图嵌入索引：密集向量检索的新思路

📄 [arXiv:2608.22980](https://arxiv.org/abs/2608.22980) | 作者：Kishore Konda

**🗣️ 大白话：** 密集向量检索用的 ANN 索引（如 HNSW、IVF）把整个向量当做一个点。本文换个思路：把向量中高度激活的维度组合看成超图的边，用超图来组织文档。这既能用倒排索引的思路快速召回候选，又保留了密集向量的语义排序能力。多个互补超图还能提升覆盖率，而不会因维度增加导致组合爆炸。

**🔬 专业讲解：** 本文提出 Hypergraph Embedding Index (HEI)，将文档按高激活潜在嵌入维度组合组织，实现坐标倒排索引式的候选生成，同时保留密集嵌入的语义排序能力。证明构建多个互补超图可在避免单一超图维度组合爆炸的同时提升检索覆盖率。引入 activation diversity 作为诊断指标，刻画嵌入激活的统计特性对坐标倒排索引效率的影响。为密集向量检索提供了新的索引范式。

---

### 15. RAG 评估：文本、多模态、密集、迟交互的系统性比较

📄 [arXiv:2608.23176](https://arxiv.org/abs/2608.23176) | 作者：Emre Kuru, Mehmet Onur Keskin

**🗣️ 大白话：** 现在的 RAG 系统花样越来越多：纯文本的、带图片的、用密集向量的、用迟交互的（比如 ColBERT）。但怎么选？本文提出一个数据驱动的选择方法论：根据你的文档类型、效果要求和资源限制，给出最优 pipeline 推荐。对于包含表格、图片的文档，多模态 pipeline 效果更好；但对于纯文本，传统的密集检索可能更划算。

**🔬 专业讲解：** 本文提出 RAG pipeline 的定量数据驱动选择方法论。评估当代文本和多模态 pipeline（包括密集和迟交互架构），分析各 pipeline 的效果-资源权衡。关键发现：对于布局、表格、视觉元素丰富的文档，VLM 驱动的多模态检索显著改善效果；但对于纯文本语料，文本密集检索在效果和效率上仍具竞争力。提供 actionable guidance，帮助从业者基于语料特征和资源约束选择最优方案。

---

### 16. WARP: 用 Wasserstein 距离做观点分布对齐的 RAG

📄 [arXiv:2608.22859](https://arxiv.org/abs/2608.22859) | 作者：Aman Singh Thakur, Aditya Agrawal, Alwarappan Nakkiran, Alex Karlsson

**🗣️ 大白话：** RAG 做观点总结时有个偏见问题：top-k 检索按相似度排序，少数派观点容易被淹没。现有多样性重排（MMR、DPP）没有目标分布；基于 KL/JS 的校准方法把观点强度当无序类别处理。WARP 先用 Wasserstein-1 距离衡量检索结果与人群观点分布的匹配度，然后校准检索证据，确保少数派观点不被遗漏。

**🔬 专业讲解：** 本文提出 WARP（Wasserstein-Aligned RAG for Population Opinions），首个基于最优传输的检索后观点校准算法家族。核心创新：(1) 恢复 cosine 排序可能埋没的少数派观点；(2) 使用 Wasserstein-1 距离（而非 KL/JS）选择 sentiment-intensity 分布与人群目标匹配的文档，因为 Wasserstein 考虑了观点强度的有序性；(3) 提供多样性重排与校准方法的统一框架。为人口观点代表性检索提供新范式。

---

### 17. 答案波动：RAG 索引更新导致的隐性风险

📄 [arXiv:2608.22856](https://arxiv.org/abs/2608.22856) | 作者：Jingjie Ning, Xueqi Li

**🗣️ 大白话：** RAG 系统有个隐性 bug：索引扩大后（比如从 1 个 shard 变 7 个），即使模型、prompt、检索策略全不变，答案也可能变。这种变化被 aggregate accuracy 掩盖了——有的问题答对了，有的答错了，总和看起来差不多。本文提出 Snapshot Compatibility Audit，用"同快照重复实验"和"跨快照对比"的差分方法，量化这种"accuracy-blind answer churn"。在 Natural Questions 上发现 6.44% 的额外波动，而准确率只变化了 -1.5%。

**🔬 专业讲解：** 本文提出 accuracy-blind answer churn 概念：RAG 系统在索引扩展后，即使所有可控参数固定，答案仍可能变化，而聚合准确率掩盖了这些变化。引入 Snapshot Compatibility Audit，通过减去同快照重复分歧来估计跨快照的额外波动。在 400 问题的 Natural Questions 预注册研究中，normalized-exact 和 blinded-semantic 额外波动分别为 6.44 和 10.25 个百分点，而 exact-match 准确率仅变化 -1.50%。后验分析发现 40/400 问题存在稳定的语义翻转。警示 RAG 系统的稳定性和可预测性风险。

---

### 18. 时尚知识图谱增强 RAG

📄 [arXiv:2608.22688](https://arxiv.org/abs/2608.22688) | 作者：Yujuan Ding, Linyin Luo, Shijie Wang, Xu Yuan, Yunshan Ma, Yi Bin, Wenqi Fan, Qing Li

**🗣️ 大白话：** 时尚领域做问答特别难：需要整合风格、材质、搭配、趋势等多维知识。LLM 容易 hallucination，而且缺乏时尚专业知识。本文构建了一个完整的时尚知识图谱 FashionEcoKG，然后通过 KG-RAG 把结构化知识注入 LLM，解决时尚问答中的知识需求。

**🔬 专业讲解：** 本文提出 FashionEcoKG，通过三阶段 agentic pipeline 从权威教材提取高保真知识核心，通过跨领域增强和生成式扩展强化结构连通性。基于此构建 FashionKG-RAG，将结构化知识注入 LLM 用于时尚问答。这是时尚领域知识图谱增强 RAG 的首次系统性尝试，为知识密集型领域的 RAG 应用提供了范例。

---

## 📋 其他论文速览

- **Robustness of IR Models to Collection Growth**（arXiv:2608.23419）：CIKM 2026 短论文，提出检索模型对集合增长的鲁棒性评估框架，区分多文档无关（MDA）和多文档依赖（MDD）模型，发现两者对非相关文档增加均不完全鲁棒。

- **From Click Modeling to Offline and Off-Policy Evaluation in Carousel Recommendation**（arXiv:2608.22022）：Kang 的博士论文，系统研究轮播推荐中的点击模型和离线/离线策略评估，提出考虑二维布局约束的点击模型设计框架。

- **GRAFT: Graph-Distilled Generative Retrieval for Facet-Aware Scientific Literature Exploration**（arXiv:2608.22381）：将科学论文按问题、方法、结果、贡献等维度建立类型化图边，结合生成式检索实现面感知的文献探索，超越传统 citation-based 检索的邻域限制。

- **HIRA: A Human-in-the-Loop Retrieval-Augmented Cascade for Document Classification in Regulated Industries**（arXiv:2608.21792）：CIKM 2026，面向监管行业的文档分类，提出人机协同的 RAG 级联框架，将人类专家纳入检索和分类流程。

- **The Compaction Cliff in Long-Running AI Agent Memory**（arXiv:2608.22752）：发现长期运行的 AI Agent 在记忆压缩时存在"压缩悬崖"现象，提示记忆管理在 Agent 系统中的重要性。

- **Training-Free Pseudo-Fusion for Composed Image Retrieval**（arXiv:2608.23102）：结合扩散模型和多模态大语言模型，实现无需训练的组合图像检索伪融合。

- **Cultural Moment Benchmark: Evaluating Video Cultural Reasoning and Grounding in Southeast Asia**（arXiv:2608.23065）：EMNLP 2026，提出东南亚视频文化推理基准，涉及信息检索和跨文化理解。

- **TSWAP: A Multilingual Retrieval-Augmented Thai Wellness Advisor**（arXiv:2608.22917）：面向泰语健康咨询的多语言 RAG 系统，8 页论文，数据和评估日志已开源。

- **Better Retrieval, Worse Robustness: How Multi-hop RAG Amplifies Upstream ASR Errors**（arXiv:2608.22872）：EMNLP 2026，发现多跳 RAG 在改善检索的同时，会放大上游 ASR（语音识别）错误，对语音交互式 RAG 系统提出警示。

- **The Laws of Context Allocation: Causal Measurement and Closed-Loop Orchestration in Generative Search**（arXiv:2608.23252）：研究生成搜索中的上下文分配规律，提出因果测量和闭环编排框架。

- **Aligning Biomedical Texts and Knowledge Graphs**（arXiv:2608.23214）：KG-NeSy 2026，系统比较轻量级生物医学文本与知识图谱对齐策略。

- **RAG Collapse: LLM Responses Collapse When Retrieved Documents Are Self-Authored**（arXiv:2608.22118）：发现当检索到的文档是 LLM 自己生成的时，RAG 响应会出现"collapse"现象，36 页深入研究，31 个图。

- **W-RAG: Source-Aware Retrieval for Enterprise Document Generation**（arXiv:2608.22081）：面向企业文档生成的异构知识库源感知检索，18 页技术报告。

- **Training a Knowledge Base: Supervised Structure Learning for Agent-Curated Document Stores**（arXiv:2608.21829）：IEEE BigData 2026，提出监督式结构学习框架，训练 Agent 自动策展文档存储。

- **GrOIL: Graph-Grounded Domain Ontology Induction with Constrained LLM Mediation**（arXiv:2608.22135）：提出七阶段图接地 pipeline，将领域文档转换为完整可审计的 OWL TBox，无无约束生成步骤。

- **Retrieval-Augmented Classification of Environmental Mitigations**（arXiv:2608.23241）：面向水电许可文档中环境缓解措施的多标签分类，135 类别，严重标签稀缺。

- **ExecRubrics: Executable Tool-Augmented Rubrics for Verifiable Long-Form Evaluation**（arXiv:2608.22559）：EMNLP 2026 Findings，提出可执行工具增强的评分标准，用于长文本生成的可验证评估。

- **VERDICT: Agreement Beats Pixel-Space Verification in Real-Document OCSR**（arXiv:2608.22183）：面向真实文档的光学化学结构识别，验证一致性优于像素空间验证。

- **Enrich-Retrieve-Rank: Scaling Capability Discovery Beyond In-Context Routing**（arXiv:2608.22695）：提出超越上下文路由的能力发现扩展框架，11 页，4 图，12 表。

- **The Emergence of Relevance Through Axiomatic Attention Patterns During LoRA Fine-Tuning**（arXiv:2608.23338）：EMNLP 2026 Findings，17 页，25 图，研究 LoRA 微调中注意力模式如何产生相关性。

- **KSE-Web: Hybrid Retrieval and LLM-Assisted Query Expansion for Low-Resource Khmer Semantic Search**（arXiv:2608.21365）：低资源高棉语语义搜索的混合检索和 LLM 辅助查询扩展。

- **DamageScope: Vision-Language Retrieval at Scale for Disaster Damage Assessment**（arXiv:2608.21529）：大规模视觉-语言检索用于卫星图像灾害损害评估。

- **Prompt-Based Abstention Fails Under Misleading Context**（arXiv:2608.22228）：AACL-IJCNLP 2026，20 页，研究小冻结 RAG 模型在误导性上下文中的拒绝回答失败问题。

- **SARCLIP: CLIP-Based Retrieval for Seventeenth-Century Spanish American Notary Records**（arXiv:2608.22036）：基于 CLIP 的 17 世纪西班牙美洲公证记录检索系统。
