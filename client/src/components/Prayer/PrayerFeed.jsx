import PrayerCard from "./PrayerCard";
import "./Prayer.css";

const mockPrayers = [
  {
    id: "1",
    title: "Peace and focus",
    body: "Praying for peace and focus with school and work. I want to stay consistent and not overwhelmed.",
    tag: "Needs prayer",
    createdAt: "Today",
  },
  {
    id: "2",
    title: "Family unity",
    body: "Please pray for patience, better communication, and unity in my home.",
    tag: "Ongoing",
    createdAt: "Yesterday",
  },
  {
    id: "3",
    title: "Guidance",
    body: "Praying for direction and confidence as I keep learning and growing.",
    tag: "Growth",
    createdAt: "This week",
  },
];

export default function PrayerFeed() {
  return (
    <section className="feed">
      <div className="feed_header">
        <div>
          <h1 className="feed__title">Prayer Feed</h1>
          <p className="feed__subtitle">
            A gentle space to write, reflect, and pray.
          </p>
        </div>
        <button className="btn btn--primary" type="button">
          Add Prayer
        </button>
      </div>

      <div className="feed__grid">
        {mockPrayers.map((p, idx) => (
          <PrayerCard key={p.id} prayer={p} delayMs={idx * 60} />
        ))}
      </div>
    </section>
  );
}
