---
title: "个性化SID｜PCTX: TOKENIZING PERSONALIZED CONTEXT FOR GENERATIVE"
date: 2025-11-04
tags: [公众号]
---


![](../static/img/wechat/2896564c-e948-4ed0-9582-7e935628cd89-eacd67.png)

PCTX: TOKENIZING PERSONALIZED CONTEXT FOR
GENERATIVE RECOMMENDATION
https://arxiv.org/pdf/2510.21276

将多模态信息融入SID中、将下游任务融入SID中、将检索的词表结构引入SID中，本文将历史上下文信息融入SID中，还有什么能融入SID中的呢？

一般的想法可能是将上下文作为前缀，这篇文章直接把上下文emb作为SID的输入，行为序列和SID耦合起来，感觉会很麻烦。

# 1 背景

本文认为，现在的SID是静态的，没有考虑到历史上下文信息。一般的想法是，历史上下文信息靠模型去提取，这篇文章倒反天罡，将上下文行为融入到sid中，使一个item在不同的上下文中能对应多个sid。


# 2 方法

模型结构如下，$e^{feat}$表示原本的item表征，$e^{ctx}$表示item的上下文表征：

![](../static/img/wechat/7b722db5-4114-490f-a7e5-409f03e84f57-17c2aa.png)

## 2.1 个性化上下文表示
用一个辅助模型，从用户历史行为中提取item $v_i$的上下文信息：

![](../static/img/wechat/34218339-79f4-43ec-a93c-69eb4c9c31f1-69f585.png)

v是行为序列，f是预训练好的辅助模型。

但这样有个问题，每个item可能会有非常多个$e_{v_i}^{ctx}$。所以为了降维，对$e_{v_i}^{ctx}$进行聚类，将每个item的上下文限制在$C_{v_i}$个。

## 2.2 个性化SID

将C个上下文表征和原始表征concat在一起，就得到了item个性化表征。

![](../static/img/wechat/7b977f8d-1939-4e05-9a52-3bbce8ed171f-a44df7.png)

量化后可能会有重复，需要去重。

# 3 实验

像这种动态SID（一个item id对应多个SID），下游NTP任务怎么用呢？

- 首先就是构造NTP序列样本的时候，需要选择item最合适的那个SID（根据$e^{ctx}$选吗？那一个序列得算多少次啊，真麻烦），或者以一定的概率替换为同一item的其他SID。
- 然后就是推理阶段，一个item id对应多个SID，冲突率提升了，SID的hit rate一定占优啊。但是文中并没有提到有特别的动作。如果上下文只是用于SID前缀，可以根据上下文进行硬过滤，本文该如何保证呢？


![](../static/img/wechat/7d405170-a2c7-482a-90b5-a71263a4cafc-c53614.png)
