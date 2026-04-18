import React from "react";

const CustomerFeedback = () => {
  const feedbacks = [
    {
      id: 1,
      name: "Amaka Okonkwo",
      orderRef: "#LX-9070",
      time: "5 MINS AGO",
      comment:
        '"The royal leather sofa arrived in perfect condition. The delivery team was very professional and placed everything exactly where I wanted. Highly recommend Himbalin!"',
      borderColor: "border-[#F4A623]",
    },
    {
      id: 2,
      name: "Babatunde Adeyemi",
      orderRef: "#LX-9065",
      time: "2 HOURS AGO",
      comment:
        '"Shipping took a bit longer than expected but the build quality of the dining table is exceptional. You can tell it is premium furniture. Will buy again."',
      borderColor: "border-[#2B1A12]",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold text-[#2B1A12]">Customer Feedback</h3>
        <span className="text-xs font-bold text-[#F4A623] bg-[#F4A623]/10 border border-[#F4A623]/20 px-3 py-1.5 rounded-full">
          {feedbacks.length} New
        </span>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className={`bg-[#f9fafb] p-5 rounded-r-xl border-l-4 ${fb.borderColor}`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-[#2B1A12]">
                {fb.name}{" "}
                <span className="text-[#F4A623] font-semibold">{fb.orderRef}</span>
              </p>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                {fb.time}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed">{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFeedback;
