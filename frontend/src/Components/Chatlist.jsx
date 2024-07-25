import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Chatlist.css'; // Import the CSS file for styling

const ChatList = (users, setSelectedUser) => {
    return (
        <div className="chat-container">
            <div className="chat-list-container">
                <h2>Friends</h2>
                <ul className="user-list">

                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className='user-item'
                        >
                            <div className='user-link'>
                                <Link to={`/Chat/${user.id}`}>
                                    {user.username}
                                </Link>
                            </div>
                        </li>
                    ))}

                </ul>
            </div>
        </div>

    );
};

export default ChatList;