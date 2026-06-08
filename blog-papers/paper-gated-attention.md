---
slug: gated-attention
title: "Gated Attention：一个 sigmoid 门，三重收益——非线性、稀疏性、Attention-Sink-Free"
date: 2026-06-08
tags:
  - LLM
  - Transformer架构
  - 注意力机制
  - 门控机制
  - Attention Sink
authors: wangshuli
description: "Qwen Team, Alibaba | 博导判决：🌟 Strong Accept"
---

- **日期**：2026-06-08（精读日期）
- **来源**：https://arxiv.org/abs/2505.06708
- **作者**：Zihan Qiu, Zekun Wang, Bo Zheng, Zeyu Huang, Fei Huang, Junyang Lin 等（Qwen Team, Alibaba Group）
- **发表**：arXiv:2505.06708v2 [cs.CL]，2025年6月（v1 2025-05-10）

---

## 缺口：注意力里"塞门控"是民间偏方，没人讲清楚为什么有用

门控（gating）在序列建模里早就不是新东西——LSTM 的输入/遗忘门、Highway Network、近年线性注意力（GLA、Gated DeltaNet、Mamba2）几乎家家都带门控。在标准 softmax 注意力里"随手加个门"也是工业界心照不宣的 trick（Qwen、Gemma 内部都用过）。但学术上一直停留在"加了涨点、不知道为什么"的状态：

- **门加在哪？** SDPA 输出后？value 上？query/key 上？没人系统扫过。
- **门长什么样？** elementwise 还是 headwise？sigmoid 还是别的激活？乘性还是加性？
- **为什么有用？** 是因为引入了非线性，还是因为做了数据依赖的缩放，还是别的？

这篇论文的价值不在于"发明门控"，而在于把这个 15M~1.7B 规模、扫了 30+ 配置的**设计空间彻底测明白**，并给出了一个反直觉的机理解释：门控最关键的收益，可能不是大家以为的"增强表达能力"，而是**消灭了 attention sink**。

## 增量：把"在哪加门"拆成 5 个位置，把"加什么门"拆成 3 个维度

作者把一个标准的多头注意力层 $\text{Attn}(X) = \text{SDPA}(Q,K,V)W_o$ 拆解，定义了 5 个候选注入点 G1–G5：

- **G1**：SDPA 输出之后、$W_o$ 之前（即门控 $\odot$ SDPA 结果）——**本文主推**
- **G2**：$W_o$ 之后（整个注意力层输出处）
- **G3**：value $V$ 上
- **G4**：key $K$ 上
- **G5**：query $Q$ 上

门控函数统一写成 $g(X, \theta) = \sigma(X W_\theta)$，再与目标张量做 elementwise 乘法。在这之上扫三个二值维度：

1. **位置粒度**：headwise（每个 head 一个标量门，参数省）vs elementwise（每个维度一个门，表达强）
2. **共享性**：head-specific（各 head 独立 $W_\theta$）vs head-shared
3. **激活/形式**：sigmoid 乘性门 是默认，对照组试了 SiLU、不带激活的纯线性投影、加性门等

最终推荐配置：**G1 位置 + head-specific + elementwise + sigmoid 乘性门**。开销极小：1.7B 模型上 <2% 额外参数（约 1.6M）、训练吞吐几乎无损。

## 核心机制：一个 sigmoid 门到底干了两件事

作者把门控的收益拆成两个正交的来源，并用消融把它们分离开。

### 机制一：非线性（Non-linearity）

标准注意力层 $\text{SDPA}(Q,K,V)W_o$ 在 $V \to$ 输出这条路径上是**完全线性**的（softmax 只作用在分数上，对 value 是凸组合即线性加权）。G1 处插入 $\sigma(XW_\theta) \odot (\cdot)$ 相当于在这条线性通路上**强行插入一个数据依赖的非线性激活**。

关键对照实验：把 sigmoid 换成**无激活的纯线性投影门**（即 $g = XW_\theta$ 直接相乘，仍是数据依赖缩放但没非线性），涨点显著缩水。这证明收益里很大一块来自**非线性本身**，而不仅仅是"多了一次缩放"。这也解释了为什么 G1（作用在 SDPA 输出、即 value 聚合结果上）比 G3/G4/G5（作用在 Q/K/V 输入上）更有效——只有 G1 真正打破了 value→输出的线性。

### 机制二：稀疏性 / 数据依赖的门控稀疏（Sparsity）

sigmoid 门的输出落在 (0,1)，训练后**平均门控分数仅约 0.116**——也就是说门常态性地把大部分激活"按下去"，只放行少数。这等价于一种**软稀疏化**：每个 token、每个 head 自适应决定哪些信息流通过。

这种 query-dependent 的稀疏门控带来两个下游好处：

- **削掉 massive activation**：隐藏态里那些数值离谱大的"巨型激活"，从基线的约 **1053 降到约 94**。massive activation 是长期困扰量化、长上下文外推的元凶，门控顺手把它压下去了。
- **为消除 attention sink 铺路**（见下一节）。

## 关键概念费曼讲解

### 概念一：Attention Sink（注意力沉没）是什么、为什么坏

在标准 LLM 里，无论输入是什么，**第一个 token（通常是 BOS）会吸走异常高比例的注意力**——本文测得首 token 平均注意力高达 **46.7%**。这不是模型"觉得首 token 重要"，而是 softmax 的结构性缺陷：softmax 要求所有注意力权重和为 1，当某个 head 在当前 query 下"没什么想关注的"时，它没法输出"全 0"，只能把概率倾倒到一个无害的锚点上——首 token 就成了这个"垃圾桶"。

attention sink 的坏处：(1) 长上下文里位置外推不稳；(2) KV cache 量化/驱逐时首 token 不能丢，约束了优化；(3) 是 massive activation 的共谋。

### 概念二：门控如何"釜底抽薪"消除 sink

sigmoid 门提供了 softmax 给不了的能力——**输出真正的 0**。当一个 head 在某 query 下无可关注时，它不再需要把概率倒给首 token，而是直接让门关闭（输出趋近 0），整条注意力贡献被乘成 0。于是首 token 注意力从 **46.7% 暴跌到 4.8%**，attention sink 基本消失。

这是本文最漂亮的因果链：**sigmoid 门 → 可输出 0 的逃生阀 → 不再需要 sink 当垃圾桶 → sink 消失 → 长上下文更稳**。

### 概念三：为什么 head-specific elementwise 最优

head-shared 门相当于强制所有 head 用同一套"放行策略"，但不同 head 的语义角色差异巨大（有的管局部、有的管全局）；head-specific 让每个 head 自定阀门。elementwise 则比 headwise（整 head 一个标量）多了维度级的精细控制。两者叠加，在几乎不增参的前提下吃满收益。

## 餐巾纸速写：思想框架的位移

```
旧认知：                          本文重构：
"门控 = 加表达能力"               门控 = 非线性 + 数据依赖稀疏 两件正交的事
"加了涨点就行"                    G1 位置最关键，因为只有它打破 value→输出 的线性
"attention sink 是模型特性，       attention sink 是 softmax "权重必须和为1" 的
 用 StreamingLLM 留着它"            结构性 bug；给个能输出 0 的门，sink 自动消失

softmax：    Σ权重 = 1  ──► 没东西可关注时只能倒给首token（sink）
                              │
sigmoid门：  允许输出 0  ──────┘  逃生阀打开，sink 不再必要
```

核心位移：**把"attention sink 不可避免、只能管理"的工程共识，改写成"它是可被结构性消除的 softmax 缺陷"**。

## 博导审稿

**判决：🌟 Strong Accept**

- **优点**：(1) 设计空间扫得彻底诚实——5 位置 × 3 维度 × 多规模，工业界的"民间 trick"第一次被系统量化。(2) 机理解释有因果说服力，尤其"非线性 vs 缩放"的纯线性门对照、以及"sigmoid 可输出 0 → 消灭 sink"的链条，不是事后讲故事而是有控制实验支撑。(3) 数字过硬：PPL 6.026→5.761，RULER-128k 58.82 vs 31.65（长上下文几乎翻倍），首 token 注意力 46.7%→4.8%，massive activation 1053→94。(4) 落地成本几乎为零（<2% 参数、吞吐无损），是真正能上生产的结论。
- **扣分项**：(1) 非线性与稀疏两个机制虽分离，但二者对最终收益的定量贡献占比仍偏定性。(2) 规模上限 1.7B，超大规模（百亿级）是否仍成立未验证。(3) 与现有 attention sink 缓解方案（StreamingLLM、注册 token / attention bias）缺少同台对比，无法判断门控是不是"更优解"还是"另一条路"。
- 但瑕不掩瑜——一个 1.6M 参数的 sigmoid 门换来长上下文近翻倍 + sink 消失 + massive activation 压两个数量级，这是性价比极高、且可立即复现的工作。

## 启发

**对生成式推荐 / SID 体系的迁移思考：**

1. **G1 式门控直接可用于推荐序列模型**。HSTU、OneRec 这类生成式推荐骨干本质也是 attention 堆叠，在 SDPA 输出处加 head-specific sigmoid 门，按本文是 <2% 开销的"白嫖涨点"，且对短序列、长尾 POI 这种本地生活场景里"很多 head 无可关注"的情况尤其对症——门可以直接关掉无关 head，而不是把注意力倒给序列首位的占位 token。

2. **"sink = softmax 必须归一"的洞察，可类比 SID 召回里的"概率必须分配"困境**。生成式召回 beam search 时，模型对长尾 item 同样被迫分配非零概率；能否引入类似"可输出 0 的门"机制，让模型对真正不相关的候选直接闸断，而非软分配——这可能是缓解长尾噪声、提升 SID 解码精度的一个方向。

3. **门控分数 ≈ 0.116 的稀疏性，提示一种天然的可解释信号**。在推荐场景，每个 token/head 的门控开度可以当作"这一步行为对当前预测有没有用"的归因，比注意力权重更干净（因为门能真正归零）。值得在序列推荐的可解释性分析里试。

4. **massive activation 压制对推荐模型量化部署是直接利好**。线上排序/召回模型上量化时巨型激活同样难搞，门控顺手解决，对 INT8/低比特部署友好。

- **关联论文**：Attention Residuals（同为 attention 内部结构改造，但走"深度维度注意力替换残差"路线，与本文"注入门控"互补）、StreamingLLM（attention sink 的"管理派"代表，本文是"消除派"）、GLA / Gated DeltaNet / Mamba2（线性注意力里的门控，本文把门控收益的机理讲清楚后可反哺这些工作）

- **BibTeX**：
```bibtex
@article{qiu2025gated,
  title         = {Gated Attention for Large Language Models: Non-linearity, Sparsity, and Attention-Sink-Free},
  author        = {Qiu, Zihan and Wang, Zekun and Zheng, Bo and Huang, Zeyu and Huang, Fei and Lin, Junyang and others},
  journal       = {arXiv preprint},
  year          = {2025},
  eprint        = {2505.06708},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL}
}
```
