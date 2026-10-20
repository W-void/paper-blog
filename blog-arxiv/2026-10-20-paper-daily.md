---
title: "【推荐系统 Paper 日报】2026-10-20"
date: 2026-10-20
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2793501987"
---

# 【推荐系统 Paper 日报】2026-10-20

## 📊 今日概览

本期为 arXiv cs.IR 2026-10-20（周二）公告，共收录 41 篇新论文，其中推荐系统相关 11 篇，延续了近期"生成式推荐 + LLM 智能体"的双主线热度。亮点包括：快手多智能体个性化视频广告系统 MAPS 线上 ARPU +9.85%、天猫验证的生成式检索 SID 拓扑保持部署原则（GMV +1.16%）、以及单卡 H100 吞吐达教师模型 60 倍的 DuoLM 个性化推荐框架。

## 🔥 推荐系统论文深度解读

### 1. MAPS: A Multi-Agent Personalized Script-Driven Video Advertising System Enhanced by Reinforcement Learning

📄 [arXiv:2610.25748](https://arxiv.org/abs/2610.25748) | 快手广告系统 | Zhongyu Wang, Chen Zuo, Qingxuan Sun 等

**🗣️ 大白话：** 传统视频广告是"挑一个现成的给你看"，而 MAPS 是"现场给你编一个"——四个 AI 智能体组队，先给你画像、再写广告脚本、然后生成视频、最后根据你的反馈迭代。用强化学习训练写脚本的智能体，让它既能戳中你的兴趣，又能把产品卖点讲清楚。快手上真实 A/B 测试：点击率 +2.87%、转化率 +2.74%、用户人均收入 ARPU 直接 +9.85%。

**🔬 专业讲解：** 论文指出检索式广告范式受限于预制作素材，个性化粒度受限且在不同用户群体上表现不均。MAPS 构建用户画像、脚本生成（Scripter）、视频合成、反馈迭代四个智能体的闭环流水线；针对 Scripter 训练设计了多维奖励函数的 RL 框架，同时约束内容偏好对齐与产品信息植入。离线实验与快手广告场景在线 A/B（CTR +2.87%，CVR +2.74%，ARPU +9.85%）共同验证了"生成式个性化创意"相对生成式基线的增益，是 agentic advertising 方向少有的完整线上落地案例。

---

### 2. Don't Rewrite the SID Map: Topology Preservation for Generative Retrieval in Dynamic E-Commerce Search

📄 [arXiv:2610.26105](https://arxiv.org/abs/2610.26105) | 天猫电商搜索 | Jianbo Zhu, Xing Fang, Xiaopeng Chu 等

**🗣️ 大白话：** 生成式检索给每个商品编了串"语义身份证"（SID），但电商天天上新商品，一更新 SID 映射，模型已经学会的"检索路线"就作废了。这篇论文用 67 天真实日志把问题量化清楚，并给出一条极简部署军规：新商品只做插入、老商品 SID 冻结不动、尽量热启动——就这么简单一招，老商品召回 +10%，新商品召回 +109%，天猫 App 三周 A/B 实测 UCTCVR +0.29%、GMV +1.16%。

**🔬 专业讲解：** 论文系统刻画了 SID 映射变更与检索质量的定量关系，三个核心发现：① SID 语义漂移造成严重退化且会被大 beam size 掩盖（beam=1 时 HitRate 降 41.78–62.05%，beam=1000 时仅降 8.33–10.85%）；② 变更 SID 比例与检索质量严格单调负相关（重映射比例 0%→72.75%，beam=1 HitRate 单调下降最多 42.66%），且短预算续训无法修复拓扑破坏；③ "冻结旧 SID + 插入新 SID + warm-start"的最简策略即高度有效。是生成式检索工业部署侧非常扎实的实证工作。

---

### 3. DuoLM: Fast and Effective Personalized Recommendation with Language Models

📄 [arXiv:2610.24481](https://arxiv.org/abs/2610.24481) | Jiang Wu, Yutong Song, Hongbo Wang 等

**🗣️ 大白话：** 让 LLM 直接给用户打分推荐效果很好，但逐个读全文太慢，线上根本撑不住。DuoLM 的思路是"双模型接力"：一个 encoder LLM 提前把商品压成紧凑向量，一个个性化排序 LLM 拿向量 + 用户历史做最终打分，两个模型端到端联合训练。再配合虚拟 token、共享历史计算、CUDA Graph 等推理加速，单张 H100 每秒能打 2.64 万个候选分，是 vLLM 部署教师模型的 60 倍吞吐，效果基本不掉。

**🔬 专业讲解：** 框架由 encoder LLM（离线学习紧凑物品表示）与 personalized ranker LLM（融合用户历史与反馈做在线打分）组成，以推荐监督 + 教师蒸馏端到端训练。工程侧通过虚拟 token ID 实现嵌入直取、跨请求共享历史计算、CUDA Graph replay 消除 kernel 启动开销。基准测试质量对齐专家教师模型，单 H100 约 26,400 candidate scores/s，为 vLLM + automatic prefix caching 部署教师的约 60 倍，展示了 LLM 推荐从"离线蒸馏、在线轻量化"的高性价比路线。

---

### 4. Structure-Aligned History Learning with Subspace-Structured Semantic IDs for Generative Recommendation

📄 [arXiv:2610.25093](https://arxiv.org/abs/2610.25093) | 34 pages | Kaiwen Wei, Kejun He, Jie Zhang 等

**🗣️ 大白话：** 生成式推荐分两步：给商品编码、预测下一个。现有方法两个环节都偷懒了——编码不平衡、历史只用来看不用来学。这篇 SAHL 的核心想法很漂亮：编码时建好的"token→子空间→商品"层级结构，直接拿来当历史重建的监督粒度，让模型被迫学会从历史中恢复长期偏好。四个 Amazon 类目上 NDCG@10 比 RPG 高 18.6%–30%。

**🔬 专业讲解：** 针对 quantizer 码本分配不均、缺乏中间语义单元、以及 next-item 单目标监督下远距离偏好信号利用不足两大问题，提出 SRBQ（Semantic Residual Balanced Quantization）构建平衡的 token-子空间-商品层级，并让 SAHL 在相同粒度上重建历史；以预测熵优先处理不确定转移，课程学习渐进过渡到与推理一致的 next-item 预测。Amazon Review 四类目上 NDCG@10 较 RPG 提升 18.6%–30.0%、较 MHL 提升 2.7%–6.0%，消融验证了均衡码本使用与量化结构对齐重建的必要性。

---

### 5. Decision4Rec: A Jev-Inspired Framework of Decision Models on Knowledge and Active Graphs for Multi-Agent Recommender Systems

📄 [arXiv:2610.26035](https://arxiv.org/abs/2610.26035) | Marco Polignano, Het Darshan Mehta, Pasquale Lops 等

**🗣️ 大白话：** 决策模型（如 Jev）不生成文本、直接输出选项概率，这篇把它搬进了推荐系统：知识图谱把推荐日志写成"销量：前 10%"这种短陈述，一群智能体出候选，决策模型打分融合排序。4B 的决策模型在三个稀疏 Amazon 数据集上 NDCG@10 超最强基线 25%–36%，而且迁移到没见过的 MovieLens 上还能涨 5%–7%。开源了代码和模型。

**🔬 专业讲解：** 框架模块化设计：知识图谱将场景日志转化为分尺度类型化陈述，agent pool 提出候选、residual ranker 保留 Top30，decision model（商用 Jev / 开源 Kev / 自训版本）经统一类型化问题接口读取后与 ranker 分数融合。4B 决策模型在三个稀疏 Amazon 目录 NDCG@10 超最佳训练基线 25%–36%（含一个训练未见目录），dense Steam 近打平；27B 较 0.8B 再增 5%–6%；自训 0.8B 开源模型在 15 个设置中 11 个胜出商业 Jev。增益主要来自 agent pool 的知识而非新候选，泛化性是核心卖点。

---

### 6. Learning Complementary Agent Groups via Task Hypergraphs for Next-POI Recommendation with Missing Modalities

📄 [arXiv:2610.25801](https://arxiv.org/abs/2610.25801) | Jinze Wang, Yuze Liu, Liang Yuan 等

**🗣️ 大白话：** 下一地点推荐（比如猜你下一个去哪家店）常遇到签到没配图、没文字的情况。CATH 让一群各有专长的 LLM 智能体"组队干活"：用超图学习怎么根据任务挑人、挑谁，成员之间还互相共享发现，最后统一修正基础排序。三个真实数据集上 NDCG@20 比此前最强基线高 8.4%–9.1%，还把算力成本算进了优化目标。

**🔬 专业讲解：** 针对 POI 推荐中文本/图像模态天然缺失问题，将异构角色 agent 建模为任务超图节点，hyperedge 记录所选 agent 组、分析目标与目标 POI；策略网络按请求、任务与已选成员条件化选择，执行时成员共享候选关联结果并更新候选状态与 agent 记忆，共享 ranking head 将候选状态转为对固定基排序的修正。训练采用监督排序 + 计入计算代价的策略优化。Gowalla-CA、Foursquare-NYC/TKY 自然缺失场景下 NDCG@20 相对 HyperAgent4POI 提升 8.4%–9.1%，并给出质量-成本 tradeoff 分析。

---

### 7. OneChord: Distill What You Rank, Recommend in One Pass

📄 [arXiv:2610.25805](https://arxiv.org/abs/2610.25805) | Zesheng Li, Chengchang Pan, Honggang Qi

**🗣️ 大白话：** 语义 ID 推荐在线上部署时要把"生成概率"和"商品相似度"加权融合，但训练目标和线上打分公式经常对不上。OneChord 提出一个直白的训练原则："你线上怎么排，就照着怎么蒸馏"。一个共享解码器同时产出 SID 证据和商品匹配分，训练时冻结的降噪器提供合法部分 SID，学生模型学会一次前向就出最终排序。六个 Amazon 数据集上 Recall@5 和 NDCG@5 全部第一，推理还快 1.04–1.18 倍。

**🔬 专业讲解：** 核心贡献是将"服务时排序分布"作为训练与蒸馏的共同对象：catalog-normalized fusion 同时用于 next-item 监督、refinement distillation 与推理；并行共享解码器输出联合 SID 证据与 item-matching 分数；训练期由冻结 denoiser 采样合法部分 SID，学生在共享难负候选上对齐直接预测与 refined 预测，从而将 refinement 能力迁移进单次前向推理。理论上给出候选条件化诱导的融合权重刻画及保持 refined predictor Top-K 选择的充分条件。六个 Amazon 数据集 Recall@5/NDCG@5 全面最优（相对最强基线平均 +6.30%/+7.12%），全测生成加速 1.04–1.18×。

---

### 8. Multimodal Decoupling for Diversified Recommendation through Semantic and Structural Shaping

📄 [arXiv:2610.26024](https://arxiv.org/abs/2610.26024) | Changran He, Jiaming Wei, Jianghong Ma 等

**🗣️ 大白话：** 推荐系统只顾准不准，推出来全是同质化内容。MOSS 从两头下手：语义上用多模态大模型把内容特征拆干净、按类目挑紧凑特征；结构上交替用协同图和多模态图传播防止表征塌缩，再加熵正则让各类目曝光均衡。实测准确率-多样性的平衡显著优于强基线。

**🔬 专业讲解：** 论文论证准确率-多样性 tradeoff 由表征结构性质与优化动力学共同决定。MOSS 包含：MLLM 驱动的解耦特征提取模块、类别感知嵌入选择模块（提升语义利用率）、交替双图传播（协同+多模态，缓解表示坍缩）与基于熵的多样性正则（促进类目均衡曝光）。真实数据集上一致取得优于强基线的 accuracy-diversity tradeoff，属于多模态多样性方向较完整的框架性工作。

---

### 9. When Semantics Fall Short: Persona-Guided Cross-Domain Sequential Recommendation with Large Language Models

📄 [arXiv:2610.25221](https://arxiv.org/abs/2610.25221) | Jundong Chen, Honglei Zhang, Shuai An 等

**🗣️ 大白话：** 跨域序列推荐想借 LLM 的"全球商品语义"打通两个域，但作者发现这事有个坑：商品语义其实是域内专属的，全局语义桥接经常失效——局部语义和用户行为对得上，跨域就对不上了。他们的解法是换思路：不再靠全局语义硬桥，而是用 LLM 推断的"用户人设"来引导跨域行为模式迁移，域内才用局部语义辅助。效果稳定优于基线。

**🔬 专业讲解：** 论文指出 LLM 语义桥接范式的两大缺陷：语义域隔离（item 语义域内特化，难以全局迁移）与语义-行为不一致（局部语义关系与行为转移一致、全局跨域断裂）。PerCDR 转向 persona-guided 行为建模：以 LLM 推断 persona 全局引导可迁移的跨域行为模式，局部语义关系仅用于域内行为增强，最后做域偏好适配。实验验证了"语义做域内、人设做跨域"的分工策略有效性。

---

### 10. FLMNet: Self-Ensemble Distillation from Masks to Seeds for Single-Tower CTR Prediction

📄 [arXiv:2610.26143](https://arxiv.org/abs/2610.26143) | 44 pages | Yifan Wang, Yifei Du

**🗣️ 大白话：** CTR 模型里"自己蒸馏自己"（同一网络跑不同 dropout 取平均再互相学）效果不错，但一直说不清为什么、随机采样是不是必须的。这篇从理论上证明：当 dropout 模式数量趋于无穷时，这个目标恰好等于"logit 平均预测的标签损失 + 一个惩罚网络内部不一致的闭式项"。FLMNet 按这个原理设计，训练完全不用采样，单网络推理就在 5 个基准 17 个基线中拿下前两名。

**🔬 专业讲解：** 理论贡献在于将 FinalNet/QNN 类自蒸馏目标在 dropout pattern 数趋于无穷时解析化为 logit-averaged 预测的标签损失加不一致惩罚项，且当 dropout 不影响特征门控时惩罚可闭式近似；FLMNet 据此免采样训练。论文进一步证明不同 seed 训练的网络间分歧具有相同形式，多网络蒸馏可回收部分 ensemble 增益。5 个基准、17 个基线下单网络推理取得精度前二，惩罚项与蒸馏增益近似可加。

---

### 11. Candidate-dependent residual routing trades top-of-list accuracy for recall in sequential recommendation

📄 [arXiv:2610.24200](https://arxiv.org/abs/2610.24200) | 33 pages | Han Chen, Yingrui Li

**🗣️ 大白话：** "根据候选物品给用户历史行为分配不同权重"（candidate-dependent routing）这种灵活设计到底有没有用？作者做了个很扎实的对照实验：加个小模块，两个版本只差路由权重来自用户历史还是候选物品。结果平均指标几乎没动，但拆开看是两个效应互相抵消：候选相关模式让 recall +1.81%，头部排名反而变差（MRR -1.09%），新命中都堆在 6-10 名。本质是"头部精度换尾部召回"。

**🔬 专业讲解：** 在 REES46 化妆品数据集、5 组配对种子、训练对齐条件下，candidate-dependent residual routing 对 NDCG@10 平均相对变化仅 +0.003%，但分解显示 top-10 内相关条目 recall +1.81%、MRR -1.09%，新增命中集中于位置 6–10；增益集中于目标出现在最近 50 个事件内的 query，窗口外 query 反而变差。是罕见的高严谨阴性/条件性结论工作，提示路由机制评估需要位置级与 query 级分解而非聚合指标。

---

## 📋 其他论文速览

- **AGR: Agentic Generative Retrieval with Tool-Augmented Search**（arXiv:2610.26831）：给生成式检索装上工具增强搜索能力，agent 化检索新尝试
- **Preference Is Not Position: Evaluating Reranking on NevIR in Fixed Hybrid Candidate Pools**（arXiv:2610.26260）：指出重排序评估中偏好与位置混淆问题，在固定混合候选池下重新评测 NevIR
- **Babbar26 main x genre**（arXiv:2610.26220）：Babbar 系列工作
- **MEMORA: A Memory-Enhanced Multimodal Committee Reranking Agent for Reasoning-Intensive Retrieval**（arXiv:2610.25282）：带记忆的多模态"委员会"重排 agent，专攻需要推理的重检索任务
- **MemRevise: A Self-Revising Memory for Conversational Search**（arXiv:2610.24672）：对话搜索中会自我修正的记忆机制
- **Optimal Fusion Weights Form Intervals, Not Points: A Latency-Aware Study of Query-Adaptive WRRF**（arXiv:2610.24341）：查询自适应 WRRF 融合权重并非单点最优而是一个区间，兼顾延迟约束
- **Location, Location, Generation: Where You Ask Matters for Generative Engine Optimization**（arXiv:2610.24081）：生成式引擎优化（GEO）中提问位置影响生成结果
- **When Does Evidence-Graph Structure Predict Answer Correctness? Label-Free Abstention for Structured Retrieval**（arXiv:2610.24030）：用证据图结构免标注预测答案正确性、实现结构化检索弃答
- **Next Best Action: Causal Constrained Offline RL for Business Action Targeting**（arXiv:2610.26817）：因果约束离线 RL 做业务动作定向，与推荐营销强相关
- **Beyond Behavioral Accuracy: Evaluating Individual-Level Fidelity in LLM Investor Simulation**（arXiv:2610.26524）：LLM 投资者模拟的个体级保真度评估
- **The Scheduler Is a Hidden Retriever: How Asynchrony Shapes Evidence Acquisition in Search Agents**（arXiv:2610.26310）：揭示搜索 agent 调度器的异步性实质上决定了证据获取
- **The Geometry of Agent Memory: Forecasting Retrieval-Bound Memory Failures**（arXiv:2610.26433）：从几何视角预测 agent 记忆检索失败
- **Whistle and Wrong Lyrics: Synthetic Queries Are Not Enough for Real-World Query-by-Melody**（arXiv:2610.25371）：合成查询不足以覆盖真实哼唱检索场景
- **Where and Why Search-Augmented LLMs Fail When Reasoning over Rapidly Evolving Knowledge**（arXiv:2610.25323）：剖析搜索增强 LLM 在快速演化知识上的失败模式
- **RemoteANN: A Native Vector Search Engine for Cloud Object Storage**（arXiv:2610.25172）：面向云对象存储的原生向量检索引擎
- **Learning to Program Retrievals: Composing Search Primitives via Reinforcement Learning**（arXiv:2610.24854）：用 RL 组合检索原语"编程"检索流程
- **Cache2LoRA: Understanding and Improving Context Internalization**（arXiv:2610.24107）：理解并改进 KV cache 到 LoRA 的上下文内化
