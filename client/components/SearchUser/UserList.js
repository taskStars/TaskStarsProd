"use client";
import UserCard from "./UserCard";

const UserList = ({ users, onAddFriend }) => {
  // Sort users in descending order (most recently found)
  const sortedUsers = [...users].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <ul>
      {sortedUsers.map((user) => (
        <UserCard key={user._id} user={user} onAddFriend={onAddFriend} />
      ))}
    </ul>
  );
};

export default UserList;
