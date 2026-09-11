import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-domain.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";

function createMockChannel(name: string) {
  const channel: any = {
    name,
    on: () => channel,
    subscribe: (cb?: Function) => {
      if (typeof cb === "function") cb("SUBSCRIBED");
      return channel;
    },
    send: async () => "ok",
    unsubscribe: async () => "ok",
  };
  return channel;
}

const mockUser = {
  id: "guest-etudiant-id",
  email: "etudiant@hech.be",
  user_metadata: { display_name: "Étudiant HECh", avatar_color: "#05b9b6" },
};

const mockSession = {
  access_token: "guest-token",
  user: mockUser,
};

let _browser: any;

export function getSupabaseBrowser() {
  if (!_browser) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      _browser = {
        auth: {
          getUser: async () => ({ data: { user: mockUser }, error: null }),
          getSession: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
          signOut: async () => ({ error: null }),
          signInWithOtp: async () => ({ error: null }),
          onAuthStateChange: (cb?: Function) => {
            if (typeof cb === "function") {
              setTimeout(() => cb("SIGNED_IN", mockSession), 0);
            }
            return { data: { subscription: { unsubscribe: () => {} } } };
          },
        },
        channel: (name: string) => createMockChannel(name),
        removeChannel: (_channel: any) => {},
      };
    } else {
      _browser = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return _browser;
}

export function getSupabaseAdmin() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
