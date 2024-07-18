import { createBrowserRouter } from "react-router-dom";
import Main from "./pages/main.jsx";
import ItemDetail from "./pages/itemDetail.jsx";
import Chat from "./pages/chat.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/items/:itemId",
    element: <ItemDetail />,
  },
  {
    path: "/chat/:roomId",
    element: <Chat />,
  },
]);
