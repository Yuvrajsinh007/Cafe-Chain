/**
 * Dummy data for CafeChain Frontend
 */

export const dummyData = {
  // Partner cafes in the network
  partnerCafes: [
    {
      id: 'cafe-001',
      name: 'Brew Haven',
      logo: 'https://placehold.co/100x100?text=BH',
      address: '123 Coffee St, Beantown',
      phone: '+1-555-123-4567',
      email: 'info@brewhaven.com',
      rating: 4.8,
      joinedDate: '2023-01-15',
      status: 'active'
    },
    {
      id: 'cafe-002',
      name: 'Espresso Express',
      logo: 'https://placehold.co/100x100?text=EE',
      address: '456 Latte Ave, Brewville',
      phone: '+1-555-987-6543',
      email: 'contact@espressoexpress.com',
      rating: 4.6,
      joinedDate: '2023-02-20',
      status: 'active'
    },
    {
      id: 'cafe-003',
      name: 'Mocha Moments',
      logo: 'https://placehold.co/100x100?text=MM',
      address: '789 Bean Blvd, Arabica',
      phone: '+1-555-456-7890',
      email: 'hello@mochamoments.com',
      rating: 4.7,
      joinedDate: '2023-03-10',
      status: 'active'
    },
    {
      id: 'cafe-004',
      name: 'The Daily Grind',
      logo: 'https://placehold.co/100x100?text=DG',
      address: '321 Roast Rd, Coffeeville',
      phone: '+1-555-234-5678',
      email: 'info@dailygrind.com',
      rating: 4.5,
      joinedDate: '2023-04-05',
      status: 'active'
    },
    {
      id: 'cafe-005',
      name: 'Caffeine Corner',
      logo: 'https://placehold.co/100x100?text=CC',
      address: '567 Drip Dr, Beanville',
      phone: '+1-555-876-5432',
      email: 'hello@caffeinecorner.com',
      rating: 4.9,
      joinedDate: '2023-05-12',
      status: 'active'
    }
  ],
  
  // Announcements for cafes
  announcements: [
    {
      id: 'ann-001',
      title: 'New Loyalty Program Launch',
      content: 'We\'re excited to announce our new loyalty program starting next month. Customers can earn double points on all purchases!',
      date: '2024-02-15T10:30:00Z',
      priority: 'high',
      expiryDate: '2024-03-15T23:59:59Z'
    },
    {
      id: 'ann-002',
      title: 'System Maintenance Notice',
      content: 'The CafeChain platform will be undergoing maintenance on March 5th from 2AM to 4AM. Services may be temporarily unavailable.',
      date: '2024-02-28T14:15:00Z',
      priority: 'medium',
      expiryDate: '2024-03-06T00:00:00Z'
    },
    {
      id: 'ann-003',
      title: 'New Feature: Digital Receipts',
      content: 'Starting today, you can enable digital receipts for your customers. Go to Settings to configure this eco-friendly option!',
      date: '2024-02-10T09:00:00Z',
      priority: 'medium',
      expiryDate: '2024-03-10T23:59:59Z'
    },
    {
      id: 'ann-004',
      title: 'Holiday Hours Reminder',
      content: 'Don\'t forget to update your special holiday hours in the system to keep customers informed about your availability.',
      date: '2024-02-20T11:45:00Z',
      priority: 'low',
      expiryDate: '2024-03-01T23:59:59Z'
    },
    {
      id: 'ann-005',
      title: 'Partner Discount Program',
      content: 'New partnership with local suppliers offering 15% discount on coffee beans. Contact support for more details.',
      date: '2024-02-25T16:20:00Z',
      priority: 'high',
      expiryDate: '2024-03-25T23:59:59Z'
    }
  ],
  
  // Leaderboard data
  leaderboard: [
    {
      id: 'cafe-005',
      name: 'Caffeine Corner',
      logo: 'https://placehold.co/100x100?text=CC',
      points: 2850,
      rank: 1,
      lastMonthRank: 2,
      trend: 'up'
    },
    {
      id: 'cafe-001',
      name: 'Brew Haven',
      logo: 'https://placehold.co/100x100?text=BH',
      points: 2720,
      rank: 2,
      lastMonthRank: 1,
      trend: 'down'
    },
    {
      id: 'cafe-003',
      name: 'Mocha Moments',
      logo: 'https://placehold.co/100x100?text=MM',
      points: 2540,
      rank: 3,
      lastMonthRank: 3,
      trend: 'stable'
    },
    {
      id: 'cafe-002',
      name: 'Espresso Express',
      logo: 'https://placehold.co/100x100?text=EE',
      points: 2350,
      rank: 4,
      lastMonthRank: 5,
      trend: 'up'
    },
    {
      id: 'cafe-004',
      name: 'The Daily Grind',
      logo: 'https://placehold.co/100x100?text=DG',
      points: 2180,
      rank: 5,
      lastMonthRank: 4,
      trend: 'down'
    }
  ],
  
  // Events and promotions
  events: [
    {
      id: 'event-001',
      title: 'Coffee Tasting Workshop',
      description: 'Join us for an exclusive coffee tasting event featuring beans from around the world.',
      startDate: '2024-03-15T14:00:00Z',
      endDate: '2024-03-15T16:00:00Z',
      location: 'Brew Haven',
      image: 'https://placehold.co/300x200?text=Coffee+Tasting',
      status: 'upcoming'
    },
    {
      id: 'event-002',
      title: 'Barista Championship',
      description: 'Annual barista skills competition with prizes for the top three winners.',
      startDate: '2024-04-10T09:00:00Z',
      endDate: '2024-04-10T17:00:00Z',
      location: 'Convention Center',
      image: 'https://placehold.co/300x200?text=Barista+Championship',
      status: 'upcoming'
    },
    {
      id: 'event-003',
      title: 'Latte Art Workshop',
      description: 'Learn the basics of latte art from our master baristas.',
      startDate: '2024-03-05T10:00:00Z',
      endDate: '2024-03-05T12:00:00Z',
      location: 'Espresso Express',
      image: 'https://placehold.co/300x200?text=Latte+Art',
      status: 'upcoming'
    },
    {
      id: 'event-004',
      title: 'Coffee and Jazz Night',
      description: 'Enjoy an evening of smooth jazz and premium coffee blends.',
      startDate: '2024-03-20T18:00:00Z',
      endDate: '2024-03-20T21:00:00Z',
      location: 'Mocha Moments',
      image: 'https://placehold.co/300x200?text=Jazz+Night',
      status: 'upcoming'
    },
    {
      id: 'event-005',
      title: 'Sustainable Coffee Sourcing',
      description: 'Learn about ethical and sustainable coffee sourcing practices.',
      startDate: '2024-03-25T15:00:00Z',
      endDate: '2024-03-25T17:00:00Z',
      location: 'The Daily Grind',
      image: 'https://placehold.co/300x200?text=Sustainable+Coffee',
      status: 'upcoming'
    }
  ],
  
  // Transaction history
  transactions: [
    {
      id: 'txn-001',
      customerId: 'cust-123',
      customerName: 'John Smith',
      amount: 15.75,
      points: 16,
      date: '2024-02-28T09:15:23Z',
      type: 'purchase',
      items: ['Latte', 'Croissant']
    },
    {
      id: 'txn-002',
      customerId: 'cust-456',
      customerName: 'Emma Johnson',
      amount: 8.50,
      points: 9,
      date: '2024-02-28T10:30:45Z',
      type: 'purchase',
      items: ['Cappuccino', 'Blueberry Muffin']
    },
    {
      id: 'txn-003',
      customerId: 'cust-789',
      customerName: 'Michael Brown',
      amount: 12.25,
      points: 12,
      date: '2024-02-28T11:45:12Z',
      type: 'purchase',
      items: ['Americano', 'Sandwich']
    },
    {
      id: 'txn-004',
      customerId: 'cust-123',
      customerName: 'John Smith',
      amount: 0,
      points: -100,
      date: '2024-02-28T14:20:33Z',
      type: 'redemption',
      items: ['Free Coffee Voucher']
    },
    {
      id: 'txn-005',
      customerId: 'cust-101',
      customerName: 'Sarah Wilson',
      amount: 21.30,
      points: 21,
      date: '2024-02-28T15:10:05Z',
      type: 'purchase',
      items: ['Mocha', 'Cheesecake', 'Bottled Water']
    },
    {
      id: 'txn-006',
      customerId: 'cust-202',
      customerName: 'David Lee',
      amount: 5.75,
      points: 6,
      date: '2024-02-28T16:05:18Z',
      type: 'purchase',
      items: ['Espresso', 'Cookie']
    },
    {
      id: 'txn-007',
      customerId: 'cust-303',
      customerName: 'Lisa Garcia',
      amount: 0,
      points: -200,
      date: '2024-02-28T16:45:22Z',
      type: 'redemption',
      items: ['Lunch Set Voucher']
    },
    {
      id: 'txn-008',
      customerId: 'cust-404',
      customerName: 'Robert Taylor',
      amount: 18.90,
      points: 19,
      date: '2024-02-28T17:30:40Z',
      type: 'purchase',
      items: ['Cold Brew', 'Salad', 'Brownie']
    }
  ],
  
  // Business metrics
  metrics: {
    daily: {
      sales: 542.75,
      transactions: 37,
      newCustomers: 5,
      redemptions: 8,
      averageOrder: 14.67
    },
    weekly: {
      sales: 3245.50,
      transactions: 221,
      newCustomers: 28,
      redemptions: 42,
      averageOrder: 14.68
    },
    monthly: {
      sales: 12980.25,
      transactions: 884,
      newCustomers: 112,
      redemptions: 165,
      averageOrder: 14.68
    },
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [420.50, 380.25, 510.75, 542.75, 625.30, 480.15, 285.80],
      transactions: [29, 26, 35, 37, 42, 33, 19],
      customers: [24, 22, 30, 31, 36, 28, 16]
    }
  },
  
  // Performance data
  performance: {
    pointsTrend: [120, 145, 160, 175, 190, 210, 230],
    activeUsersTrend: [45, 52, 58, 64, 72, 78, 85],
    participationTrend: [32, 36, 42, 45, 51, 56, 62],
    customerRetention: 78, // percentage
    customerSatisfaction: 4.7, // out of 5
    revenueGrowth: 12.5, // percentage
    topProducts: [
      { name: 'Latte', sales: 156, revenue: 624.00 },
      { name: 'Cappuccino', sales: 132, revenue: 528.00 },
      { name: 'Croissant', sales: 98, revenue: 294.00 },
      { name: 'Cold Brew', sales: 87, revenue: 391.50 },
      { name: 'Blueberry Muffin', sales: 76, revenue: 228.00 }
    ],
    peakHours: [
      { hour: '07:00', customers: 42 },
      { hour: '08:00', customers: 78 },
      { hour: '09:00', customers: 65 },
      { hour: '10:00', customers: 43 },
      { hour: '11:00', customers: 51 },
      { hour: '12:00', customers: 82 },
      { hour: '13:00', customers: 74 },
      { hour: '14:00', customers: 45 },
      { hour: '15:00', customers: 38 },
      { hour: '16:00', customers: 56 },
      { hour: '17:00', customers: 63 },
      { hour: '18:00', customers: 47 }
    ],
    monthlyComparison: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      currentYear: [10580.25, 12980.25, 0, 0, 0, 0],
      previousYear: [9120.50, 11250.75, 12340.80, 11980.25, 13450.60, 12870.30]
    }
  }
};

export default dummyData;