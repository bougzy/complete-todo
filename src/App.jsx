
import TodoList from './TodoList';
import { ThemeProvider } from './ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <TodoList />
    </ThemeProvider>
  );
};

export default App;
