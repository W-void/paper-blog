---
title: "「谷歌」PLUM: Adapting Pre-trained Language Models for Industrial"
date: 2025-10-15
tags: [公众号]
---


![](../static/img/wechat/c9e77724-5623-4508-9d75-d0772c720c70-bf78ac.png)

[PLUM: Adapting Pre-trained Language Models for Industrial-scale Generative Recommendations](https://arxiv.org/pdf/2510.07784)

前两天还说工业界都比较保守，主要在SID-based GR上做SID增强、prompt增强、稳定性的工作，今天deepmind就这么激进地来了一篇LLM-as-RS。

![](../static/img/wechat/819d6b06-e638-40c5-a978-1233b98e62aa-c5d68d.png)

应该是已经部署在了YouTube上。

# 1 背景

传统推荐系统是ID-based，参数主要在高度稀疏的ID embedding上，后续的dense部分很简单（甚至有one-epoch这种过拟合现象）。

LLM（生成式）是反过来的，将稀疏的ID压缩成稠密的SID，以此来增加dense参数、释放模型能力。（所以你认为SID是生成式必须的吗？）

本文是将LLM直接作为推荐模型。作者认为，LLM用于推荐的主要挑战在于：
1. 领域差距，LLM没有吃过推荐的数据，不适配；
2. ID表征，推荐场景的词表太大了。

就引出了本文的三个模块：
1. SID-v2；
2. 持续预训练，Continued pre-training (CPT)；
3. 微调。

（因为LLM结构是没办法变的了，也只能改这些了吧。）

# 2 方法

## 2.1 SID-v2
SID流程一般包括两步：
1. 将特征（sideinfo）编码成稠密的语义embedding；
2. 将密的语义embedding离散化成SID。

本文的SID方案如下：
![](../static/img/wechat/c74f9dc1-880b-4261-a992-4e684ca9885a-3a9529.png)
1. 融合多模态特征，包括文本、视频、音频。（常规操作）
2. 多层精细化量化。可以看到，本文的码本层数达到了8层（虽然图中画的是5层），onerec、onesearch里都有提到，层数大于3后效果就不好了。本文的方案是**先加大层数再约束**：
- **约束1: 多分辨率码本**。每层的码本大小逐渐减小（残差信息越来越少）：$$2048/2^{level-1}$$ 
- **约束2: 渐进式掩码**。类似于tf.sequence_mask，引入随机mask。

3. 共现对比损失。用共现过的item进行对比增强。
![](../static/img/wechat/2d5b2e64-ab41-483b-9166-41ad7a6a1784-13977f.png)

## 2.2 预训练（Continued Pre-training）

用NTP任务做预训练，不仅用用户行为数据，还用视频元数据做NTP。样本格式如下：
![](../static/img/wechat/5a184b39-6011-4446-8566-77741677208b-63a9bb.png)

## 2.3 SFT

![](../static/img/wechat/42193044-52bc-4d2f-95f2-b6e97b47f626-5c8dc8.png)

输入prompt不仅包含SID token 和用于数值特征的自定义token，还包含其他可以由预训练的LLM自然编码的文本特征。

（看这个图感觉码本有A-H 8层）

![](../static/img/wechat/5f97b261-0146-4377-9285-26be01695866-ece75c.png)


# 3 实验

基座模型是Gemini-1.5（900M参数）。在长视频和短视频上做实验。base 模型是一个传统的large embedding model，dense部分的参数仅占0.4%。而本文PLUM的dense参数占到了90%。

- 对比指标也有点意思，Effective Vocab Size：覆盖95%的词表需要多少视频。（SID-based model和ID-based model 比不是欺负人吗。）WT和WF分别是观看视频的长度和比例。
![](../static/img/wechat/7ee7de39-8c54-4e3a-a921-9f61e223bdb4-f1d606.png)

- 除了点击和时长，用户的各种参与度指标也有提升。
![](../static/img/wechat/8a046c5e-6f82-4c61-a752-89413212fa05-91999e.png)

- 训练成本也降低到了0.55倍。虽然单个样本的训练成本变大了，但样本数量变少了。训练9亿参数的PLUM，仅需要2.5亿的样本，传统模型需要数十亿。

- SID的消融实验。SID的唯一率这么高。看上去共现损失才是最关键的。没有看到码本层数的超参数实验。


![](../static/img/wechat/20fc78c5-bcda-496c-8805-0de2b5051746-0747f8.png)


- 用LLM初始化，效果比从头训练好。


![](../static/img/wechat/eeee8f5d-1efc-4ddb-8830-531a64341587-5041f8.png)

![](../static/img/wechat/6c6ac0da-ef97-498c-b3b8-ef9747129e97-510f03.png)

- scaling law。作者解释3B效果不好是因为还没训练完。

![](../static/img/wechat/48216cab-1a89-4c53-aa3f-06ca545d6f1a-2e4243.png)
