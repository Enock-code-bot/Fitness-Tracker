# Fitness Tracker

A comprehensive fitness management application built with React and TypeScript that helps users track their workouts, set goals, monitor hydration and steps, and compete with friends.

## Features

- **User Authentication**: Secure sign-up and login using Supabase
- **Dashboard**: Overview of weekly stats, progress charts, and recent activities
- **Workout Management**: Log, edit, and track various types of workouts with duration and calories
- **Goal Setting**: Set and monitor fitness goals with progress tracking
- **Water Tracking**: Monitor daily water intake with customizable goals
- **Step Counter**: Track daily steps and activity levels
- **Workout Templates**: Predefined templates for quick workout logging
- **Leaderboard**: Compete with friends and view community rankings

### Freemium Model

#### Free Tier
- Core features: workout logging, basic goals, dashboard overview
- Water and step tracking
- Basic workout templates
- Community leaderboard

#### Basic Premium ($5–10/month)
- AI-powered workout plans
- Advanced analytics and progress insights
- Wearables sync (Google Fit, Apple Health)
- Enhanced health assessments
- Priority customer support

#### Pro Premium ($15–25/month)
- All Basic Premium features
- Nutrition tracking and meal logging
- Advanced social challenges and competitions
- Data export and detailed reports
- Custom goal templates

#### Elite ($50+/month)
- All Pro Premium features
- 1-on-1 coaching sessions
- Direct trainer access
- Fully customized workout and nutrition plans
- Exclusive premium content and webinars
- **AI Chatbot**: Get fitness advice and motivation through an interactive chatbot

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fitness-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Run the migrations in the `supabase/migrations` folder
   - Or use Supabase CLI to apply migrations

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## How the App Works

### User Journey

1. **Authentication**: New users sign up with email and password. Existing users log in to access their personalized dashboard.

2. **Dashboard Overview**: Upon login, users see a comprehensive dashboard displaying:
   - Weekly workout statistics (total workouts, duration, calories burned)
   - Progress towards active goals
   - Recent workout history
   - Water intake and step tracking widgets
   - Weekly activity chart
   - Quick action buttons

3. **Workout Tracking**:
   - Navigate to the "Workouts" tab to log new workouts
   - Enter workout type, duration, calories burned, and notes
   - View, edit, or delete past workouts
   - Use workout templates for quick logging of common exercises

4. **Goal Management**:
   - Set fitness goals (e.g., number of workouts per week, total calories to burn)
   - Monitor progress on the dashboard
   - Track completion over time periods

5. **Health Tracking**:
   - **Water Tracker**: Log daily water consumption, set hydration goals
   - **Step Tracker**: Monitor daily steps and activity levels

6. **Social Features**:
   - View leaderboard to see how you rank against friends
   - Participate in challenges and competitions

7. **AI Assistance**: Use the AI chatbot for fitness advice, workout suggestions, and motivation.

### Data Flow

- All user data is stored securely in Supabase
- Real-time updates ensure data consistency across the app
- Authentication state is managed globally via React Context
- Charts and statistics are generated from workout and goal data

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
