import { Link, Route, Routes } from 'react-router-dom';
import { PostPage } from './pages/PostPage.jsx';
import { PostsPage } from './pages/PostsPage.jsx';

export default function App() {
  return (
    <div className="shell">
      <header className="app-header">
        <h1>
          <Link to="/">Blog Reader</Link>
        </h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PostsPage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
        </Routes>
      </main>
    </div>
  );
}
