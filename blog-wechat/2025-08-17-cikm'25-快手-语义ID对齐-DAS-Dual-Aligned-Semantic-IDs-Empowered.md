---
title: "cikm'25「快手」语义ID对齐｜DAS: Dual-Aligned Semantic IDs Empowered"
date: 2025-08-17
tags: [公众号]
---

[DAS: Dual-Aligned Semantic IDs Empowered Industrial Recommender System](https://arxiv.org/pdf/2508.10584)


![](../static/img/wechat/8d37a693-60c9-449f-92e5-56a7a0ab39ed-7fa860.png)

如果说NTP落地到推荐系统中的姿势还有待商榷，那利用LLM的世界知识生成sid应用到下游任务中应该是无可争议的。

既然涉及到下游任务，那么和下游任务的对齐一定是研究重点。前有快手QRAM利用sid实现llm的近似端到端应用，但仍有较大改进空间。要和下游任务对齐，一个最简单的想法就是：对齐下游任务的u2p label和loss。

就在笔者的论文正在撰写中时，看到了快手这篇文章，现在生成式太容易撞idea了！

# 1 背景

llm生成的语义ID与下游基于协同过滤的推荐任务之间的一致目标固有偏差长期以来一直是行业内的一个关键挑战.

目前的对齐机制可以分为两类：
1. CF first：下图2（a），我理解就是像CLIP那样，多模态emb对齐；
2. Alignment First：下图2（b），像QRAM那样，在量化之前，使用一个训练有素的CF模型对多模态内容表示进行对齐。
![](../static/img/wechat/277c89d1-7ae1-4f86-a8d2-626c6c25dbce-02bc99.png)


# 2 方法

![](../static/img/wechat/cb5140cb-2a40-4d8e-85ac-eaa727114e46-bc5559.png)

1. 用LLM生成用户和item的语义emb；
2. 分别量化用户和item的语义emb，生成语义ID，loss为重构损失+聚类损失：
![](../static/img/wechat/11606f37-8bfe-46b6-8b46-be7dc0819376-9a41ee.png)
3. 协同损失，作者这里还考虑了流行度偏差。具体来说，就是将用户无偏兴趣表示$c_u^{int}$与用户的从众表示$c_u^{con}$分离，将广告内容无偏表示$c_i^{pro}$与广告的流行度表示$c_i^{pop}$分离。这4个都是基于用户/item的ID特征得到的。
loss如下，其中$c_i^p$表示item真实的流行度表示，$c_u^c$表示用户真实的从众表示。这两个是基于流行度特征得到的（比如：曝光数、点击数）

![](../static/img/wechat/050e5a00-238f-4d6f-86db-5e6654229ad9-68f347.png)


![](../static/img/wechat/b0eaae0e-c47c-462c-a886-80dc19195c6d-8a12f5.png)

4. 最关键的对齐方式。

- u2i损失：user无偏和item无偏各来一次。

![](../static/img/wechat/0515c933-c3a7-4375-9c61-c3ee9fa1d2af-f238ff.png)

![](../static/img/wechat/664a65e7-32f5-4702-aa2a-6c1fe9b10d04-71d6d4.png)

- u2u和i2i损失：

![](../static/img/wechat/c68f1235-37c1-4914-a735-5c534876995e-d09809.png)

![](../static/img/wechat/b4996269-47b2-431d-b5c4-119dcf183ffc-233d7b.png)

（说实话，有点繁琐。）

# 3 实验

离线实验：指标是下游任务的auc，看上去去偏效果还挺大的。

![](../static/img/wechat/667321f7-034b-4a8e-abf9-6d5d33df77b4-105476.png)

sid应用在生成式任务上也是又提升的：
![](../static/img/wechat/54387e74-51f1-4311-9f1b-2b8eafebb7a9-242e65.png)

在线实验：
判别模型和生成模型上的eCPM分别提升2.69%/0.79%。