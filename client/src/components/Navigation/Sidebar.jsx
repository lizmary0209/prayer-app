import FaithCard from "../UI/FaithCard";
import "./Sidebar.css";

const faithPrompts = [
  {
    title: "Need a little faith?",
    hint: "Hover to reveal a verse",
    verse:
      "Matthew 17:20 - Faith as small as a mustard seed can move mountains.",
  },
  {
    title: "Peace for anxious moments",
    hint: "Hover to reveal a verse",
    verse:
      "Isaiah 41:10 - Do not fear, for I am with you; I will strengthen you.",
  },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__section">
        <h3 className="sidebar__title">Encouragement</h3>
        <p className="sidebar__subtitle">A gentle lift when you need it.</p>
      </div>

      <div className="sidebar__cards">
        {faithPrompts.map((item) => (
          <FaithCard key={item.title} {...item} />
        ))}
      </div>

      <div className="sidebar__section sidebar__section--small">
        <h4 className="sidebar__title">Quick filters (placeholder)</h4>
        <div className="chips">
          <button className="chip">All</button>
          <button className="chip">Answered</button>
          <button className="chip">Needs Prayer</button>
        </div>
      </div>
    </div>
  );
}
