# Testing Documentation

## Manual Testing
Comprehensive testing was performed on all features of the FitTrack application. Below are the detailed test cases and results.

### Authentication Features

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Create new account | Click "Sign Up" in navbar, Fill in registration form with username and password, Submit form | Form submits successfully, Redirect to dashboard, Success toast message appears | Form submitted, Redirected to dashboard, Success message shown | ✅ Pass |
| Login to account | Click "Sign In" in navbar, Enter credentials, Submit form | Form submits successfully, Redirect to dashboard, Success toast message appears | Form submitted, Redirected to dashboard, Success message shown | ✅ Pass |
| Logout from account | Click user menu in navbar, Select "Logout", Confirm logout | Logout successful, Redirect to login page, Success toast message appears | Logged out, Redirected to login, Success message shown | ✅ Pass |

### Workout Management

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Log new workout | Click "Log Workout" button, Fill workout details (type, duration, intensity), Submit form | Form submits successfully, Workout appears in list, Success toast message appears | Form submitted, Workout visible in list, Success message shown | ✅ Pass |
| Modify existing workout | Open workout details, Click edit button, Modify details, Save changes | Changes save successfully, Updated workout displays, Success toast message appears | Changes saved, Updates visible, Success message shown | ✅ Pass |
| Remove workout | Open workout details, Click delete button, Confirm deletion | Workout removes from list, Success toast message appears, Return to workout list | Workout removed, Success message shown, Returned to list | ✅ Pass |
| View workout history | Navigate to workout history, Apply filters if needed | List of past workouts displays with correct information, Pagination works if applicable | Workout history displayed correctly, All information visible | ✅ Pass |

### Profile Features

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Update profile info | Navigate to profile, Click edit profile, Update information, Save changes | Changes save successfully, Profile updates display, Success toast message appears | Changes saved, Updates visible, Success message shown | ✅ Pass |
| Change profile image | Go to profile, Click profile image, Select new image, Confirm upload | Image uploads successfully, New image displays, Success toast message appears | Image uploaded, New image visible, Success message shown | ❌ Fail |

### Social Features

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Follow another user | View user profile, Click follow button, Confirm follow | Follow status updates, User appears in following list, Success toast message appears | Status updated, User in following list, Success message shown | ❌ Fail |
| Add comment | Open workout post, Type comment, Submit comment | Comment posts successfully, Comment appears in list, Success toast message appears | Comment posted, Comment visible, Success message shown | ✅ Pass |
| View social feed | Navigate to social feed, Scroll through posts | Feed loads correctly, Posts display with images and interactions | Feed loaded, Posts visible with interactions | ✅ Pass |
| Share workout | Complete workout, Click share button, Add caption if desired | Workout posts to feed, Appears in followers' feeds | Workout shared, Visible in feeds | ✅ Pass |
| React to shared workout | View shared workout, Click like/comment | Reaction registers, Updates in real-time | Reaction registered, Updates shown | ✅ Pass |

### Goals Features

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Create fitness goal | Navigate to goals, Click add goal, Set goal details, Save goal | Goal saves successfully, Goal appears in list, Success toast message appears | Goal saved, Goal visible, Success message shown | ❌ Fail |
| View goal progress | Open goals dashboard, Select goal, View progress | Progress displays correctly, Stats are accurate, Visual indicators show | Progress shown, Stats correct, Indicators visible | ❌ Fail |

### Responsive Design

| Description | Steps | Expected | Actual | Status |
|------------|-------|-----------|---------|---------|
| Test mobile layout | Open site on mobile, Navigate all features, Test interactions | Layout adjusts correctly, All features accessible, No horizontal scroll | Layout adjusted, Features working, No scroll issues | ✅ Pass |
| Test tablet layout | Open site on tablet, Navigate all features, Test interactions | Layout adjusts correctly, All features accessible, Proper spacing | Layout adjusted, Features working, Spacing correct | ✅ Pass |

## Testing Summary

### Results Overview

- Total Tests: 19
- Passed: 16
- Failed: 3
- Pass Rate: 84%

### Failed Tests:

1. Change profile image - Visibility issues
2. Follow another user - Missing button
3. Create fitness goal - Feature not implemented

### Testing Notes:

- Core workout tracking features working as expected
- Social features partially implemented
- Goals system needs implementation
- Profile image handling needs investigation

### Next Steps:

1. Fix profile image visibility issue
2. Implement follow user functionality
3. Complete goals system implementation
4. Add missing social features

## Lighthouse scores

![lighthouse](/documentation/readme_images/lighthouse_home.png)

![lighthouse](/documentation/readme_images/lighthouse_about.png)

![lighthouse](/documentation/readme_images/lighthouse_signup.png)

![lighthouse](/documentation/readme_images/lighthouse_signin.png)

![lighthouse](/documentation/readme_images/lighthouse_dashboard.png)

![lighthouse](/documentation/readme_images/lighthouse_workoutform.png)

![lighthouse](/documentation/readme_images/lighthouse_workoutlist.png)

![lighthouse](/documentation/readme_images/lighthouse_feed.png

![lighthouse](/documentation/readme_images/lighthouse_profilepage.png)
