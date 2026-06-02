---
title: "AAAI'26「快手」llm as rec｜Align3GR: Unified Multi-Level Alignment"
date: 2025-12-08
tags: [公众号]
---



![](https://files.mdnice.com/user/83179/f2f2864c-6af2-479b-83f4-6d702adf6189.png)
Generative Recommendation for Large-Scale Advertising
https://arxiv.org/pdf/2602.22732

广告和推荐的核心区别是什么？排序公式多了个收入项？保证激励兼容的拍卖机制？考虑广告主意志的动态出价？来看看快手给出的广告的生成式方案。



# 1 背景

本文给出广告生成式的三个核心挑战：

1. **Advertisement Tokenization**。除了item本身的多模态语义信息，还要考虑广告账户的信息。比如同一个item，广告主A出价比广告主B高，A的优先级就要比B高。还有广告类型，比如短视频广告、商品广告、直播广告。

2. **Learning Paradigm**。需要考虑业务目标（如广告收入ecpm）和列表级指标。

3. **Real-Time Serving**。实时serving，比如广告主预算花完了、或者投放效果不及预期导致出价降低，要实时感知到（广告的SID要实时变）。

对应的，针对上面三个挑战，本文的方法包含三个部分：

1. **统一的广告SID（UA-SID）**。基于RQ-Kmeans的改进。

2. **增加一个ecpm的预估项**。并提出list-wise RL（RSPO）。

3. **LazyAR加快自回归解码速度**。和我前面理解的不一样，可能快手的广告主有钱，预算花不完所以广告候选比较稳定。

# 2 方法

## 2.1 Unified Advertisement Semantic ID

快手这个是广告的统一生成式模型，所以需要给不同类型的异构广告编码到统一SID空间中。


![](https://files.mdnice.com/user/83179/4cac5736-f10e-4497-b7bf-ff65d8d21aea.png)


1. 设计了6个模版针对不同的广告，输入llm中得到语义向量。

2. 引入协同信息，用对比损失拉近/远正负样本：
![](https://files.mdnice.com/user/83179/bf9ca926-91a1-4224-a0f8-c62a7a41d87f.png)

3. 多粒度多分辨率(MGMR)RQ-Kmeans。多分辨率（MR）体现在：较低层级使用较大的码本尽早捕捉主导因素，而较高层级则对低熵残差进行建模。多粒度（MG）体现在：直接把最后一层用广告信息硬编码，而非语义信息。

意思是说，广告有很多规则类的特征，需要直接编码进SID。

## 2.2 Lazy Autoregressive Decoder

一个图就清晰了，改串行为并行，只有最后一层是串行的。

![](https://files.mdnice.com/user/83179/0377e96a-4014-4e93-844f-a3e992477bda.png)

感觉和虾皮onepiece里提到的隐式推理加速有点像，推理加速应该是llm一大子方向。

## 2.3 Value-Aware Supervised Learning
![](https://files.mdnice.com/user/83179/faad9f01-b9ac-4cd7-a6aa-5c0c12013183.png)

在ntp 任务的基础上，增加了一个ecpm生成，对ecpm进行等频分桶（equiprobable buckets）。
![](https://files.mdnice.com/user/83179/e646e5a7-3c0f-43f6-b966-cc42e0788753.png)

（这个ecpm的label应该和onerec一样，由判别式精排模型输出。那generator推全后，还需要离线用evaluator评估一次吗？）

- 对不同行为施加不同的loss权重，这都是小trick了。

然后对LazyAR并行的部分增加一个辅助的MTP loss，让并行部分直接生成target token而不依赖串行的结果：

![](https://files.mdnice.com/user/83179/9dbc04de-34fa-4309-815a-b64cbe044d79.png)

## 2.4 Ranking-Guided Reinforcement Learning

最后还是得加一个强化，对齐业务、并实现可控的探索。

RSPO (RankingGuided Softmax Preference Optimization)：列表级优化，这个损失和NDCG很像。

公式如下，意思是，如果j的ecpm比i的ecpm低，且j的生成概率比i大，那就施加一个和排名（i、j）相关的惩罚。
（所以样本肯定也是请求粒度的，不知道有没有包含未曝光样本）
![](https://files.mdnice.com/user/83179/dc2b8237-4b3b-453e-a08f-3598b9269bd8.png)

作者证明，这个loss就是NDCGcost的上界。


作者将VSL视为学习用户兴趣项目上的稳定基础分布，而RSPO通过偏向生成更高价值的项目来完善这一分布，同时不偏离用户相关性。

# 3 效率优化

作者还提出了一些效率优化方案：

1. 动态beam search。本文的beam search数量不是均匀的，而是每层递增。然后高峰期降低。

2. 结果缓存。在一定时间间隔（例如，一分钟）内的请求直接重用缓存的结果。

3. 其他优化。提出束共享键值对缓存，以沿序列维度组织束。这允许多个束共享单个编码器键值对缓存，消除冗余内存访问，并将每步键值对读取复杂度从O(B·L)降低到O(L)。对beam search引入TopK预切割，它首先并行地从上一步骤的每个束中选择k个候选项，然后在聚合候选项上进行全局Top-k选择。将数值精度从FP32降低到FP8。

# 4 实验

没看到离线指标，只有业务指标。相比onerec-v2有很大提升：

![](https://files.mdnice.com/user/83179/0674c064-b24f-424c-88c8-66e9e4555cfe.png)
