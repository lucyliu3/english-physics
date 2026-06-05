export default function TopNav({ title, onBack, rightSlot }) {
  return (
    <div className="top-nav">
      <button className="back" onClick={onBack}>←</button>
      <span className="title">{title}</span>
      <span className="right">{rightSlot}</span>
    </div>
  );
}
