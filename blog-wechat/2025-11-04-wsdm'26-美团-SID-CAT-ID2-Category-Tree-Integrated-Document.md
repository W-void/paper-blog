---
title: "wsdm'26「美团」SID｜CAT-ID2: Category-Tree Integrated Document"
date: 2025-11-04
tags: [公众号]
---


![](../static/img/wechat/95620dde-048a-476f-95f5-6d67ca552de6-20f534.webp)

CAT-ID2: Category-Tree Integrated Document Identifier Learning
for Generative Retrieval In E-commerce

https://arxiv.org/pdf/2511.01461

把检索词表（DocID）的结构信息引入SID的生成过程，让DocID老树发新芽，应该是一件挺有意思的事情。

把id遮住，我还以为这篇文章是阿里的。

# 1 背景

搜索系统通常包括“语义理解-检索-排序”多个阶段。语义理解中的关键步骤是query rewriting，传统的query rewriting依赖规则或统计，泛化能力有限。

生成式推荐（GR）一方面利用llm增强了语义理解能力，另一方面通过SID整合语义理解和检索，克服了多阶段的一些误差。

本文认为，一种有效的语义ID构建方法必须满足三个关键属性：
1. 相似的文档应该有相似的ID；
2. 不相似的文档应该有独特的ID；
3. 文档的语义ID应该是唯一的。

前两条容易理解，第三条可能会有争议，一般认为冲突率在一个可接受的范围内就好。

RQ-VAE这种无监督聚类捕捉层次结构，缺乏可靠性；强制类别内一致性约束又太严格，忽略全局语义关系。所以本文采用将类别信息作为软约束（其实就是辅助loss）。

# 2 方法

![](../static/img/wechat/598c7727-ce22-450d-b528-85361dae1630-842853.webp)
其实就是3个loss。

## 2.0 原始的RQ-VAE loss

原始embedding用d表示，encoder到隐空间后为z，z再经过量化变为$\hat{z}$，重构损失就是decoder后再还原回d：

![](../static/img/wechat/076ef161-b6f9-4c40-8d46-a5eef0c9286d-cbc94c.webp)

## 2.1 分层类别约束loss
约束相同品类的doc在同一个code中。
![](../static/img/wechat/fa1d9ab9-c559-40b6-933c-e0cfb2dc5efc-986f7f.webp)
其中，$r_a$、$r_p$、$r_n$分别代表锚点样本、正样本和负样本。同一类别内的文档被视为正例，而来自不同类别的文档则被视为负例。从第二层开始，选择在前一层属于同一类别但在当前层落入不同子类别的作为负样本。

值得注意的是，类别树的最大深度 H 必须小于 RQ-VAE 的最大深度 L，才能使用此方法。

## 2.2 簇尺度约束loss
如果类别数量|C|小于码本数量K，那么每个类别的样本可能会独占一个码本code，就起不到聚类的效果（相当于K-means选的聚类中心数量比样本数量还多）。
![](../static/img/wechat/df0e7267-5cf8-4335-9c5c-2bcc1f640582-4bef86.webp)
直接让样本属于某个code的概率和全1向量计算双向的KL散度。双向KL散度有两个目的：第一项防止过度使用某些码本code，而第二项则对未使用的码本code进行惩罚。CSCL通过鼓励样本在码本条目上的平均分布接近平均分布，来惩罚分配不平衡的情况。因此，它显著提高了码本的利用效率。

（感觉让模型既要往左、又要往右，你就说考虑的全不全吧，然后效果全靠调参是吧。不如对每个类别C设置不同的权重，但超参数也太多了hh）


## 2.3 分散loss：

争议最大的第三点来了，为了保证文档语义ID的唯一性，让解码后的$\hat{d}$和其他doc距离尽可能远。

![](../static/img/wechat/6147af31-c9f0-491e-be72-e8a8e01c1e26-b0d9fd.webp)

重构损失是让$\hat{d}$和d尽可能接近，这个loss是让$\hat{d}$和其他$\hat{d}$尽可能远。

（感觉这个loss有点多余呢，如果$d_i$和$d_j$本来就远，重构损失就能让$\hat{d}_i$和$\hat{d}_j$拉远，如果如果$d_i$和$d_j$本来就近，这个损失就和重构损失矛盾了，最后就变成调参的艺术了。）


最终的loss：

![](../static/img/wechat/9b89e5ad-c27e-4882-89b6-07c27a673d60-a0becd.webp)


# 3 结论

离线效果：
![](../static/img/wechat/337873f4-4af8-4a93-93ed-6d5d402234f3-fb92ca.webp)

超参数分析：
![](../static/img/wechat/415f1d9c-0507-4627-826a-82280d29c204-abb2e4.webp)


在线AB：
![](../static/img/wechat/afe95c2a-3db9-42fc-bab0-4136103f38df-be155d.webp)


这个图画的真不错，看上去浅层还有明显的类别属性，深层基本就均匀分布了。
![](../static/img/wechat/422af4c3-d026-4ad6-911b-5eb7c774cc68-11e3f4.webp)
