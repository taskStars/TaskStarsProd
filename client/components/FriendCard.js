"use client"; // Mark this as a Client Component

// Utility function to format seconds into hours, minutes, and seconds
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs} hrs ${mins} mins ${secs} secs`;
};

const FriendCard = ({ friend }) => {
  return (
    <li className="mb-2 border-b border-gray-200 pb-2">
      <p className="text-lg font-semibold">{friend.name}</p>
      <p className="text-sm text-gray-600">
        Time spent being productive: {formatTime(friend.productivityTime)}
      </p>
    </li>
  );
};

export default FriendCard;
