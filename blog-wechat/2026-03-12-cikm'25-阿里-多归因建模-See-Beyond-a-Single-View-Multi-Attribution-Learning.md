---
title: "cikm'25「阿里」多归因建模｜See Beyond a Single View: Multi-Attribution Learning"
date: 2026-03-12
tags: [公众号]
---


![](https://files.mdnice.com/user/83179/b84c2485-e806-49a2-b0e4-3b1a58ec3e1d.png)

See Beyond a Single View: Multi-Attribution Learning Leads to Better Conversion Rate Prediction

https://arxiv.org/pdf/2508.15217

搜广推早就进入了红海，纯模型迭代越来越困难，所以现在拆墙的工作也越来越多，比如：整合链路吃一致性收益、整合业务吃数据收益、暴力点scaling law吃参数收益。但这些工作都太正能量了，不够花活，有没有一些歪点子，最好是不劳而获的那种，就喜欢躺。

最近在梳理业务，发现归因存在一些“问题”，就在想：实时归因改成点击24h行不行，点击去重改成不去重行不行，把我业务的归因优先级调到最高行不行。虽然没有给商家带来实际订单增长，但业务指标实打实的提升了呀。“再苦一苦商家吧，骂名我来担”。

业务指标是提升了，但算法做功体现在哪呢？找篇论文做做技术深度吧。这不巧了么，刚好阿里这篇MAL非常适合我现在的业务“问题”。改巴改巴发一篇哈哈。

免责声明：以上全是段子哈，本人是正经工作的打工人。

# 1 背景

一般归因有以下几种，first-click归因、last-click归因、线性归因（所有点击均匀分配权重）、MTA（数据驱动的多触点归因，Data-Driven Multi-Touch Attribution）
![](https://files.mdnice.com/user/83179/5148ecfe-71b9-482e-8eaa-f0cf7cd81108.png)

想象自己的业务就是上图的圆圈之一，如何干掉其他业务的圆圈，让自己的业务收益？当然，“正确”的想法应该是：同一商品我给用户推了4次，用户最后一次才点击，前面的曝光算是无效曝光吗？（举个可能不是很恰当的例子，你第四碗饭吃饱了，前三碗饭就不用吃了吗）

这种重复性的建模，可能更适合本地生活、直播场景。

# 2 方法

其实最主要的就是引入标签，本文线性和MTA方法分别比最后一次点击方法多产生42%和15%的正面样本。

![](https://files.mdnice.com/user/83179/c2b6d349-a680-4d68-988b-d56cd7e34290.png)

感觉和多任务其实不是很像，更像是label扩充/改写，但明显作者是延续着多任务的思路。

![](https://files.mdnice.com/user/83179/05caa59b-e8b1-4abe-a74e-9a3f19db0b08.png)

主要包括两个模块：
- 多归因聚合模块：把多归因label像多任务那样单独一个塔预测。作者这里额外引入了一个CAT标签，就是把所有标签聚合形成新的标签，用于细粒度预估。
![](https://files.mdnice.com/user/83179/08dd0b3d-22ca-4c52-a2bd-1f0e5af5c05b.png)

- 目标域适应模块：把多归因塔输出的向量和target塔的向量聚合，进行预估。我认为这样给目标域一个独立塔的好处是不影响目标域的预估值偏差，这对广告业务是至关重要的。

# 3 实验

只和多任务模型进行了对比：
![](https://files.mdnice.com/user/83179/dceeeffb-3be0-42db-b1ab-5746a62ffc45.png)


对于决策链路更长的（稀疏）业务，正样本引入更多，auc提升更多。
![](https://files.mdnice.com/user/83179/d153caa9-6ecf-472c-8be1-5a13a5f0eba1.png)

消融实验证明，几乎全是额外标签带来的收益：
![](https://files.mdnice.com/user/83179/0963c1e5-f3b0-4b98-81ad-07ba4089ccfd.png)

所以这篇文章本质上是额外正样本的引入，缓解了稀疏现象。我更好奇的是本文的样本是如何构造的，比如额外label的周期是多少，处理当天的多次点击还是多天的多次点击？以及长决策链路业务和短决策链路业务，引入label的周期一不一样？