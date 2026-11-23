---
title: "【推荐系统 Paper 日报】2026-11-23"
date: 2026-11-23
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/md/2799967386"
---

# 【推荐系统 Paper 日报】2026-11-23

## 📊 今日概览

arXiv cs.IR 本期公告日期为 2026-11-23（周一），今日共 8 篇新论文，其中推荐系统/个性化排序相关 3 篇。亮点：工业界投稿火力全开——被 WSDM 2027 接收的 DCDN 已在短视频生产环境全量落地并带来分享率 +16.26% 的显著提升；ERA 和 StylePrism 则分别在冷启动检索和个性化长文生成上给出了漂亮的新解法。

## 🔥 推荐系统论文深度解读

### 1. Deep Cross-Division Network for Product-and-Ratio Feature Interactions in Industrial Ranking

📄 [arXiv:2611.27514](https://arxiv.org/abs/2611.27514) | WSDM 2027 | Mikhail Trapeznikov; Sofia Gulevskaia; Maksim Utushkin; Aleksandr Poslavsky; Alexander D'yakonov

**🗣️ 大白话：** 做过特征工程的同学都懂，"点击率""收藏率"这类比率特征（CTR、like rate）在推荐排序里特别有用，但都得靠人工先算好喂给模型。这篇论文说：别手动算了，我把"除法"直接搬进 DCNv2 的交叉层里，让网络自己学出"乘积 + 比值"的组合。结果是模型输入特征砍掉 40%，线上 A/B 分享率涨了 16.26%。

**🔬 专业讲解：** DCN/DCNv2 的交叉层只能表达输入特征的非负整数次幂多项式，天然无法表示倒数项（reciprocal terms），所以比率类特征必须靠人工构造后作为输入。作者提出 DCDN，在 DCNv2 风格的交叉层上增加一条除法分支，联合学习乘积、比值和乘除混合交互；理论上将可表示函数刻画为多元 Laurent 多项式——K 层 DCDN 可生成 ℓ1 阶至 K+1、带符号次数在 [-K, K+1] 的 Laurent 单项式。在一个围绕 DCNv2、依赖人工比率特征的短视频生产排序栈中，用 DCDN 替换 DCNv2 模块后，彻底删除了整类人工比率特征，输入特征数减少 40.1%。线上 A/B 实验显示点赞 +3.25%、分享 +16.26%、总观看时长 +0.33%、全屏点击 +0.38%（均统计显著），展示视频数仅 -0.24%。代码已开源。

---

### 2. Explicit Style Extraction for Personalized Long-Form Text Generation

📄 [arXiv:2611.27211](https://arxiv.org/abs/2611.27211) | Jenitha Reddy Patel; Sameeksha Kini; Amulya Rayasam; Anisa Dye; Abhinav Sharma; Sai Karthik Navuluru; Bo Ni; Junda Wu; Tong Yu; Nedim Lipka; Xiaolei Huang

**🗣️ 大白话：** 想让大模型"用你的口吻"写长文，现在的常规操作是把你的几篇旧文塞进 prompt，但模型自己琢磨该学什么。这篇把"风格提取"变成显式步骤：先用一套 28 个维度的风格清单（StylePrism）把你的写作习惯、口头禅、该避开的毛病逐项填好，然后照着这份"风格档案"写初稿，再自我打分、迭代修订两轮。在 LongLaMP 三个长文任务上，27 组对比赢了 25 组，平均提升 10.2%，最高 35.8%。

**🔬 专业讲解：** 个性化长文生成任务中，RAG 式方法仅将用户历史文本置于 prompt 中，风格信息的利用是隐式的。StylePrism 定义了 7 大类共 28 个风格维度的分类体系；SP-Refine 在推理阶段将风格提取显式化：模型先从用户样本中提取风格档案（包含模式、引用证据和应避免的习惯），再基于样本起草，并依据风格自评分进行两轮修订。在 LongLaMP 三个长文任务、三个 LLM 上，SP-Refine 在 25/27 组 ROUGE 与 METEOR 对比中超过检索增强基线，平均 +10.2%、最高 +35.8%。消融表明：档案作为修订指导有效，但仅凭档案（不看样本）写作在全部 27 组对比中更差——样本仍是风格信息的最佳载体；单次隐式推理是成本更低、效果接近的替代方案。Oracle 变体显示更大的修订增益依赖推理时不可得的信息，说明当前方法已接近无泄露设定的上限。

---

### 3. ERA: Embed, Route, Adapt for Cold-Start Cross-Model Latent Retrieval

📄 [arXiv:2611.26919](https://arxiv.org/abs/2611.26919) | 20 pages, 2 figures, 11 tables | Venkata Chivukula; Zifeng Wang; Jinsung Yoon

**🗣️ 大白话：** 检索系统的索引是用某个 embedding 模型建的，想换新模型就得把全库重新 embed，又贵又慢，冷启动时连查询日志都没有。ERA 的思路很省：只挑一小撮"最有信息量"的文档花预算重新编码（用余弦最远点采样选），在这些锚点上训一个轻量适配器做"新模型 → 旧索引空间"的映射，再配一个路由器——简单查询直接走适配器（快），少数难查询才升级调用完整的新编码器（准）。端到端延迟从约 160ms 降到 38-86ms。

**🔬 专业讲解：** 论文面向冷启动跨模型潜在检索场景：既有索引由旧 encoder 构建，新 encoder 上线时全库重编码成本高且缺少查询日志。ERA 三步走：(1) Embed——在既有目标索引上用 Cosine Farthest Point Sampling 选取信息量最大的锚点文档，只对锚点花费新模型编码预算；(2) Adapt——在锚点上训练轻量适配器，采用 Manifold Alignment Loss（方向对齐 + 正交正则）耦合两个表示空间并防止表示坍缩；(3) Route——确定性路由器将少数困难查询升级至新 encoder 全量推理。在五个 BEIR 数据集上，ERA 匹配或超过逐点 L2 与 embedding-conversion 基线，Arguana 上 nDCG@10 相对提升至 35%；聚类语料下锚点选择在同等预算下也优于既有方法。在约 20ms 本地 encoder 基础上，适配器+路由仅增加 1.2ms，20% 名义升级预算下将端到端查询延迟从约 160ms 降至 38-86ms，且升级集中在投影失败最严重的查询上。

---

## 📋 其他论文速览

- **Decision Columns as an Index: Interpretable Embeddings for Explainable Entity Matching and Search**（arXiv:2611.27910）：用"决策列"（对一系列自然语言问题的 yes/no/not-stated 校准回答）构建可解释 embedding，相似度可精确分解到每个问题的贡献；检索质量与稠密向量统计持平，还能从稠密向量直接预测出可解释向量，回填成本仅约 1/200。
- **DiTraR: Diverse Scorers and Transcript-Guided Re-ranking for Video Corpus Moment Retrieval**（arXiv:2611.27931）：视频库时刻检索，错误主因是"选错视频"而非"边界不准"；DiTraR 用多打分器能量集成 + 冻结 LLM 读字幕重排，TVR 验证集 IoU@0.5 达 24.36 R@1，视觉类与对白类查询的增益基本可叠加。
- **Leader Finding: A New Variation of Expert Finding in Community Question Answering**（arXiv:2611.26921）：把专家检索扩展到"找团队负责人"——不只看技术匹配，还要看管理知识和沟通能力，概率框架三指标齐下，Stack Overflow 两个数据集上 NDCG@10 超最强基线一倍以上。
- **Which Dwarf Is This? Doppeldwarf-306 and Near-Duplicate Instance Retrieval**（arXiv:2611.27490）：发布 306 座"长得几乎一样"的波兰小矮人铜像数据集（1691 张图），冻结 DINOv2 特征免训练近邻检索准确率 93.1%；把地理位置当权重而非过滤器，模拟用户场景下可提升至 98.7%。
- **Pre-Crawl Prioritization and Seed Classification for Large-Scale Web Archiving**（arXiv:2611.27743）：面向网页存档的抓取前优先级调度，用 URL 词法分析、域名信誉和 HTTP 响应分析 + 内容变化/消失概率预测模型，提升存档完整性的同时减少对稳定资源的重复访问。
