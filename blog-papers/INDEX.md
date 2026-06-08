# 论文精读知识库索引

> 自动维护，每次精读后更新。共 **23** 篇。
> 检索方式：Ctrl+F 搜索关键词、标签、作者、机构。

---

## 快速索引表

| # | 标题 | 机构 | 日期 | 领域标签 | 博导判决 | 文件 |
|---|------|------|------|----------|----------|------|
| 1 | SID-Coord | 快手 | 2026-04-12 | `推荐` `搜索排序` `Semantic ID` `长尾` | Weak Accept | [→](paper-SID-Coord.md) |
| 2 | AdaSID | 电子科技大学 & 快手 | 2026-04-26 | `推荐` `Semantic ID` `量化` `碰撞` | Weak Accept 偏 Accept | [→](paper-AdaSID.md) |
| 3 | AutoSOTA | 清华 & 北大 & 中科大 | 2026-04-07 | `AI科研自动化` `多智能体` `代码生成` | Accept | [→](paper-AutoSOTA.md) |
| 4 | Attention Residuals | 月之暗面 Kimi | 2026-03-16 | `LLM` `Transformer架构` `残差连接` `注意力` | Strong Accept | [→](paper-attention-residuals.md) |
| 5 | GenLI | 美团 | 2026-05-15 | `CTR预估` `用户兴趣建模` `长期行为序列` `广告` | Weak Accept 偏 Accept | [→](paper-GenLI.md) |
| 6 | ELF | MIT | 2026-05-11 | `生成模型` `Flow Matching` `语言模型` `扩散模型` | Strong Accept | [→](paper-ELF-embedded-language-flows.md) |
| 7 | LWGR | 中科院信工所 & 阿里国际 | 2026-04-16 | `生成式推荐` `LLM知识融合` `个性化软指令` | Weak Accept 偏 Accept | [→](paper-LWGR.md) |
| 8 | harness-design | Anthropic Labs | 2026-03-24 | `Agentic系统` `Harness设计` `多Agent架构` | Strong Accept | [→](paper-harness-design.md) |
| 9 | claude-code-arch | 小林（知乎） | 2026-05-22 | `Agent工程` `Claude Code` `上下文压缩` | Strong Accept | [→](paper-claude-code-arch.md) |
| 10 | RankElastor | 腾讯 & HKUST-GZ | 2026-05-22 | `CTR预估` `推荐Scaling` `embedding collapse` | Weak Accept 偏 Accept | [→](paper-RankElastor.md) |
| 11 | TokenFormer | 腾讯 | 2026-05-25 | `CTR预估` `统一建模` `SCP` `有效秩` | Accept | [→](paper-TokenFormer.md) |
| 12 | RankUp | 腾讯 | 2026-05-25 | `CTR预估` `推荐Scaling` `embedding collapse` `多任务` | Accept | [→](paper-RankUp.md) |
| 13 | 有效秩三部曲串联解读 | 腾讯（三篇合集） | 2026-05-25 | `CTR预估` `有效秩` `推荐Scaling` `串联解读` | — | [→](paper-trilogy-effective-rank.md) |
| 14 | Diff-eRank | 上海交通大学 & 清华 | 2024-01-30 | `LLM评估` `有效秩` `信息论` | Weak Accept | [→](paper-Diff-eRank.md) |
| 15 | Memento | Meta AI | 2026-05-22 | `长期用户历史` `RAG推荐` `灾难性遗忘` | Weak Accept 偏 Accept | [→](paper-Memento.md) |
| 16 | SID-Collision | 奥塔哥大学 & UNSW | 2026-05-25 | `生成式推荐` `Semantic ID` `评估方法论` | Weak Accept 偏 Accept | [→](paper-SID-Collision.md) |
| 17 | DeGRe | 浙江大学 & 阿里巴巴（淘宝闪购） | 2026-05-25 | `推荐重排序` `生成式重排序` `稠密监督` | Strong Accept | [→](paper-DeGRe.md) |
| 18 | SwAV | Inria & Facebook AI | 2020-06-17 | `自监督学习` `对比学习` `聚类` `multi-crop` | Strong Accept | [→](paper-SwAV.md) |
| 19 | DINO | Facebook AI & Inria | 2021-04-29 | `自监督学习` `ViT` `self-distillation` `涌现属性` | Strong Accept | [→](paper-DINO.md) |
| 20 | UniPinRec | Pinterest | 2026-05-29 | `召回排序统一` `生成式推荐` `KV缓存共享` | Weak Accept | [→](paper-UniPinRec.md) |
| 21 | DRQ | Shopee | 2026-06-01 | `Semantic ID` `向量量化` `诊断框架` | Weak Accept | [→](paper-DRQ.md) |
| 22 | DS-MLP | 人大 & 字节 & 美团 | 2026-06-03 | `CTR预估` `知识蒸馏` `双流MLP` `特征交互` | Weak Accept | [→](paper-DS-MLP.md) |
| 23 | OneReason | 快手 | 2026-06-04 | `生成式推荐` `推荐推理` `CoT` `itemic token` | Strong Accept | [→](paper-OneReason.md) |

---

## 详细条目

### [SID-Coord] Coordinating Semantic IDs for ID-based Ranking in Short-Video Search

- **arXiv**：2604.10471
- **机构**：快手技术
- **发表**：SIGIR '26
- **日期**：2026-04-12
- **领域标签**：`推荐系统` `搜索排序` `Semantic ID` `长尾问题` `短视频`
- **技术标签**：`RQ量化` `层级SID` `热度门控` `兴趣对齐` `HID-SID协调`
- **核心增量**：把 SID 从"辅助特征"升级为"协调机制"，通过层级组合、热度感知门控、语义兴趣对齐三个模块，系统性协调 SID 语义泛化与 HID 稀疏记忆，长尾 UAUC +0.93%，在线长播放率 +0.664%。
- **博导判决**：Weak Accept（工程贡献扎实，理论深度有限，三模块"协调"叙事略牵强）
- **关联论文**：AdaSID（同为 SID 方向）、TIGER/QARM（SID 基础工作）
- **BibTeX**：
  ```bibtex
  @inproceedings{li2026sidcoord,
    title     = {SID-Coord: Coordinating Semantic IDs for ID-based Ranking in Short-Video Search},
    author    = {Li, Guowen and Zhang, Yuepeng and Zhang, Shunyu and Zhang, Yi and Jiang, Xiaoze and Wang, Yi and Zhuo, Jingwei},
    booktitle = {Proceedings of the 49th International ACM SIGIR Conference on Research and Development in Information Retrieval},
    series    = {SIGIR '26},
    year      = {2026},
    doi       = {10.1145/3805712.3808436},
    eprint    = {2604.10471},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-SID-Coord.md](paper-SID-Coord.md)

---

### [AdaSID] Adaptive Semantic ID Learning for Generative Recommendation

- **arXiv**：2604.23522
- **机构**：电子科技大学 & 快手技术
- **发表**：arXiv 预印本（2026-04-26）
- **日期**：2026-04-28（精读日期）
- **领域标签**：`推荐系统` `Semantic ID` `量化学习` `生成式推荐`
- **技术标签**：`碰撞处理` `语义门控` `负载感知` `自适应排斥` `RQ-VAE`
- **核心增量**：提出自适应碰撞处理机制——先用语义相容性门控决定"要不要排斥"，再用局部拥挤度×训练进度决定"排斥多用力"，让 SID 空间更有区分度、更均匀、更对齐推荐目标。
- **博导判决**：Weak Accept 偏 Accept（碰撞问题定义清晰，自适应设计有新意，但实验规模偏小）
- **关联论文**：SID-Coord（同为 SID 方向）、TIGER（SID 基础）、QuaSID（碰撞处理前作）
- **BibTeX**：
  ```bibtex
  @article{pan2026adasid,
    title         = {AdaSID: Adaptive Semantic ID Learning for Generative Recommendation},
    author        = {Pan, Yongsen and Chen, Yuxin and Hu, Zheng and Yuan, Xu and Wang, Daoyuan and Yin, Yuting and Ni, Songhao and Wang, Hongyang and Wang, Jun and Ren, Fuji and Ou, Wenwu},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2604.23522},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-AdaSID.md](paper-AdaSID.md)

---

### [AutoSOTA] End-to-End Automated Research System

- **arXiv**：2604.05550
- **机构**：清华大学、中关村研究院、北大、中科大
- **发表**：arXiv 预印本（2026-04-07）
- **日期**：2026-04-09（精读日期）
- **领域标签**：`AI科研自动化` `多智能体系统` `代码生成` `AutoML`
- **技术标签**：`八智能体架构` `红线系统` `假设库` `环境搭建` `基线复现`
- **核心增量**：首个从论文 PDF 出发、自动完成"复现→超越 SOTA"全流程的系统，105 篇论文全部成功，平均提升近 10%，约 5 小时/篇。
- **博导判决**：Accept（工程系统完整，规模验证充分，红线设计有原则性）
- **关联论文**：autoresearch skill（本项目直接相关）
- **BibTeX**：
  ```bibtex
  @article{li2026autosota,
    title         = {AutoSOTA: End-to-End Automated Research System for Achieving State-of-the-Art},
    author        = {Li, Yu and Shao, Chenyang and Liu, Xinyang and Zhao, Ruotong and Liu, Peijie and Su, Hongyuan and Chen, Zhibin and Yang, Qinglong and Xu, Anjie and Fang, Yi and Zeng, Qingbin and Li, Tianxing and Xu, Jingbo and Xu, Fengli and Li, Yong and Liu, Tie-Yan},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2604.05550},
    archivePrefix = {arXiv},
    primaryClass  = {cs.AI}
  }
  ```
- **文件**：[paper-AutoSOTA.md](paper-AutoSOTA.md)

---

### [Attention Residuals] Attention-based Residual Connections for Deep Networks

- **arXiv**：2603.15031
- **机构**：月之暗面 Kimi Team
- **发表**：arXiv 预印本（2026-03-16）
- **日期**：2026-04-07（精读日期）
- **领域标签**：`LLM` `Transformer架构` `深度学习基础`
- **技术标签**：`残差连接` `深度维度注意力` `PreNorm稀释` `层间信息检索`
- **核心增量**：把序列维度上"RNN→Transformer"的跃迁复制到深度维度——用 softmax 注意力替换固定权重的残差累加，让每层能选择性地从所有前层检索信息，解决 PreNorm 稀释问题。
- **博导判决**：Strong Accept（问题定义精准，类比优雅，实验充分）
- **关联论文**：ELF（同为架构创新方向）
- **BibTeX**：
  ```bibtex
  @article{chen2026attnresiduals,
    title         = {Attention-based Residual Connections for Deep Networks},
    author        = {Chen, Guangyu and Zhang, Yu and Su, Jianlin and others},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2603.15031},
    archivePrefix = {arXiv},
    primaryClass  = {cs.CL}
  }
  ```
- **文件**：[paper-attention-residuals.md](paper-attention-residuals.md)

---

### [GenLI] Generative Long-term User Interest Modeling for CTR Prediction

- **arXiv**：2605.15905
- **机构**：美团
- **发表**：arXiv 预印本（待投会议）
- **日期**：2026-05-16（精读日期）
- **领域标签**：`CTR预估` `用户兴趣建模` `长期行为序列` `广告系统`
- **技术标签**：`target-independent` `兴趣分布生成` `O(1)查表检索` `显式/隐式/相对兴趣` `GSU替代`
- **核心增量**：把 GSU 的"pairwise 检索"范式替换为"生成+查表"范式：IGM 先从短期行为生成三种 target-independent 兴趣分布，BRM 用 O(1) 查表打分，在提升兴趣多样性的同时把单条行为评分复杂度从 O(d) 降到 O(1)。在线 RPM +1.567%，已部署美团外卖广告主流量。
- **博导判决**：Weak Accept 偏 Accept（核心思路有实质价值，"生成"包装略夸张，hash 碰撞分析缺失）
- **关联论文**：MIMN（memory-based 长期兴趣建模）、SIM/TWIN（GSU-ESU 框架）
- **BibTeX**：
  ```bibtex
  @article{shao2026genli,
    title         = {Generative Long-term User Interest Modeling for Click-Through Rate Prediction},
    author        = {Shao, Jiangli and Zheng, Kaifu and Fang, Hao and Ye, Huimu and Liu, Zhiwei and Zhang, Bo and Han, Shu and Wang, Xingxing},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2605.15905},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-GenLI.md](paper-GenLI.md)

---

### [ELF] Embedded Language Flows

- **arXiv**：2605.10938
- **机构**：MIT
- **发表**：arXiv 预印本（2026-05-11）
- **日期**：2026-05-19（精读日期）
- **领域标签**：`生成模型` `语言模型` `扩散模型` `Flow Matching`
- **技术标签**：`连续DLM` `Flow Matching` `无额外decoder` `共享权重解码` `离散化`
- **核心增量**：把 Flow Matching 的最后一个时间步"顺手"当作离散化解码器，让连续 DLM 在完全不受离散约束的轨迹里自由流动，同时用共享权重网络完成去噪和解码，效果超越所有离散和连续 DLM，仅用十分之一训练数据。
- **博导判决**：Strong Accept（问题定义精准，方法优雅，实验充分）
- **关联论文**：Attention Residuals（同为基础架构创新）
- **BibTeX**：
  ```bibtex
  @article{hu2026elf,
    title         = {ELF: Embedded Language Flows},
    author        = {Hu, Keya and Qiu, Linlu and Li, Tianhong and Kim, Yoon and Lu, Yiyang and Zhao, Hanhong and Andreas, Jacob and He, Kaiming},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2605.10938},
    archivePrefix = {arXiv},
    primaryClass  = {cs.CL}
  }
  ```
- **文件**：[paper-ELF-embedded-language-flows.md](paper-ELF-embedded-language-flows.md)

---

### [LWGR] Lagrangian-Constrained Personalized World Knowledge for Generative Recommendation

- **arXiv**：2605.18771
- **机构**：中科院信工所 & 阿里巴巴国际数字商业集团
- **发表**：ACM 会议论文（2026，具体会议待定）
- **日期**：2026-04-16
- **领域标签**：`生成式推荐` `LLM知识融合` `个性化软指令` `约束优化` `工业推荐`
- **技术标签**：`并行码本OPQ` `IBQ直通估计器` `软指令` `拉格朗日原始-对偶` `交叉注意力BOS融合` `近线预计算`
- **核心增量**：用并行码本把用户上下文量化成个性化软指令，引导 LLM 激活与用户行为模式一致的世界知识；再用拉格朗日约束优化自适应抑制有害知识，在工业数据集上 Recall@5 提升 10.28%，在线广告收入 +1.35%。
- **博导判决**：Weak Accept 偏 Accept（工业验证充分，方法组合有新意，但理论深度有限，公开数据集消融缺失）
- **关联论文**：TIGER（GR 基础）、KAR/SeRALM（prompt-based 知识融合前作）、GenLI（同为 LLM 增强推荐）
- **BibTeX**：
  ```bibtex
  @inproceedings{mu2026lwgr,
    title     = {LWGR: Lagrangian-Constrained Personalized World Knowledge for Generative Recommendation},
    author    = {Mu, Lingyu and Deng, Hao and Xing, Haibo and Lin, Kaican and Zhu, Zhitong and Zhang, Yu and Zeng, Xiaoyi and Liu, Zhengxiao and Lin, Zheng and Hu, Jinxin},
    booktitle = {ACM Conference},
    year      = {2026},
    eprint    = {2605.18771},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-LWGR.md](paper-LWGR.md)

---

### [harness-design] Harness Design for Long-Running Application Development

- **arXiv**：N/A（工程博客）
- **机构**：Anthropic Labs
- **发表**：Anthropic Engineering Blog，2026-03-24
- **日期**：2026-03-24
- **领域标签**：`Agentic系统` `Harness设计` `多Agent架构` `LLM工程` `自动化编程`
- **技术标签**：`Generator-Evaluator分离` `Context Reset` `Sprint Contract` `Playwright MCP` `主观质量操作化` `Claude Agent SDK`
- **核心增量**：把 GAN 的生成器-判别器结构迁移到 Agentic 系统，通过独立 Evaluator + 可操作化评分标准解决自我评估偏差，结合 Context Reset 和 Sprint Contract 构建出能运行 4-6 小时、产出完整全栈应用的三 Agent 架构（Planner + Generator + Evaluator）。
- **博导判决**：Strong Accept（工程实践扎实，洞察有普适价值，诚实承认局限）
- **关联论文**：AutoSOTA（同为 AI 科研/编程自动化方向）
- **BibTeX**：
  ```bibtex
  @misc{rajasekaran2026harness,
    title         = {Harness Design for Long-Running Application Development},
    author        = {Rajasekaran, Prithvi},
    year          = {2026},
    howpublished  = {Anthropic Engineering Blog},
    url           = {https://www.anthropic.com/engineering/harness-design-long-running-apps}
  }
  ```
- **文件**：[paper-harness-design.md](paper-harness-design.md)

---

### [claude-code-arch] Claude Code 源码架构深度解析

- **arXiv**：N/A（知乎技术文章）
- **机构**：小林（知乎作者，基于 Claude Code npm 包 .map 文件泄漏的源码分析）
- **发表**：知乎专栏，2026-05-22
- **日期**：2026-05-22
- **领域标签**：`Agent工程` `Claude Code` `上下文压缩` `记忆系统` `System Prompt设计`
- **技术标签**：`四层架构` `Tool-Use Loop` `Plan Mode` `三级缓存` `五步压缩` `读时投影` `Sonnet秘书` `四类型记忆`
- **核心增量**：通过 Claude Code 51 万行泄漏源码，揭示地表最强编程 Agent 的核心竞争力不是模型能力，而是四层架构 + Tool-Use Loop + 动态 System Prompt + 四类型记忆 + 五步上下文压缩构成的"缰绳系统"——80% 的代码在死磕可靠性，不是在让 AI 更聪明。
- **博导判决**：Strong Accept（源码级细节扎实，分析有洞察力，是目前中文互联网最深入的 Claude Code 架构分析）
- **关联论文**：harness-design（Anthropic 官方 harness 设计博客，与本文互补）、AutoSOTA（同为 AI 自动化编程方向）
- **BibTeX**：
  ```bibtex
  @misc{xiaolin2026claudecodearch,
    title         = {Claude Code 源码架构深度解析},
    author        = {小林},
    year          = {2026},
    howpublished  = {知乎专栏},
    url           = {https://zhuanlan.zhihu.com/p/2025176118068621451}
  }
  ```
- **文件**：[paper-claude-code-arch.md](paper-claude-code-arch.md)

---

### [RankElastor] Expand More, Shrink Less: Shaping Effective-Rank Dynamics for Dense Scaling in Recommendation

- **arXiv**：2605.23191
- **机构**：腾讯 & 香港科技大学（广州）
- **发表**：KDD '26，2026年8月，济州岛
- **日期**：2026-05-22
- **领域标签**：`CTR预估` `推荐系统Scaling` `embedding collapse` `有效秩` `token-transformation架构`
- **技术标签**：`参数化全混合` `GLU改进P-FFN` `有效秩动态` `阻尼振荡` `谱鲁棒性`
- **核心增量**：发现 RankMixer 的有效秩在层间呈"阻尼振荡"（token mixing 小幅扩张，P-FFN 大幅收缩），提出 RankElastor 用参数化全混合+GLU门控P-FFN实现"扩得更多、缩得更少"，Criteo AUC +0.00107，scaling 行为显著优于 RankMixer。
- **博导判决**：Weak Accept 偏 Accept（理论链条完整，工程价值清晰，但参数化全混合在大规模配置下的可行性未讨论）
- **关联论文**：RankMixer（直接改进对象）、GenLI（同为推荐系统工业落地）、DCNv2/xDeepFM（对比 baseline）
- **BibTeX**：
  ```bibtex
  @inproceedings{li2026rankelastor,
    title     = {Expand More, Shrink Less: Shaping Effective-Rank Dynamics for Dense Scaling in Recommendation},
    author    = {Li, Guoming and Zhang, Shangyu and Pan, Junwei and Ning, Wentao and Chen, Jin and Xue, Gengsheng and Zhou, Chao and Huang, Shudong and Gu, Haijie and Yang, Menglin},
    booktitle = {Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2},
    series    = {KDD '26},
    year      = {2026},
    doi       = {10.1145/3770855.3818049},
    eprint    = {2605.23191},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-RankElastor.md](paper-RankElastor.md)

---

### [TokenFormer] TokenFormer: Unify the Multi-Field and Sequential Recommendation Worlds

- **arXiv**：2604.13737
- **机构**：腾讯
- **发表**：KDD/WWW-style Draft, 2025（arXiv 2026年4月）
- **日期**：2026-05-25（精读日期）
- **领域标签**：`CTR预估` `推荐系统` `统一建模` `序列推荐` `有效秩`
- **技术标签**：`SCP（序列坍塌传播）` `BFTS（底层全注意力-顶层滑动窗口）` `NLIR（非线性交互表示）` `滑动窗口注意力` `乘法门控`
- **核心增量**：识别并命名"序列坍塌传播"（SCP）——统一建模时低秩静态特征污染序列特征有效秩的失效模式；提出 BFTS（浅层全注意力建立全局上下文，深层滑动窗口专注时序精炼）+ NLIR（sigmoid 乘法门控保持秩丰富性），在腾讯广告在线 A/B 测试中实现 GMV +4.03%，serving 吞吐量 5.5 倍提升。
- **博导判决**：Accept（SCP 命名有价值，BFTS+NLIR 工程方案有清晰直觉和工业验证）
- **关联论文**：RankElastor（同为有效秩方向，同一团队）、RankUp（同为有效秩方向，同一团队）、RankMixer（基础架构）
- **BibTeX**：
  ```bibtex
  @article{zhou2026tokenformer,
    title         = {TokenFormer: Unify the Multi-Field and Sequential Recommendation Worlds},
    author        = {Zhou, Yifeng and Hu, Yuehong and Feng, Zhixiang and Pan, Junwei and Wu, Kaihui and Li, Hanyong and Zhang, Shangyu and Huang, Shudong and Zhu, Zhangbin and Yin, Chengguo and Gu, Haijie and Jiang, Jie},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2604.13737},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-TokenFormer.md](paper-TokenFormer.md)

---

### [RankUp] RankUp: Towards High-rank Representations for Large Scale Advertising Recommender Systems

- **arXiv**：2604.17878
- **机构**：腾讯
- **发表**：ACM Conference（arXiv 2026年4月）
- **日期**：2026-05-25（精读日期）
- **领域标签**：`CTR预估` `推荐系统Scaling` `embedding collapse` `多任务学习` `广告系统`
- **技术标签**：`随机置换分割` `多embedding范式` `全局token` `预训练embedding交叉集成` `任务特定token解耦` `有效秩`
- **核心增量**：从输入端扩充表示多样性来对抗 collapse：随机置换分割打破 token 相关性，多 embedding 扩充初始多样性，全局 token 防止深层退化，预训练 embedding 交叉集成注入外部先验，任务 token 解耦多任务干扰。微信视频号/公众号/朋友圈全量上线，GMV 分别提升 3.41%/4.81%/2.12%，新广告冷启动 GMV 最高提升 9.67%。
- **博导判决**：Accept（工业验证充分，五个机制设计有清晰直觉，GMV 提升显著）
- **关联论文**：RankElastor（同为有效秩方向，同一团队，互补视角）、TokenFormer（同为有效秩方向，同一团队）、RankMixer（基础架构和对比 baseline）
- **BibTeX**：
  ```bibtex
  @article{chen2026rankup,
    title         = {RankUp: Towards High-rank Representations for Large Scale Advertising Recommender Systems},
    author        = {Chen, Jin and Zhang, Shangyu and Hu, Bin and Zhou, Chao and Pan, Junwei and Xue, Gengsheng and Ning, Wentao and Weng, Gengyu and Zheng, Wang and Liu, Shaohua and Xu, Zeen and Mai, Chengyuan and Quan, Shijie and Jiang, Tingyu and Wang, Lifeng and Huang, Shudong and Yin, Chengguo and Gu, Haijie and Jiang, Jie},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2604.17878},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-RankUp.md](paper-RankUp.md)

---

### [Diff-eRank] Diff-eRank: A Novel Rank-Based Metric for Evaluating Large Language Models

- **arXiv**：2401.17139
- **机构**：上海交通大学 & 清华大学 & William & Mary
- **发表**：NeurIPS 2024
- **日期**：2024-01-30
- **领域标签**：`LLM评估` `有效秩` `信息论` `表示学习` `多模态对齐`
- **技术标签**：`eRank` `协方差矩阵` `矩阵熵` `Von Neumann熵` `降噪量化` `模态对齐评估`
- **核心增量**：提出 Diff-eRank——用训练前后隐藏表示有效秩的减少量来量化 LLM 的"降噪能力"，无需标注数据，随模型规模单调递增，与 loss 和准确率高度一致；同时提出基于 eRank 的多模态对齐评估指标。
- **博导判决**：Weak Accept（内在评估视角有价值，但只能在同一模型家族内部比较的局限未被正面讨论）
- **关联论文**：RankElastor、TokenFormer、RankUp（同用 eRank 但目的相反：推荐系统中 eRank 降低是病，LLM 训练中 eRank 降低是成功）
- **BibTeX**：
  ```bibtex
  @inproceedings{wei2024differank,
    title     = {Diff-eRank: A Novel Rank-Based Metric for Evaluating Large Language Models},
    author    = {Wei, Lai and Tan, Zhiquan and Li, Chenghai and Wang, Jindong and Huang, Weiran},
    booktitle = {Advances in Neural Information Processing Systems},
    series    = {NeurIPS '24},
    year      = {2024},
    eprint    = {2401.17139},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-Diff-eRank.md](paper-Diff-eRank.md)

---

### [Memento] Memento: Personalized RAG-Style Long-Retention Data Scaling for Online Ads Recommendation

- **arXiv**：2605.24051
- **机构**：Meta AI
- **发表**：arXiv 预印本（2026-05-22）
- **日期**：2026-05-22
- **领域标签**：`长期用户历史建模` `RAG推荐` `灾难性遗忘` `CTR预估` `广告系统`
- **技术标签**：`MMR检索` `Representation Memento` `Data Memento` `Ember-Affine` `Ember-Quadratic` `参数重置` `NormInt8量化` `时间分块`
- **核心增量**：把"历史扩展"重新定义为"信息检索问题"，用 RAG 范式将用户 365 天历史作为文档库、广告请求作为查询，通过 MMR 平衡相关性与多样性；双应用：Representation Memento 做推理时特征增强，Data Memento 做训练时回放对抗灾难性遗忘；生产 CTR +1%，CVR +1.2%，5–10× 资源效率优于线性扩展。
- **博导判决**：Weak Accept 偏 Accept（工程贡献扎实，RAG 类比有洞察力，但方法创新度有限，QPS 下降 trade-off 处理不够正面）
- **关联论文**：GenLI（同为长期用户历史建模，美团），TWIN/DV365（同为超长历史建模前作），SIM（GSU-ESU 框架），MMR 原论文（Carbonell 1998）
- **BibTeX**：
  ```bibtex
  @article{chen2026memento,
    title         = {Memento: Personalized RAG-Style Long-Retention Data Scaling for Online Ads Recommendation},
    author        = {Chen, Xiaoyu and Wang, Ruichen and Di, Jieming and Feng, Suofei and Abrar, Nafis and Kumari, Lilly and Tsui, Tony and Liu, Yilin and Lu, Yu and Patapati, Sowmya and Xiong, Junwei and Yang, Qiao and Sun, Dorothy and Cao, Yang and Chen, Victor and Chen, Pan and Sundarkumar, Ramsundar and Singh, Shivendra Pratap and Overwijk, Arnold and Leng, Ling and Ramasamy, Dinesh and Reddy, Sri and Malkin, Robert and Pandey, Sandeep},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2605.24051},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-Memento.md](paper-Memento.md)

---

### [SID-Collision] How Reliable Are Semantic-ID Tokenizer Comparisons in Generative Recommendation?

- **arXiv**：2605.25330
- **机构**：奥塔哥大学（新西兰）& 新南威尔士大学
- **发表**：arXiv 预印本（2026-05-25）
- **日期**：2026-05-26（精读日期）
- **领域标签**：`生成式推荐` `Semantic ID` `评估方法论` `向量量化` `碰撞问题`
- **技术标签**：`CCE（碰撞修正评估）` `ItemHit@K` `ItemNDCG@K` `ZCR（零碰撞重分配）` `匈牙利算法` `分数信用`
- **核心增量**：发现 SID 碰撞在实践中普遍存在（碰撞率高达 30.5%），导致 Hit@10 虚高最多 103.36%，并足以翻转 tokenizer 排名；提出 CCE（碰撞修正评估指标）和 ZCR（最小代价零碰撞重分配）两个工具，构建可信 tokenizer 评估框架。
- **博导判决**：Weak Accept 偏 Accept（问题定义清晰，工具设计简洁可靠，实验结论有冲击力；实验规模偏小，工业级验证缺失）
- **关联论文**：AdaSID（同为 SID 碰撞方向）、SID-Coord（同为 SID 方向）、QuaSID（碰撞惩罚前作）
- **BibTeX**：
  ```bibtex
  @article{zhang2026sidcollision,
    title         = {How Reliable Are Semantic-ID Tokenizer Comparisons in Generative Recommendation?},
    author        = {Zhang, Qian and Szymanski, Lech and Zhang, Haibo and Deng, Jeremiah D.},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2605.25330},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-SID-Collision.md](paper-SID-Collision.md)

---

### [DeGRe] DeGRe: Dense-supervised Generative Reranking for Recommendation

- **arXiv**：2605.25749
- **机构**：浙江大学 & 阿里巴巴 Rajax Network Technology（淘宝闪购）
- **发表**：KDD '26，2026年8月，济州岛，韩国
- **日期**：2026-05-25
- **领域标签**：`推荐重排序` `生成式重排序` `稠密监督` `离线-在线解耦` `工业推荐`
- **技术标签**：`累积回归` `Lookahead Evaluator` `beam search未曝光探索` `硬标签+软标签蒸馏` `序列加权` `用户引导解码` `候选约束解码`
- **核心增量**：把排列空间探索搬到离线，用累积回归 Lookahead Evaluator 的逐步价值估计作为稠密监督信号，蒸馏进轻量在线生成器，在线推理只需单次贪心解码；GMV +3.75%，延迟仅增加 14.8ms，已部署淘宝闪购。
- **博导判决**：Strong Accept（问题真实，方法有新意，工业验证充分，离线-在线解耦思路有普适价值）
- **关联论文**：GReF（直接对比基线）、NLGR（直接对比基线）、GoalRank（最强基线）、GenLI（同为阿里系工业推荐，不同阶段）
- **BibTeX**：
  ```bibtex
  @inproceedings{song2026degre,
    title     = {DeGRe: Dense-supervised Generative Reranking for Recommendation},
    author    = {Song, Chaotian and Zhang, Jingyao and Chen, Chenghao and Sang, Zisen and Zhao, Dehai and Cao, Guodong and Wu, Boxi and Cai, Deng and Jia, Jia},
    booktitle = {Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2},
    series    = {KDD '26},
    year      = {2026},
    doi       = {10.1145/3770855.3818363},
    eprint    = {2605.25749},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-DeGRe.md](paper-DeGRe.md)

---

### [SwAV] Unsupervised Learning of Visual Features by Contrasting Cluster Assignments

- **arXiv**：2006.09882
- **机构**：Inria & Facebook AI Research
- **发表**：NeurIPS 2020
- **日期**：2020-06-17
- **领域标签**：`自监督学习` `对比学习` `聚类` `视觉表示`
- **技术标签**：`交换预测` `prototype` `Sinkhorn-Knopp` `multi-crop` `equipartition` `在线聚类`
- **核心增量**：用可训练 prototype 作为中间桥梁，将 pairwise 特征比较替换为"交换预测聚类分配"，配合 Sinkhorn-Knopp 在线均匀分配和 multi-crop 策略，ResNet-50 达到 75.3% top-1（当时 SOTA），首次在所有 transfer task 上超越有监督预训练。
- **博导判决**：Strong Accept（方法优雅，实验充分，multi-crop 贡献有普适价值）
- **关联论文**：DINO（同一作者，直接继承 multi-crop）、MoCo（对比学习前作）、SimCLR（对比学习前作）、DeepCluster（离线聚类前作）
- **BibTeX**：
  ```bibtex
  @inproceedings{caron2020swav,
    title     = {Unsupervised Learning of Visual Features by Contrasting Cluster Assignments},
    author    = {Caron, Mathilde and Misra, Ishan and Mairal, Julien and Goyal, Priya and Bojanowski, Piotr and Joulin, Armand},
    booktitle = {Advances in Neural Information Processing Systems},
    series    = {NeurIPS '20},
    year      = {2020},
    eprint    = {2006.09882},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-SwAV.md](paper-SwAV.md)

---

### [DINO] Emerging Properties in Self-Supervised Vision Transformers

- **arXiv**：2104.14294
- **机构**：Facebook AI Research & Inria & Sorbonne University
- **发表**：ICCV 2021
- **日期**：2021-04-29
- **领域标签**：`自监督学习` `Vision Transformer` `self-distillation` `涌现属性`
- **技术标签**：`momentum teacher` `centering+sharpening` `EMA` `cross-entropy` `语义分割涌现` `k-NN特征`
- **核心增量**：发现自监督 ViT 的 self-attention map 自动包含语义分割信息（有监督 ViT 和 ConvNet 都没有），提出 DINO（self-distillation with no labels）——用 centering + sharpening 替代 contrastive loss 避免 collapse，momentum teacher 持续优于 student 提供高质量 target，ViT-B/8 达到 80.1% top-1。
- **博导判决**：Strong Accept（涌现属性发现有开创性，方法简洁优雅，实验全面深入）
- **关联论文**：SwAV（同一作者，multi-crop 直接继承）、BYOL（momentum encoder 前作）、MoCo v2（对比学习 baseline）、BEiT/MAE（后续 ViT 自监督方向）
- **BibTeX**：
  ```bibtex
  @inproceedings{caron2021dino,
    title     = {Emerging Properties in Self-Supervised Vision Transformers},
    author    = {Caron, Mathilde and Touvron, Hugo and Misra, Ishan and Jegou, Herv{\'e} and Mairal, Julien and Bojanowski, Piotr and Joulin, Armand},
    booktitle = {Proceedings of the IEEE/CVF International Conference on Computer Vision},
    series    = {ICCV '21},
    year      = {2021},
    eprint    = {2104.14294},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-DINO.md](paper-DINO.md)

---

### [UniPinRec] UniPinRec: Unifying Generative Retrieval and Ranking at Pinterest Scale

- **arXiv**：2606.00422
- **机构**：Pinterest
- **发表**：arXiv 预印本（2026-05-29，投稿中）
- **日期**：2026-05-29
- **领域标签**：`推荐系统` `召回排序统一` `生成式推荐` `KV缓存共享` `工业推荐`
- **技术标签**：`MAM（Masked Action Modeling）` `非交错序列` `跨阶段KV缓存` `GPU IPC共享内存` `混合训练样本` `Ray in-trainer join` `FP8量化` `flex attention`
- **核心增量**：首个在工业规模推荐系统中实现"全栈统一"（输入格式+模型+训练+服务）的系统，通过 MAM 消除交错序列、混合训练样本联合优化、跨阶段 KV 缓存共享，让召回和排序共享同一 Transformer backbone，在线 +1% 参与度，延迟 -11.1%，QPS +63.6%。
- **博导判决**：Weak Accept（价值在于系统性结论"全栈统一可行"，但三大贡献中 KV-cache sharing 是标准技术搬运、blended training 是常规多任务、真正有新意的只有 MAM 一个 trick，学术贡献密度不高）
- **关联论文**：PinRec（直接基础），HSTU（对比基线），OnePiece（部分统一前作），OneRec/OneRanker（端到端生成方向），RelayGR（KV 缓存跨阶段前作），GenLI（同为工业推荐，美团）
- **BibTeX**：
  ```bibtex
  @article{li2026unipinrec,
    title         = {UniPinRec: Unifying Generative Retrieval and Ranking at Pinterest Scale},
    author        = {Li, Hanyu and Hsu, Yi-Ping and Mantha, Aditya and Agarwal, Prabhat and Bhasin, Laksh and Wang, Jialu and Lin, Hongtao and Huang, Bella and Li, Yaxin and Li, Xinyi and Wang, Chuxi and Rajesh, Kousik and Razaghi, Hooshmand S. and Li, Shunyao and Qin, Zongyue and Yang, Jaewon and Li, James and Badani, Dhruvil Deven and Xu, Jiajing and Rosenberg, Charles},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2606.00422},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-UniPinRec.md](paper-UniPinRec.md)

---

### [DRQ] Decoupled Residual Quantization for Robust Semantic IDs in Recommendation

- **arXiv**：2606.01844
- **机构**：Shopee
- **发表**：Conference '26（ACM，2026年6月，具体会议待定）
- **日期**：2026-06-01
- **领域标签**：`推荐系统` `Semantic ID` `向量量化` `诊断框架` `item-to-item检索`
- **技术标签**：`期望重叠率Oπ` `有效码本容量Keff` `分布惩罚` `几何惩罚` `解耦VAE` `RQ-KMeans` `对比学习InfoNCE`
- **核心增量**：提出 $O_\pi$（期望重叠率）和 $K_\text{eff}$（有效码本容量）两个量化指标，把 SID 失效分解为分布惩罚和几何惩罚两个可分解的根因；DRQ 通过解耦 VAE（连续几何学习）和 K-Means（离散分布匹配）作为框架的 proof-of-concept 实现；实验揭示 SID 质量是多目标的，没有单一 tokenizer 在符号鲁棒性、重建保真度、行为软匹配三个目标上全面领先。
- **博导判决**：Weak Accept（框架贡献真实，诊断工具有实用价值，但单一工业数据集和各向同性噪声假设限制了结论普适性）
- **关联论文**：SID-Coord（同为 SID 方向）、AdaSID（同为 SID 量化质量方向）、SID-Collision（SID 评估方法论，互补）、RQ-VAE/TIGER（SID 基础工作）
- **BibTeX**：
  ```bibtex
  @inproceedings{wang2026drq,
    title     = {Decoupled Residual Quantization for Robust Semantic IDs in Recommendation},
    author    = {Wang, Xuesi and Wang, Junjie and Wang, Ziliang and Bian, Weijie and Zhang, Guanxing},
    booktitle = {Proceedings of Conference '26},
    series    = {Conference '26},
    year      = {2026},
    doi       = {10.1145/XXXXXX.XXXXXX},
    eprint    = {2606.01844},
    archivePrefix = {arXiv}
  }
  ```
- **文件**：[paper-DRQ.md](paper-DRQ.md)

---

### [DS-MLP] Dual-Stream MLP is All You Need for CTR Prediction

- **arXiv**：2606.04944
- **机构**：人民大学 & 字节跳动 & 美团
- **发表**：ACM Transactions on Knowledge Discovery from Data (TKDD), 2026
- **日期**：2026-06-03
- **领域标签**：`CTR预估` `知识蒸馏` `双流MLP` `特征交互` `推荐系统`
- **技术标签**：`显式-隐式特征交互` `GDCN教师模型` `批归一化对齐` `预测对齐` `独立embedding表` `两阶段训练`
- **核心增量**：通过知识蒸馏把复杂显式交叉网络（GDCN）的特征交互能力内化进 Main MLP，再用 Parallel MLP 补充隐式交互，配合 BN 隐状态对齐和独立 CTR 监督预测对齐，最终推理只需两个轻量 MLP，在 Criteo/Avazu/MovieLens 三个基准上超越所有现有方法（含 GDCN、FinalMLP、ECKD）。
- **博导判决**：Weak Accept（方法有效，实验扎实，但创新点偏工程组合，Teacher 选择是额外超参）
- **关联论文**：FinalMLP（同为双流 MLP 方向）、GDCN（Teacher 模型）、ECKD（同为 KD-based CTR 方向）、GenLI（同为美团 CTR 工业落地）
- **BibTeX**：
  ```bibtex
  @article{ou2026dsmlp,
    title         = {Dual-Stream MLP is All You Need for CTR Prediction},
    author        = {Ou, Kesha and Tian, Zhen and Zhao, Wayne Xin and Zhang, Long and Chen, Sheng and Wen, Ji-Rong},
    journal       = {ACM Transactions on Knowledge Discovery from Data},
    year          = {2026},
    doi           = {10.1145/3819238},
    eprint        = {2606.04944},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-DS-MLP.md](paper-DS-MLP.md)

---

### [OneReason] OneReason Technical Report

- **arXiv**：2606.06260
- **机构**：快手（OneRec Team）
- **发表**：arXiv 预印本（2026-06-04）
- **日期**：2026-06-08（精读日期）
- **领域标签**：`生成式推荐` `推荐推理` `Chain-of-Thought` `itemic token` `快手工业落地`
- **技术标签**：`感知+认知二分` `R0-R3诊断阶梯` `OneReason-Bench` `三阶段预训练578B` `三段式R3-CoT` `溯因推理` `specialize-then-unify` `GRPO` `RFT/MOPD` `Fast-Slow Thinking`
- **核心增量**：把推荐推理失效归因为感知（itemic token 语义）和认知（行为→兴趣结构）两块地基未打牢，用预训练补感知、SFT 补认知、RL（specialize-then-unify）调思考，第一次让思考模式在多个真实业务榜单上稳定超过不思考模式；另发现 CoT 监督能反哺非思考推理。
- **博导判决**：Strong Accept（正面解决动摇整条技术路线的真问题，方案可诊断可施工可验证，首次兑现“思考有用”，学术单点创新密度不顶尖但系统性贡献足够）
- **关联论文**：OneRec/OneRec-Think/OpenOneRec（同源前作与探路）、TIGER/LC-Rec（itemic token 基础与对比基线）、HSTU/SASRec（ID-based 基线）、Diff-eRank（同为表示/推理能力分析，跨领域）
- **BibTeX**：
  ```bibtex
  @article{onerec2026onereason,
    title         = {OneReason Technical Report},
    author        = {{OneRec Team}},
    journal       = {arXiv preprint},
    year          = {2026},
    eprint        = {2606.06260},
    archivePrefix = {arXiv},
    primaryClass  = {cs.IR}
  }
  ```
- **文件**：[paper-OneReason.md](paper-OneReason.md)

---

## 主题聚类

### 🔵 Semantic ID 方向
SID-Coord · AdaSID · SID-Collision · DRQ

### 🟢 用户兴趣建模 / CTR 预估 / 推荐 Scaling
GenLI · LWGR · RankElastor · TokenFormer · RankUp · Memento · DS-MLP

### 🟠 推荐重排序 / 生成式重排序
DeGRe

### 🔷 召回排序全栈统一
UniPinRec

### 🧠 生成式推荐推理
OneReason

### 🟡 基础架构创新（LLM/生成模型）
Attention Residuals · ELF

### 🔴 AI 科研自动化 / Agentic 系统
AutoSOTA · harness-design · claude-code-arch

### 🟣 LLM 评估 / 表示分析
Diff-eRank

### 🟤 自监督视觉表示学习
SwAV · DINO

---

## 技术谱系速查

**长期行为序列建模演进**：
MIMN（离线memory压缩）→ SIM（两阶段GSU-ESU）→ ETA/SDIM（hash检索）→ TWIN（GSU-ESU一致性）→ **GenLI（生成+查表）** · **Memento（RAG范式+MMR检索，365天）**

**Semantic ID 演进**：
RQ-VAE/TIGER（基础量化）→ SPM/Prefix-Ngram（SID特征化）→ QuaSID（碰撞惩罚）→ **AdaSID（自适应碰撞）** · **SID-Coord（HID-SID协调）** · **SID-Collision（评估方法论纠偏）** · **DRQ（诊断框架+解耦量化）**

**LLM 知识融合演进**：
KAR/SeRALM（固定 prompt + 无约束融合）→ **LWGR（个性化软指令 + 拉格朗日约束融合）**

**深度维度信息流**：
标准残差（固定权重累加）→ **Attention Residuals（softmax注意力替换残差）**

**连续语言扩散模型**：
离散DLM（MDLM等）→ 连续DLM（有per-step离散监督）→ **ELF（无离散约束+共享decoder）**

**推荐 Scaling / embedding collapse 演进**：
RankMixer（块转置+GELU-FFN）→ **RankElastor（参数化全混合+GLU-FFN）** · **RankUp（输入端多样性扩充）** · **TokenFormer（统一建模+SCP对抗）**

**eRank 工具的双重用途**：
**Diff-eRank**（LLM 评估，eRank 降低 = 成功，降噪能力）↔ **RankElastor/TokenFormer/RankUp**（推荐系统，eRank 降低 = 失败，collapse 问题）

**生成式重排序演进**：
单阶段贪心（DLCM/PRM）→ 生成器-评估器范式（GRN/PIER，目标不一致）→ 端到端生成式（GReF/NLGR/GoalRank，稀疏奖励+启发式标签）→ **DeGRe（离线探索+稠密监督蒸馏，单次贪心解码）**

**自监督视觉表示学习演进**：
离线聚类（DeepCluster）→ 对比学习（MoCo/SimCLR，pairwise比较+memory bank）→ **SwAV（在线聚类+交换预测+multi-crop）** → BYOL（momentum encoder+无负样本）→ **DINO（self-distillation+centering+sharpening，ViT涌现语义分割）** → DINOv2/MAE（大规模预训练）

**召回排序统一演进**：
独立模型（各自 Transformer，重复编码）→ 统一架构但分开训练（HSTU，交错序列，两种输入格式）→ 统一训练但未同时部署（OnePiece，只部署一个阶段）→ 端到端生成绕过漏斗（OneRec/OneRanker，替换整条流水线）→ **UniPinRec（全栈统一：MAM+混合训练+KV缓存共享，drop-in 替换现有基础设施）**

**CTR 知识蒸馏演进**：
DAGFM（DAG 因子机缩小 Teacher-Student 差距）→ ECKD（多 Teacher 集成蒸馏）→ **DS-MLP（蒸馏显式交互进 MLP + 双流对齐，推理时丢弃 Teacher）**

**生成式推荐“思考”演进**：
OneRec（只会一口气生成，System-1）→ OneRec-Think/OpenOneRec（硬接 CoT，但思考模式≤不思考）→ **OneReason（感知+认知地基 + specialize-then-unify，首次思考模式>不思考）**
