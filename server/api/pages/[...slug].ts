interface ComponentContent {
  [key: string]: unknown;
}

interface ComponentConfig {
  name: string;
  component: string;
  props?: Record<string, unknown>;
  content?: ComponentContent;
}

interface BlockConfig {
  name: string;
  type?: 'predefined' | 'custom';
  component?: string;
  components?: ComponentConfig[];
  props?: Record<string, unknown>;
}

interface PageConfig {
  name: string;
  path: string;
  blocks: BlockConfig[];
  seoMeta?: {
    title?: string;
    description?: string;
    ogImage?: string;
    [key: string]: unknown;
  };
}

// Mock database of pages based on your menu structure
const pages: Record<string, PageConfig> = {
  'home': {
    name: 'home',
    path: '/',
    blocks: [
      // Predefined Widget: Hero Section
      {
        name: 'HeroWidget',
        type: 'predefined',
        component: 'HeroWidget',
        props: {
          title: 'Welcome to Our Platform',
          subtitle: 'Innovative Solutions',
          description: 'Transform your workflow with our cutting-edge platform. Experience seamless integration and powerful features.',
          buttonLabel: 'Get Started',
          buttonLink: '/highlights',
          image: '/demo/images/landing/screen-1.png',
          imageAlt: 'Platform Overview'
        }
      },
      // Predefined Widget: Features
      {
        name: 'FeaturesWidget',
        type: 'predefined',
        component: 'FeaturesWidget',
        props: {
          title: 'Why Choose Us',
          subtitle: 'Discover what makes our platform special',
          features: [
            {
              icon: 'pi-bolt',
              title: 'Lightning Fast',
              description: 'Optimized performance for the best user experience.',
              bgColor: 'bg-yellow-200',
              iconColor: 'text-yellow-700',
              gradient: 'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))'
            },
            {
              icon: 'pi-shield',
              title: 'Secure',
              description: 'Enterprise-grade security to protect your data.',
              bgColor: 'bg-green-200',
              iconColor: 'text-green-700',
              gradient: 'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))'
            },
            {
              icon: 'pi-users',
              title: 'Team Collaboration',
              description: 'Work together seamlessly with your team.',
              bgColor: 'bg-blue-200',
              iconColor: 'text-blue-700',
              gradient: 'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))'
            }
          ]
        }
      },
      // Custom Block: Call to Action
      {
        name: 'hero-section',
        type: 'custom',
        components: [
          {
            name: 'cta-title',
            component: 'H1_TextField',
            content: {
              title: 'Ready to Get Started?',
              description: 'Join thousands of satisfied customers today.'
            }
          },
          {
            name: 'cta-button',
            component: 'ButtonField',
            props: { rounded: true, severity: 'success', size: 'large' },
            content: { label: 'Start Free Trial', icon: 'pi pi-check' }
          }
        ],
        props: {
          class: 'py-20 bg-surface-50 dark:bg-surface-900'
        }
      },
      // Predefined Widget: Highlights
      {
        name: 'HighlightsWidget',
        type: 'predefined',
        component: 'HighlightsWidget'
      },
      // Predefined Widget: Pricing
      {
        name: 'PricingWidget',
        type: 'predefined',
        component: 'PricingWidget'
      },
      // Custom Block: Testimonials
      {
        name: 'single-column',
        type: 'custom',
        components: [
          {
            name: 'testimonials-title',
            component: 'H1_TextField',
            content: {
              title: 'What Our Customers Say',
              description: 'Real stories from real customers.'
            }
          },
          {
            name: 'customer-image',
            component: 'ImageField',
            props: { class: 'mx-auto rounded-full w-32 h-32 object-cover' },
            content: {
              src: 'https://primefaces.org/cdn/primevue/images/landing/avatar-1.png',
              alt: 'Happy Customer'
            }
          }
        ],
        props: {
          class: 'py-16 text-center'
        }
      },
    ],
    seoMeta: {
      title: 'Home - Welcome to Our Platform',
      description: 'Transform your workflow with our innovative platform.',
      ogImage: 'https://primefaces.org/cdn/primevue/images/landing/screen-1.png'
    }
  },
  'highlights': {
    name: 'highlights',
    path: '/highlights',
    blocks: [
      // Custom Block: Page Header
      {
        name: 'hero-section',
        type: 'custom',
        components: [
          {
            name: 'page-title',
            component: 'H1_TextField',
            content: {
              title: 'Highlights',
              description: 'Discover our most exciting features and achievements.'
            }
          }
        ]
      },
      // Predefined Widget
      {
        name: 'HighlightsWidget',
        component: 'HighlightsWidget'
      },
      // Custom Block: Grid Content
      {
        name: 'grid-columns',
        type: 'custom',
        components: [
          {
            name: 'highlight-1-image',
            component: 'ImageField',
            content: {
              src: 'https://primefaces.org/cdn/primevue/images/landing/screen-2.png',
              alt: 'Award Winning Design'
            }
          },
          {
            name: 'highlight-1-text',
            component: 'H1_TextField',
            content: {
              title: 'Award Winning Design',
              description: 'Recognized globally for exceptional UX.'
            }
          },
          {
            name: 'highlight-1-button',
            component: 'ButtonField',
            props: { rounded: true, outlined: true },
            content: { label: 'Learn More', icon: 'pi pi-info-circle' }
          }
        ]
      },
     
    ],
    seoMeta: {
      title: 'Highlights - Our Best Features',
      description: 'Explore our award-winning features.'
    }
  },
  'articles/blog': {
    name: 'blog',
    path: '/articles/blog',
    blocks: [
      {
        name: 'hero-section',
        type: 'custom',
        components: [
          {
            name: 'page-title',
            component: 'H1_TextField',
            content: {
              title: 'Blog',
              description: 'Insights, tutorials, and stories from our team.'
            }
          }
        ]
      },
      {
        name: 'grid-columns',
        type: 'custom',
        components: [
          {
            name: 'post-1-image',
            component: 'ImageField',
            content: {
              src: 'https://primefaces.org/cdn/primevue/images/landing/screen-1.png',
              alt: 'Getting Started Guide'
            }
          },
          {
            name: 'post-1',
            component: 'H1_TextField',
            content: {
              title: 'Getting Started with Our Platform',
              description: 'A comprehensive guide to help you get up and running.'
            }
          },
          {
            name: 'post-1-button',
            component: 'ButtonField',
            props: { rounded: true, text: true },
            content: { label: 'Read More', icon: 'pi pi-arrow-right' }
          },
          {
            name: 'post-2-image',
            component: 'ImageField',
            content: {
              src: 'https://primefaces.org/cdn/primevue/images/landing/screen-2.png',
              alt: 'Advanced Tips'
            }
          },
          {
            name: 'post-2',
            component: 'H1_TextField',
            content: {
              title: 'Advanced Tips & Tricks',
              description: 'Take your skills to the next level with these pro tips.'
            }
          },
          {
            name: 'post-2-button',
            component: 'ButtonField',
            props: { rounded: true, text: true },
            content: { label: 'Read More', icon: 'pi pi-arrow-right' }
          }
        ]
      },
      
    ],
    seoMeta: {
      title: 'Blog - Insights & Tutorials',
      description: 'Read our latest blog posts.'
    }
  },
  'articles/news': {
    name: 'news',
    path: '/articles/news',
    blocks: [
      {
        name: 'hero-section',
        type: 'custom',
        components: [
          {
            name: 'page-title',
            component: 'H1_TextField',
            content: {
              title: 'News',
              description: 'Latest updates and announcements.'
            }
          }
        ]
      },
      {
        name: 'flex-column',
        type: 'custom',
        components: [
          {
            name: 'news-1',
            component: 'H1_TextField',
            content: {
              title: 'Introducing New AI Features',
              description: 'Revolutionary AI capabilities launching now.'
            }
          },
          {
            name: 'news-1-image',
            component: 'ImageField',
            props: { class: 'rounded-lg shadow-lg' },
            content: {
              src: 'https://primefaces.org/cdn/primevue/images/landing/screen-2.png',
              alt: 'Product Launch'
            }
          },
          {
            name: 'news-1-button',
            component: 'ButtonField',
            props: { rounded: true, severity: 'info', size: 'large' },
            content: { label: 'Try It Now', icon: 'pi pi-sparkles' }
          }
        ],
        props: {
          class: 'max-w-4xl mx-auto py-16'
        }
      },
    
    ],
    seoMeta: {
      title: 'News - Company Updates',
      description: 'Stay updated with latest news.'
    }
  }
};

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || 'home';
  
  // Check if page exists
  const pageConfig = pages[slug];
  
  if (!pageConfig) {
    throw createError({
      statusCode: 404,
      message: `Page not found: /${slug}`
    });
  }
  
  return pageConfig;
});
