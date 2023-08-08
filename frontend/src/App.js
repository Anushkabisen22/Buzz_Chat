import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import ChatsPage from './screens/ChatsPage';
function App() {
  return (
    <div className="App">
    <Routes>
    <Route exact path="/" Component={LoginPage} />
    <Route exact path="/chats" Component={ChatsPage}/>
    </Routes>
    </div>
  );
}

export default App;
