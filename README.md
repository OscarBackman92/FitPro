# FitPro Frontend Application

FitPro is a comprehensive fitness tracking and social platform designed to help users monitor their workout progress, connect with fellow fitness enthusiasts, and maintain their health goals. Whether you're a beginner starting your fitness journey or an experienced athlete, FitPro provides the tools and community support needed to achieve your fitness objectives.

![Mockup](/documentation/readme_images/mockup.png)

## The Strategy Plane

### Site Goals

FitPro aims to create a supportive fitness community where users can:

- Track and log their workouts
- Monitor progress through detailed analytics
- Connect with other fitness enthusiasts
- Share achievements and motivate others
- Access workout history and statistics

### Agile Planning

This project was developed using agile methodologies, delivering small features in incremental sprints. There were 4 sprints in total, spaced out evenly over four weeks.

All stories were assigned to epics, prioritized under the labels Must have, Should have, and Could have, then assigned to sprints. "Must have" stories were completed first to ensure core functionality, followed by "should haves" and "could haves" as time permitted.

The Kanban board was created using GitHub Projects and can be found [here](https://github.com/yourusername/project-board-link). All user stories have detailed acceptance criteria defining the functionality required for completion.

![Kanban Board](/documentation/readme_images/kanban.png)

## Epics

**Setup**

- Initial React application configuration
- Dependencies installation
- Basic routing structure
- Authentication setup

**Authentication & User Management**

- User registration
- Login/Logout functionality
- Password management
- Profile creation

**Workout Management**

- Create workout entries
- View workout history
- Edit workout details
- Delete workouts
- Track workout statistics

**Social Features**

- Social feed
- Like/comment functionality
- User following system
- Activity sharing

**Profile Management**

- View/edit profile information
- Track user statistics
- Manage personal preferences
- View workout history

**Dashboard & Analytics**

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
* As a user, I can categorize my workouts by type

### Social Features

* As a user, I can follow other users
* As a user, I can like and comment on workouts
* As a user, I can share my workouts
* As a user, I can view a social feed of workouts
* As a user, I can search for other users

### Profile Management

* As a user, I can edit my profile information
* As a user, I can upload a profile picture
* As a user, I can view my workout statistics
* As a user, I can set my fitness goals
* As a user, I can track my progress

### Dashboard & Analytics

* As a user, I can view my workout trends
* As a user, I can track my personal records
* As a user, I can see my recent activity
* As a user, I can view my achievement badges
* As a user, I can analyze my workout data

## The Structure Plane

### Features

#### Navigation

The application features a responsive navigation system that adapts to different screen sizes and user authentication states.

**Logged In Users See:**

- Dashboard
- Workouts
- Social Feed
- Profile
- Sign Out

![Logged In Navigation](/documentation/readme_images/nav_logged_in.png)

**Logged Out Users See:**

- Home
- About
- Sign In
- Sign Up

![Logged Out Navigation](/documentation/readme_images/nav_logged_out.png)

#### Authentication System

The application implements a comprehensive authentication system with the following features:

**Sign Up:**

- Username/email validation
- Password strength requirements
- Account creation confirmation

![Sign Up Form](/documentation/readme_images/signup_form.png)

**Sign In:**

- Secure login process
- Remember me functionality
- Password reset option

![Sign In Form](/documentation/readme_images/signin_form.png)

#### Dashboard

The dashboard provides users with an overview of their fitness journey:

- Recent workout summary
- Progress charts
- Activity feed
- Quick action buttons

![Dashboard Overview](/documentation/readme_images/dashboard_overview.png)

#### Workout Management

Users can manage their workouts through an intuitive interface:

**Create Workout:**
- Type selection
- Duration tracking
- Intensity setting
- Notes addition

![Create Workout Form](/documentation/readme_images/workout_form.png)

**Workout History:**
- Filterable list view
- Detailed workout information
- Edit/delete capabilities

![Workout History](/documentation/readme_images/workout_history.png)

#### Social Features

The social aspects of the application include:

**Social Feed:**
- Activity stream
- Like/comment functionality
- Share workouts
- Follow other users

![Social Feed](/documentation/readme_images/social_feed.png)

#### Profile Management

Users can manage their profiles with features including:

- Profile information editing
- Profile picture upload
- Statistics viewing
- Achievement tracking

![Profile Management](/documentation/readme_images/profile_management.png)

### Future Features

1. **Advanced Analytics Dashboard**
   - Detailed performance metrics
   - Custom report generation
   - Goal tracking visualization

2. **Workout Plans**
   - Pre-made workout templates
   - Custom plan creation
   - Progress tracking

3. **Social Features Enhancement**
   - Direct messaging
   - Group creation
   - Challenges system

4. **Mobile Application**
   - Native mobile experience
   - Offline functionality
   - Push notifications

## The Skeleton Plane

## The Surface Plane

### Design

#### Color Scheme

The application uses a carefully selected color palette:

- Primary Green: `#10B981`
- Dark Background: `#1F2937`
- Light Text: `#F9FAFB`
- Accent Blue: `#3B82F6`

#### Typography

The application uses two main fonts:

- Primary Font: Inter (Headers)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

- Secondary Font: Open Sans (Body)

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
```

#### Imagery

The application uses:

- Custom icons from Lucide React
- User-uploaded profile images
- Placeholder images for development
- SVG graphics for illustrations

## Technologies Used

### Core Technologies

- React 18.3.1
- React Router 6.27.0
- Axios 1.7.7
- TailwindCSS
- React Query
- React Hot Toast

### Development Tools

- ESLint
- Prettier
- Git
- GitHub
- VS Code
- Chrome DevTools

### Additional Libraries

- date-fns
- lucide-react
- recharts
- shadcn/ui

## Testing

Comprehensive testing information can be found in the [TESTING.md](TESTING.md) file.

## Deployment

### Production Deployment

The application is deployed on Heroku. The live site can be found at: [FitPro Live Site](https://frontendfitness-e0476c66fecb.herokuapp.com/)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fitpro-frontend.git
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

```bash
cp .env.example .env.local
```

4. Start development server:

```bash
npm start
```

## Credits

### Code References

- React Documentation
- TailwindCSS Documentation
- Stack Overflow solutions
- YouTube tutorials (referenced in comments)

### Media

- Icons from Lucide React
- Placeholder images from various sources
- User-uploaded content

### Acknowledgements

- Code Institute tutors
- Mentor support
- Fellow developers who provided feedback
- Stack Overflow community

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.