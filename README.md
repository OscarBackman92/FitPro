# FitPro Frontend Application

[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

FitPro is a comprehensive fitness tracking platform designed to help users stay on top of their workouts, monitor progress, and engage with a supportive community. Whether you're a fitness enthusiast, personal trainer, or someone looking to improve their health, this application provides the tools and features necessary to manage your fitness goals efficiently.

![Mockup](/documentation/readme_images/fitpro_mockup.png)

The live link can be found here: [Live Site - FitPro](https://frontendfitness-e0476c66fecb.herokuapp.com/)

## Table of Contents

1. [Strategy Plane](#strategy-plane)
2. [Epics](#epics)
3. [User Stories](#user-stories)
4. [Features](#features)
5. [Components](#components)
6. [Design & UX](#design--ux)
7. [Technologies Used](#technologies-used)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Credits](#credits)

## The Strategy Plane

### Site Goals

FitPro aims to create a supportive fitness community where users can:
- Track and log their workouts
- Monitor progress through detailed analytics
- Connect with other fitness enthusiasts
- Share achievements and motivate others
- Access workout history and statistics

### Project Management

This project was developed using agile methodologies by delivering small features in incremental sprints. There were 4 sprints in total, spaced out evenly over four weeks.

All stories were assigned to epics, prioritized under the labels Must have, Should have, Could have and assigned to sprints. "Must have" stories were completed first to ensure core functionality, followed by "should haves" and "could haves" as time permitted.

The Kanban board was created using github projects and can be located [here](https://github.com/users/OscarBackman92/projects/11/views/1) and can be viewed to see more information on the project cards. All stories except the documentation tasks have a full set of acceptance criteria to define the functionality that marks that story as complete.

### Target Audience

- Fitness enthusiasts
- Personal trainers
- Gym-goers
- Health-conscious individuals

## Epics

### Setup
- Initial React application configuration
- Dependencies installation
- Basic routing structure
- Authentication setup

### Authentication & User Management
- User registration
- Login/Logout functionality
- Password management
- Profile creation

### Workout Management
- Create workout entries
- View workout history
- Edit workout details
- Delete workouts
- Track workout statistics

### Social Features
- Social feed
- Like/comment functionality
- Activity sharing

### Profile Management
- View/edit profile information
- Track user statistics
- Manage personal preferences
- View workout history

### Dashboard & Analytics
- Personal dashboard
- Progress tracking
- Workout statistics
- Achievement tracking

## User Stories

### Authentication & User Management

* As a user, I can create a new account so that I can access personalized features
* As a user, I can log in to my account to access my personal data
* As a user, I can reset my password if I forget it
* As a user, I can logout to secure my account
* As a user, I can view my login status so I know whether I'm authenticated

### Workout Management

* As a logged-in user, I can create new workout entries
* As a user, I can view my workout history
* As a user, I can edit my workout details
* As a user, I can delete my workouts
* As a user, I can track my workout statistics

### Social Features

* As a user, I can like and comment on workouts
* As a user, I can share my workouts
* As a user, I can view a social feed of workouts
* As a user, I can search for other users

### Profile Management

* As a user, I can edit my profile information
* As a user, I can upload a profile picture
* As a user, I can view my workout statistics
* As a user, I can track my progress

## Features

### Navigation

The application features a responsive navigation system that adapts to different screen sizes and user authentication states.

#### Logged In Users See:
- Dashboard
- Workouts
- Social Feed
- Profile
- Sign Out
- Users Icon and Username

![Navbar Logged In](/documentation/readme_images/)

#### Logged Out Users See:
- Home
- Sign In
- Sign Up

![Navbar Logged Out](/documentation/readme_images/navbar_logged_out.png)

### Authentication Features

#### Sign Up
- Username validation and availability check
- Email format validation
- Password strength indicators
- Form validation with error messages
- Automatic login on successful registration
- Success/error toast notifications

![Sign Up Form](/documentation/readme_images/sign_up.png)

#### Sign In
- Remember me functionality
- Forgot password link
- Form validation
- Error handling
- JWT token management
- Success/error notifications

![Sign In Form](/documentation/readme_images/login.png)

#### Password Reset
- Email verification
- Secure token generation
- Reset form validation
- Success confirmation
- Security measures

![Reset Password](/documentation/readme_images/reset_pw.png)

### Dashboard

The dashboard serves as the central hub for users, providing:

#### Overview Section
- Total workout count
- Current week's workouts
- Workout streak counter
- Total workout minutes

#### Recent Activity
- Latest workouts display
- Quick access to workout details
- Edit/delete functionality
- Activity timestamps

![Dashboard Overview](/documentation/readme_images/dashboard_hero_image.png)

### Workout Management

#### Create Workout

- Workout type selection
- Duration input
- Intensity level selection
- Date picker
- Notes section
- Form validation
- Success/error handling

![Workout Form](/documentation/readme_images/workout_form.png)

#### Workout History

- Chronological workout list
- Filter by type/date
- Sort functionality
- Edit option
- Delete confirmation
- Pagination

#### Workout Details

- Complete workout information
- Edit functionality
- Delete option
- Share capability
- Comments section

### Social Features


#### Activity Feed

- Recent workouts from all users
- Like functionality
- Comment system
- Share workouts
- Infinite scroll

![Social Feed](/documentation/readme_images/feed.png)

#### Interaction Features

- Like/unlike workouts
- Add/edit/delete comments
- Share workouts
- User profile links

### Profile Features

#### Profile View

- User information display
- Profile image
- Workout statistics
- Recent activity
- Edit capabilities

#### Profile Edit

- Update personal information
- Change profile picture
- Modify preferences
- Password change
- Success/error handling

## Components

### Common Components

The application features a set of reusable components located in `/src/components/common`:

#### Avatar

- Versatile user avatar display
- Multiple size options (xs, sm, md, lg, xl)
- Image loading and fallback handling
- Status indicators
- Cloudinary image optimization

```jsx
<Avatar 
  src={userImage}
  size="md"
  showStatus={true}
  status="online"
/>
```

#### LoadingSpinner

- Configurable loading animation
- Multiple size options (sm, md, lg)
- Color variants (green, white, blue)
- Screen reader support

```jsx
<LoadingSpinner 
  size="md"
  color="green"
/>
```

#### ErrorMessage

- Standardized error display
- Consistent styling
- Built-in accessibility features

#### PrivateRoute

- Authentication route wrapper
- Redirect logic
- Loading state management
- Location state preservation

```jsx
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

#### NavBar

- Responsive navigation
- Dynamic menu based on auth state
- Mobile-friendly menu
- Smooth transitions

#### Footer

- Responsive layout
- Social media links
- Copyright information

### Profile Components

#### ProfileImageHandler

- Image upload and preview
- File validation
- Progress indicators
- Cloudinary optimization

```jsx
<ProfileImageHandler
  src={profileImage}
  onChange={handleImageChange}
  size="lg"
  editable={true}
/>
```

#### ProfileHeader

- User information display
- Stats visualization
- Action buttons
- Responsive design

### Dashboard Components

#### DashboardHeader

- Welcome message
- Date display
- User context integration

#### DashboardStats

- Statistics cards
- Dynamic data display
- Icon integration
- Responsive grid

### Social Components

#### SocialActions

- Like functionality
- Comment system
- Share capabilities
- Interactive feedback

#### WorkoutShareModal

- Workout sharing interface
- Preview functionality
- Social integration

### Props API

Key component props and interfaces:

```typescript
// Avatar Props
interface AvatarProps {
  src?: string;
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// LoadingSpinner Props
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'white' | 'blue';
}

// ProfileImageHandler Props
interface ProfileImageHandlerProps {
  src?: string;
  onChange: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  disabled?: boolean;
}
```

### Context Providers

#### CurrentUserContext

- Authentication state management
- User session handling
- Token management

#### ProfileDataContext

- Profile state management
- Profile data operations
- Cache handling

#### WorkoutContext

- Workout state management
- CRUD operations
- Data synchronization

### Custom Hooks

#### useClickOutsideToggle

```javascript
const useClickOutsideToggle = () => {
  // Handles click outside events for dropdowns/modals
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  // ... implementation
};
```

#### useRedirect

```javascript
const useRedirect = (userAuthStatus) => {
  // Handles authentication redirects
  // Manages protected routes
};
```

### Best Practices

When using these components:

1. Always provide alt text for images
2. Implement proper error handling
3. Use appropriate size props for consistent UI
4. Follow established prop patterns
5. Maintain responsive design principles

## Design & UX

### Color Scheme

The application uses a carefully selected color palette:

Primary Colors:
- Brand Green: `#10B981` - Used for primary actions and success states
- Dark Background: `#1F2937` - Main background color
- Light Text: `#F9FAFB` - Primary text color
- Accent Blue: `#3B82F6` - Used for links and secondary actions

Additional Colors:
- Input Background: `#374151`
- Border Color: `#4B5563`
- Error Red: `#EF4444`
- Warning Yellow: `#F59E0B`

### Typography

#### Primary Font: Inter
Used for headings and important text
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

#### Secondary Font: Open Sans
Used for body text and longer content
```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
```

### Layout & Responsive Design

The application follows a mobile-first approach with responsive breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Key layout principles:
- Consistent spacing using TailwindCSS utilities
- Flexible grid systems
- Responsive navigation
- Adaptive content layouts

### User Interface Elements

#### Buttons
- Primary: Green background, white text
- Secondary: Transparent with border
- Danger: Red background for destructive actions
- Disabled states with reduced opacity

#### Forms
- Clear label positioning
- Intuitive input sizing
- Visible validation states
- Helpful error messages

#### Cards
- Consistent padding and margins
- Subtle shadows for depth
- Responsive scaling
- Interactive hover states

## Technologies Used

### Core Technologies

#### Languages
- HTML5
- CSS3 (with Tailwind)
- JavaScript (ES6+)
- JSX

#### Frameworks & Libraries
- React 18.3.1
- React Router 6.27.0
- Axios 1.7.7
- TailwindCSS 3.x
- React Query
- React Hot Toast
- Date-fns
- JWT Decode

### Development Tools

#### Code Quality
- ESLint - Code linting
- Prettier - Code formatting
- Husky - Git hooks
- Jest - Testing framework
- React Testing Library - Component testing

#### Version Control & Deployment
- Git - Version control
- GitHub - Code repository
- VS Code - Code editor
- Chrome DevTools - Development and debugging
- Heroku - Application hosting

### UI Components & Libraries

#### Icon System
- Lucide React - Icon library
- Custom SVG implementations

#### UI Framework
- shadcn/ui components
- Custom React components
- Tailwind CSS utilities

#### Data Visualization
- Recharts - Chart library
- Custom SVG graphs

### Installation & Setup

#### Prerequisites
```bash
Node.js (v18.x+)
npm (v9.x+)
Git
```

#### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/fitpro-frontend.git
cd fitpro-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Update environment variables
```env
REACT_APP_API_URL=https://fitnessapi-d773a1148384.herokuapp.com
REACT_APP_DEFAULT_PROFILE_IMAGE=https://res.cloudinary.com/dufw4ursl/image/upload/v1/default_profile_ylwpgw
REACT_APP_CLOUDINARY_CLOUD_NAME=dufw4ursl
```

5. Start development server
```bash
npm start
```

## Deployment

### Heroku Deployment

The site was deployed to Heroku. The steps to deploy are as follows:

1. Navigate to heroku and create an account
2. Click the new button in the top right corner
3. Select create new app
4. Enter app name
5. Select region and click create app
6. Click the deploy tab
7. Scroll down to Connect to GitHub and sign in / authorize when prompted
8. In the search box, find the repository you want to deploy and click connect
9. Scroll down to Manual deploy and choose the main branch
10. Click deploy

The live link can be found here: [Live Site - FitPro](https://frontendfitness-e0476c66fecb.herokuapp.com/)

### Version Control

The site was created using the Visual Studio Code editor and pushed to github to the remote repository 'fitpro-frontend'.

The following git commands were used throughout development:

```git add <file>``` - This command was used to add the file(s) to the staging area before they are committed.

```git commit -m "commit message"``` - This command was used to commit changes to the local repository queue ready for the final step.

```git push``` - This command was used to push all committed code to the remote repository on github.

### Run Locally

Navigate to the GitHub Repository you want to clone to use locally:

1. Click on the code drop down button
2. Click on HTTPS
3. Copy the repository link to the clipboard
4. Open your IDE of choice (git must be installed for the next steps)
5. Type git clone copied-git-url into the IDE terminal

The project will now have been cloned on your local machine for use.

### Forking

Most commonly, forks are used to either propose changes to someone else's project or to use someone else's project as a starting point for your own idea.

1. Navigate to the GitHub Repository you want to fork.
2. On the top right of the page under the header, click the fork button.
3. This will create a duplicate of the full project in your GitHub Repository.

## Credits

### Code References

- React Documentation
- React Router Documentation
- JavaScript.info
- CSS-Tricks
- Stack Overflow solutions
- Code Institute's React Module

### Tools & Libraries

- React Bootstrap
- React Icons
- React Toastify
- React Hot Toast
- Date-fns
- Tailwind CSS
- Shadcn/ui components

### Known Bugs

1. Profile image upload is failing, debugging needed
2. Recent workouts in profile shows incorrect user's workouts
3. Mobile keyboard issues with weight/height inputs
4. Birth date display issues on mobile
5. Member since date validation error
6. Search and filter functionality incomplete
7. Missing home/about page images
8. Password reset not functional
9. Login page refresh required after logout

### Planned Improvements

1. Dark mode implementation
2. Push notifications
3. Offline support
4. Performance optimizations
5. Enhanced analytics
6. Resolution of all known bugs

### Acknowledgments

Special thanks to:
- Code Institute tutors
- Mentor Daisy
- Testing team/family
- Fellow developers who provided feedback
- Stack Overflow community

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
For testing documentation, visit the [TESTING.md](TESTING.md) file.