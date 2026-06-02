---
slug: swav
title: "SwAV：通过对比聚类分配进行无监督视觉特征学习"
date: 2020-06-17
tags:
  - 自监督学习
  - 对比学习
  - 聚类
  - 视觉表示
authors: wangshuli
description: "Inria & Facebook AI | 博导判决：🌟 Strong Accept"
---

- **日期**：2020-06-17
- **来源**：https://arxiv.org/abs/2006.09882
- **作者**：Mathilde Caron, Ishan Misra, Julien Mairal, Priya Goyal, Piotr Bojanowski, Armand Joulin
- **发表**：NeurIPS 2020

---

## 从一个尴尬说起

2020 年中的自监督视觉学习正处于一个微妙的分岔口。一边是 SimCLR、MoCo 为代表的对比学习路线，它们把同一张图的两个增强视角拉近、把不同图推远，效果惊艳但代价不菲：你需要海量负样本才能让 loss 有区分度，SimCLR 要 4096 的 batch size，MoCo 要维护一个 65K 的 memory bank。另一边是 DeepCluster 为代表的聚类路线，先跑一遍 k-means 再用伪标签训练，效果稳健但节奏笨重：每隔几个 epoch 就要对全数据集做一次离线聚类，训练流程被切成了"聚类-训练-聚类-训练"的锯齿形。

缺口就在这里：**能不能既拥有聚类方法的语义结构感，又保持对比学习的在线训练流畅性？**

## 一句话说清变化

Before：要么逐对比较特征（计算量随负样本数爆炸），要么离线聚类再训练（pipeline 割裂）。After：SwAV 用一组可学习的 prototype 向量做中间桥梁，把"比较特征"转化为"交换预测聚类分配"，在一个 batch 内完成在线聚类与对比，不需要负样本，不需要离线 pass。

## 白话方法：图书馆里的交叉问答

想象你是图书管理员，手里有 3000 个主题标签（prototype）。现在来了同一本书的两份不同摘要（两个 augmented view）。你的任务不是直接比较两份摘要像不像，而是：先根据摘要 A 给这本书贴上主题标签，然后让摘要 B 去"猜"摘要 A 被贴了什么标签，反过来也一样。如果两份摘要确实来自同一本书，它们应该能互相猜对对方的标签。

这就是"Swapping Assignments"的含义。具体来说：

给定图像 x，生成两个增强视角 x_t 和 x_s，分别通过编码器得到特征 z_t 和 z_s（归一化到单位球面）。然后把特征投影到 K 个 prototype 向量上，得到相似度矩阵。关键一步是用 Sinkhorn-Knopp 算法把这个相似度矩阵"整理"成一个合法的 soft assignment（聚类分配）Q。最后的 loss 是交叉熵：用 z_t 去预测 q_s，用 z_s 去预测 q_t。

整个过程没有负样本，没有离线聚类，prototype 跟网络一起端到端学习。

## 费曼讲解：三个关键概念

### Sinkhorn-Knopp 算法

假设你有一张 batch_size × K 的"投票表"，每个样本对每个 prototype 投了一个置信度。直接取 argmax 会出问题：所有样本可能都涌向同一个 prototype，导致表征坍缩。Sinkhorn-Knopp 做的事情很简单：交替对行和列做归一化，让这张表变成一个"双随机矩阵"的近似。行归一化保证每个样本的分配加起来是 1（它必须被分到某些类），列归一化保证每个 prototype 被均匀使用（不能所有人都挤到一个类）。实际操作中只需要 3 次迭代，在 GPU 上 35ms 就能处理 4096 个样本到 3000 个 prototype 的映射。

### Equipartition Constraint（均匀分配约束）

这是防止坍缩的核心机制。如果没有这个约束，模型会找到一个 trivial solution：把所有样本映射到同一个 prototype，loss 为零但什么也没学到。均匀分配约束要求在一个 batch 内，每个 prototype 被大致等量的样本选中。这不是硬约束，而是通过 Sinkhorn 迭代隐式实现的 soft 版本。它的物理意义是：我们相信视觉世界的语义是多样的，不应该有一个"万能类别"吞噬所有样本。

### Multi-crop 策略

对比学习的一个瓶颈是：增加 view 数量会让计算量平方增长（因为要两两比较）。SwAV 的 multi-crop 策略巧妙地绕过了这个问题：用 2 个标准分辨率（224×224）的 crop 加上 V 个低分辨率（96×96）的 crop。关键设计是只用全分辨率 crop 计算 codes（聚类分配），低分辨率 crop 只参与预测 loss。这样低分辨率 crop 的计算开销很小（前向传播快，不需要 Sinkhorn），但提供了更多的"视角多样性"。实验表明这个策略对 SimCLR、DeepCluster 等方法都有 2-4% 的一致提升，说明它是一个通用的增强手段而非 SwAV 的专属技巧。

## 核心机制图

```
Image x
├── aug_t ──► f_θ ──► z_t ──┐
│                            │
│    ┌───── Prototypes C ────┤
│    │      [c₁ c₂ ... cₖ]  │
│    │                       │
│    ▼                       ▼
│  Sinkhorn(z_t·Cᵀ)      z_s·Cᵀ/τ
│    ║                       │
│    ▼                       ▼
│   q_t ◄── cross-entropy ── p_s  (predict q_t from z_s)
│
└── aug_s ──► f_θ ──► z_s ──┐
                             │
     ┌───── Prototypes C ────┤
     │                       │
     ▼                       ▼
   Sinkhorn(z_s·Cᵀ)      z_t·Cᵀ/τ
     ║                       │
     ▼                       ▼
    q_s ◄── cross-entropy ── p_t  (predict q_s from z_t)

Loss = ℓ(z_t, q_s) + ℓ(z_s, q_t)
```

## 餐巾纸速写

| 以前怎么想 | 这篇论文说应该怎么想 |
|---|---|
| 自监督 = 拉近正对、推远负对，负样本越多越好 | 自监督 = 让不同视角对同一组语义锚点（prototype）产生一致的投票 |
| 聚类是离线的预处理步骤，和训练是两个阶段 | 聚类可以是在线的、可微的，Sinkhorn 让它变成 forward pass 的一部分 |
| 增加 view 数量 = 增加计算量的平方 | 用非对称设计（低分辨率 crop 只预测不被预测），线性增加 view 数量 |
| 小 batch 对比学习效果差，必须大 batch 或 memory bank | 有了 prototype 做中间层，batch 256 也能到 74.3%，不需要 momentum encoder |

## 博导审稿

**选题眼光**：精准。2020 年对比学习和聚类方法各有痛点，这篇论文找到了两者的交汇点，用 online clustering 统一了两条路线。选题本身就暗示了一个更大的图景：自监督学习的本质可能不是"对比"而是"一致性"。

**方法成熟度**：极高。Sinkhorn-Knopp 不是新算法，但把它嵌入自监督训练循环、用 equipartition 约束替代负样本，这个组合非常优雅。每个设计选择都有消融实验支撑：prototype 数量 3K-100K 影响不大（±0.3%），soft vs hard assignment 差 0.6%，Sinkhorn 3 次迭代即饱和。方法的鲁棒性令人印象深刻。

**实验诚意**：满分。不仅在 ImageNet 线性评估上达到 75.3%（当时 SOTA），还做了半监督、transfer（Places205、VOC07、iNat18 全部超越有监督预训练）、小 batch、大规模无标注数据（1B Instagram 图片）、训练效率（200 epochs 即达 72%）。Multi-crop 策略单独拿出来在 SimCLR 和 DeepCluster 上验证，证明了通用性。

**写作功力**：清晰流畅，图表信息密度高。Method 部分用 2 页讲清楚了所有细节，没有故弄玄虚。

**一句话判决**：这是一篇把"在线聚类即对比学习"这个洞察做到极致的工作，方法简洁、实验扎实、影响深远，是 NeurIPS 2020 自监督方向的标杆论文。

## 启发

对推荐系统和 DIG-v2 项目而言，SwAV 的几个思路值得迁移：

第一，prototype 作为语义锚点的思路可以用于用户/物品表征学习。推荐场景中用户行为序列的不同子序列就像同一张图的不同 crop，让它们对一组可学习的"兴趣原型"产生一致的分配，可能比直接做序列级对比更高效，也更容易解释（每个 prototype 对应一种兴趣模式）。

第二，Sinkhorn 的均匀分配约束天然适合解决推荐中的"热门偏差"问题。如果我们在 embedding 空间中要求所有物品被均匀地分配到不同的语义簇，就能避免表征空间被少数热门物品主导。

第三，multi-crop 的非对称设计启发我们：在多模态推荐中，不同模态（文本、图像、行为）可以扮演不同角色。重模态（如行为序列）负责生成 codes，轻模态（如标题文本）只负责预测，这样既利用了多模态信息又控制了计算开销。

第四，SwAV 证明了不需要显式负样本也能学好表征。这对推荐系统中负样本采样困难的场景（如隐式反馈）特别有吸引力：与其费力构造负样本，不如让模型学习对一组 prototype 的一致性分配。
