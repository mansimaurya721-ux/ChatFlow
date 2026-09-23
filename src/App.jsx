import { useEffect, useState } from "react";
import "./App.css";

import socket from "./services/socket";
import { getCurrentUser } from "./services/authService";
import { getUsers } from "./services/userService";
import { createConversation } from "./services/conversationService";

import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [conversation, setConversation] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.log(
          "No logged-in user:",
          error.message
        );

        // Remove invalid/expired token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==========================================
  // LOAD ALL USERS
  // ==========================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadUsers = async () => {
      try {
        setUsersLoading(true);

        const data = await getUsers();

        setUsers(data);

        // Select first user automatically
        if (data.length > 0) {
          setSelectedUser(data[0]);
        } else {
          setSelectedUser(null);
        }
      } catch (error) {
        console.error(
          "Users loading error:",
          error.message
        );
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [user]);

  // ==========================================
  // CREATE / GET CONVERSATION
  // ==========================================

  useEffect(() => {
    if (!user || !selectedUser) {
      return;
    }

    const loadConversation = async () => {
      try {
        setConversationLoading(true);

        setConversation(null);
        setMessages([]);

        const data = await createConversation(
          selectedUser.id
        );

        setConversation(data);
      } catch (error) {
        console.error(
          "Conversation loading error:",
          error.message
        );

        setConversation(null);
        setMessages([]);
      } finally {
        setConversationLoading(false);
      }
    };

    loadConversation();
  }, [user, selectedUser]);

  // ==========================================
  // LOAD CONVERSATION MESSAGES
  // ==========================================

  useEffect(() => {
    if (!user || !conversation) {
      return;
    }

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found"
          );
        }

        const response = await fetch(
          `http://localhost:5000/api/messages/${conversation.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load messages"
          );
        }

        setMessages(data.messages || []);
      } catch (error) {
        console.error(
          "Message loading error:",
          error.message
        );

        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [user, conversation]);

  // ==========================================
  // SOCKET.IO
  // ==========================================

  useEffect(() => {
    if (!user || !conversation) {
      return;
    }

    const conversationId =
      Number(conversation.id);

    // Make sure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join selected conversation
    socket.emit(
      "joinConversation",
      conversationId
    );

    // Receive new message
    const handleNewMessage = (newMessage) => {
      if (
        Number(newMessage.conversationId) ===
        conversationId
      ) {
        setMessages((previousMessages) => {
          // Prevent duplicate messages
          const alreadyExists =
            previousMessages.some(
              (msg) =>
                msg.id === newMessage.id
            );

          if (alreadyExists) {
            return previousMessages;
          }

          return [
            ...previousMessages,
            newMessage
          ];
        });
      }
    };

    socket.on(
      "newMessage",
      handleNewMessage
    );

    // Cleanup listener
    return () => {
      socket.off(
        "newMessage",
        handleNewMessage
      );
    };
  }, [user, conversation]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = () => {
    if (
      !message.trim() ||
      !user ||
      !conversation
    ) {
      return;
    }

    socket.emit(
      "sendMessage",
      {
        conversationId:
          conversation.id,

        senderId:
          user.id,

        content:
          message.trim()
      }
    );

    setMessage("");
  };

  // ==========================================
  // HANDLE ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    socket.disconnect();

    setUser(null);
    setUsers([]);
    setSelectedUser(null);
    setConversation(null);
    setMessages([]);
    setMessage("");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="loading-spinner"></div>

          <h2>
            Loading ChatFlow...
          </h2>

          <p>
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN
  // ==========================================

  if (!user) {
    return <Login />;
  }

  // ==========================================
  // CHATFLOW
  // ==========================================

  return (
    <div className="chatflow-app">

      {/* ==========================================
                HEADER
            ========================================== */}

      <header className="chat-header">

        <div className="header-brand">
          <h1>
            ChatFlow
          </h1>

          <p>
            Logged in as{" "}
            <strong>
              {user.name}
            </strong>
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* ==========================================
                MAIN CHAT LAYOUT
            ========================================== */}

      <div className="chat-layout">

        {/* ==========================================
                    USERS SIDEBAR
                ========================================== */}

        <aside className="users-sidebar">

          <div className="sidebar-header">

            <div>
              <h2>
                Conversations
              </h2>

              <p>
                {users.length}{" "}
                {users.length === 1
                  ? "user"
                  : "users"}
              </p>
            </div>

          </div>

          <div className="users-list">

            {usersLoading ? (
              <div className="sidebar-message">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="sidebar-message">
                No users found.
              </div>
            ) : (
              users.map(
                (otherUser) => (
                  <button
                    key={
                      otherUser.id
                    }
                    className={
                      selectedUser?.id ===
                        otherUser.id
                        ? "user-card active"
                        : "user-card"
                    }
                    onClick={() =>
                      setSelectedUser(
                        otherUser
                      )
                    }
                  >

                    <div className="user-avatar">
                      {otherUser.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="user-info">

                      <strong>
                        {
                          otherUser.name
                        }
                      </strong>

                      <span
                        className={
                          otherUser.status ===
                            "online"
                            ? "status-online"
                            : "status-offline"
                        }
                      >
                        {otherUser.status ||
                          "offline"}
                      </span>

                    </div>

                  </button>
                )
              )
            )}

          </div>

        </aside>

        {/* ==========================================
                    CHAT AREA
                ========================================== */}

        <main className="chat-container">

          {selectedUser ? (
            <>

              {/* CHAT HEADER */}

              <div className="chat-title">

                <div className="user-avatar large">
                  {selectedUser.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2>
                    {
                      selectedUser.name
                    }
                  </h2>

                  <p
                    className={
                      selectedUser.status ===
                        "online"
                        ? "status-online"
                        : "status-offline"
                    }
                  >
                    {selectedUser.status ||
                      "offline"}
                  </p>
                </div>

              </div>

              {/* ==========================================
                                CONVERSATION LOADING
                            ========================================== */}

              {conversationLoading ? (
                <div className="empty-chat">

                  <div className="loading-spinner small"></div>

                  <p>
                    Opening conversation...
                  </p>

                </div>

              ) : conversation ? (
                <>

                  {/* ==========================================
                                        MESSAGES
                                    ========================================== */}

                  <div className="messages-container">

                    {messagesLoading ? (
                      <div className="messages-state">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="messages-state">
                        <h3>
                          No messages yet
                        </h3>

                        <p>
                          Start the conversation.
                        </p>
                      </div>
                    ) : (
                      messages.map(
                        (msg) => {

                          const isMyMessage =
                            Number(
                              msg.sender?.id
                            ) ===
                            Number(
                              user.id
                            );

                          return (
                            <div
                              key={
                                msg.id
                              }
                              className={
                                isMyMessage
                                  ? "message-row sent"
                                  : "message-row received"
                              }
                            >

                              <div className="message-bubble">

                                <strong>
                                  {
                                    msg.sender
                                      ?.name ||
                                    "User"
                                  }
                                </strong>

                                <p>
                                  {
                                    msg.content
                                  }
                                </p>

                                {msg.createdAt && (
                                  <span className="message-time">
                                    {new Date(
                                      msg.createdAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      }
                                    )}
                                  </span>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )
                    )}

                  </div>

                  {/* ==========================================
                                        MESSAGE INPUT
                                    ========================================== */}

                  <div className="message-input-area">

                    <input
                      type="text"
                      placeholder={
                        `Message ${selectedUser.name}...`
                      }
                      value={
                        message
                      }
                      onChange={(
                        e
                      ) =>
                        setMessage(
                          e.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                    />

                    <button
                      onClick={
                        sendMessage
                      }
                      disabled={
                        !message.trim()
                      }
                    >
                      Send
                    </button>

                  </div>

                </>

              ) : (
                <div className="empty-chat">

                  <h2>
                    Unable to open conversation
                  </h2>

                  <p>
                    Please try selecting
                    the user again.
                  </p>

                </div>
              )}

            </>
          ) : (

            <div className="empty-chat">

              <h2>
                Welcome to ChatFlow
              </h2>

              <p>
                Select a user to
                start chatting.
              </p>

            </div>

          )}

        </main>

      </div>
    </div>
  );
}

export default App;