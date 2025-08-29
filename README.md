# 🚐 wuecamper

**Community-funded Campervan Project in Würzburg**

A crowdfunding platform for a shared campervan experience where the community collectively funds and uses a campervan conversion project.

## 🎯 Project Vision

**wuecamper** is a community-driven project where multiple people contribute to funding a campervan conversion and share usage time. The goal is to make vanlife accessible and affordable while building a community around shared adventures.

### Key Concept
- **50€ per day** usage cost
- **2-week minimum** booking requirement (€700 minimum)
- **€25,000 total budget**: €15k personal investment + €10k community crowdfunding
- **200 days** needed to reach the €10k community funding goal

## ✨ Features

### 🗓️ **Advanced Booking System**
- Date-based reservations with 2-week minimum stays
- Real-time availability checking
- Booking conflict prevention
- Mobile-optimized date picker

### 📊 **Live Project Tracking**
- Real-time budget progress (€15k personal + community contributions)
- Booking progress toward 200-day funding goal
- Project milestones and timeline
- Transparent financial tracking

### 👤 **User Dashboard**
- Personal booking management
- Contribution impact visualization
- Booking cancellation with confirmation
- User contribution percentage display

### 🔐 **Authentication & Security**
- Supabase authentication with protected routes
- Row Level Security (RLS) policies
- Mobile-optimized login experience
- Email verification system

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### 1. Clone & Install
```bash
git clone https://github.com/your-username/wuecamper.git
cd wuecamper
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
```bash
# Run the schema in your Supabase SQL editor
# File: supabase-schema.sql
```

### 4. Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── actions/           # Server actions
│   │   ├── date-bookings.ts
│   │   └── project-budget.ts
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   └── page.tsx         # Landing page
├── components/
│   ├── auth/            # Auth components
│   ├── booking/         # Booking system
│   ├── sections/        # Page sections
│   └── ui/              # UI components
├── lib/
│   ├── supabase/        # Supabase configuration
│   └── utils.ts         # Utilities
├── types/
│   └── booking.ts       # TypeScript types
└── supabase-schema.sql  # Database schema
```

## 🗄️ Database Schema

### Main Tables
- **`date_bookings`**: User reservations with date ranges
- **`profiles`**: Extended user information

### Key Features
- Booking overlap prevention with PostgreSQL functions
- Cost validation (minimum €700 for 14 days)
- Status tracking (pending/confirmed/cancelled)
- Public read access for availability display

## 🎨 Design System

- **Colors**: Earth tones (#D4A574, #4A5D23, #2B5F75)
- **Dark Theme**: Consistent across all components
- **Mobile-First**: Responsive design optimized for mobile usage
- **Animations**: Smooth transitions with Framer Motion

## 🧪 Key Components

### `WuecamperDatePicker`
Custom date range picker with:
- 2-week minimum validation
- Blocked date visualization
- German localization
- Real-time cost calculation

### `ProtectedRoute`
Authentication wrapper with:
- Auto-redirect for unauthenticated users
- Loading states
- Auth state monitoring

### Project Budget Tracker
Real-time tracking of:
- Personal investment (€15k)
- Community contributions
- Progress toward €25k total goal
- Booking progress toward 200-day target

## 📱 Mobile Optimization

- **iOS Safari Compatible**: Fixed mobile login redirection issues
- **Touch-Friendly**: Large touch targets and mobile gestures
- **Responsive**: Optimized for all screen sizes
- **PWA-Ready**: Service worker support for offline usage

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### Docker
```bash
docker build -t wuecamper .
docker run -p 3000:3000 wuecamper
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Contact

**Julian Krämer**
- Email: juliankraemer184@gmail.com
- Project: wuecamper Community Campervan

---

*Made with ❤️ for the vanlife community in Würzburg*