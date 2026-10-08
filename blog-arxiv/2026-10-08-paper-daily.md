---
title: "【推荐系统 Paper 日报】2026-10-08"
date: 2026-10-08
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2790611498"
---

# 【推荐系统 Paper 日报】2026-10-08

## 📊 今日概览

arXiv cs.IR 本期公告日期为 2026-10-08（周四），今日共 18 篇论文，其中推荐系统直接相关 3 篇（生成式推荐的漏目标训练、两段式 Softmax 采样纠偏、个性化划线预测评估），另有 2 篇泛推荐/个性化语义检索相关工作值得关注。亮点：NeurIPS 2026 的两段式 Softmax 采样纠偏工作给出了可证明更优的采样近似，实用价值很高；生成式推荐中"补目标训练"的因果拆解也非常扎实。

## 🔥 推荐系统论文深度解读

### 1. Training with Missed Targets in Generative Recommendation: Separating Supervision from Probability Competition

📄 [arXiv:2610.10124](https://arxiv.org/abs/2610.10124) | 12 pages, 4 figures, 8 tables | Xuesi Wang, Yangbin Shi, Xiaolin Zheng

**🗣️ 大白话：** 生成式推荐器一次只能吐出有限的候选集，训练时见过的"正样本"可能没被它捞回来（漏目标）。常见做法是把漏掉的目标塞回 reranker 的训练列表里补一补。但这篇论文发现：这一塞其实同时干了两件事——既加了新监督信号，又让"补进来的目标"和"推理时真正的候选"抢概率名额。抢名额这件事反而会伤害最终返回结果的排序：在 Amazon Video Games 的四组对照实验里，去掉这种竞争让 FT-NDCG 提升了 7.8%~22.2%。

**🔬 专业讲解：** 作者构造了三个 matched loss 来做受控拆解：固定 retrieved-target 权重不变，分别单独引入"补目标监督"和"两组概率竞争"。中间版本 loss 在两组内部各自训练但分开归一化，从而避免训练专属目标与推理候选竞争概率质量。实验用已开源的 OneRec 模型 + 本地训练的 Amazon 生成器，结果显示竞争项会损害返回条目排序；且基于开发集的保守选择规则表明，补目标训练是否有效高度依赖具体生成器（一类目 3 选 2 采用、另一类目全部拒绝，避免了 1.7% 的损失）。结论：候选补全（candidate completion）应逐生成器评估，而非默认开启。

---

### 2. Two-Level Softmax Sampling Done Right: Correcting Bias from Size Imbalance and Dispersion

📄 [arXiv:2610.10483](https://arxiv.org/abs/2610.10483) | NeurIPS 2026 | Walid Bendada, Guillaume Salha-Galvan

**🗣️ 大白话：** 从 softmax 分布里采样是推荐/召回里的常见操作，但物品数量一多，精确采样的线性复杂度扛不住。流行的加速方案是"两段式 softmax 采样"（先采簇、再采簇内物品），但它有个隐藏 bug：忽略了簇大小不均衡和簇内相似度离散度，导致采样有系统性偏差。本文给出两个修正版（S-2LS 和 SD-2LS），几乎零额外计算开销，就能得到可证明更好的 softmax 近似。结论很直白：以后用 2LS 就换成这俩。

**🔬 专业讲解：** 作者形式化了 2LS 的两类偏差来源：按簇采样时未按簇内物品数加权（size imbalance），以及簇内物品与代表向量距离分散导致簇内均匀假设失效（dispersion）。提出的 S-2LS 仅做尺寸校正，SD-2LS 同时校正离散度，二者均为对原 softmax 的更优近似并附有理论证明。在 5 个大规模数据集上验证了采样性质的改善，计算开销可忽略。该工作对大规模召回中的负采样、softmax 候选采样等场景有直接落地价值。

---

### 3. Reading Position Is the Baseline to Beat: A Time-Ordered Evaluation of Personalised Highlight Prediction

📄 [arXiv:2610.09262](https://arxiv.org/abs/2610.09262) | 13 pages | Kazuki Nakayashiki, Keisuke Watanabe

**🗣️ 大白话：** 阅读产品里最便宜的个人化信号，就是用户划的第一道线。直觉做法是"推荐和 TA 相似的读者划过的句子"，但这篇论文说：先别急，最该打败的 baseline 是"阅读位置"——只看读者第一道划线的位置、完全不用别人的数据，就能在 47% 的情况下把下一道划线预测进 Top5，远超热门度基线的 26%。个性化做得好不好，得按时间顺序、跟"位置基线"比才算数。

**🔬 专业讲解：** 作者在一个社交划线平台上做了时间有序评估（7,343 个 reader-page 对、1,511 页），系统比较位置基线、热门度、两种相似度方法在两个目标（下一道划线 vs. 全部后续划线）上的表现。关键发现：位置排序在"下一道划线"上大幅领先，但在"全部后续划线"上输给热门度；而按距最新划线距离折损的热门度在两个目标上都稳定占优。预先指定的对照显示相似度方法相对热门度并无增益（+0.01 的 AP 增益可被排除）。作者进一步用合成读者论证：不按时间顺序的评估会高估个性化方法的效果。对做内容消费个性化（划线、评论、停留）的团队，这是一份很好的评估方法论警示。

---

## 📋 其他论文速览

- **From High Recall to High Utility: Dataset-Adaptive Post-Processing of LLM-Generated Customer Intents**（arXiv:2610.09039）：把 LLM 高召回抽出的客户意图做"数据集自适应"的后处理（去重、聚类、受约束聚合），变成稳定可溯源的意图单元，并支持相似用户意图推断和意图引导的语义检索——对用 LLM 做用户意图挖掘 + 个性化检索的团队很有参考价值。
- **Finding the Right Balance: Relevance and Diversity in LLM Retrieval**（arXiv:2610.09412）：LLM 检索中相关性与多样性的平衡研究（36 页长文，附代码与结果）。
