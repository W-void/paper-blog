# 分布式近似最近邻搜索：面向不确定性感知的检索

- **原标题**：Distributional Approximate Nearest Neighbour Search for Uncertainty-Aware Retrieval
- **作者**：Olivier Jeunen
- **来源**：https://arxiv.org/abs/2606.04603
- **翻译日期**：2026-06-09

---

## 摘要

近似最近邻（Approximate Nearest Neighbour, ANN）搜索索引构成了现实世界推荐系统的骨架，使得在百万级物品目录上进行实时候选检索成为可能。通常，为每个用户和每个物品学习一个单一的点估计嵌入向量（point estimate embedding）。在服务时，用户嵌入向量查询索引以获取相关物品。由于这些表示是从稀疏交互数据中学习的，它们是含噪声的，可能无法捕捉到影响"相关性"的所有细微差别——忽视了其内在的根本不确定性（fundamental uncertainty）。其结果是一个系统性偏向少数热门头部物品（这些物品具有良好估计的嵌入向量）的检索管线，而牺牲了长尾（long-tail）中大量小众、多样化和意外发现的内容。

我们提出 DINOSAUR（Distributional Approximate Nearest Neighbour Search for Uncertainty-Aware Retrieval，分布式近似最近邻搜索用于不确定性感知检索）：一个简单且与基础设施兼容的框架，将嵌入不确定性纳入候选生成。DINOSAUR 不索引点估计，而是为每个物品采样 $S_i$ 个嵌入向量并在这个增广集合上构建索引。类似地，在查询时，用户嵌入也被采样。这个双侧随机检索过程隐式地对嵌入不确定性进行边缘化（marginalisation），而不需要对模型架构或 ANN 索引基础设施进行修改。

在分析方面，我们证明当不确定性消失时，DINOSAUR 恢复为标准的点估计检索，并且我们刻画了嵌入方差的增加如何扩展不确定物品可被检索的潜在空间区域。可复现的实证观察与这些预期一致，显示出以较小的离线召回损失换取大幅度的覆盖率提升。

---

## 1. 引言与动机（Introduction & Motivation）

现代大规模推荐系统通常由多个顺序阶段组成，这些阶段迭代地精炼越来越小的物品集合，最终得到一个物品或一组物品展示给终端用户 [8, 15, 26]。第一个阶段通常被称为候选生成（candidate generation），将 $O(10^6)$ 或更多物品过滤到 $O(10^3)$ [2, 22]。

这一范式的实际实现通常利用近似最近邻（ANN）搜索：用户和物品由共享向量空间中的 $d$ 维嵌入向量表示，一个在物品上预计算的索引在服务时用用户嵌入进行查询。当相似度通过内积或余弦来度量时，这归结为最大内积搜索（Maximum Inner Product Search, MIPS）问题——一个众所周知的数据库问题，已有若干高效的生产级开源解决方案 [3]（例如 annoy [4]、faiss [10]、scann [13] 或 hnsw [29]）。

这条管线高效且可扩展，但它建立在一个强且很少被审视的假设之上：**一个单一的点估计能够忠实地表示用户或物品**。在现实中，两种表示都具有根本性的不确定性 [32]。部分不确定性是认知性的（epistemic）——从稀疏交互数据中学习意味着长尾内容具有高方差；其他不确定性是随机性的（aleatoric）——为潜在因子模型辩护的低秩假设必然丢失信息 [16]。其后果是静态 ANN 设置与用户多样化且依赖上下文的信息需求以及高度不确定的物品嵌入之间的不匹配。

这导致了检索中的系统性偏差。点估计 ANN 搜索在设计上是确定性的。因此，恰好落在 top-$k$ 邻域之外的物品被永久排除在候选生成之外，无论物品或查询中的底层不确定性如何。这在部署系统中产生了众所周知的病理现象：流行度偏差（popularity bias）[1] 可能被反馈循环放大 [6]，以及系统性地使长尾创作者和卖家缺乏曝光的一般曝光差异 [9, 19]。另一方面，探索的价值是明确的、多方面的和持续的 [12, 20, 33]。

现有补救措施（例如多样性促进目标 [27, 28]、事后重排序 [25] 或探索奖金 [7, 35]）通常是启发式的，应用在管线中更后面的排序阶段，并且与问题的底层根源脱节。我们认为正确的解决位置是在检索阶段本身，通过将点估计嵌入替换为显式表示不确定性的分布嵌入（distributional embeddings）。然而，改造现有 ANN 搜索框架以索引和查询嵌入分布绝非易事 [4, 10, 13, 29]。

我们的关键洞察很简单：如果我们从学习到的分布 $P(\mathbf{v}_i)$ 中为每个物品采样多个嵌入向量并在这些样本上构建 ANN 索引，那么具有更高嵌入不确定性的物品自然会覆盖嵌入空间中更大的区域——因此更有可能被那些真实偏好位于该区域的用户检索到。这不需要对评分模型进行修改，除了采样数 $S_i$ 之外没有新的超参数，也不需要对 ANN 索引基础设施本身进行修改。此外，这种机制为长尾内容的检索阶段探索提供了一条有原则的路径，与现有顺序决策和探索-利用权衡文献中的汤普森采样（Thompson Sampling）有紧密联系 [34]。

我们将这一想法形式化为 DINOSAUR（Distributional Approximate Nearest Neighbour Search for Uncertainty-Aware Retrieval），提供对其性质的严格理论分析，并通过可复现的实验设置进行验证。

---

## 2. 问题设置与符号（Problem Setting and Notation）

设 $\mathcal{U}$ 和 $\mathcal{I}$ 分别表示用户（例如买家或订阅者）和物品（例如卖家或创作者）的集合，其中 $|\mathcal{I}| = M$。在标准双塔编码器（dual-encoder）检索中，表示被视为确定性的点。我们转而假设每个物品 $i \in \mathcal{I}$ 与一个在 $\mathbb{R}^d$ 上的连续嵌入分布 $P(\mathbf{v}_i)$ 相关联，由均值 $\boldsymbol{\mu}_i$ 和协方差 $\boldsymbol{\Sigma}_i$ 刻画。类似地，每个用户 $u \in \mathcal{U}$ 拥有一个嵌入分布 $P(\mathbf{v}_u)$。我们将从这些分布中的抽样记为 $\mathbf{v}_i \sim P(\mathbf{v}_i)$ 和 $\mathbf{v}_u \sim P(\mathbf{v}_u)$。

设 $\text{sim}: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$ 表示标准相似度函数（例如内积）。标准近似最近邻（ANN）检索作为确定性截断（deterministic truncation），返回严格按 $\text{sim}(\boldsymbol{\mu}_u, \boldsymbol{\mu}_i)$ 排序的 top-$k$ 物品。这种刚性截断不成比例地惩罚了高度不确定的长尾物品，这些物品的真实相关性可能被其点估计均值所低估。

**定义 1（DINOSAUR 索引与检索）**。给定每个物品的采样预算 $S_i \geq 1$，DINOSAUR 索引 $\mathcal{X}_S$ 通过为每个物品 $i \in \mathcal{I}$ 独立抽取样本 $\mathbf{v}_i^{(1)}, \ldots, \mathbf{v}_i^{(S_i)} \sim P(\mathbf{v}_i)$，并索引得到的向量来构建：

$$\mathcal{X}_S = \bigcup_{i \in \mathcal{I}} \left\{ \left(\mathbf{v}_i^{(j)}, i\right) : j = 1, \ldots, S_i \right\}$$

在查询时，用户嵌入 $\mathbf{v}_u \sim P(\mathbf{v}_u)$ 被采样。检索包括找到 $\mathcal{X}_S$ 中距 $\mathbf{v}_u$ 最近的向量，并返回其对应的物品标识符，去重直到恰好累积 $k$ 个不同物品。

**定义 2（供给侧曝光与目录覆盖率）**。物品 $i$ 对用户 $u$ 的期望曝光是其检索概率：$\rho(i, u) = P(i \in \text{Top-}k(u))$。在标准点估计检索下，这坍缩为确定性的 $\{0, 1\}$。检索方案的目录覆盖率（catalogue coverage）是对至少一个用户可检索的物品目录总比例的期望值，作为市场健康度和长尾卖家公平性的代理指标。

---

## 3. DINOSAUR 框架（The DINOSAUR Framework）

在实践中部署 DINOSAUR 只需要两个成分：嵌入不确定性的生成源和一个现有的、未修改的 ANN 索引（例如 faiss、scann、hnsw）。至关重要的是，该方法对不确定性来源本身完全不可知。

在实践中，$P(\mathbf{v}_i)$ 可以通过几种标准方式获得：从贝叶斯潜在因子模型 [31, 32]，近似贝叶斯推断如变分贝叶斯（Variational Bayes）[5, 24]，推断时随机性如蒙特卡洛 Dropout [11]，或将后验尺度与交互稀疏性关联的轻量级经验代理，例如 $\sigma_i \propto (1 + n_i)^{-\gamma}$，反映了不确定性对样本量的依赖。

通过离线为每个物品采样 $S_i$ 个向量，服务时路径与标准确定性 ANN 检索保持相同，唯一区别是更大的索引和将邻居去重为物品。

**单侧 vs 双侧探索**。DINOSAUR 高度模块化；它可以仅在物品侧（供给方或创作者）、仅在用户侧（买方或订阅者）或同时在两侧建模不确定性。在用户延迟约束禁止实时采样的动态双边市场中，单侧（仅物品）实现足以单方面驱动对长尾和小众内容的探索，解锁我们在下面建立的核心覆盖率和探索收益。

---

## 4. 理论分析（Theoretical Analysis）

我们建立 DINOSAUR 的核心几何和分布性质。为了符号清晰性，我们假设各向同性高斯分布 $P(\mathbf{v}_i) = \mathcal{N}(\boldsymbol{\mu}_i, \sigma_i^2 \mathbf{I})$，通过内积评估。

**命题 1（安全性：恢复点估计检索）**。对于任何固定采样预算 $S_i \geq 1$，当嵌入方差消失时（$\sigma_i^2, \sigma_u^2 \to 0$），DINOSAUR 检索到精确确定性 top-$k$ 的概率趋向于 1。

*证明概要*。通过对采样内积 $\langle \mathbf{v}_u, \mathbf{v}_i^{(j)} \rangle$ 应用高斯尾部界，我们可以证明当 $\sigma^2 \to 0$ 时，最大采样分数严格收敛到确定性均值 $\langle \boldsymbol{\mu}_u, \boldsymbol{\mu}_i \rangle$。因此，排序顺序以高概率不被违反。

**命题 2（长尾的单调覆盖率扩展）**。对于任何用户 $u$ 和任何物品 $i \notin \text{Top-}k_{\text{point}}(u)$，检索概率 $\rho_{\text{DINOSAUR}}(i, u)$ 关于其嵌入方差 $\sigma_i^2$ 严格非递减。

*证明概要*。更高的方差 $\sigma_i^2$ 决定了一个凸的几何排序，将物品的概率质量分散到潜在空间的更广体积中。这严格增加了 $S_i$ 个样本中至少一个与查询的检索边界相交的概率，从数学上保证了高方差（即高度不确定）物品获得更高曝光。

**注记 1（市场含义）**。在大多数推荐架构中，嵌入方差与历史交互量成反比（即 $\sigma_i^2$ 对于长尾物品最高）。命题 2 确认 DINOSAUR 不仅仅是添加随机噪声；它在结构上充当检索阶段的探索奖金。具有高认知不确定性的小众卖家获得了不成比例的、数学上保证的市场曝光提升，绕过了对显式随机化或事后重排序的需要。

---

## 5. 实际实例化与系统权衡（Practical Instantiations & Systems Trade-offs）

在生产环境中部署 DINOSAUR 需要权衡硬件约束以及面向用户的短期相关性与物品侧覆盖率和探索之间的根本张力。

### 5.1 自适应采样预算与索引膨胀（Adaptive Sample Budgets and Index Bloat）

朴素地为整个工业规模目录（$M \sim 10^8$）索引 $S$ 个样本会引入令人望而却步的内存占用。然而，探索效用将集中在长尾。我们提出通过自适应采样来解决这个问题：采样预算 $S_i$ 动态地以物品的不确定性为条件。通过为例如 Top 20% 的头部物品分配 $S_i = 1$（其嵌入通常被更好地估计），而仅为不确定的尾部物品保留 $S_i \in \{2, 5, 10\}$，索引大小分数级增长而非倍数级增长，有效消除索引膨胀。

搜索成本随索引中可参与检索的采样数量而扩展，但在实践中不一定线性增长：基于图和分区的 ANN 方法通常在查询时只检查增广索引的一小部分。我们实现中的主要显式开销是检索更大的原始候选集，随后去重为 $K$ 个物品标识符。因此 DINOSAUR 用索引大小和原始候选检索深度换取覆盖率；自适应采样提供了在内存或延迟受限时管理此权衡的自然方式。

### 5.2 汤普森采样的认知后验（Thompson Sampling Epistemic Posteriors）

在底层表示模型本身是确定性的设置中（例如标准 iALS [30]），我们可以通过隔离认知不确定性——严格来自缺乏历史观察的不确定性——来构建一个数学上有动机的后验代理。借鉴标准贝叶斯估计原理，学习参数的后验标准差通常相对于观察数 $n$ 衰减。我们通过定义每个物品的经验标准差来直接在几何空间中镜像这种动态：$\sigma_i = \alpha / (1 + n_i)^\gamma$，其中 $n_i$ 是交互计数。通过索引从这种合成后验抽取的样本，DINOSAUR 有效地在候选生成阶段执行了一种高度可扩展的汤普森采样形式。稀疏的尾部创作者固有地表现出宽采样分布，赋予它们探索和竞争检索所需的几何方差，而数据丰富的热门物品优雅地坍缩向其确定性点估计。

### 5.3 精确度-探索权衡（The Precision-Exploration Trade-off）

通过扩展不确定物品的空间足迹，DINOSAUR 本质上以微小程度的顶级点估计精确度来换取长尾的最大曝光。然而，这种离线召回下降的严重程度在很大程度上是历史推荐数据集的非随机缺失（Missing Not At Random, MNAR）性质的人工产物 [17, 18, 23]。

离线日志受到收集它们的确定性检索策略的严重偏差影响，将系统困在算法反馈循环中 [6, 21]。因此，当 DINOSAUR 成功检索到一个高度相关但历史上未曝光的尾部物品时，离线指标通常将其惩罚为"未命中"。通过主动注入不确定性，DINOSAUR 打破了这个反馈循环。此外，这种动态在现代多阶段架构中具有结构性优势：ANN 检索的首要目标是高召回候选生成，而非严格精确度。DINOSAUR 有效地将相关性过滤的负担从向量索引的脆弱几何边界转移到下游排序模型，后者拥有准确评估这些新浮现的探索性候选所需的特征深度。

---

## 6. 实验与实证验证（Experiments & Empirical Validation）

为了实证验证 DINOSAUR 框架的有效性，我们在一个大规模真实世界推荐数据集上进行了完全可复现的评估。我们的实验旨在回答两个主要研究问题：

**RQ1（探索）**：分布式检索是否在不同 $K$ 值下扩展了相对于传统方法的目录覆盖率？

**RQ2（效用）**：注入随机不确定性是否降低了 top-$K$ 推荐的召回率？

我们在 MovieLens-32M 数据集 [14] 上将 DINOSAUR 与精确和近似最近邻基线进行评估，使用维度 $d = 128$ 的 iALS 嵌入 [30]。任务是候选生成：对于每个用户，我们从 84,428 个物品的语料库中检索一组 $K$ 个物品，并评估保留的测试物品是否出现在检索集中（Recall@$K$）。所有代码用 Python 编写，使用 faiss。

**数据**。我们使用完整的 ML-32M 数据集，包含约 3200 万条 200,948 个用户和 84,428 个物品之间的交互。评估采用留一法（leave-one-out）协议和固定随机种子，每个用户随机选择一个交互作为测试物品保留。所有剩余交互构成训练集。

**嵌入**。用户和物品嵌入通过 iALS 学习，正则化 $\lambda = 0.01$，未观察权重 $\alpha_0 = 0.1$，嵌入维度 $d = 128$，16 次训练迭代。嵌入不做归一化使用，保留内积作为模型分数。我们利用基于物品交互计数的合成认知后验，而非学习的分布嵌入。这将检索机制与表示学习问题隔离开来；端到端学习校准的嵌入分布是未来工作的一个有前景的方向。

**方法**。我们比较三种检索策略：

(1) **Flat**：精确内积搜索（faiss 的 IndexFlatIP [10]），作为召回的上界。

(2) **IVFFlat**：使用倒排文件索引的近似搜索，$\text{nlist} = \sqrt{4|\mathcal{I}|}$ 个聚类，$\text{nprobe} = 0.1 \cdot \text{nlist}$，无量化。

(3) **DINOSAUR ($S$)**：每个物品在索引中用 $S$ 个嵌入副本表示——一个在学习的均值处，$S-1$ 个从按 $\sigma_i = \alpha / (1 + n_i)^{0.25}$ 缩放的单位方向噪声中抽取的随机扰动，其中 $\alpha = 0.1$，$n_i$ 是物品 $i$ 的交互计数。索引是在 $S \cdot |\mathcal{I}|$ 个向量上的 IVFFlat 索引，nlist 按比例缩放，nprobe 比例相同。检索 $k' = S \cdot K$ 个候选后去重为 $K$ 个物品，保留分数排序。这使我们能够隔离对检索效用的任何影响。我们专注于物品侧不确定性（固定 $S_u = 1$）以隔离对目录覆盖率的影响。

**指标**。我们报告 $K \in \{10, 50, 100, 250, 500, 1000\}$ 的 Recall@$K$ 和 Catalogue Coverage@$K$。目录覆盖率衡量出现在至少一个用户 top-$K$ 列表中的物品目录比例。我们另外提供按流行度分层的视图：物品按排名被划分为桶（五分位数）（B0 = 最流行，B4 = 最不流行），我们报告 $K = 1000$ 时的分层目录覆盖率和包含率（Inclusion Rate）。包含率定义为接收到来自给定流行度五分位数的至少一个检索物品的用户比例。

### 6.1 结果与讨论（Results and Discussion）

为了回答 RQ1 和 RQ2，我们检查不同采样限制 $S$ 下全局目录覆盖率和召回率之间的关系。如表 1 所示，DINOSAUR 深刻地扩展了目录足迹。对于 $K = 1000$，将采样预算从基线（$S = 1$）增加到 $S = 5$ 将全局覆盖率从 23.52% 提升到 62.97%。至关重要的是，这种探索表面积的近三倍扩展几乎不以点估计效用为代价，离线召回仅减少 0.0041。

![Table 1: Global Recall@K and Catalogue Coverage@K (%) across retrieval methods. Higher is better.](translate-dinosaur-assets/table_1.webp)

当检查表 2 中的分层结果时，这种动态变得更加明显。基线近似搜索完全忽略最不流行的物品，在桶 B4 中实现 0.00% 覆盖率。相比之下，DINOSAUR 成功检索到这些高度冷门物品的 81.88% 以上，确保超过 13% 的用户有机地接收到来自长尾最极端端点的推荐。

![Table 2: Stratified Catalogue Coverage and Inclusion Rate at K=1000 by popularity quintile. Higher is better.](translate-dinosaur-assets/table_2.webp)

最后，我们通过将 DINOSAUR 与强 $\epsilon$-greedy 启发式方法进行比较来验证这种权衡的效率。如图 1 所示，DINOSAUR 严格帕累托支配均匀随机探索。在任何给定的修改候选列表比例下，以及在多个实际检索深度（$K \in \{100, 500, 1000\}$）下，通过合成后验的汤普森采样始终在注入相关多样性的同时保持更高的顶级召回。

![Figure 1: Pareto Frontier of Recall vs. Exploration at varying retrieval depths. DINOSAUR strictly dominates the epsilon-greedy baseline, yielding substantially higher recall for an equivalent fraction of exploratory recommendations.](translate-dinosaur-assets/figure_1.webp)

---

## 7. 结论与未来工作（Conclusions & Future Work）

我们介绍了 DINOSAUR，一个利用现有 ANN 基础设施进行不确定性感知候选生成的轻量级框架。DINOSAUR 不是改变评分模型或检索后端，而是索引来自物品嵌入分布的多个样本，并将检索到的邻居去重回物品标识符。这种简单机制将嵌入不确定性转化为检索阶段的探索，增加了不确定或长尾物品在下游排序之前进入候选集的机会。

我们的实验表明，这可以在仅有小幅离线召回损失的情况下大幅扩展目录覆盖率，并且所得到的召回-探索权衡与均匀 $\epsilon$-greedy 探索相比更为有利。这些结果表明，不确定性感知检索是在候选生成阶段改善长尾曝光的一种实用方式，在这个阶段确定性点估计 ANN 搜索否则会施加硬性的几何截断。

仍存在几个局限性。首先，我们的实验通过基于交互计数的代理实例化不确定性；同样的检索机制也可以使用学习到的不确定性估计。其次，离线推荐日志是 MNAR 的，因此在历史交互上的召回衡量的是与先前曝光物品的一致性，而非新浮现候选的全部效用。未来工作应因此结合倾向感知（propensity-aware）的离线评估（如 IPS 或双重鲁棒估计器）与在线 A/B 测试，以衡量不确定性感知检索对用户和市场层面的影响。我们希望我们的工作能够激发在更广泛的使用场景和 ANN 候选检索的实际实例化中对 DINOSAUR 的验证。

---

## 参考文献（References）

[1] Himan Abdollahpouri. 2019. Popularity Bias in Ranking and Recommendation. AIES '19.

[2] Nima Asadi and Jimmy Lin. 2013. Effectiveness/efficiency tradeoffs for candidate generation. SIGIR '13.

[3] Martin Aumueller et al. 2020. ANN-Benchmarks. Information Systems 87.

[4] Erik Bernhardsson. 2018. Annoy: Approximate Nearest Neighbors in C++/Python.

[5] Charles Blundell et al. 2015. Weight Uncertainty in Neural Networks. ICML.

[6] Allison J. B. Chaney et al. 2018. How algorithmic confounding increases homogeneity. RecSys '18.

[7] Minmin Chen et al. 2021. Values of User Exploration in Recommender Systems. RecSys '21.

[8] Paul Covington et al. 2016. Deep Neural Networks for YouTube Recommendations. RecSys '16.

[9] Fernando Diaz et al. 2020. Evaluating Stochastic Rankings with Expected Exposure. CIKM '20.

[10] Matthijs Douze et al. 2026. The Faiss Library. IEEE Trans. Big Data 12(2).

[11] Yarin Gal and Zoubin Ghahramani. 2016. Dropout as a Bayesian Approximation. ICML.

[12] Dalin Guo et al. 2020. Deep Bayesian Bandits. RecSys '20.

[13] Ruiqi Guo et al. 2020. Accelerating Large-Scale Inference with Anisotropic Vector Quantization. ICML.

[14] F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets. ACM TIIS 5(4).

[15] Karl Higley et al. 2022. Building and Deploying a Multi-Stage Recommender System. RecSys '22.

[16] Eyke Huellermeier and Willem Waegeman. 2021. Aleatoric and epistemic uncertainty. Machine Learning 110(3).

[17] Amir H. Jadidinejad et al. 2021. The Simpson's Paradox in Offline Evaluation. ACM TOIS 40(1).

[18] Olivier Jeunen. 2019. Revisiting Offline Evaluation for Implicit-Feedback. RecSys '19.

[19] Olivier Jeunen and Bart Goethals. 2021. Top-K Contextual Bandits with Equity of Exposure. RecSys '21.

[20] Olivier Jeunen et al. 2026. Sustained Impact of Agentic Personalisation. UMAP '26.

[21] Olivier Jeunen et al. 2019. On the Value of Bandit Feedback. REVEAL '19.

[22] Olivier Jeunen et al. 2024. On Gradient Boosted Decision Trees and Neural Rankers. FIRE '23.

[23] Olivier Jeunen et al. 2018. Fair Offline Evaluation Methodologies. REVEAL '18.

[24] Diederik P. Kingma and Max Welling. 2014. Auto-Encoding Variational Bayes. ICLR.

[25] Deepak Kumar et al. 2023. Fairness of recommender systems in recruitment. Frontiers in Big Data 6.

[26] David C. Liu et al. 2017. Related Pins at Pinterest. WWW '17 Companion.

[27] Yong Liu et al. 2022. Diversity-Promoting Deep RL for Interactive Recommendation. ICCSE '21.

[28] Yuli Liu and Yuan Zhang. 2025. Diversity-Promoting Recommendation. IEEE TKDE 37(5).

[29] Yu A. Malkov and D. A. Yashunin. 2020. Efficient and Robust ANN Search Using HNSW. IEEE TPAMI 42(4).

[30] Steffen Rendle et al. 2022. Revisiting the Performance of iALS. RecSys '22.

[31] Otmane Sakhi et al. 2020. BLOB: A Probabilistic Model for Recommendation. KDD '20.

[32] Ruslan Salakhutdinov and Andriy Mnih. 2008. Bayesian probabilistic matrix factorization. ICML '08.

[33] Yi Su et al. 2024. Long-Term Value of Exploration. WSDM '24.

[34] William R. Thompson. 1933. On the Likelihood that One Unknown Probability Exceeds Another. Biometrika 25(3/4).

[35] Zheqing Zhu and Benjamin Van Roy. 2023. Deep Exploration for Recommendation Systems. RecSys '23.
