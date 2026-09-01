export const SUGGESTIONS = [
  { id: "1", text: "Job Search", icon: "⭐️" },
  {
    id: "2",
    text: "To Do List",
  },
];

import { supabase } from "lib/supabaseClient";

export const handleLogout = async () => {
  await supabase?.auth.signOut();
  window.location.reload();
};
