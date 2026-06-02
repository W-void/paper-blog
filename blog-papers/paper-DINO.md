---
slug: dino
title: "DINO：自监督 Vision Transformer 的涌现属性"
date: 2021-04-29
tags:
  - 自监督学习
  - Vision-Transformer
  - self-distillation
  - 涌现属性
authors: wangshuli
description: "Facebook AI & Inria | 博导判决：🌟 Strong Accept"
---

- **日期**：2021-04-29
- **来源**：https://arxiv.org/abs/2104.14294
- **作者**：Mathilde Caron, Hugo Touvron, Ishan Misra, Hervé Jegou, Julien Mairal, Piotr Bojanowski, Armand Joulin
- **发表**：ICCV 2021

---

## 缺口

Vision Transformer 在 2020 年末横空出世时，社区的第一反应是兴奋，第二反应是困惑。ViT 需要海量有监督数据（JFT-300M）才能超越 ConvNet，而在 ImageNet-1k 的量级上甚至不如 ResNet。与此同时，NLP 领域的 BERT 和 GPT 早已证明：Transformer 的真正潜力要靠自监督预训练来释放。更让人不甘心的是，有监督训练出的 ViT 在 attention map 上并没有展现出什么独特属性——它的注意力分散、嘈杂，远不如人们期望的那样"理解"图像结构。这就是 DINO 想要回答的问题：如果我们把有监督的标签拿掉，让 ViT 纯粹通过自监督去学，它会不会像 BERT 一样，涌现出有监督训练给不了的东西？

## 增量

一句话：之前 ViT 需要海量标注才能工作且学不到语义结构，之后 DINO 证明无标签的自蒸馏就能让 ViT 的 attention map 自动浮现物体轮廓，且 k-NN 直接达到 78.3%。

## 白话方法

想象一个美术老师和学生的关系。学生（student network）每次画画，老师（teacher network）给出示范。但这里有个奇妙的设定：老师并不是外面请来的大师，而是学生自己的"历史平均水平"。每天学生画完一幅画，老师会用指数移动平均（EMA）把学生最近所有的表现揉在一起，形成一个更稳定、更平滑的判断标准。学生画新画时，目标是让自己的输出尽可能接近老师给出的分布。

这就是 self-distillation：没有外部标签，没有预训练好的固定教师，teacher 从 student 中自然生长出来。训练过程中 teacher 始终略优于 student，因为 EMA 本质上是一种模型集成（Polyak-Ruppert averaging），它把 student 训练路径上的多个快照做了平均，天然比任何单一快照更稳定。

但这套机制有一个致命风险：collapse。如果 student 和 teacher 互相模仿，两者可能收敛到同一个常数输出——所有图片的表征都一样。DINO 用两个互补的工具解决这个问题。Centering 对 teacher 的输出减去一个 batch 均值的滑动平均，防止某一维度霸占所有信息，但 centering 本身会鼓励均匀分布（uniform collapse）。Sharpening 则通过极低的 teacher temperature（τ_t = 0.04）把输出概率尖锐化，迫使 teacher 做出果断选择而非"我觉得啥都行"。两者一推一拉，恰好把表征锁定在"既不坍缩到一个点，也不坍缩到均匀分布"的健康区间。

训练时，两张 global view（224×224 crop）只过 teacher，而多张 local view（96×96 crop）和 global view 一起过 student。Student 必须从局部碎片中预测 teacher 看到的全局语义——这种"local-to-global correspondence"迫使网络学到真正的语义不变性，而非纹理快捷方式。

## 费曼讲解

**Self-Distillation without Labels**。传统知识蒸馏是大模型教小模型，大模型是固定的、预训练好的。DINO 把"大模型"替换成了"自己的 EMA"。你可能会问：一个随机初始化的网络怎么能教自己？关键在于 EMA 的集成效应。假设 student 在第 100 步犯了一个错误，EMA teacher 包含了第 1 到第 99 步的信息，这个错误被稀释了。Teacher 总是比 student 当前时刻更"见多识广"，所以它能持续提供有意义的学习信号。实验也验证了这一点：teacher 的 k-NN 准确率在整个训练过程中始终高于 student 2-3 个百分点。

**Centering + Sharpening 的互补机制**。想象一个有 K=65536 维的概率分布。Collapse 有两种死法：所有图片输出同一个 one-hot 向量（mode collapse），或所有图片输出均匀分布 1/K（uniform collapse）。Centering 减去均值，相当于对信息熵设了下限——不允许某维度永远为 1。但纯 centering 的最优解恰好是均匀分布。Sharpening 则对信息熵设了上限——teacher 必须"做决定"。两个约束夹住，最终的解只能是：不同图片激活不同的维度组合，形成有意义的聚类。这比对比学习的负样本机制简洁得多，也不需要 predictor（BYOL）或 batch normalization（SimCLR）。

**涌现的语义分割属性**。最惊人的发现是：自监督训练的 ViT 的最后一层 self-attention map，自动、精确地勾勒出物体边界。有监督训练的 ViT 没有这个属性，ConvNet 也没有。为什么？猜想是这样的——有监督训练只需要学一个全局标签，attention 可以偷懒只看最具判别力的局部。而自监督训练没有标签引导，网络必须理解图像的完整结构才能预测 teacher 的全局表征，self-attention 因此被迫发展出精细的空间感知能力。这个属性直接转化为下游价值：无需任何 fine-tuning，DINO 在 DAVIS 视频分割任务上达到 71.4% J&F。

## 核心机制图

```
┌─────────────────────────────────────────────────────────┐
│                      DINO Framework                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Image x                                               │
│     │                                                   │
│     ├── global crops (2×224) ──┐                        │
│     └── local crops (N×96) ────┤                        │
│                                │                        │
│              ┌─────────────────┼──────────────┐         │
│              │                 │              │         │
│              ▼                 ▼              │         │
│     ┌──────────────┐   ┌──────────────┐      │         │
│     │   Teacher    │   │   Student    │      │         │
│     │   (θ_t)     │   │   (θ_s)     │      │         │
│     │  frozen grad │   │  backprop    │      │         │
│     └──────┬───────┘   └──────┬───────┘      │         │
│            │                  │              │         │
│            ▼                  ▼              │         │
│     ┌────────────┐     ┌────────────┐        │         │
│     │ centering  │     │            │        │         │
│     │     +      │     │  softmax   │        │         │
│     │ sharpening │     │  (τ_s)     │        │         │
│     │  (τ_t)    │     │            │        │         │
│     └──────┬─────┘     └──────┬─────┘        │         │
│            │                  │              │         │
│            └───────┬──────────┘              │         │
│                    ▼                         │         │
│            cross-entropy loss                │         │
│                    │                         │         │
│                    ▼                         │         │
│            update θ_s (SGD)                  │         │
│                    │                         │         │
│                    ▼                         │         │
│            θ_t ← m·θ_t + (1-m)·θ_s   (EMA) │         │
│                                              │         │
└─────────────────────────────────────────────────────────┘
```

## 餐巾纸速写

| 以前怎么想 | DINO 说应该怎么想 |
|---|---|
| 自监督学习需要负样本或精心设计的非对称结构来避免 collapse | 只需 centering + sharpening，无需负样本、predictor、BN |
| ViT 必须有监督才能学好视觉表征 | 自监督反而能激活 ViT 独有的涌现属性 |
| Knowledge distillation 需要预训练好的大 teacher | Teacher 可以从 student 自身的 EMA 中涌现 |
| 好的表征 = 线性分类器表现好 | k-NN 同样是衡量表征质量的试金石，且门槛更高 |

## 博导审稿

**选题眼光**：9/10。在 ViT 刚出现、社区还在纠结"ViT 到底有没有归纳偏置"时，作者另辟蹊径去问"ViT 的独特属性藏在哪里"，答案是"藏在自监督里"。这个问题的设置本身就极具洞察力。

**方法成熟度**：8/10。DINO 的方法简洁到令人不安——momentum EMA + cross-entropy + centering + sharpening，没有花哨的模块。但正是这种极简让人看到作者对 collapse 机制的深刻理解。唯一的遗憾是 centering + sharpening 为什么 work 的理论解释还停留在直觉层面。

**实验诚意**：9/10。消融实验极为详尽：momentum schedule、teacher temperature warmup、projection head 的每一层设计、patch size、head 数量、batch size 从 1024 到 8 的全覆盖。特别是 batch=8 也能训练这个实验，直接击碎了"自监督需要大 batch"的迷信。

**写作功力**：8/10。论文结构清晰，但对"涌现属性"的因果解释还不够深——为什么自监督能做到而有监督不行？留给了读者自己推测。

**一句话判决**：这是一篇把 ViT + 自监督的组合推到正确轨道上的里程碑工作，方法极简但洞察深刻，实验扎实且结论对后续研究（MAE、DINOv2）产生了深远影响。

## 启发

对推荐系统和 DIG-v2 项目，DINO 有几个直接可迁移的技术点。

**Momentum Teacher 做在线蒸馏**。推荐系统的 embedding 模型通常有一个在线更新的需求。与其维护一个独立的 teacher 模型做定期蒸馏，不如直接用 student 的 EMA 作为 teacher。这样做的好处是 teacher 永远跟着数据分布走，不会过时；同时 EMA 的集成效应让 teacher 提供比 student 更稳定的 soft target，缓解推荐系统中标签噪声的问题。

**Centering 机制对抗热门偏差**。推荐系统中最常见的 collapse 形式就是"热门 item 霸占所有流量"。DINO 的 centering 操作——对输出减去全局均值——本质上是在对抗这种 mode collapse。在 item embedding 的训练中引入类似的 centering（减去所有 item embedding 的滑动均值），可以显式地鼓励 long-tail item 获得差异化表征。

**Local-to-Global 的多粒度对比**。DINO 的 multi-crop 策略让 student 从局部碎片预测全局语义。在推荐场景中，这对应于"从用户的短期行为片段预测长期兴趣"。DIG-v2 的序列建模可以尝试类似的非对称设计：用完整行为序列构建 teacher target，用随机子序列训练 student，迫使模型学到跨时间尺度的兴趣不变性。

**不需要负样本的训练范式**。推荐系统的对比学习通常依赖负采样，但负样本质量是老大难问题（随机负样本太容易、in-batch 负样本有 popularity bias）。DINO 证明了只要 teacher 足够稳定（EMA）且输出分布受控（centering + sharpening），完全可以抛弃负样本。这为推荐系统的表征学习提供了一条更干净的路径。
