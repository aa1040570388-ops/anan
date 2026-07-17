/**
 * supabase-sync.js
 * GitHub Pages / Vercel 静态网页可用的 Supabase 登录会话连接器。
 *
 * 使用方法：
 * 1. 在下方填写 Supabase Project URL 和 anon public key。
 * 2. 不要填写 service_role key，也不要把管理员密钥上传到 GitHub。
 * 3. Auth > Users 是用户管理页面，不是上传 JS 文件的位置。
 */
(() => {
  "use strict";

  const CONFIG = {
    url: "https://luowiojyippzopemiqwv.supabase.co",
    anonKey: "请填写_SUPABASE_ANON_PUBLIC_KEY",
    storageKey: "ceq-medical-price-auth"
  };

  const state = { client: null, session: null, ready: false };
  const isConfigured = () => CONFIG.anonKey && !CONFIG.anonKey.startsWith("请填写_");

  async function loadLibrary() {
    if (window.supabase?.createClient) return window.supabase;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Supabase JS 加载失败"));
      document.head.appendChild(script);
    });
    return window.supabase;
  }

  async function init() {
    if (!isConfigured()) {
      console.info("supabase-sync.js：尚未填写 anon public key，网页将以公开静态模式运行。");
      return null;
    }
    const lib = await loadLibrary();
    state.client = lib.createClient(CONFIG.url, CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: CONFIG.storageKey
      }
    });
    const { data, error } = await state.client.auth.getSession();
    if (error) throw error;
    state.session = data.session;
    state.ready = true;
    state.client.auth.onAuthStateChange((_event, session) => {
      state.session = session;
      window.dispatchEvent(new CustomEvent("ceq:supabase-auth", { detail: { session } }));
    });
    window.dispatchEvent(new CustomEvent("ceq:supabase-ready", { detail: { session: state.session } }));
    return state.client;
  }

  window.CEQSupabase = {
    init,
    getClient: () => state.client,
    getSession: () => state.session,
    signIn: async (email, password) => {
      if (!state.client) await init();
      if (!state.client) throw new Error("请先在 supabase-sync.js 填写 anon public key");
      return state.client.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      if (!state.client) return;
      return state.client.auth.signOut();
    }
  };

  init().catch(error => console.error("Supabase 初始化失败：", error));
})();
