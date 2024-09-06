"use client"; // Mark this as a Client Component

const FriendCard = ({ friend }) => {
  return (
    <li className="mb-2 border-b border-gray-200 pb-2">
      <p className="text-lg font-semibold">{friend.name}</p>
      <p className="text-sm text-gray-600">
        Time spent being productive: {friend.sessionTime} hours
      </p>
    </li>
  );
};

export default FriendCard;
