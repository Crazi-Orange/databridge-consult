'use client';

import { useState, useEffect } from 'react';
import { fetchMessages, createMessage } from 'app/lib/api';
import { Message } from 'app/types/database.types';

export default function UserMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => setError('Failed to load messages'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newMessage = await createMessage({
        content,
        receiver_id: receiverId,
        type: 'user',
      });
      setMessages([...messages, newMessage]);
      setContent('');
      setReceiverId('');
      setSuccess('Message sent successfully!');
    } catch (error) {
      setError('Failed to send message. Please try again.');
    }
  };

  const getMessageTypeStyle = (type: Message['type']) => {
    switch (type) {
      case 'system':
        return 'bg-gray-100';
      case 'whatsapp':
        return 'bg-green-100';
      case 'user':
        return 'bg-blue-100';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No messages found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-4 ${getMessageTypeStyle(msg.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-grow">
                        <p className="text-sm text-gray-600 mb-2">
                          From: {msg.sender_id} • To: {msg.receiver_id}
                        </p>
                        <p className="text-gray-800">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver ID
                </label>
                <input
                  type="text"
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  placeholder="Enter receiver's ID"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Type your message here"
                  className="w-full p-2 border rounded h-32 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}