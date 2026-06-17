---
title: "【推荐系统 Paper 日报】2026-06-18"
date: 2026-06-18
authors: [wangshuli]
tags: [推荐系统, Paper日报, arxiv]
km_source: "https://km.sankuai.com/collabpage/2769823588"
---

# 【推荐系统 Paper 日报】2026-06-18

## 📊 今日概览

arXiv cs.IR 最新公告日期 **Wed, 17 Jun 2026**，今日共发布 **10 篇** 论文。其中推荐系统（Recommender System）相关论文 **3 篇**，本期亮点聚焦于生成式推荐（Generative Recommendation）的深层问题——信息茧房与记忆偏差，以及零工平台中的推荐曝光控制机制设计。

## 🔥 推荐系统论文深度解读

### 1. Do Generative Recommenders Deepen the Information Cocoon? A Closed-Loop Simulation with LLM-powered User Simulators

📄 [arXiv:2606.17707](https://arxiv.org/abs/2606.17707) | Jiyuan Yang, Gengxin Sun, Mengqi Zhang, Lingjie Wang, Yuanzi Li, Hongxi Cui, Xin Xin, Pengjie Ren

**🗣️ 大白话：** 大家都在说生成式推荐是下一代推荐系统的方向，但有个问题没人认真想过：用 LLM 做推荐，会不会让用户的信息茧房更严重？这篇论文用 LLM 模拟用户行为，做了个闭环实验，结果发现——生成式推荐在曝光多样性上其实比传统方法更好，但反馈循环仍然会在模型内部造成"代码空间"的集中效应。简单说，用户看到的推荐不算太窄，但模型内部编码已经悄悄变得"趋同"了。

**🔬 专业讲解：** 论文提出 RecLoop 框架，用 LLM 驱动的用户智能体在闭环环境中模拟推荐-交互反馈。核心发现有三：
- 生成式推荐器在曝光级茧房指标上优于传统序列基线，交叉用户同质化更慢
- 但反馈循环仍会在生成的 SID（Semantic ID）空间中引发集中效应，论文引入"Code-Space Structural Cocoon"指标量化这一现象
- 茧房严重程度与 tokenization 策略和模型规模强相关：协同信号 tokenization 比语义 tokenization 茧房效应更强；更大模型能保持更好的代码空间多样性，对长尾内容的保留也更优

这意味着，生成式推荐中的茧房问题不仅由推荐行为本身塑造，还与 item tokenization 和模型容量密切相关。代码已开源。

---

### 2. On the Memorization Behavior of LLMs in Generative Recommendation: Observations, Implications, and Training Strategies

📄 [arXiv:2606.17276](https://arxiv.org/abs/2606.17276) | Sunwoo Kim, Sunkyung Lee, Clark Mingxuan Ju, Donald Loveland, Bhuvesh Kumar, Kijung Shin, Neil Shah, Liam Collins

**🗣️ 大白话：** 大家以为 LLM 做推荐靠的是它强大的预训练知识，能推荐出训练数据里没出现过的好东西。但这篇论文泼了盆冷水：LLM 在推荐任务里其实很爱"死记硬背"——训练数据里 item A 后面常跟着 item B，它就死磕这个规律。论文发现，LLM 超过基线的性能优势，大部分都来自这种"一阶记忆"。那真正需要预训练知识的用户（那些训练数据里没出现过类似行为的用户）反而被忽略了。

**🔬 专业讲解：** 论文系统研究了 LLM 在生成式推荐中的 one-hop memorization 行为：
- LLM 的 one-hop 记忆率显著高于非 LLM 的生成式推荐模型
- LLM 相对于基线的绝大部分增益，实际上来自那些 test item 可以通过训练数据中的 one-hop 记忆预测的用户
- 提出了 IIRG（Inter-Item Relation for Generative recommendation）训练策略，让 LLM 学习两类更丰富的 item-item 关系：
  1. 多跳协同关系：从用户序列中跨多跳的 item 共现推导的协同信号
  2. 语义关系：主题相似 item 之间的语义关联
- IIRG 在标准 next-item prediction 基础上显著提升了性能，尤其对 test item 未被训练时 one-hop 覆盖的用户增益更大

这对 LLM 推荐系统设计有重要启示：不能盲目相信 LLM 的预训练知识，需要显式训练更丰富的 item 关系。

---

### 3. Designing Recommendation Exposure and Favorite Lists: A Field Experiment in a Spot-Work Platform

📄 [arXiv:2606.17397](https://arxiv.org/abs/2606.17397) | Kazuki Sekiya, Suguru Otani, Yuki Komatsu, Shunsuke Ozeki, Shunya Noda

**🗣️ 大白话：** 做推荐不只是让用户点击喜欢的内容，有时候推荐决定了用户能否获得稀缺的机会。这篇论文研究的是日本最大的零工平台 Timee：工人收藏了喜欢的岗位模板，平台推荐新班次时，如果只按"最受欢迎"推荐，就会造成"热门模板一堆人抢，但真正缺人的模板没人看"的局面。论文设计了一个曝光重分配机制，按岗位的实际需求和未填补容量来调整推荐，结果找工作成功率从 57.6% 提升到 70.0%，还做了真正的随机对照实验验证。

**🔬 专业讲解：** 论文提出了 Thresholded Eligibility Control (TEC) 推荐框架，核心设计包括：
- 曝光控制机制：基于模板发布活动和未填补容量重分配曝光，而非单纯最大化预测收藏率
- TEC 完全可并行化，适合大规模数字平台部署
- 在基于 Timee 真实数据校准的模拟中，TEC 将每轮求职成功率从 57.6% 提升至 70.0%
- 在日本某县的随机对照实验（RCT）中，TEC 实现了：
  - 提升实际匹配数和每个活跃模板的曝光量
  - 降低低曝光模板的比例
  - 改善 impression-level 收藏率和下游匹配率

这是推荐系统与经济学/运筹学交叉的典型应用，TEC 的思想对任何涉及稀缺资源分配的推荐场景（如招聘、住房、医疗预约等）都有参考价值。

---

## 📋 其他论文速览

- **IUU+DB: Tracking Illegal, Unreported, and Unregulated Fishing, Seafood Fraud, and Labor Abuse through LLM-driven Information Extraction**（arXiv:2606.18181）：LLM 驱动的全球渔业非法事件数据库系统，支持事件分类、关键信息提取、去重和趋势分析
- **Non-negative Elastic Net Decoding for Information Retrieval**（arXiv:2606.17910）：将稠密检索从点-wise 打分扩展到 set-wise 联合解码，NNN 解码选择一组文档其嵌入能联合重构查询嵌入，理论证明严格优于标准内积打分
- **Understanding and Debugging Failures in N-Gram-Based Generative Retrieval**（arXiv:2606.17721）：生成式检索失败模式分类学，针对 n-gram 方法（SEAL、MINDER）的实证分析，并推出可视化调试工具
- **Temporal Preference Optimization for Unsupervised Retrieval**（arXiv:2606.17664）：TPOUR，通过时间偏好优化（TRPO）让无监督检索器学会时间对齐，对时间检索任务超越监督和基线方法
- **RSRank: Learning Relevance from Representational Shifts**（arXiv:2606.17468）：利用文档条件化查询内部状态时的表征偏移（RS）作为相关性信号，零阈值即可过滤无关内容，超越 SOTA 重排序器
- **HistoRAG: Embedding Historical Methodology in Retrieval-Augmented Generation Through Critical Technical Practice**（arXiv:2606.18103）：为历史学等诠释性学科设计的 RAG 框架，引入分离检索与生成、时间窗口、LLM-as-judge 等机制
- **Beyond Parallel Sampling: Diverse Query Initialization for Agentic Search**（arXiv:2606.17209）：DivInit，通过首轮查询多样性提升并行 agentic 搜索效率，解决并行采样中查询冗余导致检索重叠的问题
