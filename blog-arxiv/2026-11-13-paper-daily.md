---
title: "【推荐系统 Paper 日报】2026-11-13"
date: 2026-11-13
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2797827103"
---

# 【推荐系统 Paper 日报】2026-11-13

## 📊 今日概览

本期覆盖 arXiv cs.IR 于 2026-11-11（周三）公告的最新论文，共 20 篇，其中推荐系统相关 8 篇（占比 40%）。本期亮点：POI 推荐连发两篇（LLM 智能体 + 多模态解耦表示），还有一篇非常实用的"用 Scaling Law 省算力做 A/B 实验"的工业向论文，以及一个戳穿离线评测假象的基准工作，做推荐评测的同学重点看后两篇。

## 🔥 推荐系统论文深度解读

### 1. SHARP: Semantic Hierarchical Agentic Reasoning for Next POI Prediction with Dynamic Memory

📄 [arXiv:2611.14220](https://arxiv.org/abs/2611.14220) | 会议/期刊：预印本 | 作者：Yuhang Zhan, Silin Zhou, Zhuo Chen, Haoxiang Lei, Yunren Feng, Lisi Chen, Shuo Shang

**🗣️ 大白话：** 预测你下一个要去的地方（POI 推荐）。现在的做法是让大模型做语义推理 + 用图来建模大家的移动规律，但两边各干各的，接不到一起。SHARP 的思路是"先猜大类、再定具体地点"：先预测你接下来大概率去"餐饮"还是"商场"这个粒度的类别，再在类别内锁定具体 POI，同时用一个"记忆管家" agent 持续记录你历史的行为习惯，防止老信息被挤掉。

**🔬 专业讲解：** 框架核心有三块：(1) 动态轨迹记忆 agent——维护一个随上下文增长受限的记忆库，既保留早期移动模式又能追踪行为漂移；(2) 多粒度时间感知的类别转移图——同时构建全局视图和按时间条件化的视图，避免全局聚合把时段性的转移规律（比如早高峰/晚间模式）抹平；(3) 用 RQ-VAE（残差量化 VAE）学习 POI 的语义 ID（SID），与类别引导的 POI 预测器端到端联合优化。在三个真实数据集上，Acc@5 和 Acc@10 平均比最强基线提升 5.29 和 4.52 个百分点，"类别先验 + 语义 ID"的组合是主要收益来源。

---

### 2. LUMIR: Decoupled Multimodal Representation Learning from Heterogeneous Data for Next-POI Recommendation

📄 [arXiv:2611.14004](https://arxiv.org/abs/2611.14004) | 会议/期刊：DaQuaMRec Workshop @ ACM RecSys 2026 | 作者：Zehui Wang, Wolfram Höpken, Dietmar Jannach

**🗣️ 大白话：** 多模态推荐的老大难问题：特征融合和下游模型绑得太死，换一个推荐模型就得重学一遍表示。LUMIR 说：咱们把"学表示"和"用表示"拆开——先用 LLM 把图片、文本等异构信息统一成文本表示，再用对比学习 + 序列信号约束学出一份通用表示，之后随便接哪个下游推荐模型都能用。

**🔬 专业讲解：** 技术路线是三步走：异构多模态数据经 LLM 语义统一到共享文本空间 → 交互感知融合机制建模跨模态交互 → 把序列信号作为结构性约束引导表示学习。评测在多模态 POI 数据集上做 next-POI 推荐，跨多个序列推荐骨干模型验证，LUMIR 在准确率和 beyond-accuracy 指标上都稳定优于多模态融合基线。核心结论是"解耦式表示学习 + 下游即插即用"这条范式跑得通，代码已开源，工程上很有参考价值。

---

### 3. From Counterfactual Edits to Human Narratives: LLM-Driven Interpretations for Recommender System Explanations

📄 [arXiv:2611.13914](https://arxiv.org/abs/2611.13914) | 会议/期刊：CIKM 2026 | 作者：Vojtech Cahlik, Amir Reza Mohammadi, Rodrigo Alves, Pavel Kordik, Eva Zangerle

**🗣️ 大白话：** 反事实解释（CFX）告诉用户"如果你少看点这类视频，系统就会推荐你想要的东西"，但实际生成的编辑列表往往又长又碎，用户根本看不懂。这篇论文让 LLM 当"翻译官"，把底层的一长串编辑操作浓缩成一句人话："系统发现你最近对悬疑片的偏好盖过了喜剧"。

**🔬 专业讲解：** 作者把 LLM 作为 CFX 的中介层，将原始的交互历史编辑列表总结为描述高层偏好模式的自然语言解释，并通过偏好优化（DPO）在正确性、信息量和语言质量三个维度上调优。评测用独立人工标注数据构建人类校准的指标，在 MovieLens-1M 上跨多个反事实生成器和语言模型验证：语言质量普遍较高，语义质量则在 ACCENT、SPINRec 这类高成功率的 CFX 方法上最好；DPO 几乎在所有设置下都提升了语义指标。亮点还在于指出了当前评测"只数编辑次数、不看用户能不能懂"的缺陷。

---

### 4. Exploiting Feature-invariant Scaling Laws for Efficient A/B Experimentation in Recommendation Systems

📄 [arXiv:2611.13539](https://arxiv.org/abs/2611.13539) | 会议/期刊：预印本 | 作者：Zhiliang Chen, Sammy Nammari, Jiahao Su, Xiaoqiang Luo

**🗣️ 大白话：** 推荐系统的 A/B 实验太烧钱了——每改一个特征都要全量训练一遍模型，根本跑不过来；跑小实验吧，结果还经常误导人。这篇发现了一个规律：不管你怎么改特征，模型性能的变化都遵循同一条可预测的 scaling law。于是可以用小实验 + 统计推断外推出全量实验的效果，把没用的改动提前筛掉，省下大量算力。

**🔬 专业讲解：** 核心概念是 feature-invariant scaling：在基线模型上应用不同的特征改动时，性能变化依然服从可预测的 scaling law。作者据此提出用小规模实验配合统计推断（带置信区间）预测全量 A/B 效应的方法，在 Wukong、HSTU、LLM-based 推荐模型三个模型家族、40 多种架构/优化/数据改动上验证，能准确区分有益改动和中性/回退改动，且只用全量评测一小部分的算力；还借这个方法把 HSTU 在 MovieLens-20M 上的 SOTA 又刷高了。对工业界来说，这是把 scaling law 从"涨点工具"变成"实验筛选工具"的落地范本，强烈推荐做实验平台的同学精读。

---

### 5. INTENT: Out-of-Sample, Out-of-Time, and Cold-Start Evaluation on User Event Sequences

📄 [arXiv:2611.13069](https://arxiv.org/abs/2611.13069) | 会议/期刊：MFMB Workshop @ ACM ICAIF '26 | 作者：Mattias Kvist, Erik Lidman Hillbom, Edoardo de Cal, Davis Siemens, Adam Fredriksson, Rickard Brüel-Gabrielsson

**🗣️ 大白话：** 现在的序列行为模型（比如银行用交易、登录、授权事件训练的基础模型）上线后要面对训练时没见过的新用户、新时间段、新商品，但公开基准很少考这些。INTENT 把评测切成 7 个格子：用户见没见过 × 时间段见没见过 × 目标物品见没见过，每格至少 11 万用户，看看模型到底哪块强哪块弱。

**🔬 专业讲解：** 对 59 个公开数据集家族做审计，只有 5 个合格——最常见的缺陷是缺日历时间戳导致事件无法按时间排序。切分点用事先固定的统一规则确定。参考结果非常有信息量：最优模型由"格子"决定——transformer 在截止后但物品见过的场景领先，但对全新物品直接得零分；嵌入物品元数据的变体主要在 MicroLens 上有优势；而"重复用户最近一次物品"这个无参数的朴素策略，竟在 5 个数据集中的 4 个上领跑全新物品场景。这个朴素对照还揭示：三个数据集上截止后丢失的分数，大部分反映的是行为分布变化而非模型变差。做离线评测设计的必读。

---

## 📋 其他论文速览

- **Data Quality Challenges in Multimodal Tourism Recommender Systems**（arXiv:2611.13972）：RecSys 2025 Workshop 短文，盘点旅游多模态推荐的真实数据质量坑——虚假评论、LLM 幻觉内容、模态矛盾、人群偏差，并给出质量感知融合、受控生成等方向。
- **IntentTwin: Deconfounding Candidate Support and the Oracle-to-Deployment Gap in Offline Web Behavior Prediction**（arXiv:2611.12918）：戳穿离线网页行为评测的一个大坑——当目标动作在训练支持集之外、干扰项全部来自支持集时，光靠"是否在支持集里"就能拿满分。提出支持均衡候选集（SIR 从 1.0 降到 0）和双路 proposer，是评测方法论的重要警示。
- **Auditing LLM Pseudo-Label Distillation for Review Informativeness at E-Commerce Scale**（arXiv:2611.13797）：534 万条土耳其电商评论上做 Gemini → 小模型蒸馏的审计：teacher fidelity 高不等于和人工编辑判断一致，评测人群不同结论会反转；单张 L4 学生管线比 teacher 快 50 倍。

---
