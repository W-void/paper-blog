---
title: "「小红书」搜广推统一LLM｜CROSS-SCENARIO UNIFIED MODELING OF USER INTERESTS"
date: 2025-11-03
tags: [公众号]
---


![](/img/wechat/a1267df7-0ce1-4213-93b5-5eda4059f98b-2f2469.png)

CROSS-SCENARIO UNIFIED MODELING OF USER INTERESTS AT BILLION SCALE
https://arxiv.org/pdf/2510.14788

小红书这种笔记内容的app，简直太适合LLM落地了。这篇文章，llm as Rec，研究跨场景统一大模型，直接整合了搜广推（homefeed, advertisements, search）三个主要场景。这得释放多少人力成本啊，小红书的兄弟们还好吗？

# 1 背景

llm落地多场景，同样面临场景不平衡的问题。

本文还公开了一个数据集，RED-MMU，包含搜广推三个场景，点击、点赞、收藏、分享、观看时长等多种正向行为，数十亿项目和超过一亿用户的行为记录。

# 2 方法

输入是四元组：item、行为类型、场景、时间戳。
![](/img/wechat/f3490749-a1e5-43f3-98c6-f4514e252a13-41175a.png)

目标是学习统一的用户和item表征：
![](/img/wechat/5364aeb9-23e4-4fd9-ad5f-505bce08acf8-a9fb5d.png)

emb生成分为三层：item层、user层（多场景序列）、场景层（场景作为query提取用户信息）。
![](/img/wechat/f2f0f963-0418-46d1-bce9-475f19a31653-fb11a0.png)

- item层包括文本内容、ocr补充信息和视觉信息。
- user层item表征序列 $\mathrm{H}_u$、行为类型表征序列 $\mathrm{A}_u$、时间戳（hour）表征序列，搜广推混合序列：
![](/img/wechat/95924b81-012f-4b74-a3fd-9cf69369a1d7-cff680.png)

- 场景层。给场景定义了k个可学习向量：$Q=[q_1, q_2,... , q_K] $，对用户最近的w个行为进行多兴趣提取：
![](/img/wechat/18e3420a-5474-401e-9290-ab3df0802833-b55865.png)

RED-Rec框架：
![](/img/wechat/722a0e71-5fb2-4c25-a5be-fc5a68154fee-719db9.png)

训练用infoNCE loss：

![](/img/wechat/c676be3f-84e2-4d50-a919-8a8ffc3ed108-4807a7.png)


# 3 实验

item llm 和 user llm 用的是 Chinese-LLaMA-1.3B 和 Qwen-2.5-1.5B。

效果简直好到飞起：

![](/img/wechat/4c48a31a-072e-47f5-842b-f3c6a61ee0da-00403f.png)


![](/img/wechat/0ae7d3d5-508a-4fab-a5f7-e52e151a6e9d-b79e2d.png)

线上部署只在广告业务，作为一路召回，90%的召回都是来自这一路。线上效果：

![](/img/wechat/2fe39ddf-9a74-4e59-9953-710d0efe6ee2-d89991.png)

这篇文章其实没啥技术增量，可能是小红书太适合llm落地了！