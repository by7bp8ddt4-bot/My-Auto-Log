import AuthPageComponent from '../components/AuthPage.jsx';

export default function AuthPage({ auth, navigate }) {
  return <AuthPageComponent onAuth={auth} onNavigate={navigate} />;
}
