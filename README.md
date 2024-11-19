# FitPro Frontend Application

[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/xxxxx/deploy-status)](https://app.netlify.com/sites/fittrack/deploys)

## Project Goals & Strategy

### Primary Goals

- Create an intuitive fitness tracking interface
- Enable social interaction between users
- Provide visual progress tracking
- Ensure mobile-first, responsive design
- Maintain high performance and accessibility

### Target Audience

- Fitness enthusiasts
- Personal trainers
- Gym-goers
- Health-conscious individuals


### User Story Prioritization

- Must Have (Core functionality)
- Should Have (Important features)
- Could Have (Nice to have features)
- Won't Have (Future considerations)

[View Project Board](https://github.com/users/OscarBackman92/projects/11/views/1)

## Design & UX

### Color Scheme

Primary Colors:

- Brand Green: `#10B981`
- Dark Background: `#1F2937`
- Light Text: `#F9FAFB`
- Accent Blue: `#3B82F6`

### Typography

- Primary Font: Inter (Headers)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

```

- Secondary Font: Open Sans (Body)

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
```

## Features with Screenshots

### Authentication

- User registration
![register](/documentation/readme_images/sign_up.png)

- Login/Logout
![login](/documentation/readme_images/login.png)
- Password reset
![reset](/documentation/readme_images/reset_pw.png)
- JWT token management

### Dashboard

![Dashboard](documentation/readme_images/dashboard_hero_image.png)

- Workout summary
- Recent activities
- Quick actions

### Workout Tracking

![Workout Form](documentation/readme_images/workout_form.png)

- Create workouts
- Track duration & intensity
- Add notes
- View history

### Social Features

![Social Feed](documentation/readme_images/feed.png)

- Activity feed
- Like & comment
- Share workouts

## Installation & Setup

### Prerequisites

- Node.js (v18.x+)
- npm (v9.x+)
- Git

### Installation Steps

```bash
# Clone repository
git clone https://github.com/OscarBackman92/FitPro

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm start
```

### Required Packages

```json
{
  "dependencies": {
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "axios": "^1.7.7",
    "date-fns": "^2.30.0",
    "jwt-decode": "^4.0.0",
    "react": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "recharts": "^2.13.3"
  }
}
```

## Cross-Browser Compatibility

Tested on:
| Browser | Version | Status |

|---------|---------|---------|
| Chrome  | 120.0   | ✅ Pass |
| Firefox | 119.0   | ✅ Pass |
| Safari  | 17.0    | ✅ Pass |
| Edge    | 120.0   | ✅ Pass |

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ratios
- Screen reader testing

### Lighthouse Scores

- See testing file for lighthouse scores.
- [TESTING.md](TESTING.md)

## Known Bugs & Future Improvements

### Known Issues

1. Profile image upload occasionally fails
2. Goal tracking feature incomplete
3. Social feed pagination issues

### Planned Improvements

1. Dark mode implementation
2. Push notifications
3. Offline support
4. Performance optimizations
5. Enhanced analytics

## CORS & Security

### CORS Configuration

```javascript
// axios configuration
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

### Security Measures

- JWT token refresh
- XSS prevention
- CSRF protection
- Secure cookie handling

## Tools & Technologies

### Core Technologies

- React 18.3.1
- React Router 6.27.0
- Axios 1.7.7
- React Query
- Tailwind CSS
- Recharts

### Development Tools

- ESLint
- Prettier
- Husky
- Jest
- React Testing Library
- Cypress

### Design Tools

- Figma
- Adobe XD
- Lucide Icons

## Credits

### Code Resources

- React Documentation
- React Router Documentation
- JavaScript.info
- CSS-Tricks
- Stack Overflow solutions

### Tools & Libraries

- React Bootstrap
- React Icons
- React Toastify
- React Hot Toast
- Date-fns

### Tutorials

- Code Institute's React Module
- Traversy Media Tutorials
- Net Ninja React Series
- Kent C. Dodds Blog

## Acknowledgments

Special thanks to:

- Code Institute tutors
- Project mentor
- Testing team
- UX reviewers
- Fellow developers who provided feedback

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For API documentation, visit the [Backend README](../backend/README.md)

For testing documentation, visit the [TESTING.md](TESTING.md)