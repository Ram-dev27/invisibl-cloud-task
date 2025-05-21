# Dynamic Fields Project

A modern React application showcasing dynamic form fields and virtualized infinite scrolling using React Query and React Window.

## Features

### Dynamic Form
- Add and remove form fields dynamically
- Form validation using Zod
- Real-time error handling
- Success notifications with auto-dismiss
- Clean and responsive UI

### Virtualized Infinite Scroll
- Efficient data loading with React Query
- Virtualized list rendering using React Window
- Infinite scrolling with automatic data fetching
- Loading states and error handling
- Responsive design with Tailwind CSS

### General Features
- Dark/Light mode toggle
- Mobile-responsive design
- Modern UI with Tailwind CSS
- TypeScript support
- React Router for navigation

## Tech Stack

- React 19
- TypeScript
- Vite
- React Query (TanStack Query)
- React Router DOM
- React Window
- Tailwind CSS
- Zod (Form validation)
- Sonner (Toast notifications)
- Lucide Icons

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ram-dev27/invisibl-cloud-task.git
cd dynamic-fields
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── app-components/
│   │   └── header.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── pages/
│   ├── DynamicForm.tsx
│   └── InfiniteScroll.tsx
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features in Detail

### Dynamic Form
The dynamic form component allows users to:
- Add new form fields dynamically
- Remove existing fields
- Validate input using Zod schema
- Show real-time validation errors
- Display success messages with auto-dismiss

### Virtualized Infinite Scroll
The infinite scroll component demonstrates:
- Efficient data fetching with React Query
- Virtualized list rendering for performance
- Automatic loading of more data on scroll
- Loading states and error handling
- Responsive design with proper spacing

### Image
![image](https://github.com/user-attachments/assets/01a5562d-9d84-4ac1-be09-d3f061dc9e79)

## Mobile screen
![image](https://github.com/user-attachments/assets/5dc9f919-ada8-4d13-b50e-50d388ccb9af)

