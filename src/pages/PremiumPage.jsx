import PremiumPaywall from '../components/PremiumPaywall.jsx';

export default function PremiumPage({ analytics, setPage, handleUpgrade, userId }) {
  return (
    <PremiumPaywall
      onClose={() => { analytics.track('premium_paywall_closed'); setPage('dashboard'); }}
      onUpgrade={handleUpgrade}
      userId={userId}
      trackEvent={analytics.track}
    />
  );
}
