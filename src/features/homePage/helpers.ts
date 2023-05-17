export const SUGGESTIONS = [
  { id: "1", text: "Job Search", icon: "⭐️" },
  {
    id: "2",
    text: "To Do List",
  },
];

export const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.reload();
};
