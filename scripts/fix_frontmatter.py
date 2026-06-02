#!/usr/bin/env python3
"""修复 frontmatter 中的错误转义 \' -> '"""
import os
import glob

blog_dir = '/Users/wangshuli03/Agent/paper-blog/blog-wechat'

for f in glob.glob(os.path.join(blog_dir, '*.md')):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # 只修复 frontmatter 部分（--- 之间）
    if content.startswith('---'):
        end = content.find('---', 3)
        if end > 0:
            frontmatter = content[:end+3]
            rest = content[end+3:]
            fixed_fm = frontmatter.replace("\\'", "'")
            if fixed_fm != frontmatter:
                with open(f, 'w', encoding='utf-8') as fp:
                    fp.write(fixed_fm + rest)
                print(f'Fixed: {os.path.basename(f)}')

print('Done')
