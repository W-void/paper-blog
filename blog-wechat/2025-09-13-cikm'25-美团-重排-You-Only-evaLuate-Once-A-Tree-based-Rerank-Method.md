---
title: "cikm'25「美团」重排｜You Only evaLuate Once: A Tree-based Rerank Method"
date: 2025-09-13
tags: [公众号]
---

[You Only evaLuate Once: A Tree-based Rerank Method at Meituan](https://arxiv.org/pdf/2508.14420)

![](/img/wechat/8ec80c81-0420-413d-bac7-ca1201873f84-2fe6f7.png)

你只用评估一次——you only evaluate once。重排需要在组合空间中进行检索，但要想评估所有列表就无法将模型做得很复杂很精确，所以现在的方法基本都是评估两次，先GSU粗略评估缩小范围，再ESU精确评估选择最优。GSU追求效率，ESU追求效果，效果与效率貌似是一对不可调和的矛盾。但这篇文章-YOLOR转移了这一矛盾，将效果与效率重新定义为：“在列表上追求效果”和“在排列空间内追求效率”，具体方法就是树状上下文和cache复用。挺有意思的idea，值得一读。

# 1 背景

重排需要在组合空间中找到最优的排列，这个空间是非常巨大的，比如8个候选组成的空间就有$A_8^8$=40320个候选排列。评估所有候选的成本显然是非常大的，所以现在的重排方法基本都是两阶段范式，先用启发式/生成式/sim等方法缩小范围（GSU），再从候选中精确评估最优排列（ESU）。

这些两阶段方法本质上是在做**效果--效率的trade off**，面临严峻的两阶段不一致问题，即GSU会错过ESU所认为的高价值列表。

本文的方法也很简单，两阶段有不一致问题，那就只评估一次（You Only Evaluate Once）。但排列空间的计算复杂度怎么解决？答案就是cache。以下图为例，下图是8个候选的某一个排列，作者将上下文设计为多层的树状上下文，实现“在列表上追求效果”。如果要计算第4个item的预估值，那么可以收集它的3层上下文后进行计算。从图中可以看出，第4个item的上下文和第5个item是重复的，因此可以复用。同理在排列空间中任何一个排列，只要第4个item和第5个item是相邻的，那么他们的上下文 $E(4,5)$ 都是可以复用的，因此实现“在排列空间内追求效率”。

![](/img/wechat/ec1c7766-d1b6-43d1-b7cc-1896a2e58c16-bcff9a.png)


# 2 方法

模型结构如下图，非常简单。作者将重排的list-wise建模分解为3件事：
1. point-wise语义建模$X^s$; 
2. 层级上下文建模$X^C$; 
3. 绝对位置建模$E^p$.
![](/img/wechat/71b7f67a-30b6-4d70-88ed-8dd2dc38e1d7-1b5a53.png)

**point-wise语义建模**$X^s$：可以直接复用精排模型（甚至可以直接让精排模型输出最后一层emb，还能增加链路一致性）。

**绝对位置建模**$E^p$：就是一个绝对位置编码。

重点是**层级上下文建模**$X^C$：作者在论文中说的很简单，先计算出所有层级上下文$X^C$，再选择出当前列表L所需要的上下文$X^C_\mathcal{L}$.

![](/img/wechat/f1525999-6082-4355-ae4a-5eb659f7dcaf-7ee0ef.png)

这个代码实现还是有一定复杂度的，我在这里给出一个代码demo，一共有5步：

1. 8个候选组成的空间就有$A_8^8$=40320个候选排列。
```python
import itertools
import numpy as np

len_pv = 8

all_perms = np.array(list(itertools.permutations(list(range(len_pv))))) # [P, len_pv]
print(all_perms.shape)
print(all_perms)
```
![](/img/wechat/135cad71-c0c6-4ae4-9a15-c869a9c49073-06d9eb.png)

2. 以上下文尺度=3为例，一共有448个上下文。
```python
all_perms_pad = np.concatenate((all_perms[:, 0:1], all_perms, all_perms[:, -1:]), 1) # [P, len_pv + 2]
window_view = np.stack([all_perms_pad[:, :-2], all_perms_pad[:, 1:-1], all_perms_pad[:, 2:]], -1) # [P, len_pv, window]

context_str  = np.apply_along_axis(lambda x: ','.join(x.astype(str)), axis=1, arr=np.reshape(window_view, [-1, 3]))
context_str_unique = sorted(list(set(context_str)))
context_unique = np.array([x.split(',') for x in context_str_unique]).astype(int) # [C, window]

print(context_unique.shape)
print(context_unique)
```
![](/img/wechat/d24baa87-8237-4d44-aaee-a0cecb3e79b1-f216a7.png)

3. 构建列表-上下文的映射关系。

```python
str2id = dict(zip(context_str_unique, range(len(context_str_unique))))
context_str2id = [str2id[x] for x in context_str]
context_id = np.reshape(context_str2id, [-1, len_pv]) # [P, len_pv]

print(context_id.shape)
print(context_id)
```
![](/img/wechat/5cc75d59-2192-4338-90e3-ea11b164c86b-ca5057.png)

4. 设batch_size=10，批量计算候选排列空间内的上下文。

```python
import tensorflow as tf

batch_size = 10
emb_dim = 6

X_s = np.random.rand(batch_size, len_pv, emb_dim).astype(np.float32) # [B, len_pv, emb]
CCM_pre = tf.gather(X_s, context_unique, axis=1) # [B, C, window, emb]
CCM_pre = tf.reshape(CCM_pre, [-1, CCM_pre.shape[1], CCM_pre.shape[2]*CCM_pre.shape[3]])
CCM = tf.keras.layers.Dense(emb_dim, activation=tf.nn.leaky_relu)(CCM_pre) # [B, C, emb]

print(CCM.shape) # [B, C, emb]
```
![](/img/wechat/74285e2d-f2ae-4992-936d-cd89bc39521e-b0f3d1.png)

5. 最后，gather得到排列空间内每个可能排列所需要的上下文。
```python
perms_X_C = tf.gather(CCM, array_id, axis=1) # [B, P, len_pv, emb]
print(perms_X_C.shape) # [B, P, len_pv, emb]
```
![](/img/wechat/69f4ab75-0e4c-4dd4-9f50-aed00d0446f1-f99c4b.png)


# 3 实验

离线auc：
![](/img/wechat/d01bb003-77c9-4a54-a194-59982aa94fbc-6bc48a.png)

重点是HR这个指标。美团数据集是$A_8^8$=40320个排列，因为YOLOR很快，所以可以全预估选最优，因此HR达到了1.
![](/img/wechat/4ed437ad-85d0-4ec0-81ac-9f9b7135ee7d-91dcd2.png)


AB实验：
![](/img/wechat/633a59bc-80a0-4b7c-9d65-178e46f9ca92-6a8f37.png)
