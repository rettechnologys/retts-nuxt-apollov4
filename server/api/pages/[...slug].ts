import { PageConfig } from '#shared/types';
import { newModelPages } from '#shared/base-model';
import { createError, getRouterParams } from 'h3';

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const slug = params.slug || '';
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;

  console.log('[API Pages] Fetching:', slugPath);

  try {
    // 1. Try to fetch from CMS/database as a regular page
    // const pageConfig = await fetchPageFromCMS(slugPath);
    // if (pageConfig) {
    //   console.log('[API Pages] Static page found');
    //   return pageConfig;
    // }

    // // 2. Check if it's a collection listing page
    // const listingPage = await tryFetchCollectionList(slugPath);
    // if (listingPage) {
    //   console.log('[API Pages] Collection listing page found');
    //   return listingPage;
    // }

    // // 3. Check if it's a collection detail page pattern: collection/item-slug
    // const detailPage = await tryFetchCollectionDetail(slugPath);
    // if (detailPage) {
    //   console.log('[API Pages] Collection detail page found');
    //   return detailPage;
    // }

    // 4. Fallback to mock data for development
    const mockPage = getMockPage2(slugPath);
    if (mockPage) {
      console.log('[API Pages] Mock page found');
      return mockPage;
    }
    // const mockPage = getMockPage(slugPath);
    // if (mockPage) {
    //   console.log('[API Pages] Mock page found');
    //   return mockPage;
    // }

    // Not found
    throw createError({
      statusCode: 404,
      message: `Page not found: ${slugPath}`
    });

  } catch (error: any) {
    console.error('[API Pages] Error:', error);

    if (error.statusCode === 404) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
});

/**
 * Fetch page configuration from external CMS backend (when ready)
 * For now, returns null to use mock data fallback
 */
async function fetchPageFromCMS(_slugPath: string): Promise<PageConfig | null> {
  try {
    // TODO: Enable this when backend is ready
    // const config = useRuntimeConfig();
    // const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
    // const apiKeyName = config.apiKeyName || config.public.apiKeyName;
    // const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;
    //
    // const page = await $fetch<PageConfig>(`${apiBaseUrl}/api/cms/pages/${slugPath}`, {
    //   headers: {
    //     [apiKeyName]: apiKeyValue,
    //   },
    // }).catch(() => null);
    //
    // if (page) return page;

    // Use mock data for now
    return null;
  } catch (error) {
    console.error('[API Pages] CMS fetch error:', error);
    return null;
  }
}

/**
 * Try to fetch collection listing page
 */
async function tryFetchCollectionList(_slugPath: string): Promise<PageConfig | null> {
  // TODO: Implement when backend is ready
  // For now, handled by getMockPage
  return null;
}

/**
 * Try to fetch collection detail page
 * Pattern: collection-slug/item-slug (e.g., articles/my-post)
 */
async function tryFetchCollectionDetail(slugPath: string): Promise<PageConfig | null> {
  // Pattern: collection/item-slug
  const match = slugPath.match(/^([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const [, _collectionSlug, _itemSlug] = match;

  // TODO: Enable this when backend is ready
  // const config = useRuntimeConfig();
  // const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl;
  // const apiKeyName = config.apiKeyName || config.public.apiKeyName;
  // const apiKeyValue = config.apiKeyValue || config.public.apiKeyValue;
  //
  // const headers = { [apiKeyName]: apiKeyValue };
  //
  // const collectionConfig = await $fetch<any>(
  //   `${apiBaseUrl}/api/cms/collections/${collectionSlug}/config`,
  //   { headers }
  // ).catch(() => null);
  //
  // if (!collectionConfig) return null;
  //
  // const item = await $fetch<any>(
  //   `${apiBaseUrl}/api/cms/collections/${collectionConfig.type}/${itemSlug}`,
  //   { headers }
  // ).catch(() => null);
  //
  // if (!item) return null;
  //
  // const template = await $fetch<any>(
  //   `${apiBaseUrl}/api/cms/templates/${collectionConfig.detailTemplateId}`,
  //   { headers }
  // ).catch(() => null);
  //
  // if (!template) return null;
  //
  // return buildPageFromTemplate(template, item, collectionSlug);

  // Use mock data for now
  return null;
}

/**
 * Build PageConfig from template and item data
 * Template contains block definitions with dynamic field mappings
 */
function buildPageFromTemplate(
  template: any,
  item: any,
  collectionSlug: string
): PageConfig {
  // Process template blocks and replace dynamic variables with actual data
  const blocks = template.blocks.map((block: any) => {
    return {
      name: block.name,
      type: block.type,
      component: block.component,
      props: processTemplateProps(block.props, item),
      components: block.components ? block.components.map((comp: any) => ({
        name: comp.name,
        component: comp.component,
        props: processTemplateProps(comp.props, item)
      })) : undefined
    };
  });

  return {
    name: `${collectionSlug}-${item.slug}`,
    path: `/${collectionSlug}/${item.slug}`,
    blocks,
    seoMeta: {
      title: processTemplateValue(template.seoMeta?.title, item) || item.title,
      description: processTemplateValue(template.seoMeta?.description, item) || item.excerpt,
      ogImage: processTemplateValue(template.seoMeta?.ogImage, item) || item.coverImage
    },
    meta: {
      type: 'collection-detail',
      category: 'content',
      collection: {
        type: collectionSlug,
        isDetail: true,
        itemSlug: item.slug
      }
    }
  };
}

/**
 * Process template props and replace variables with actual data
 * Supports dot notation for nested properties: {{item.author.name}}
 */
function processTemplateProps(props: any, item: any): any {
  if (!props) return {};

  if (Array.isArray(props)) {
    return props.map(prop => processTemplateProps(prop, item));
  }

  if (typeof props === 'object') {
    const processed: any = {};

    for (const [key, value] of Object.entries(props)) {
      processed[key] = processTemplateProps(value, item);
    }

    return processed;
  }

  if (typeof props === 'string') {
    return processTemplateValue(props, item);
  }

  return props;
}

/**
 * Replace template variables in a string
 * Examples:
 *   {{item.title}} -> "My Article Title"
 *   {{item.author.name}} -> "John Doe"
 */
function processTemplateValue(value: string, item: any): any {
  if (!value || typeof value !== 'string') {
    return value;
  }

  // Check if entire value is a variable
  const singleVarMatch = value.match(/^\{\{\s*item\.(.+?)\s*\}\}$/);
  if (singleVarMatch) {
    return getNestedProperty(item, singleVarMatch[1]);
  }

  // Replace multiple variables in string
  return value.replace(/\{\{\s*item\.(.+?)\s*\}\}/g, (match, path) => {
    const val = getNestedProperty(item, path);
    return val !== undefined ? String(val) : match;
  });
}

/**
 * Get nested property from object using dot notation
 * Example: getNestedProperty(obj, 'author.name')
 */
function getNestedProperty(obj: any, path: string): any {
  if (!path) return obj;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = result[key];
  }

  return result;
}

/**
 * Generate mock article detail page
 * This simulates what would come from the backend template system
 */
function getMockArticleDetailPage(slug: string): PageConfig | null {
  // Mock article data - in production this would come from CMS
  const mockArticles: Record<string, any> = {
    'getting-started': {
      slug: 'getting-started',
      title: 'Getting Started with Our Platform',
      excerpt: 'A comprehensive guide to help you get up and running quickly with all the essential features.',
      content: `
        <h2>Welcome to Our Platform</h2>
        <p>This comprehensive guide will help you get started with all the essential features of our platform. Whether you're a beginner or an experienced user, you'll find valuable insights here.</p>
        
        <h3>Installation</h3>
        <p>Getting started is easy. Simply follow these steps:</p>
        <ol>
          <li>Sign up for an account</li>
          <li>Download the necessary tools</li>
          <li>Follow the setup wizard</li>
          <li>Start building!</li>
        </ol>
        
        <h3>Key Features</h3>
        <p>Our platform offers a wide range of features designed to make your development process smooth and efficient:</p>
        <ul>
          <li>Intuitive drag-and-drop interface</li>
          <li>Real-time collaboration</li>
          <li>Advanced analytics</li>
          <li>Enterprise-grade security</li>
        </ul>
        
        <h3>Next Steps</h3>
        <p>Now that you're familiar with the basics, explore our advanced features and tutorials to take your skills to the next level.</p>
      `,
      coverImage: '/demo/images/blog/blog-1.png',
      author: 'John Doe',
      authorAvatar: '/demo/images/avatar/avatar-1.png',
      publishedDate: '2024-03-15',
      category: 'Tutorial',
      tags: ['Getting Started', 'Beginner', 'Tutorial'],
      readTime: '5 min read'
    },
    'advanced-tips': {
      slug: 'advanced-tips',
      title: 'Advanced Tips & Tricks',
      excerpt: 'Take your skills to the next level with these professional tips and advanced techniques.',
      content: `
        <h2>Advanced Techniques</h2>
        <p>Ready to level up? These advanced tips and tricks will help you become a power user.</p>
        
        <h3>Keyboard Shortcuts</h3>
        <p>Master these keyboard shortcuts to boost your productivity:</p>
        <ul>
          <li><code>Ctrl+S</code> - Save your work</li>
          <li><code>Ctrl+Z</code> - Undo changes</li>
          <li><code>Ctrl+Shift+P</code> - Command palette</li>
        </ul>
        
        <h3>Automation</h3>
        <p>Automate repetitive tasks with our built-in automation tools. Set up workflows that run automatically based on triggers.</p>
        
        <h3>Integration</h3>
        <p>Connect with your favorite tools and services through our extensive integration marketplace.</p>
      `,
      coverImage: '/demo/images/blog/blog-2.png',
      author: 'Jane Smith',
      authorAvatar: '/demo/images/avatar/avatar-2.png',
      publishedDate: '2024-03-12',
      category: 'Tips',
      tags: ['Advanced', 'Tips', 'Productivity'],
      readTime: '8 min read'
    },
    'scalable-apps': {
      slug: 'scalable-apps',
      title: 'Building Scalable Applications',
      excerpt: 'Learn how to architect and build applications that scale with your business growth.',
      content: `
        <h2>Scalability Fundamentals</h2>
        <p>Building applications that scale requires careful planning and architecture decisions from the start.</p>
        
        <h3>Architecture Patterns</h3>
        <p>Consider these proven architecture patterns:</p>
        <ul>
          <li>Microservices architecture</li>
          <li>Event-driven design</li>
          <li>CQRS pattern</li>
          <li>Load balancing strategies</li>
        </ul>
        
        <h3>Performance Optimization</h3>
        <p>Optimize your application for high performance with caching, database indexing, and CDN integration.</p>
      `,
      coverImage: '/demo/images/blocks/hero/hero-1.png',
      author: 'Mike Johnson',
      authorAvatar: '/demo/images/avatar/avatar-3.png',
      publishedDate: '2024-03-10',
      category: 'Development',
      tags: ['Architecture', 'Scalability', 'Performance'],
      readTime: '12 min read'
    }
  };

  const article = mockArticles[slug];
  if (!article) {
    // Return a generic article template for any slug not in our mock data
    return null;
  }

  // Build the page config using generic field components
  return {
    name: `article-${slug}`,
    path: `/articles/${slug}`,
    blocks: [
      // Hero section with article title and metadata
      {
        name: 'article-hero',
        type: 'custom',
        components: [
          {
            name: 'hero-container',
            component: 'BaseLayout',
            props: {
              layout: 'flex',
              direction: 'column',
              align: 'center',
              justify: 'center',
              padding: 'section',
              contentClass: 'max-w-4xl mx-auto text-center',
              class: 'px-12 bg-gradient-to-b from-primary-50 to-surface-0 dark:from-surface-800 dark:to-surface-900'
            },
            components: [
              {
                name: 'category-badge',
                component: 'H1_TextField',
                props: {
                  text: article.category,
                  class: 'text-primary-500 text-sm font-semibold uppercase mb-4'
                },
                content: {
                  title: article.category
                }
              },
              {
                name: 'article-title',
                component: 'H1_TextField',
                props: {
                  text: article.title,
                  class: 'text-5xl font-bold text-surface-900 dark:text-surface-0 mb-6'
                },
                content: {
                  title: article.title
                }
              },
              {
                name: 'article-excerpt',
                component: 'H1_TextField',
                props: {
                  text: article.excerpt,
                  class: 'text-xl text-surface-600 dark:text-surface-400 mb-8'
                },
                content: {
                  title: article.excerpt
                }
              },
              {
                name: 'article-metadata',
                component: 'Metadata',
                props: {
                  items: [
                    { label: 'Author', value: article.author, icon: 'pi pi-user' },
                    { label: 'Published', value: article.publishedDate, icon: 'pi pi-calendar' },
                    { label: 'Read Time', value: article.readTime, icon: 'pi pi-clock' }
                  ],
                  layout: 'horizontal',
                  separator: true,
                  class: 'justify-center'
                }
              }
            ]
          }
        ]
      },
      // Article cover image
      {
        name: 'article-image',
        type: 'custom',
        components: [
          {
            name: 'image-container',
            component: 'BaseLayout',
            props: {
              padding: 'section',
              contentClass: 'max-w-4xl mx-auto'
            },
            components: [
              {
                name: 'cover-image',
                component: 'ImageField',
                props: {
                  src: article.coverImage,
                  alt: article.title,
                  class: 'w-full rounded-xl shadow-2xl'
                }
              }
            ]
          }
        ]
      },
      // Article content
      {
        name: 'article-content',
        type: 'custom',
        components: [
          {
            name: 'content-container',
            component: 'BaseLayout',
            props: {
              padding: 'section',
              contentClass: 'max-w-3xl mx-auto'
            },
            components: [
              {
                name: 'article-body',
                component: 'Content',
                props: {
                  content: article.content,
                  format: 'html',
                  class: 'prose prose-lg dark:prose-invert max-w-none'
                }
              }
            ]
          }
        ]
      },
      // Article tags
      {
        name: 'article-tags',
        type: 'custom',
        components: [
          {
            name: 'tags-container',
            component: 'BaseLayout',
            props: {
              padding: 'md',
              contentClass: 'max-w-3xl mx-auto'
            },
            components: [
              {
                name: 'tags-label',
                component: 'H1_TextField',
                props: {
                  text: 'Tags:',
                  class: 'text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2'
                },
                content: {
                  title: 'Tags:'
                }
              },
              {
                name: 'tags-list',
                component: 'BaseLayout',
                props: {
                  layout: 'flex',
                  gap: 'sm',
                  wrap: true
                },
                components: article.tags.map((tag: string) => ({
                  name: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
                  component: 'H1_TextField',
                  props: {
                    text: tag,
                    class: 'px-3 py-1 w-fit bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm'
                  },
                  content: {
                    title: tag
                  }
                }))
              }
            ]
          }
        ]
      },
      // Share buttons
      {
        name: 'article-share',
        type: 'custom',
        components: [
          {
            name: 'share-container',
            component: 'BaseLayout',
            props: {
              padding: 'section',
              contentClass: 'max-w-3xl mx-auto border-t border-surface-200 dark:border-surface-700 pt-8'
            },
            components: [
              {
                name: 'share-buttons',
                component: 'ShareButtons',
                props: {
                  url: `https://example.com/articles/${slug}`,
                  title: article.title,
                  platforms: ['twitter', 'facebook', 'linkedin', 'email'],
                  layout: 'horizontal',
                  class: 'justify-center'
                }
              }
            ]
          }
        ]
      }
    ],
    seoMeta: {
      title: `${article.title} - Blog`,
      description: article.excerpt,
      ogImage: article.coverImage,
      author: article.author,
      publishedDate: article.publishedDate,
      type: 'article'
    },
    meta: {
      type: 'collection-detail',
      category: 'content',
      collection: {
        type: 'blog',
        isDetail: true,
        itemSlug: slug,
        parentPage: '/articles/blog'
      }
    }
  };
}

// Mock database of pages for development
function getMockPage(slugPath: string): PageConfig | null {

  const pages: Record<string, PageConfig> = {
    'home': {
      name: 'home',
      path: '/',
      blocks: [
        // Predefined Widget: Hero Section
        {
          name: "HeroWidget_2",
          component: "HeroWidget_2",
          type: "predefined",
          props: {
            title: "Uhuy",
            subtitle: "faster than ever before",
            description: "Transform your ideas into reality with our powerful platform",
            primaryButtonLabel: "Get Started",
            primaryButtonLink: "/signup",
            secondaryButtonLabel: "View Demo",
            secondaryButtonLink: "/demo",
            image: "/demo/images/blocks/hero/hero-1.png",
            imageAlt: "Product Screenshot"
          }
        },
        {
          name: "FeatureBlock",
          component: "FeatureBlock",
          type: "predefined",
          props: {
            title: "Empower Your Development",
            subtitle: "with Cutting-Edge Features",
            features: [
              {
                icon: "pi pi-cog",
                title: "Customizable",
                description: "Tailor the platform to fit your unique needs."
              },
              {
                icon: "pi pi-cloud",
                title: "Cloud-Based",
                description: "Access your projects from anywhere, anytime."
              },
              {
                icon: "pi pi-lock",
                title: "Secure",
                description: "Top-notch security to protect your data."
              }, {
                icon: "pi pi-thumbs-up",
                title: "User-Friendly",
                description: "Intuitive design for a seamless experience."
              }, {
                icon: "pi pi-shield",
                title: "Reliable",
                description: "99.9% uptime guarantee for uninterrupted access."
              }
            ]
          }
        },
        {
          name: "TestimonialsBlock",
          component: "TestimonialsBlock",
          type: "predefined",
          props: {
            title: "What Our Users Say",
            testimonials: [
              {
                quote: "This platform has revolutionized the way we develop applications. Highly recommended!",
                user: { name: "Jane Doe", role: "CTO, TechCorp" }
              },
              {
                quote: "The features and ease of use are unparalleled. It has boosted our productivity significantly.",
                user: { name: "John Smith", role: "Lead Developer, DevSolutions" }
              },
              {
                quote: "A game-changer in the industry. The support team is also fantastic!",
                user: { name: "Emily Johnson", role: "Product Manager, InnovateX" }
              }
            ],
          },
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
        // Predefined Widget: Highlights
        {
          name: 'HighlightsWidget',
          type: 'predefined',
          component: 'HighlightsWidget'
        },
        {
          name: 'pricing-section',
          type: 'predefined',
          component: 'GridViewBlock',
          props: {
            title: 'Choose Your Plan',
            description: 'Select the perfect plan for your needs',
            columns: '3',
            items: [
              {
                highlight: false,
                headerComponents: [
                  {
                    name: 'title',
                    component: 'H1_TextField',
                    props: {
                      text: 'Starter',
                      class: 'text-2xl font-bold text-surface-900 dark:text-surface-0'
                    },
                    content: {
                      title: 'Starter',
                    }
                  },
                  {
                    name: 'subtitle',
                    component: 'H1_TextField',
                    props: {
                      text: 'Perfect for individuals',
                      class: 'text-surface-600 dark:text-surface-400 text-sm'
                    },
                    content: {
                      description: 'Perfect for individuals',
                    }
                  }
                ],
                contentComponents: [
                  {
                    name: 'price',
                    component: 'H1_TextField',
                    props: {
                      class: 'text-5xl font-bold text-surface-900 dark:text-surface-0'
                    },
                    content: {
                      title: '$9/month',
                    }
                  },

                ],
                footerComponents: [
                  {
                    name: 'cta',
                    component: 'ButtonField',
                    props: {
                      label: 'Get Started',
                      class: 'w-full'
                    }
                  }
                ]
              },
              {
                highlight: true,
                highlightLabel: 'Most Popular',
                badgeComponents: [
                  {
                    name: 'badge',
                    component: 'H1_TextField',
                    props: {
                      value: 'Most Popular',
                      severity: 'success',
                      class: 'mb-4 text-sm'
                    }
                  }
                ],
                headerComponents: [
                  {
                    name: 'title',
                    component: 'H1_TextField',
                    props: {
                      text: 'Pro',
                      class: 'text-2xl font-bold text-surface-900 dark:text-surface-0'
                    },
                    content: {
                      title: 'Pro',
                    }
                  },
                  {
                    name: 'subtitle',
                    component: 'H1_TextField',
                    props: {
                      class: 'text-surface-600 dark:text-surface-400 text-sm'
                    },
                    content: {
                      description: 'Perfect for professionals',
                    }
                  }
                ],
                contentComponents: [
                  {
                    name: 'price',
                    component: 'H1_TextField',
                    props: {
                      text: '$29',
                      class: 'text-5xl font-bold text-surface-900 dark:text-surface-0'
                    },
                    content: {
                      title: '$29/month',
                    }
                  },
                ],
                footerComponents: [
                  {
                    name: 'cta',
                    component: 'ButtonField',
                    props: {
                      label: 'Start Free Trial',
                      class: 'w-full'
                    }
                  }
                ]
              }
            ]
          }
        },
        // Predefined Widget: Pricing
        {
          name: 'CTABlock',
          type: 'predefined',
          component: 'CTABlock',
          props: {
            title: 'Transform Your Workflow',
            description: 'AI-powered development tools',
            decorationLeft: '/images/light/line-6.svg',
            decorationRight: '/images/light/line-7.svg',
            showDecorations: false,
            class: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900',
            actions: [
              {
                label: 'Get Started',
                url: '/signup',
                variant: 'primary'
              }
            ]
          }
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
                title: 'Join Newsletter',
                description: 'Stay updated with our latest news and offers.'
              }
            },
            {
              name: 'button-cta',
              component: 'ButtonField',
              props: {
                label: 'Subscribe Now',
                rounded: true,
                severity: 'primary',
                size: 'large'
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
        ogImage: 'https://primefaces.org/cdn/primevue/images/landing/screen-1.png',
        type: 'website'
      },
      meta: {
        type: 'landing',
        category: 'utility'
      }
    },
    'highlights': {
      name: 'highlights',
      path: '/highlights',
      blocks: [
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
        description: 'Explore our award-winning features.',
        type: 'website'
      },
      meta: {
        type: 'static',
        category: 'content'
      }
    },
    'articles/blog': {
      name: 'blog',
      path: '/articles/blog',
      blocks: [
        {
          name: 'hero-block',
          type: 'custom',
          components: [
            {
              name: 'hero-layout',
              component: 'BaseLayout',
              props: {
                layout: 'flex',
                direction: 'column',
                align: 'center',
                justify: 'center',
                padding: 'section',
                contentClass: 'text-center',
                backgroundImage: '/demo/images/blocks/about/about-1.png',
                overlay: true,
                overlayColor: 'rgba(0, 0, 0, 0.8)',
                minHeight: '400px'
              },
              components: [
                {
                  name: 'title',
                  component: 'H1_TextField',
                  props: {
                    text: 'Blog & Articles',
                    class: 'text-white text-6xl font-bold mb-6'
                  },
                  content: {
                    title: 'Blog & Articles'
                  }
                },
                {
                  name: 'subtitle',
                  component: 'H1_TextField',
                  props: {
                    text: 'Insights, tutorials, and industry news',
                    class: 'text-white text-2xl mb-8'
                  },
                  content: {
                    title: 'Insights, tutorials, and industry news'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'blog-listing',
          type: 'predefined',
          component: 'ContentListingBlock',
          props: {
            dataSource: {
              type: 'api',
              endpoint: '/api/blog/posts',
              params: {}
            },
            fieldMapping: {
              thumbnail: 'featured_image',
              title: 'post_title',
              excerpt: 'post_excerpt',
              author: 'author_name',
              date: 'published_date',
              category: 'post_category',
              slug: 'post_slug'
            },
            itemComponent: {
              name: 'blog-card',
              component: 'BaseLayout',
              props: {
                layout: 'flex',
                direction: 'column',
                class: 'bg-surface-0 dark:bg-surface-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full'
              },
              components: [
                {
                  name: 'thumbnail',
                  component: 'ImageField',
                  props: {
                    src: '{{item.thumbnail}}',
                    alt: '{{item.title}}',
                    class: 'w-full object-cover',
                    height: '200px'
                  }
                },
                {
                  name: 'content',
                  component: 'BaseLayout',
                  props: {
                    layout: 'flex',
                    direction: 'column',
                    gap: 'sm',
                    padding: 'md',
                    class: 'h-fit'
                  },
                  components: [
                    {
                      name: 'category',
                      component: 'H1_TextField',
                      props: {
                        text: '{{item.category}}',
                        class: 'text-primary-500 text-sm font-semibold uppercase'
                      },
                      content: {
                        title: '{{item.category}}',
                      }
                    },
                    {
                      name: 'title',
                      component: 'H1_TextField',
                      props: {
                        text: '{{item.title}}',
                        class: 'text-2xl font-bold text-surface-900 dark:text-surface-0 text-xl mb-2'
                      },
                      content: {
                        title: '{{item.title}}',
                      }

                    },
                    {
                      name: 'excerpt',
                      component: 'H1_TextField',
                      props: {
                        text: '{{item.excerpt}}',
                        class: 'text-surface-600 dark:text-surface-400 mb-4 text-sm font-regular! line-clamp-3'
                      },
                      content: {
                        title: '{{item.excerpt}}',
                      }

                    },
                    {
                      name: 'meta',
                      component: 'BaseLayout',
                      props: {
                        layout: 'flex',
                        justify: 'between',
                        align: 'center',
                        class: ' pt-4 border-t border-surface-200 dark:border-surface-700'
                      },
                      components: [
                        {
                          name: 'author',
                          component: 'H1_TextField',
                          props: {
                            text: '{{item.author}}',
                            class: 'text-sm text-surface-600 dark:text-surface-400'
                          },
                          content: {
                            title: '{{item.author}}',
                          }
                        },
                        {
                          name: 'date',
                          component: 'H1_TextField',
                          props: {
                            text: '{{item.date}}',
                            class: 'text-sm text-surface-500'
                          },
                          content: {
                            title: '{{item.date}}',
                          }
                        }
                      ]
                    },
                    {
                      name: 'read-more',
                      component: 'ButtonField',
                      props: {
                        label: 'Read More',
                        link: '/articles/{{item.slug}}',
                        text: true,
                        class: 'p-0 mt-2'
                      }
                    }
                  ]
                }
              ]
            },
            layout: 'grid',
            columns: '3',
            gap: 'lg',
            pagination: {
              enabled: true,
              perPage: 6,
              type: 'numbered'
            },
            filters: {
              enabled: true,
              fields: ['category']
            }
          }
        }
      ],
      seoMeta: {
        title: 'Blog - Insights & Tutorials',
        description: 'Read our latest blog posts.',
        type: 'website'
      },
      meta: {
        type: 'collection-list',
        category: 'content',
        collection: {
          type: 'blog',
          isDetail: false
        }
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
        description: 'Stay updated with latest news.',
        type: 'website'
      },
      meta: {
        type: 'static',
        category: 'content'
      }
    }
  };

  // First check if it's a static page
  if (pages[slugPath]) {
    return pages[slugPath];
  }

  // If not found, check if it's an article detail page pattern: articles/[slug]
  const articleMatch = slugPath.match(/^articles\/([^/]+)$/);
  if (articleMatch) {
    const articleSlug = articleMatch[1];
    return getMockArticleDetailPage(articleSlug);
  }

  return null;
}

function getMockPage2(slugPath: string): PageConfig | null {
  console.log('[API Pages] Checking mock page for slug:', slugPath);
  const pages: any = newModelPages;
  console.log('[API Pages] Available mock pages:', pages[slugPath]);
  // First check if it's a static page
  if (pages[slugPath]) {
    return pages[slugPath];
  }

  // If not found, check if it's an article detail page pattern: articles/[slug]
  const articleMatch = slugPath.match(/^articles\/([^/]+)$/);
  if (articleMatch) {
    const articleSlug = articleMatch[1];
    return getMockArticleDetailPage(articleSlug);
  }

  return null;
}

