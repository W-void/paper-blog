---
title: "「快手」SID异质性感知｜Stop Treating Collisions Equally"
date: 2026-04-01
tags: [公众号]
---


![](https://files.mdnice.com/user/83179/150bbe0f-98e7-4fde-9d7a-b61a8156abff.png)

Stop Treating Collisions Equally: Qualification-Aware Semantic ID Learning for Recommendation at Industrial Scale

https://arxiv.org/pdf/2603.00632v1

在之前SID随笔里笔者提到过，SID成也冲突率、败也冲突率。如果两个商品的SID是一样的，那对于所有用户来说，GR都无法区分这两个商品，更别提个性化推荐了，这也是SID-based范式难以完全替代精排的原因。

快手这篇QuaSID直面冲突率问题，对不同的冲突（Collisions）进行异质化处理。

有时候真是觉得有趣，快手的onerec系列和字节的unirec系列走在两条对称的道上，快手走在召回的scaling道上，字节走在排序的scaling道上。道不同，术却有异曲同工之处，比如快手的这篇QuaSID和字节的HAP，一个是“不要平等的处理冲突”，一个是“不要平等的处理候选。”

但是，术也只是大号的trick，你觉得哪条道是正确的，道的终点又在哪里呢？总不会殊途同归吧。


# 1 背景

SID 冲突是个老问题了，这篇找到了新的切入点。

Semantic ID（SID）把 item 的多模态特征压缩成一串离散 token（如 [100, 77, 56]），供生成式推荐或传统检索/排序使用。主流方案是 RQ-VAE（残差量化 VAE）：用 L 个码本逐层量化残差，每层选出一个 codebook index，最终形成 L 个 token 组成的 SID 序列。

SID 冲突（Collision） 是业界公认的痛点：量化时码本空间有限，语义无关的 item 可能被分配到相同或高度相似的 SID，导致下游模型混淆。

之前的解法（LETTER、HiD-VAE、SaviorRec 等）大多是"不管三七二十一，所有冲突全部压制"。QuaSID 的洞察是：这样做是错的。

**核心洞察：冲突信号是异质的**

In-batch 观察到的 SID 重叠，来源并不相同：

| 重叠类型 | 示例 | 应该怎么处理 |
|---------|------|------------|
| 有害冲突 | "拖鞋/鞋类" vs "短剧/影视"，SID 完全相同 | 必须排斥，分开 |
| 良性重叠① | 同一个 item 在 batch 里出现两次 | 不该排斥，是自己 |
| 良性重叠② | 构造的协同正样本对 (i_t, i_p)（行为上相似） | 不该排斥，是有意拉近的 |

一刀切压制良性重叠，会把人为拉近的语义相似 item 又推开，引入训练噪声。

# 2 方法

## 2.1 整体框架

输入item-to-item对，多模态 item 特征经共享编码器映射为连续 embedding，再经 L 层 RQ 量化得到 SID。除了量化损失和对比损失，还对样本进行异质处理，对不同的item-to-item对计算不同的冲突损失。

完整损失包括：

![](https://files.mdnice.com/user/83179/6de65257-1dd8-4a96-903f-d2eb1c749a1e.png)


完整模型图如下：

![](https://files.mdnice.com/user/83179/0a6c2ed2-23f4-45ff-b8eb-e461c1995720.png)


## 2.2 CVPM：先过滤，再排斥

屏蔽两类良性重叠：

① 协同正样本掩码：batch 里的 trigger-target pair 是为对比学习构造的，不应排斥。

② 同 item 掩码：相同 item ID 的重复采样不该视为冲突。

![](https://files.mdnice.com/user/83179/d2d7b509-4b96-4ef3-8141-8fbb2e3894ea.png)

只有 M_ij = 1 的 pair 才计算损失。

## 2.3 HaMR：按 Hamming 距离分级惩罚

核心逻辑：Hamming 距离越小 → 冲突越严重 → margin 越大 → 惩罚越强。

定义两类冲突集（均经过 CVPM 过滤）：

① Full Collision：Hamming = 0（SID 完全相同）

② Partial Collision：0 < Hamming ≤ R（部分重叠，R 为超参）

分别施加 hinge 损失，要求 encoder 空间余弦距离超过对应阈值：

![](https://files.mdnice.com/user/83179/167721a7-226a-4851-8417-7af83ed75784.png)

![](https://files.mdnice.com/user/83179/6edd1ed8-591e-49da-a7ff-99d075bbdca8.png)

其中 m_full >= m_partial，是超参数，D是hanmming距离。训练推进中，这一约束重塑 embedding 空间，减少量化时的碰撞频率。

# 3 实验

本文提出的HaMR损失是一个可插拔模块，对很多量化方法都有提升：

![](https://files.mdnice.com/user/83179/7db4bd9c-09e8-4db7-8d04-badb477cf6db.png)


在线提升也很高：
- 在召回和精排都有提升
- 冷启提升更明显，冷启的定义是：播放量小于100次和小于600次

![](https://files.mdnice.com/user/83179/89fc5748-ff11-4a43-b1cf-905d1eb76480.png)
