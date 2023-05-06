import { Route, Routes } from "react-router-dom";
import Board from "../features/boardPage/Board";
import HomePage from "../features/homePage/HomePage";

const user = localStorage.getItem("token");

function App() {
  if (!user) {
    window.location.replace("/");
  }

  return (
    <Routes>
      {user && <Route path="/home" element={<HomePage />} />}
      {user && <Route path="/:boardID" element={<Board />} />}
    </Routes>
  );
}

export default App;
