# Home Page Example - Dynamic Blocks

## ✅ Summary of Changes

### 1. **Removed TopbarWidget** 
TopbarWidget was excluded from all pages as it's meant for navigation, not content blocks.

### 2. **Made Widgets Accept Dynamic Content**
Both `HeroWidget` and `FeaturesWidget` now accept props for customization.

---

## 🏠 Home Page Structure

The home page demonstrates a **hybrid approach** mixing:
- ✨ **Predefined Widgets** (HeroWidget, FeaturesWidget, etc.)
- 🔧 **Custom Blocks** (field-based compositions)

### API Response Example (`/api/pages/home`)

```json
{
  "name": "home",
  "path": "/",
  "blocks": [
    {
      "name": "HeroWidget",
      "type": "predefined",
      "component": "HeroWidget",
      "props": {
        "title": "Welcome to Our Platform",
        "subtitle": "Innovative Solutions",
        "description": "Transform your workflow with our cutting-edge platform.",
        "buttonLabel": "Get Started",
        "buttonLink": "/highlights",
        "image": "https://primefaces.org/cdn/primevue/images/landing/screen-1.png",
        "imageAlt": "Platform Overview"
      }
    },
    {
      "name": "FeaturesWidget",
      "type": "predefined",
      "component": "FeaturesWidget",
      "props": {
        "title": "Why Choose Us",
        "subtitle": "Discover what makes our platform special",
        "features": [
          {
            "icon": "pi-bolt",
            "title": "Lightning Fast",
            "description": "Optimized performance for the best user experience.",
            "bgColor": "bg-yellow-200",
            "iconColor": "text-yellow-700",
            "gradient": "linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))"
          },
          {
            "icon": "pi-shield",
            "title": "Secure",
            "description": "Enterprise-grade security to protect your data.",
            "bgColor": "bg-green-200",
            "iconColor": "text-green-700",
            "gradient": "linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))"
          },
          {
            "icon": "pi-users",
            "title": "Team Collaboration",
            "description": "Work together seamlessly with your team.",
            "bgColor": "bg-blue-200",
            "iconColor": "text-blue-700",
            "gradient": "linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))"
          }
        ]
      }
    },
    {
      "name": "hero-section",
      "type": "custom",
      "components": [
        {
          "name": "cta-title",
          "component": "H1_TextField",
          "content": {
            "title": "Ready to Get Started?",
            "description": "Join thousands of satisfied customers today."
          }
        },
        {
          "name": "cta-button",
          "component": "ButtonField",
          "props": { 
            "rounded": true, 
            "severity": "success", 
            "size": "large" 
          },
          "content": { 
            "label": "Start Free Trial", 
            "icon": "pi pi-check" 
          }
        }
      ],
      "props": {
        "class": "py-20 bg-surface-50 dark:bg-surface-900"
      }
    },
    {
      "name": "HighlightsWidget",
      "type": "predefined",
      "component": "HighlightsWidget"
    },
    {
      "name": "PricingWidget",
      "type": "predefined",
      "component": "PricingWidget"
    },
    {
      "name": "single-column",
      "type": "custom",
      "components": [
        {
          "name": "testimonials-title",
          "component": "H1_TextField",
          "content": {
            "title": "What Our Customers Say",
            "description": "Real stories from real customers."
          }
        },
        {
          "name": "customer-image",
          "component": "ImageField",
          "props": { 
            "class": "mx-auto rounded-full w-32 h-32 object-cover" 
          },
          "content": {
            "src": "https://primefaces.org/cdn/primevue/images/landing/avatar-1.png",
            "alt": "Happy Customer"
          }
        }
      ],
      "props": {
        "class": "py-16 text-center"
      }
    },
    {
      "name": "FooterWidget",
      "type": "predefined",
      "component": "FooterWidget"
    }
  ],
  "seoMeta": {
    "title": "Home - Welcome to Our Platform",
    "description": "Transform your workflow with our innovative platform.",
    "ogImage": "https://primefaces.org/cdn/primevue/images/landing/screen-1.png"
  }
}
```

---

## 🎨 Widget Customization Examples

### HeroWidget Props

```typescript
interface HeroWidgetProps {
  title?: string;           // Main heading
  subtitle?: string;        // Small text above title
  description?: string;     // Paragraph below title
  buttonLabel?: string;     // CTA button text
  buttonLink?: string;      // CTA button link
  image?: string;          // Hero image URL
  imageAlt?: string;       // Hero image alt text
}
```

**Example:**
```json
{
  "component": "HeroWidget",
  "props": {
    "title": "Build Amazing Apps",
    "subtitle": "Next Generation",
    "description": "Create stunning applications with our platform",
    "buttonLabel": "Start Building",
    "buttonLink": "/signup"
  }
}
```

### FeaturesWidget Props

```typescript
interface Feature {
  icon: string;        // PrimeIcons class: 'pi-bolt', 'pi-shield', etc.
  title: string;       // Feature title
  description: string; // Feature description
  bgColor: string;     // Tailwind bg class: 'bg-yellow-200'
  iconColor: string;   // Tailwind text class: 'text-yellow-700'
  gradient: string;    // CSS gradient string
}

interface FeaturesWidgetProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}
```

**Example:**
```json
{
  "component": "FeaturesWidget",
  "props": {
    "title": "Amazing Features",
    "subtitle": "Everything you need",
    "features": [
      {
        "icon": "pi-rocket",
        "title": "Fast Performance",
        "description": "Blazing fast load times",
        "bgColor": "bg-red-200",
        "iconColor": "text-red-700",
        "gradient": "linear-gradient(...)"
      }
    ]
  }
}
```

---

## 🚀 Testing the Home Page

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **You'll see:**
   - Custom Hero with dynamic content
   - Custom Features section with 3 features
   - Custom CTA block with button
   - Predefined HighlightsWidget
   - Predefined PricingWidget
   - Custom Testimonials block
   - Predefined FooterWidget

---

## 📝 Key Takeaways

### ✅ Predefined Widgets
- **Use when:** Consistent, complex UI sections
- **Customization:** Pass props to override defaults
- **Examples:** HeroWidget, FeaturesWidget, PricingWidget

### ✅ Custom Blocks
- **Use when:** Need flexibility or simple compositions
- **Customization:** Compose from field components
- **Examples:** CTA sections, testimonials, simple layouts

### ✅ Hybrid Approach
Mix both on the same page for maximum flexibility!

---

## 🎯 Next Steps

1. **Add more predefined widgets** (e.g., TestimonialsWidget, CTAWidget)
2. **Create more field components** (e.g., VideoField, CardField)
3. **Customize existing widgets** by passing different props
4. **Create page variations** by mixing different blocks

---

## 📚 Related Documentation

- See `BLOCK_MANAGEMENT_GUIDE.md` for complete architecture details
- Check `app/components/landing/` for available widgets
- Check `app/components/fields/` for available field components
