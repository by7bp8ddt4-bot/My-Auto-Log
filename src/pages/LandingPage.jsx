import LandingPageComponent from '../components/LandingPage.jsx';

export default function LandingPage({ analytics, setPage }) {
  return (
    <LandingPageComponent
      onGetStarted={() => { analytics.track('landing_get_started'); setPage('auth'); }}
      onViewPremium={() => { analytics.track('landing_view_premium'); setPage('premium'); }}
    />
  );
}
