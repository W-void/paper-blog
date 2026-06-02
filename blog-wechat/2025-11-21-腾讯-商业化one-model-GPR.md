---
title: "「腾讯」商业化one model｜GPR"
date: 2025-11-21
tags: [公众号]
---

GPR: Towards a Generative Pre-trained One-Model Paradigm for Large-Scale Advertising Recommendation

https://arxiv.org/pdf/2511.10138

本文号称第一篇广告推荐的one model，这让EGA-V2情何以堪hhhh。

本文的写作还是有待加强的，读着是真难受，也没有把广告特色讲得很清楚(可能是因为没有讲到计费)，甚至给人的感觉是广告没什么特色（相比于推荐的one model——onerec）。

# 1 背景


![](/img/wechat/3af5c41b-04bf-44a6-9ce0-8a87eb60c6b4-7dca97.png)
我理解这个图的意思应该是：之前的推荐系统是针对item的多层级联架构，这篇文章是针对user的多层“思考”架构。

由于广告推荐任务的固有复杂性，现有的生成模型在实际工业应用中仍面临多重挑战：
1. 数据和行为的极端异质性：广告通常嵌在自然内容里，系统必须同时处理与广告和非广告内容的互动，导致高度嘈杂且复杂的数据分布。
2. 效率与灵活性的trade-off：decoder-only架构能够实现高效的用户级训练，但解码灵活性有限；而encoder-decoder架构虽然允许灵活推理，但由于逐点损失目标导致训练成本过高，不适合实时广告。
3. 平台收入和多方价值优化：广告推荐系统必须在多个利益相关者之间最大化整体生态系统价值——平衡用户体验、广告商的投资回报率（ROI）和平台收入。现有的预训练方法主要依赖于单独优化简化的单一目标（例如，最大化预测的点击率或转化率）。这种孤立的优化导致固有的目标不一致和局部最优，因此无法实现期望的全局优化商业价值。

# 2 方法

## 2.1 输入

针对挑战一，将输入分为用户Token (U-Token), 自然Token (O-Token), 环境Token(E-Token) 和 商品（广告）Token (I-Token)。将自然Token 和 广告Token分别生成SID。

![](/img/wechat/5eaf3b0a-fad3-4c69-b915-f299b7b3e2d8-4365c1.png)

本文用RQ-Kmeans+作为量化器，Q-Kmeans+就是用RQ-Kmeans生成的码本作为RQ-VAE的初始化向量。RQ-Kmeans和RQ-VAE存在码本坍缩的问题，作者认为主要是因为随机初始化，导致其中一些向量在训练期间很少被激活，最终变成“死向量”。（p.s.偏常规，DAS也是同样的操作）

## 2.2 模型结构

整体是个decoder-only结构，包括一个序列解码器（HSD）、渐进式token解码器（PTD）用于推理、和一个分层令牌评估器（HTE）用于返回reward。
![](/img/wechat/6698d7b3-0600-49d8-af02-5045314719b7-5ff603.png)

但其实，本文中HSD更像是encoder、PTD是decoder、HTE是奖励函数。


**序列解码器（HSD）** 的输入是前面提到的<U,O,E,I>四元组，目标是预测next item，将<U,O,E>作为预测的prompt，然后送入一个类似HSTU的decoder中。

![](/img/wechat/98ed9cfb-801a-43cc-a340-6f7e6c4702c0-7dd65f.png)

- 作者提到在这里引入了Mixture-of-Recursions机制，声称能在不增加参数的情况下提升模型深度与推理能力（也没讲这个机制是怎么做的，参考文件是PinRec，没懂啥意思）。
- 为了增加模型推理能力，还用LLM生成了关于用户潜在兴趣的文本“思维过程”，然后将其分词并整合到意图嵌入中，以加强语义理解和推理能力。

**渐进式token解码器（PTD）** 对HSD的输出进行二次提取，将LLM提取的意图分词作为输入并预测：
![](/img/wechat/740dd022-e10a-49a6-9518-ef9e34b8fe27-171ddf.png)

然后通过一个Refining Module进行意图精炼。Refining Module采用的是扩散模型，相当于使用扩散模型进行意图去噪：
![](/img/wechat/e2063274-5652-4bae-ba00-851c0616007a-872adc.png)

（p.s.太难读了，没有一个公式，全看字和图。）

**分层令牌评估器（HTE）** 不同于传统的内容推荐系统，在线广告系统必须同时优化用户参与度和平台收入，将所有指标聚合为final_value。（其实就是多任务，推荐也有多任务啊，这不能算是广告和推荐的区别吧）


![](/img/wechat/c2fb6c20-e0fb-4837-9250-c42d24994cb0-686887.png)

（p.s. 然后也没说怎么做的，这一小节就这么结束了。）

## 2.3 价值引导的树状beam search

解码器（PTD）可能会生成一些不存在的广告id，不同于后置过滤，本文直接将这种约束整合到解码过程中。具体做法就是在前向过程中，根据用户画像动态调整束宽。

# 3 训练

训练分为3个阶段，先是生成式训练方式MTP，再是reward微调，最后搭建了一个仿真环境用于强化训练。
![](/img/wechat/50aa8480-bb2c-4cdc-9aad-25c2d047cf3b-3f9729.png)

这里细节还挺多的，作者花了很大的篇幅，感兴趣可以阅读原文。

# 4 实验

离线实验：
![](/img/wechat/1e10ab48-95d5-4594-a2fb-0d35daadfd49-e22bfa.png)

在线AB：看上去在腾讯进行了5版推全（怪不得写这么乱，没有把思路整合到一个launch里去）

![](/img/wechat/10972717-3809-448b-9c28-60c21c2ff9e7-d68d99.png)
