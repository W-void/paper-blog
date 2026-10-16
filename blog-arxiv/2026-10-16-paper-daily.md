---
title: "【推荐系统 Paper 日报】2026-10-16"
date: 2026-10-16
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2792056855"
---

# 【推荐系统 Paper 日报】2026-10-16

## 📊 今日概览

arXiv cs.IR 今日（Fri, 16 Oct 2026）共公告 14 篇新论文，其中推荐系统相关 2 篇，均为工业界大模型推荐方向的重磅工作：一篇来自 CIKM 2026 的可控多目标推荐模型合并方案 RecSoup，一篇是工业级序列推荐大模型 TransX 技术报告（线上 A/B 提升 CTR 6.02%）。其余论文集中在检索增强（RAG）、深度搜索 Agent 与 LLM 检索对齐等热门方向。

## 🔥 推荐系统论文深度解读

### 1. RecSoup: Efficient Model Merging Approach for Controllable Multi-Objective Recommendation

📄 [arXiv:2610.21220](https://arxiv.org/abs/2610.21220) | CIKM 2026 | Zidong Jia, Guofu Xie, Xiao Zhang

**🗣️ 大白话：** 推荐系统经常要同时照顾好几个"打架"的目标——点击率和转化率、停留时长和用户疲劳度，不可能都最大化。以前的做法要么在最后重新排序（选择余地有限），要么专门训一个"调参生成器"（又贵又慢）。RecSoup 的思路很聪明：先把各个目标分别训好的模型直接"融合"成一个，融合完之后不需要重新训练，推理时用户想要什么倾向，就动态调一下参数配比就行——就像调鸡尾酒，基酒都备好了，按口味现场勾兑。

**🔬 专业讲解：** 该工作面向可控多目标推荐（CMOR）任务，即在推理时动态调整目标权衡而无需重训。作者指出模型合并直接用于推荐系统的两大障碍：缺乏共享线性机制（shared linear regime）和跨目标参数干扰。RecSoup 采用两阶段设计：（1）通过联合考虑目标特定重要性与跨目标相关性的剪枝策略缓解参数干扰；（2）学习一个偏好到系数的映射（preference-to-coefficient mapping），实现推理时的自适应参数合并与动态权衡控制。整个流程轻量，避免了输出级重排的权衡范围限制和参数生成模块的高昂训练/推理成本。

---

### 2. TransX Technical Report: Scaling Sequence Transduction for Recommendation

📄 [arXiv:2610.20913](https://arxiv.org/abs/2610.20913) | 技术报告（工业界） | Da Xu, Liyan Fang, Divya Venugopalan, Sunny Hsu, Xukai Wang, Rishav Roy Chowdhury, Cindy Liang, Nishant Satya Lakshmikanth

**🗣️ 大白话：** 这是难得一见的工业级推荐大模型技术报告。团队把推荐建模改造成了类似 NLP 里 seq2seq 的"序列转导"框架：把用户的长期行为做成一个共享的"行为记忆"，然后分别接上召回和排序两个"接口"。更难得的是他们系统研究了"怎么把钱花在刀刃上"——发现编码器堆太深会饱和、加监督信号应该把钱花在候选融合那一侧。线上 A/B 实测：CTR +6.02%，转化 +4.45%，都是实打实的收益。

**🔬 专业讲解：** TransX 将序列编码、行为记忆（behavior memory）与候选条件融合（candidate-conditioned fusion）解耦为三个可独立扩缩的组件。训练侧沿行为前缀摊销因果轨迹计算，并将记忆状态扇出到各候选；推理侧将批量 prefill、近线刷新与在线预测分离服务（服务解耦），采用紧凑的行为记忆 KV 存储。作者观察到各向异性缩放规律：在固定记忆分辨率与融合容量下，编码器缩放在中等深度后即饱和；增加监督会将资源分配前沿推向候选条件融合；维持质量所需的记忆分辨率随模型容量增长大致稳定。模型在点击与转化任务上联合训练，对共享行为接口做检索与偏好排序的后训练（post-train），并离线探索了生成式推荐。生产 A/B 中核心模型 CTR +6.02%、转化 +4.45%，后训练后的召回模块亦有显著提升。

---

## 📋 其他论文速览

- **GACC-Bench**（arXiv:2610.21893）：提出目标自适应上下文压缩基准，500 个目标、2571 个问题，评估 LLM 在预算内按高层目标保留关键信息的能力，最优压缩器与全上下文仍有明显差距。
- **Aligning LLMs with Sparse Retrieval**（arXiv:2610.21877）：用动态 α-截断从 SPLADE 中提取输入自适应的稀疏监督来对齐 LLM，比 Lion-sp 索引存储省 6.4 倍、端到端查询延迟降超 10 倍。
- **VoteGEO-Bench**（arXiv:2610.21330）：研究生成式引擎优化（GEO）对选举信息可见性的影响，发现指定目标的改写策略才更能提升目标曝光。
- **AURA**（arXiv:2610.21030）：EMNLP 2026 Findings，按中间推理状态区分相关文档与干扰项的能力直接监督推理过程，自适应停止使延迟从 4.6s 降到 0.76s，BRIGHT 上 nDCG@10 达 34.7。
- **Information-Gain Calibrated On-Policy Distillation**（arXiv:2610.20664）：发现深度搜索 Agent 蒸馏中的"证据盲监督"问题（首轮搜索贡献 51.1% 信息增益却只获 18% 监督预算），提出按检索后信息增益校准蒸馏监督。
- **CARA**（arXiv:2610.22017）：免训练的因果引导检索 Agent，用"后果性"和"必要性"双标准评估证据的因果相关性，在 STaRK 上超越现有检索器且检查节点更少。
- **Retrieved but Not Read**（arXiv:2610.21731）：揭示搜索增强 LLM 为何"检索到了却不读"——模型常只看摘要不点原文，导致过时答案和不忠实引用，层级分析显示证据可用性与有效使用间存在鸿沟。
- **Making medical device document assessment deterministic**（arXiv:2610.21300）：证明医疗设备文档评估全流程（OCR、分块、检索、推理）可以做到逐字节可复现的确定性输出。
- **TRACER**（arXiv:2610.21267）：面向 LLM Agent 的轨迹感知工具检索，用 trie 索引工具调用序列，128 个工具只暴露 5 个即可提升 GPT-5.4 工具选择准确率 4.7 点、输入 token 省 80%。
- **SSR**（arXiv:2610.21113）：多 Agent 系统中的免训练 Agent Card 结构化信号检索，1000 个 Agent 规模下 LLM 输入减少 98.8%、编排延迟降 70.9%。
- **ReviewPilot**（arXiv:2610.21042）：自动化 PRISMA 文献综述的多 Agent 系统，筛查宏 F1 达 0.776、抽取 F1 达 0.788，每个决策都附理由和来源。
- **Idea2Prior**（arXiv:2610.20857）：从模糊研究想法出发的可审计论文检索系统，Hit@5 达 53.3%，超过 ChatGPT/Gemini Deep Research。
