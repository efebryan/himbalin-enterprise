export const mockOrders = [
  {
    orderNumber: "HM-2026-00481",
    email: "john@example.com",
    customerName: "John Doe",
    orderDate: "June 20, 2026",
    estimatedDelivery: "June 28, 2026",
    deliveryAddress: "15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    courierName: "Himbalin Logistics",
    trackingNumber: "HBL938492",
    currentStatus: "Out for Delivery",
    driver: {
      name: "Michael Johnson",
      vehicle: "Mercedes Sprinter Van (LAG-892-AA)",
      phone: "+234 803 234 6678",
      estimatedArrival: "2 Hours",
      condition: "Excellent"
    },
    items: [
      {
        id: "p1",
        name: "Emerald Velvet Armchair",
        quantity: 2,
        price: 850,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "p2",
        name: "Nordic Oak Desk",
        quantity: 1,
        price: 1200,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400"
      }
    ],
    timeline: [
      {
        status: "Order Confirmed",
        description: "Your order has been successfully placed.",
        date: "20 Jun 2026",
        completed: true
      },
      {
        status: "Payment Received",
        description: "Payment has been received and verified.",
        date: "20 Jun 2026",
        completed: true
      },
      {
        status: "Processing",
        description: "Your furniture is being handcrafted by our master artisans.",
        date: "22 Jun 2026",
        completed: true
      },
      {
        status: "Ready for Dispatch",
        description: "Final quality inspection completed. Ready to leave the workshop.",
        date: "24 Jun 2026",
        completed: true
      },
      {
        status: "Shipped",
        description: "Your order has left our central Lagos warehouse.",
        date: "25 Jun 2026",
        completed: true
      },
      {
        status: "Out for Delivery",
        description: "Driver is delivering your furniture today.",
        date: "Today before 6 PM",
        completed: true,
        isCurrent: true
      },
      {
        status: "Delivered",
        description: "Furniture set up in your room of choice.",
        date: "Pending",
        completed: false
      }
    ]
  },
  {
    orderNumber: "HM-2026-00452",
    email: "sarah@example.com",
    customerName: "Sarah Connor",
    orderDate: "June 18, 2026",
    estimatedDelivery: "June 24, 2026",
    deliveryAddress: "8 Banana Island Road, Ikoyi, Lagos, Nigeria",
    courierName: "Himbalin Logistics",
    trackingNumber: "HBL938114",
    currentStatus: "Delivered",
    driver: {
      name: "David Alao",
      vehicle: "Transit Custom (LAG-412-BB)",
      phone: "+234 812 777 8899",
      estimatedArrival: "Delivered",
      condition: "Perfect"
    },
    items: [
      {
        id: "p3",
        name: "Classic Chesterfield Sofa",
        quantity: 1,
        price: 2450,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"
      }
    ],
    timeline: [
      {
        status: "Order Confirmed",
        description: "Your order has been successfully placed.",
        date: "18 Jun 2026",
        completed: true
      },
      {
        status: "Payment Received",
        description: "Payment has been received.",
        date: "18 Jun 2026",
        completed: true
      },
      {
        status: "Processing",
        description: "Your furniture is being handcrafted.",
        date: "20 Jun 2026",
        completed: true
      },
      {
        status: "Ready for Dispatch",
        description: "Final quality inspection completed.",
        date: "22 Jun 2026",
        completed: true
      },
      {
        status: "Shipped",
        description: "Your order has left our warehouse.",
        date: "23 Jun 2026",
        completed: true
      },
      {
        status: "Out for Delivery",
        description: "Driver is delivering your furniture.",
        date: "24 Jun 2026",
        completed: true
      },
      {
        status: "Delivered",
        description: "Delivered & assembled in home.",
        date: "24 Jun 2026 (2:30 PM)",
        completed: true,
        isCurrent: true
      }
    ]
  },
  {
    orderNumber: "HM-2026-00490",
    email: "james@example.com",
    customerName: "James Bond",
    orderDate: "June 25, 2026",
    estimatedDelivery: "July 02, 2026",
    deliveryAddress: "32 Victoria Island Boulevard, Lagos, Nigeria",
    courierName: "Himbalin Logistics",
    trackingNumber: "HBL938999",
    currentStatus: "Processing",
    driver: null,
    items: [
      {
        id: "p4",
        name: "Luxury Marble Dining Table",
        quantity: 1,
        price: 3800,
        image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=400"
      }
    ],
    timeline: [
      {
        status: "Order Confirmed",
        description: "Your order has been successfully placed.",
        date: "25 Jun 2026",
        completed: true
      },
      {
        status: "Payment Received",
        description: "Payment has been received.",
        date: "26 Jun 2026",
        completed: true
      },
      {
        status: "Processing",
        description: "Your furniture is being handcrafted.",
        date: "27 Jun 2026",
        completed: true,
        isCurrent: true
      },
      {
        status: "Ready for Dispatch",
        description: "Final quality inspection completed.",
        date: "Pending",
        completed: false
      },
      {
        status: "Shipped",
        description: "Your order has left our warehouse.",
        date: "Pending",
        completed: false
      },
      {
        status: "Out for Delivery",
        description: "Driver is delivering your furniture.",
        date: "Pending",
        completed: false
      },
      {
        status: "Delivered",
        description: "Furniture set up in your room.",
        date: "Pending",
        completed: false
      }
    ]
  }
];
