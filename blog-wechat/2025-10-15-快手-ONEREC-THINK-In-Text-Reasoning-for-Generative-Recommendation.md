---
title: "「快手」ONEREC-THINK: In-Text Reasoning for Generative Recommendation"
date: 2025-10-15
tags: [公众号]
---


![](../static/img/wechat/48455f64-2cf5-4f1a-848c-03210a2a1664-592129.webp)

[ONEREC-THINK: In-Text Reasoning for Generative Recommendation](https://arxiv.org/pdf/2510.11639)

又一篇LLM-as-RS（onerec系列），之前介绍过谷歌PLUM做对齐SID+微调llm的工作，这篇文章增加了**显式推理**。那么显式推理的label怎么来？经典的左手倒右手，用一个llm生成另一个llm的样本。

本文在附录中详细给出了每个步骤的prompt demo，值得一读。

# 1 背景

传统推荐系统中缺乏可解释和可控推理能力的问题，而近期的生成式推荐模型（如OneRec）主要作为隐式预测器，缺乏现代LLMs的关键优势——显式推理能力。本文旨在研究如何将LLMs的推理能力与推荐系统无缝集成。

之前的生成式，利用n个历史行为生成第n+1个：

![](../static/img/wechat/2aa0cb79-ee5d-4574-994a-7a7e1a94bd8a-38771b.webp)

本文引入推理序列$\tau$，先生成推理原因，再生成第n+1个：

![](../static/img/wechat/4182f881-418c-4d2e-a8d9-99e872c086ec-c3fa98.webp)

所以核心在于推理序列$\tau$如何生成。

# 2 方法


![](../static/img/wechat/a5df39b1-cbed-4b19-b59e-dfa5fcf2d2c5-f88b0d.webp)


## 2.1 Itemic Alignment（项目对齐）:

通过跨模态的项目-文本对齐实现语义对齐。具体任务包括：
- 交替用户画像对齐（Interleaved User Persona Grounding）：将项目标记和文本标记交替排列，创建丰富的双模态训练实例。

![](../static/img/wechat/f833288d-e180-4906-83fb-4f88a275d67c-60f2f6.webp)

- 顺序偏好建模（Sequential Preference Modeling）：从用户历史时间序列中预测后续项目交互。

![](../static/img/wechat/86c4a72b-69cd-45cb-b324-273976abecd1-68e948.webp)

- 项目密集描述（Itemic Dense Captioning）：从项目标记中解码项目的描述性内容。

![](../static/img/wechat/169d462f-a47f-47c0-9b24-580331d91b8e-44a1d3.webp)

- 通用语言建模（General Language Modeling）：在通用文本语料库上继续预训练模型。

## 2.2 Reasoning Activation（推理激活）:

- 先sim选出和target最相关的top-k（10）个行为：
![](../static/img/wechat/dff0f17c-600a-4ca7-970a-9a32f5b6a545-d56bdf.webp)

- 再用llm（文中只提到是一个语义对齐的模型）生成用户行为理由：

![](../static/img/wechat/68fd893c-9739-48ad-955e-823c713cd5ec-4de29e.webp)

- 最后作为监督信号，lora微调推理过程，loss为：
![](../static/img/wechat/99fc0b3f-54c3-43d4-89c8-d2b727d6e76f-a6a7ae.webp)


## 2.3 Reasoning Enhancement（推理增强）:

通过强化学习进一步优化推理路径，使用针对推荐任务设计的奖励机制。
具体方法包括：通过Beam搜索评估推理能力，使用GRPO算法优化模型。


![](../static/img/wechat/daed4f7f-d4fa-4b03-b359-08726dd03b5b-268782.webp)


# 3 实验

llm基座模型为Qwen-8B。

推荐demo：
![](../static/img/wechat/8ffa4cf7-610a-4fcb-b24e-3e7d1ec7af00-34918c.webp)

在线效果：

![](../static/img/wechat/b37fd8de-4f42-4ae3-a36e-14d34622765d-136c28.webp)

# 一点碎碎念

感觉除了搜索场景存在query外，其他推荐场景的语义信息（SID）都不是很明显，搞NTP有点强行，所以现在很多声称生成式方法其实还是判别式任务。本文也提供了一个思路吧，没有语义信息我就构造语义信息（Reasoning Activation）然后去学习。

llm的token id序列是【 2，415，231，551】这样的，NTP很分散，生成式有分布可学，上限较高。推荐场景下，用户的兴趣较为集中（甚至存在信息茧房），本地生活场景更甚，用户的token序列可能是【2，2，3，1，2，2，1】，用户喜欢的商家（兴趣）是固定的，NTP很集中（其他场景SID之后估计也是这样）。在这样分布很简单的业务上，生成式是否大材小用。
![](../static/img/wechat/7793a35a-56f9-4157-a3ef-d18fd678b378-e94790.webp)
