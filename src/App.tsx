import './App.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Root from './layout/Root';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/chat/Home';
import Chat from './pages/chat/Chat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="chat">
        <Route path=":id" element={<Chat />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
