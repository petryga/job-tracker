import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "features/auth/RequireAuth";

const HomePage = lazy(() => import("../features/homePage/HomePage"));
const Board = lazy(() => import("../features/boardPage/Board"));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/:boardID"
          element={
            <RequireAuth>
              <Board />
            </RequireAuth>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
