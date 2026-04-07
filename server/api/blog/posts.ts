export default defineEventHandler((event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 12;
  const search = (query.search as string) || '';
  const category = (query.category as string) || '';

  // Mock blog posts data
  const allPosts = [
    {
      id: 1,
      featured_image: '/demo/images/blog/blog-1.png',
      post_title: 'Getting Started with Our Platform',
      post_excerpt: 'A comprehensive guide to help you get up and running quickly with all the essential features.',
      author_name: 'John Doe',
      published_date: '2024-03-15',
      post_category: 'Tutorial',
      post_slug: 'getting-started',
      read_time: '5 min read'
    },
    {
      id: 2,
      featured_image: '/demo/images/blog/blog-2.png',
      post_title: 'Advanced Tips & Tricks',
      post_excerpt: 'Take your skills to the next level with these professional tips and advanced techniques.',
      author_name: 'Jane Smith',
      published_date: '2024-03-12',
      post_category: 'Tips',
      post_slug: 'advanced-tips',
      read_time: '8 min read'
    },
    {
      id: 3,
      featured_image: '/demo/images/blocks/hero/hero-1.png',
      post_title: 'Building Scalable Applications',
      post_excerpt: 'Learn how to architect and build applications that scale with your business growth.',
      author_name: 'Mike Johnson',
      published_date: '2024-03-10',
      post_category: 'Development',
      post_slug: 'scalable-apps',
      read_time: '12 min read'
    },
    {
      id: 4,
      featured_image: '/demo/images/landing/screen-1.png',
      post_title: 'UI/UX Best Practices',
      post_excerpt: 'Discover the latest best practices for creating intuitive and beautiful user interfaces.',
      author_name: 'Sarah Williams',
      published_date: '2024-03-08',
      post_category: 'Design',
      post_slug: 'ui-ux-practices',
      read_time: '6 min read'
    },
    {
      id: 5,
      featured_image: '/demo/images/blog/blog-1.png',
      post_title: 'Performance Optimization Guide',
      post_excerpt: 'Optimize your application performance with these proven techniques and tools.',
      author_name: 'David Brown',
      published_date: '2024-03-05',
      post_category: 'Performance',
      post_slug: 'performance-guide',
      read_time: '10 min read'
    },
    {
      id: 6,
      featured_image: '/demo/images/blog/blog-2.png',
      post_title: 'Security Best Practices',
      post_excerpt: 'Keep your application secure with these essential security practices and guidelines.',
      author_name: 'Emily Davis',
      published_date: '2024-03-01',
      post_category: 'Security',
      post_slug: 'security-practices',
      read_time: '7 min read'
    },
    {
      id: 7,
      featured_image: '/demo/images/blocks/hero/hero-1.png',
      post_title: 'Modern JavaScript Frameworks',
      post_excerpt: 'A comparison of the most popular JavaScript frameworks and when to use each one.',
      author_name: 'Alex Chen',
      published_date: '2024-02-28',
      post_category: 'Development',
      post_slug: 'javascript-frameworks',
      read_time: '15 min read'
    },
    {
      id: 8,
      featured_image: '/demo/images/landing/screen-1.png',
      post_title: 'API Design Principles',
      post_excerpt: 'Learn the fundamental principles of designing robust and developer-friendly APIs.',
      author_name: 'Lisa Anderson',
      published_date: '2024-02-25',
      post_category: 'Development',
      post_slug: 'api-design',
      read_time: '9 min read'
    },
    {
      id: 9,
      featured_image: '/demo/images/blog/blog-3.png',
      post_title: 'Responsive Design Strategies',
      post_excerpt: 'Master responsive design with these modern strategies and practical examples.',
      author_name: 'Tom Wilson',
      published_date: '2024-02-22',
      post_category: 'Design',
      post_slug: 'responsive-design',
      read_time: '11 min read'
    },
    {
      id: 10,
      featured_image: '/demo/images/blog/blog-4.png',
      post_title: 'Cloud Architecture Basics',
      post_excerpt: 'Understanding cloud architecture fundamentals for modern application deployment.',
      author_name: 'Rachel Green',
      published_date: '2024-02-20',
      post_category: 'Tutorial',
      post_slug: 'cloud-architecture',
      read_time: '13 min read'
    },
    {
      id: 11,
      featured_image: '/demo/images/blocks/hero/hero-1.png',
      post_title: 'Testing Strategies for Web Apps',
      post_excerpt: 'Comprehensive guide to testing strategies including unit, integration, and e2e testing.',
      author_name: 'Kevin Martinez',
      published_date: '2024-02-18',
      post_category: 'Development',
      post_slug: 'testing-strategies',
      read_time: '14 min read'
    },
    {
      id: 12,
      featured_image: '/demo/images/landing/screen-1.png',
      post_title: 'Accessibility in Web Design',
      post_excerpt: 'Make your websites accessible to everyone with these essential accessibility guidelines.',
      author_name: 'Nina Patel',
      published_date: '2024-02-15',
      post_category: 'Design',
      post_slug: 'web-accessibility',
      read_time: '8 min read'
    }
  ];

  // Filter by search
  let filteredPosts = allPosts;
  if (search) {
    filteredPosts = filteredPosts.filter(post =>
      post.post_title.toLowerCase().includes(search.toLowerCase()) ||
      post.post_excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by category
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.post_category === category);
  }

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    meta: {
      currentPage: page,
      totalPages,
      totalPosts,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
});
