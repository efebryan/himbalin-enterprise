import React, { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { MdOutlineWatchLater, MdPublish, MdUnpublished, MdDeleteOutline } from "react-icons/md";
import { supabase } from "../../lib/supabase";
import { formatDistanceToNow } from "date-fns";

const Reviews = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ published: !currentStatus })
        .eq("id", id);
      
      if (!error) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, published: !currentStatus } : msg))
        );
      }
    } catch (err) {
      console.error("Failed to update publish status", err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      
      if (!error) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">Customer Reviews & Feedback</h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          View and manage all customer inquiries and feedback.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#F4A623]/10 rounded-lg text-[#F4A623]">
                <HiOutlineChatBubbleLeftEllipsis className="text-xl" />
             </div>
             <h2 className="text-lg font-bold text-[#2B1A12]">All Messages</h2>
          </div>
          <span className="text-sm font-semibold text-gray-500">
             Total: {messages.length}
          </span>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-400 font-medium">Loading feedback...</div>
          ) : messages.length === 0 ? (
            <div className="p-10 text-center">
              <HiOutlineChatBubbleLeftEllipsis className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No feedback or messages received yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-6 transition-colors hover:bg-gray-50 flex flex-col md:flex-row gap-4 md:items-start ${
                  !msg.published ? 'bg-[#F4A623]/5' : 'bg-white'
                }`}
              >
                {/* Avatar Initial */}
                <div className="shrink-0 hidden md:flex w-10 h-10 rounded-full bg-[#2B1A12] text-white items-center justify-center font-bold text-lg">
                  {msg.name?.charAt(0).toUpperCase() || '?'}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1 gap-2">
                    <h3 className="font-bold text-[#2B1A12] text-base flex items-center gap-2">
                      {msg.name}
                      {msg.published && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-700 uppercase tracking-wider font-bold">Published</span>
                      )}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0">
                      <MdOutlineWatchLater />
                      {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : 'Unknown date'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium mb-3">
                    <a href={`mailto:${msg.email}`} className="hover:text-[#F4A623] transition-colors">{msg.email}</a>
                    {msg.subject && <span className="mx-2">• {msg.subject}</span>}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed shadow-sm">
                    {msg.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2 mt-3 md:mt-0">
                  <button 
                    onClick={() => togglePublish(msg.id, msg.published)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all shadow-sm ${
                      msg.published 
                        ? "bg-white border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-500" 
                        : "bg-white border-[#F4A623] text-[#F4A623] hover:bg-[#F4A623] hover:text-white"
                    }`}
                  >
                    {msg.published ? (
                      <><MdUnpublished className="text-sm" /> Unpublish</>
                    ) : (
                      <><MdPublish className="text-sm" /> Publish</>
                    )}
                  </button>
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    title="Delete review"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <MdDeleteOutline className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Reviews;
