import React, { useState, useEffect } from "react";
import { FiMail, FiSend, FiUsers, FiCheckCircle } from "react-icons/fi";
import { getCustomers } from "../../lib/api";
import { supabase } from "../../lib/supabase";

const EmailClients = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [customEmailInput, setCustomEmailInput] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        // Remove duplicates if multiple orders from same email
        const uniqueCustomers = [];
        const seenEmails = new Set();
        (data || []).forEach(c => {
          if (c.email && !seenEmails.has(c.email)) {
            seenEmails.add(c.email);
            uniqueCustomers.push(c);
          }
        });
        setCustomers(uniqueCustomers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmails(customers.map(c => c.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectOne = (email) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleAddCustomEmail = (e) => {
    e.preventDefault();
    const email = customEmailInput.trim();
    if (!email) return;
    
    // basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ visible: true, message: "Please enter a valid email address.", type: "error" });
      return;
    }

    if (customers.find(c => c.email === email)) {
      if (!selectedEmails.includes(email)) {
        setSelectedEmails([...selectedEmails, email]);
      }
    } else {
      setCustomers([{ id: `custom-${Date.now()}`, email, name: 'Custom Recipient' }, ...customers]);
      setSelectedEmails([...selectedEmails, email]);
    }
    
    setCustomEmailInput("");
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      setToast({ visible: true, message: "Please select at least one recipient.", type: "error" });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setToast({ visible: true, message: "Please enter a subject and message.", type: "error" });
      return;
    }

    setSending(true);
    setSendProgress({ current: 0, total: selectedEmails.length });

    let successCount = 0;
    
    // Format message text as HTML paragraphs
    const formattedHtml = message.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '<br/>').join('');
    
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        ${formattedHtml}
        <br/>
        <p>Best regards,<br/><strong>Himbalin Enterprise</strong></p>
      </div>
    `;

    // Loop through selected emails and send sequentially to avoid rate limits
    for (let i = 0; i < selectedEmails.length; i++) {
      const to = selectedEmails[i];
      try {
        await supabase.functions.invoke('send-email', {
          body: { to, subject, html: htmlContent }
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${to}:`, err);
      }
      setSendProgress({ current: i + 1, total: selectedEmails.length });
    }

    setSending(false);
    setToast({ 
      visible: true, 
      message: `Successfully sent to ${successCount} of ${selectedEmails.length} recipients.`, 
      type: successCount === selectedEmails.length ? "success" : "error" 
    });
    
    if (successCount === selectedEmails.length) {
      setSubject("");
      setMessage("");
      setSelectedEmails([]);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Email Clients
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Compose and send direct emails to your customers.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <form onSubmit={handleSendEmails} className="flex flex-col h-full">
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., New Luxury Furniture Arrivals!"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F4A623] focus:ring-1 focus:ring-[#F4A623] transition-all"
                disabled={sending}
              />
            </div>
            
            <div className="mb-5 flex-1 flex flex-col">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Message Body
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your email here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F4A623] focus:ring-1 focus:ring-[#F4A623] transition-all flex-1 min-h-[300px] resize-none"
                disabled={sending}
              ></textarea>
              <p className="text-xs text-gray-400 mt-2 italic">
                Note: Line breaks will be automatically converted to paragraphs in the email.
              </p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">
                <span className="font-bold text-[#2B1A12]">{selectedEmails.length}</span> recipients selected
              </div>
              
              <button
                type="submit"
                disabled={sending || selectedEmails.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all ${
                  sending || selectedEmails.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#F4A623] text-[#2B1A12] hover:bg-[#e09520]"
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent" />
                    Sending ({sendProgress.current}/{sendProgress.total})...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Recipients List */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col max-h-[600px]">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <FiUsers className="text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-[#2B1A12]">Select Recipients</h3>
              <p className="text-xs text-gray-500">{customers.length} total customers</p>
            </div>
          </div>

          <div className="p-3 border-b border-gray-100 bg-white">
            <form onSubmit={handleAddCustomEmail} className="flex gap-2">
              <input
                type="email"
                value={customEmailInput}
                onChange={(e) => setCustomEmailInput(e.target.value)}
                placeholder="Add custom email..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F4A623] focus:ring-1 focus:ring-[#F4A623]"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !customEmailInput.trim()}
                className="px-3 py-1.5 bg-[#F4A623] text-[#2B1A12] font-bold rounded-lg text-sm hover:bg-[#e09520] disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
          
          <div className="p-3 border-b border-gray-50 bg-[#FDFCFB]">
            <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-[#F4A623] focus:ring-[#F4A623] border-gray-300 rounded"
                checked={selectedEmails.length === customers.length && customers.length > 0}
                onChange={handleSelectAll}
                disabled={loading || sending}
              />
              <span className="text-sm font-bold text-[#2B1A12]">Select All Customers</span>
            </label>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-[#F4A623] border-t-transparent" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">
                No customers found.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {customers.map((c) => (
                  <label key={c.id || c.email} className="flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-0.5 text-[#F4A623] focus:ring-[#F4A623] border-gray-300 rounded"
                      checked={selectedEmails.includes(c.email)}
                      onChange={() => handleSelectOne(c.email)}
                      disabled={sending}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-[#2B1A12] truncate">
                        {c.name || c.customer_name || 'No Name'}
                      </span>
                      <span className="text-xs text-gray-500 truncate">{c.email}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>

      {/* Simple Toast UI */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-slide-up ${
          toast.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {toast.type === "success" ? <FiCheckCircle className="text-lg" /> : <div className="font-bold">!</div>}
          <p className="text-sm font-medium">{toast.message}</p>
          <button 
            onClick={() => setToast({ ...toast, visible: false })} 
            className="ml-4 opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default EmailClients;
