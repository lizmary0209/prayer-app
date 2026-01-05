import Header from "../Navigation/Header";
import Sidebar from "../Navigation/Sidebar";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <main className="app__main">{children}</main>
        <aside className="app__aside">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
