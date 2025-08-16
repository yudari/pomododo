# Pomododo - Your Personal Pomodoro & Task Manager

Pomododo is a simple yet effective web application designed to help you manage your tasks and boost your productivity using the Pomodoro Technique. It combines a customizable Pomodoro timer with a task management system and a calendar view to keep track of your schedule.

## Features

*   **Pomodoro Timer**:
    *   Configurable focus time, short break, and long break durations.
    *   Session tracking and progress display.
    *   Audio cues for session transitions.
*   **Task Management**:
    *   Add, update, and delete tasks.
    *   Assign focus time, break times, and repetition cycles to each task.
    *   Mark tasks as current to integrate with the Pomodoro timer.
    *   **Task Status Tracking**: Tasks are automatically marked as 'overdue' if their scheduled date/time has passed and they are still pending. Tasks are marked as 'completed' upon successful completion of their sessions.
*   **Calendar View**:
    *   Visualize your scheduled tasks on a calendar.
    *   **Visual Task Status**: Overdue tasks are highlighted in red, and completed tasks are highlighted in green on the calendar.
    *   **Improved Time Display**: Task times on the calendar are now displayed in a clear `HH:MM AM/PM` format.
*   **Responsive Design**: Optimized for various screen sizes.
*   **Hidden Scrollbars**: Scrollbars in the calendar and task list components are now hidden for a cleaner UI, while maintaining full scrolling functionality.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite**: A fast build tool that provides a lightning-fast development experience.
*   **Styled Components**: For writing CSS in JavaScript.
*   **Framer Motion**: A production-ready motion library for React.
*   **FullCalendar**: A JavaScript event calendar library.
*   **uuid**: For generating unique IDs for tasks.

## Installation and Usage

To get started with Pomododo, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yudari/pomododo.git
    cd pomododo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

    This will start the application in development mode, usually accessible at `http://localhost:5173`.

4.  **Build for production (optional)**:
    ```bash
    npm run build
    ```

    This will create a `dist` directory with the production-ready build.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
