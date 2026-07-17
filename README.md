# 医美价格表 GitHub 版

包含：

- `index.html`：已移除全部可视化编辑、内联编辑、新建、移动、复制和删除功能。
- `supabase-sync.js`：Supabase 登录会话连接器；默认未启用，需要填写项目的 anon public key。

## 上传到 GitHub Pages

1. 新建 GitHub 仓库。
2. 把 `index.html` 和 `supabase-sync.js` 上传到仓库根目录。
3. 在仓库 `Settings → Pages` 中选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/root`。

## Supabase 注意

`https://supabase.com/dashboard/project/luowiojyippzopemiqwv/auth/users` 是管理用户的页面，不能上传 JavaScript 文件。
网页文件上传 GitHub；Supabase 只负责登录和数据服务。

在 Supabase Dashboard 的 `Project Settings → API` 找到：

- Project URL
- anon / publishable public key

把 public key 填入 `supabase-sync.js` 的 `anonKey`。绝对不要把 `service_role` 密钥上传到 GitHub。
