---
title: "「字节」OneTrans: Unified Feature Interaction and Sequence Modeling"
date: 2025-11-06
tags: [公众号]
---


![](../static/img/wechat/380b8536-2a9e-4a64-b9b1-f1e06c77f876-6a170d.webp)

OneTrans: Unified Feature Interaction and Sequence Modeling with One Transformer in Industrial Recommender

https://arxiv.org/pdf/2510.26104

说到scaling law，大家的第一反应应该都是生成式。诚然，模型越大，越容易过拟合，所以泛化性更强的模型上限会更高。

还有没有其他探索scaling law的启发式思路呢？统一特征、统一模块应该是共识之一，因为这样对硬件友好，更容易扩展参数，以达到增加算力的目的。

OneTrans其实和RankMixer很像，都是：
1. 统一序列和非序列特征。只不过两者刚好相反，rankmixer是将序列特征视作非序列特征，onetrans是将非序列特征视作序列特征（的target）。
2. 统一模块，在判别式模型中堆叠。两者也是相反，rankmixer堆叠特征交叉模块，onetrans堆叠attention模块。

要说两者的优劣吧，我觉得：
1. rankmixer工程上更容易扩展，毕竟直接干掉了transformer，但特征的组合可能很关键；
2. onetrans更容易迁移到其他业务上，毕竟很多业务的收益来源主要是序列；
3. 美团的MTmixAtt可能是两者的折中。

字节的风格还是偏务实的，不愿意去硬蹭生成式的概念。很多模型，明明不是GR，非要去蹭GR的概念。说实话，现在的生成式有点像推荐领域的“石墨烯”，是不是往里面加个“屎”都能号称提效？

本文只是笔者对onetrans的浅显解读，更多理解请看作者本人的讲解：
https://zhuanlan.zhihu.com/p/1967720826364212891

# 1 背景

统一序列特征和非序列特征是本文的主要卖点，之前的方法是将序列建模和特征交互作为独立模块分离引入了两个主要限制。作者认为这样存在两个问题：
1. 模块分离限制了信息的双向交流流；
2. 模块分离会打乱执行过程并增加延迟，影响扩展参数。

![](../static/img/wechat/850f11b1-c779-4edc-9ace-f0cf9b79464e-c9cb4a.webp)

OneTrans的做法有点像大号的LHUC、PEPNet，把非序列特征直接作为target的补充信息，加到序列建模里去。所以上面作者画的图也很形象，去掉了橙色的MLP层，把蓝色的“Sequence Modeling Block”扩大，就成了OneTrans。

说实话，我觉得“统一序列特征和非序列特征”这个出发点有点小。因为统一序列特征和非序列特征本文并不是第一个做的，rankmixer、homer这些统一模型基本都是这么做的，rankmixer直接声称去掉attention能在不损失精度的情况下扩展scaling law，homer针对特征异质性进行了专门的处理，在target和序列里都加入了非序列特征，相比之下onetrans的融合就没什么特色了。

# 2 方法


![](../static/img/wechat/e6abdac7-7ffb-4067-b786-aa7a6a786722-998056.webp)

## 2.1 特征&分词

特征分为序列特征和非序列特征（包括：user特征、item特征和上下文特征）。

- **非序列特征（NS）**。连续特征和离散特征分别分桶embedding和one-hot embedding。

两种Tokenizer方式。

Group-wise Tokenizer：先分组，再mlp（rankmixer的方式）
![](../static/img/wechat/2a5d3239-8e99-4d76-bb31-9145e8ed2054-6292e7.webp)

Auto-Split Tokenizer：先mlp，再分组
![](../static/img/wechat/c919a849-ea90-40e8-9332-1182ad76b3b2-608a56.webp)

- **序列特征（S）**。

n个多行为序列：
![](../static/img/wechat/47fdd328-d15a-4099-896c-d45a70f14211-4de719.webp)

每一类行为过一个共享的mlp进行对齐：
![](../static/img/wechat/1d23f83b-2348-46f9-acb6-0bca39ddb930-d8d6e7.webp)

再对序列进行token化，方式有2种：1）按时间排列：按时间交错所有事件，并带有序列类型指示符；2）按行为类型排列：按事件影响连接序列，例如，购买→加入购物车→点击，在序列之间插入可学习的[SEP]标记。消融结果表明，当时间戳可用时，时间戳感知规则优于按影响排序的替代方案。

![](../static/img/wechat/f91b342c-d6f7-4e00-8a01-32ab3761d875-359a61.webp)

（又不是NTP任务，为啥要加个[SEP]？作为bias么，也不是说一个causal窗口一个独特的[SEP]啊）

## 2.2 OneTrans Block

序列特征按照时间顺序排（没有时间按照行为类型排），非序列特征放在最后，以此顺序进行Causal Attention。就相当于非序列特征作为target的扩充（sideinfo），参加target attention计算。


在计算attention时，序列特征共享一组QKV（毕竟都是item id），非序列特征每组特征一组QKV：
![](../static/img/wechat/b9f21bfe-d463-49d5-b001-3f2b7f1f0d3e-b473ff.webp)

![](../static/img/wechat/1d84fd98-3f12-4ec5-92ef-80c962645d1a-757dee.webp)


FFN层也一样，序列特征共享一组QKV（毕竟都是item id），非序列特征每组特征一组QKV：
![](../static/img/wechat/fa6b819f-5bdf-40ce-94f6-e7fdef1b6613-3c172e.webp)

## 2.3 序列金字塔
那么长序列（千级别、万级别）肯定不是每个item都有用，所以就压缩。（6层，从长度1190线性压缩到12）


# 3 实验

6层onetrans block，每个token emb维度256，multi head为4.

- 离线auc：
![](../static/img/wechat/00cdb902-b00d-4320-b97e-391f1232d2d1-8e608c.webp)
看上去本文是将rankmixer当作不带序列的特征交叉网络了。

- 消融实验，[SEP]还是效果影响最大的。
![](../static/img/wechat/120afbfd-2dbe-44ac-bf6a-e926377f3ac8-853325.webp)


- scaling law：把rankmixer按在地上摩擦。
![](../static/img/wechat/87d10050-d643-4b63-b283-62781ea2b2b9-e12762.webp)

- 线上也是把rankmixer按在地上摩擦。
![](../static/img/wechat/94e73dc8-0cbc-426e-a489-30f60dbce80f-83a914.webp)
