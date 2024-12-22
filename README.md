# FitPro Frontend Application

[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

FitPro is a comprehensive fitness tracking platform designed to help users stay on top of their workouts, monitor progress, and engage with a supportive community. Whether you're a fitness enthusiast, personal trainer, or someone looking to improve their health, this application provides the tools and features necessary to manage your fitness goals efficiently.

![Mockup](/documentation/readme_images/fitpro_mockup.png)

The live link can be found here: [Live Site - FitPro](https://frontendfitness-e0476c66fecb.herokuapp.com/)

## Table of Contents

1. [Strategy Plane](#the-strategy-plane)
2. [Epics](#epics)
3. [User Stories](#user-stories)
4. [Features](#features)
5. [React Architecture](#react-architecture)
   - [Component Architecture](#component-architecture)
   - [State Management](#state-management)
   - [Performance Optimization](#performance-optimization)
6. [Design & UX](#design--ux)
7. [Technologies Used](#technologies-used)
8. [Deployment](#deployment)
9. [Credits](#credits)

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

#### Logged In Users See

- Dashboard
- Workouts
- Social Feed
- Profile
- Sign Out
- Users Icon and Username

![Navbar Logged In](/documentation/readme_images/navbar_logged_in.png)

#### Logged Out Users See

- Home
- About
- Sign In
- Sign Up

![Navbar Logged Out](/documentation/readme_images/navbar.png)

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
- Form validation
- Error handling
- JWT token management
- Success/error notifications

![Sign In Form](/documentation/readme_images/sign_in.png)

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

![Dashboard Overview](/documentation/readme_images/dashboard.png)

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

![Workout History](/documentation/readme_images/workout_history.png)

#### Workout Details

- Complete workout information
- Edit functionality
- Delete option
- Share capability
- Comments section

![Details](/documentation/readme_images//workout_details.png)

### Social Features

#### Activity Feed

- Recent workouts from all users
- Like functionality
- Comment system
- Share workouts
- Infinite scroll

![Share modal](/documentation/readme_images/share.png)

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

![Profile](/documentation/readme_images/profile.png)

#### Profile Edit

- Update personal information
- Change profile picture
- Modify preferences
- Password change
- Success/error handling

![Edit](/documentation/readme_images/profile_edit.png)

## React Architecture

The FitPro application implements a modern React architecture focusing on component reusability, efficient state management, and performance optimization. This architectural approach enables rapid development, maintainable code, and an optimal user experience.

### Component Architecture

#### Why Reusable Components?

The application heavily utilizes reusable components for several key benefits:

- **Development Efficiency**: Common UI elements are developed once and reused across multiple features, significantly reducing development time and effort
- **Consistent User Experience**: Users encounter familiar, predictable component behavior throughout the application
- **Simplified Maintenance**: Updates to a component automatically propagate to all instances, making maintenance and bug fixes more efficient
- **Enhanced Testing**: Components can be tested in isolation, improving test coverage and reliability
- **Optimized Bundle Size**: Code reuse results in a smaller application footprint
- **Better Performance**: Once optimized, a component's performance improvements benefit all features using it

Example of component reuse impact:
```jsx
// Avatar component used in multiple features
<Avatar src={userImage} size="md" /> // Profile page
<Avatar src={commentUser} size="sm" /> // Comments
<Avatar src={posterImage} size="lg" /> // Social posts

// Reduces what could be 100+ lines of duplicate code to just a few lines
```

### State Management

The application uses a strategic approach to state management:

#### Context Providers

Custom contexts handle different aspects of application state:

```jsx
// Authentication state management
const { currentUser, isLoading } = useCurrentUser();

// Workout data management
const { workouts, addWorkout } = useWorkoutContext();

// Profile data management
const { profileData, updateProfile } = useProfileContext();
```

This separation of concerns makes the application more maintainable and easier to debug.

#### Custom Hooks

The application includes several custom hooks that encapsulate complex functionality:

```javascript
// Prevent excessive API calls
const debouncedSearch = useDebounce(searchTerm, 300);

// Standardize data fetching with loading states
const { data, loading, error } = useFetchData(fetchFunction);

// Handle infinite scrolling
const lastElementRef = useInfiniteScroll(loadMore, hasMoreData);
```

### Performance Optimization

The architecture includes several performance optimizations:

1. **Code Splitting**
```javascript
// Lazy loading of components
const Dashboard = lazy(() => import('./components/Dashboard'));
```

2. **Memoization**
```javascript
// Prevent unnecessary re-renders
const MemoizedComponent = useMemo(() => <Component />, [dependency]);
```

3. **Efficient Rendering**
```javascript
// Use callback for stable function references
const handleClick = useCallback(() => {
  // Handle click event
}, [dependency]);
```

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
- ClaudeAI/Chatgpt

### Tools & Libraries

- React Bootstrap
- React Icons
- React Toastify
- React Hot Toast
- Date-fns
- Tailwind CSS
- Shadcn/ui components

### Planned Improvements

1. Light/Dark mode implementation
2. Push notifications
3. Offline support
4. Performance optimizations
5. Enhanced analytics

### Acknowledgments

- React Documentation contributors
- Stack Overflow community

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
For testing documentation, visit the [TESTING.md](TESTING.md) file.
