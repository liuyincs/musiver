---
description: 版本总结
agent: build
---

依次执行以下步骤：

1. 检查 `gh` cli 是否可用，是否已登录。如果没有，提示用户并立即退出
2. 使用提问工具询问用户需要总结测试版还是正式版
3. 使用 `gh` 获取 `gitbobobo/musiver` 仓库最近的版本标签，以及同类型的上一个版本标签
4. 获取两个标签之间的全部提交历史，依次筛选出可被用户感知的更新内容，隐藏技术细节
5. 参考 `src/types/releases.ts` 修改 `src/data/releases/stable.json` 或 `src/data/releases/beta.json`
6. 最后输出一份 Github Release 风格的更新内容，用代码块包裹

## 注意事项

- 修改 `stable.json` 或 `beta.json` 时，更新内容必须支持国际化。即同步修改 `i18n/en/code.json` 和 `i18n/zh-Hans/code.json`，并删除不再使用的key。
- **严格区分更新内容属于哪些平台**（Android/HarmonynyOS/iOS/macOS/Windows/Web），并增加对应平台的 VersionInfo，不得遗漏
- `beta.json` 旧的 VersionInfo 需要保留，只在原来基础上新增
- 新增的 VersionInfo 下载地址留空，以下情况例外：web 端固定填 `https://web.musiver.cn`