# 🌐 Supported Languages

HeadForge supports 25+ programming languages with language-specific comment syntax and formatting. Each language has optimized templates for both simple and complete header styles.

## 📋 Complete Language List

### Web Technologies
- **HTML** - HyperText Markup Language
- **CSS** - Cascading Style Sheets
- **SCSS** - Sass CSS
- **JavaScript** - ECMAScript
- **TypeScript** - Typed JavaScript
- **JSX** - JavaScript XML (React)
- **TSX** - TypeScript XML (React)
- **Vue** - Vue.js templates

### Backend Languages
- **Python** - General-purpose programming
- **Java** - Object-oriented programming
- **C#** - Microsoft .NET
- **C++** - System programming
- **Go** - Google's programming language
- **Rust** - Systems programming
- **PHP** - Web development
- **Ruby** - Dynamic programming

### Data & Query Languages
- **SQL** - Structured Query Language
- **GraphQL** - Query language for APIs

### Configuration & Markup
- **YAML** - Human-readable data serialization
- **JSON** - JavaScript Object Notation
- **XML** - Extensible Markup Language
- **Markdown** - Lightweight markup language

### Scripting & Automation
- **Bash** - Unix shell scripting
- **PowerShell** - Windows automation
- **Dockerfile** - Container configuration

### Specialized Languages
- **R** - Statistical computing
- **Lua** - Embedded scripting
- **Perl** - Text processing
- **Haskell** - Functional programming

## 🎨 Language-Specific Features

### Comment Syntax
Each language uses its native comment syntax:

```javascript
// JavaScript - Single line
/* JavaScript - Multi-line */
```

```python
# Python - Single line
```

```html
<!-- HTML - Comments -->
```

```css
/* CSS - Comments */
```

```sql
-- SQL - Single line
```

### Template Customization
Headers are automatically formatted for each language:

- **File Extensions**: Correct extensions (`.js`, `.py`, `.java`, etc.)
- **Comment Styles**: Native comment syntax
- **Formatting**: Language-appropriate spacing and structure
- **Conventions**: Follows language-specific best practices

## 🔧 Adding New Languages

Want to add support for a new language? HeadForge is designed to be extensible:

1. **Fork the Repository**: Create your own copy
2. **Add Language Config**: Update `language-configs.ts`
3. **Create Templates**: Design simple and complete templates
4. **Test**: Ensure proper formatting
5. **Submit PR**: Contribute back to the project

### Language Configuration Example

```typescript
{
  id: 'newlanguage',
  name: 'New Language',
  extension: '.nl',
  commentLine: '//',
  commentStart: '/*',
  commentEnd: '*/',
  category: 'Programming',
  template: `// {{fileName}}
// {{project}}
// Author: {{author}}
// Version: {{version}}`,
  templateComplete: `/*
 * {{fileName}}
 * {{project}}
 * Author: {{author}}
 * Version: {{version}}
 */`
}
```

## 📊 Language Statistics

- **Total Languages**: 25+
- **Web Technologies**: 8 languages
- **Backend Languages**: 8 languages
- **Data Languages**: 2 languages
- **Configuration**: 4 languages
- **Scripting**: 3 languages

## 🎯 Language Categories

### **Web Development**
Perfect for frontend and full-stack developers working with modern web technologies.

### **Backend Development**
Ideal for server-side development, APIs, and system programming.

### **Data Science**
Great for data analysis, machine learning, and database management.

### **DevOps & Automation**
Perfect for infrastructure, deployment, and automation scripts.

### **Academic & Research**
Suitable for scientific computing, research, and academic projects.

## 🔄 Language Updates

HeadForge regularly updates language support:

- **New Languages**: Added based on community requests
- **Syntax Updates**: Kept current with language evolution
- **Template Improvements**: Enhanced based on user feedback
- **Best Practices**: Updated to reflect current standards

## 💡 Language Tips

### **JavaScript/TypeScript**
- Use JSDoc-style comments for better IDE support
- Include type information in TypeScript headers

### **Python**
- Follow PEP 8 conventions
- Include docstring information

### **Java**
- Use standard JavaDoc format
- Include package and import information

### **HTML/CSS**
- Include viewport and meta information
- Specify CSS framework or methodology

## 🆘 Language Support

Need help with a specific language?

1. **Check Examples**: Look at generated headers for reference
2. **Community**: Ask questions in our GitHub discussions
3. **Contribute**: Help improve language support
4. **Request**: Suggest new languages via GitHub issues

---

*Ready to generate headers for your favorite language? Check out our [Quick Start Guide](Quick-Start.md)!*
