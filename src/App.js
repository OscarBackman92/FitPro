import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import { CurrentUserProvider } from './context/CurrentUserContext';

function App() {
  return (
    <Router>
      <CurrentUserProvider>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            {/* Routes will go here */}
          </Container>
        </div>
      </CurrentUserProvider>
    </Router>
  );
}

export default App;