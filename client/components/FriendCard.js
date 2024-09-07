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
    <li className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-800">{friend.name}</p>
      <p className="text-sm text-gray-600">
        Time spent being productive: {formatTime(friend.productivityTime)}
      </p>
    </li>
  );
};

export default FriendCard;
