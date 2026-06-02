---
title: "「快手」OneSearch: A Preliminary Exploration of the Unified End-to-End"
date: 2025-09-05
tags: [公众号]
---

[OneSearch: A Preliminary Exploration of the Unified End-to-End Generative Framework for E-commerce Search](https://arxiv.org/pdf/2509.03236)

![](/img/wechat/7d3e2742-083e-4b08-8180-6c15216beec6-bdf6e8.png)

之前介绍过快手的OneSug，这次同一团队又出品了OneSearch，相似的业务背景、方法思想、行文结构，联合食用更佳。

本文模型的主体结构和OneRec类似，其他部分提出了很多搜索业务的方案，而且这篇文章给出的细节非常多，还是建议阅读原文。
![](/img/wechat/b4ebbe08-dc58-423a-a287-f1b199ae0f21-dacadf.png)

快手现在有自然场景的OneRec、本地场景的OneLoc、推荐词场景的OneSug、搜索场景的OneSearch，还缺啥场景？（商业化？广告可以先看美团的EGA）

生成式在搜广推也是越来越火热了，但今天看到了seed增发期权的消息，只能自嘲：“垃圾搜广推别来蹭我们大模型的热度了”😭😭😭

# 1 背景


![](/img/wechat/a23733c8-960d-4e18-a62b-da4ca9f21d80-45816e.png)

![](/img/wechat/b46b3fd4-eba0-43ec-bb36-31f712b375c5-843c4f.png)

本文是快手电商搜索场景，有几个关键的挑战：

1. 搜索query的相关性约束。查询通常由2-3个简短的关键词组成，任何属性的不匹配都可能导致显著的相关性问题。尽管基于语义ID的GR模型可以构建项目的层次化、可学习的表示，但它们不可避免地会导致核心属性表示的丢失，因为它们倾向于学习相同SID下的共享信息。
2. item信息有两个特性：1）信息冗余，卖家经常添加无关的关键词来增加曝光率。2）项目描述中的语义顺序较弱。重要信息如品牌名称、属性、词汇和类别通常不考虑位置出现在文本中。
3. 挖掘用户兴趣挑战。当用户输入简洁的查询或搜索一个全新的类别时，有效结合查询内容与用户行为档案以推断用户的真实搜索意图至关重要。（但我觉得在挖掘用户兴趣这一点上，搜索比推荐有优势，起码用户提供了query）


# 2 方法


![](/img/wechat/05f55484-5002-44c3-a19d-92a74379f30d-411804.png)

模型分为4个部分：SID、多视角行为序列、模型结构（encoder-decoder）、偏好对齐。

# 2.1 SID

![](/img/wechat/b6d1bf5b-b04c-4c36-bfd2-5f7a955d5c4c-ca19de.png)

1. 语意向量生成。和OneSug一样，先用BGE语言模型生成query和item的初始emb。然后进行语意对齐，损失有: i2i、q2q、q2i的对比损失、q2i的margin loss 和 难样本的相关性loss，相关性标签由LLM得到。
  ![](/img/wechat/0cb23bde-41b4-4036-9a75-cee11216d376-99b7f1.png)
2. 语意向量增强。item的文本往往会有一些和item无关但能加曝光度的一些文本，比如OneSug用相关query对prefix进行增强，本文用top keyward对item的keyward进行增强。具体来说，提取了18种keyward类型，每种类型的keyward都选择pv最高的几个组成core keyword表，然后进行增强。
  ![](/img/wechat/8ea0421f-46f3-4dec-ab58-782916ceedf4-1662e3.png)
3. 语意ID生成。RQ-Kmeans提取共性表征，但丢失了最后一层的残差，作者认为这是每个item的特性（其实特性和噪声往往很难分清，因为作者前面做了很多增强的操作，所以这里特性多而噪声偏少吧），所以作者保留了最后一层残差，并用OPQ提取特性表征。OPQ就是乘积量化，用两个额外的SID量化最后一层的残差。
  
作者做了实验，独立编码率（ICR）有明显的提升：
![](/img/wechat/399336e6-15b4-451f-bb6c-c6af9bbc14d2-b60f56.png)

而且这个OPQ好像只适合量化最后一层的残差，用OPQ替代前面的RQ-Kmeans，效果下降很明显。
![](/img/wechat/0d68b49e-d733-4514-a14f-54e65dd2939a-126023.png)

## 2.2 多视角行为序列

![](/img/wechat/e2d3dfce-7c2c-4506-a33a-bed213cd0c0e-9b4047.png)

1. 用户SID。 由长短序列提取，长度为m的短期点击序列、长度为n的长期下单序列，再加上一个时间衰减系数，所以用户SID的长度为10：
  ![](/img/wechat/69dcdc40-8663-4131-ae52-17e7326c2f06-2a80c4.png)
对于新用户或冷启动用户，行为序列不是很长，根据query-item出现次数统计每个查询的点击最多的项目，按pv降序排列作为默认的行为序列。
2. 短期行为直接输入下游模型。这里用到了滑动窗口对短期行为序列进行数据增强。
3. 长期行为，包括点击行为、下单行为、搜索相关行为，经过3层RQ编码后，对每一层RQ聚合，再做QFormer，得到长期行为表征，输入到下游模型中：
  ![](/img/wechat/e25ae4bb-49ce-44bb-becd-995da7d7c49f-39524e.png)

## 2.3 模型结构

encoder-decoder结构，样本组织形式也和onerec类似。输入包括前面提取的：用户SID、query和对应的query SID、显式的用户短期行为、提取后的用户长期行为、用户属性特征。
![](/img/wechat/b4ebbe08-dc58-423a-a287-f1b199ae0f21-dacadf.png)

## 2.4 偏好对齐


![](/img/wechat/f38f2f1a-232a-49c8-955b-3858e7350331-2c2f41.png)

相比于推荐，搜索需要多考虑相关性对齐。设计了多阶段SFT和自适应奖励系统。

**多阶段SFT。**

不像OneRec上来就是模型结构，因为本文OneSearch的阶段很多，所以提出了对多个阶段都SFT。（什么？有种感觉，one model 将原来的“漏斗多阶段”变成的另一种多阶段😂）

1. 语义内容对齐：设置了三个子任务：（a）将query/item文本作为prompt输入，然后输出相应的SID。（b）以SID为输入并生成原始query/item文本。（c）输入query/item 文本，输出相应的类别信息。前两个任务旨在使SID和文本内容对齐，而类别预测可确保相关性。
2. 共现同步：做query和item之间的相互预测以及query SID和item SID的相互预测。
3. 用户个性化建模：就是NTP loss。

**自适应奖励系统。**

和OneRec-v2一样，OneSearch也直接用用户行为作为reward，但在训练样本采样和训练范式上有差别。

1. 自适应加权奖励信号。

![](/img/wechat/cc072e9c-14a3-4d27-ae83-be5e847a3a7b-c45f53.png)

和OneSug一样，将用户行为分为6个等级。
![](/img/wechat/5ebaa412-aeea-407f-b3c7-d6ee23640684-c3f6bf.png)

reward要综合考虑曝光、点击、下单，计算公式为：
![](/img/wechat/a62d9fbe-cd6e-4121-a8fc-056ffbe6445c-63529c.png)

2. 奖励模型训练。

![](/img/wechat/308ec782-de11-4230-9862-a5eb69281e61-d2e0e6.png)

OneRec-V1的采样可能会导致有偏，OneRec-V2采用GRPO及其变体（例如ECPO、GBPO）也会引入更多无关的SID。因此本文提出了一个基于SIM的三塔框架，三个塔分别学习CTR、CVR和CTCVR（使用二元交叉熵损失）。最终偏好分数的计算方式为：
![](/img/wechat/828b9733-de5c-46b5-b933-6f4d71e1e0ce-886949.png)

这个三塔模型相当于是精排模型的蒸馏版，省去了替换精排“老汤”模型的麻烦。特征和OneSearch保持一致，并且增加了一部分推荐场景用户同品类的正样本。

**因为OneSearch的场景是电商场景，所以可以过滤掉没有正行为的pv，做下面的list-wise DPO，再加上蒸馏精排模型，实现全样本训练。**

# 3 实验

离线实验：
![](/img/wechat/52c6f9fc-1f07-42f2-8f1a-4db9cabe1476-93c28a.png)

在线实验：
![](/img/wechat/2b2841c7-e440-422d-8b5b-203fb17c3585-681aa4.png)

MFU从3.26%提升到27.32%，推理成本（operational expenditure，OPEX）下降了75.4%！
![](/img/wechat/b846be6d-56bc-4633-ad63-584dd5a4969f-41aabc.png)

而且不像OneRec-v2对冷启物料不友好，OneSearch对长尾query仍然有效！
![](/img/wechat/43d9dea9-09f2-410a-9714-3789438149f5-e95b70.png)

![](/img/wechat/df6e6256-150f-4a62-b911-e182b7aeb8b1-0d3336.png)


# 4 更多分析

**1. OneSearch模型在线收益的主要方面是什么？**

如图8所示，本文计算了前30个行业的点击率（CTR）相对增益，30个行业中有28个经历了增长，平均增幅为2.49%。本文按流行度分为三类：top（pv〉1000）、middle（100<pv<1000）和long-tail（pv<100），如表10所示，OneSearch模型提升了所有类别的查询效果。

**2. OneSearch是否具有更强的推理能力？**

这个作者主要通过case来判断。例如，一位之前搜索过“情侣运动鞋”和“情人节礼物”的女性用户在搜索“银戒指”时，很可能是在寻找一对戒指送给自己和伴侣。作者在真实日志中观察到，只有OneSearch呈现了相关产品，最终被用户购买。

在传统的电子商务搜索场景中，排名模型通常涉及数千个特征，它们的组合可能会掩盖一些关键属性。此外，该模型结构通常由简单的浅层神经网络堆栈组成，导致其推理能力极弱。而OneSearch则利用用户的长期和短期序列信息来识别他们的潜在兴趣，并通过transformer结构的注意力机制增强对用户搜索意图的推断。

**3. OneSearch将来会考虑哪些优化点？**

作者会探索实时在线的tokenization，旨在通过单一生成模型实现统一的编码和推理，从而减少离线编码与流式训练之间的差距。此外，通过更强大的强化学习来对齐用户偏好，并为item整合多模态特征（如图像和视频），可以进一步提升OneSearch的推理能力。