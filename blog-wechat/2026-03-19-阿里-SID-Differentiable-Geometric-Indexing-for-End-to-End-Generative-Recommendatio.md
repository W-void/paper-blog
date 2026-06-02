---
title: "「阿里」SID｜Differentiable Geometric Indexing for End-to-End Generative Recommendation"
date: 2026-03-19
tags: [公众号]
---


![](/img/wechat/65a27495-a732-4c39-919b-c462c6d68744-bf9420.png)


Differentiable Geometric Indexing for End-to-End Generative Retrieval

https://arxiv.org/pdf/2603.10409

上周刚提过SID的一大方向就是端到端，这周就看到阿里的这篇DGI，也是端到端SID。

背景已经很清晰了，直接说方法：
![](/img/wechat/e3660008-4eed-47ef-861f-50fc21da5c79-75f1bd.png)
1. 优化阻碍。针对现在先量化SID再推荐的两阶段割裂问题，采用双塔模型直接优化协同信号。本文认为STE那种梯度传播方式是有偏的（因为STE是已经量化完了才计算梯度），所以用Gumble-softmax的方式传播梯度；
2. 几何冲突。作者提出，内积的距离度量方式会使热门商品的长度越来越长，使得热门商品计算内积占优，所以用cos相似度度量。其实就是cos计算的是角度，内积还和长度有关。

其实我觉得本文还有一个小贡献点，就是一般双塔结构的SID模型，只有协同信息的判别loss，本文还额外引入了NTP生成loss，也就是第三层的sid计算loss时是将前两层作为条件输入的。

完整模型图如下：
![](/img/wechat/6b8d3b71-3f86-49bc-984c-34974b3a1a23-cdac14.png)

实验：

![](/img/wechat/b60796e0-c991-4376-978d-e9e9ca5bb970-541765.png)

应用在阿里的网页搜索和电商搜索业务中。

我还注意到，一般的GR指的是Generative Recommendations，而本文中GR指的是Generative Retrieval，是不是作者也认为，SID这种生成范式就是个召回？