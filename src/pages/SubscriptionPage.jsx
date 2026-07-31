import SubscriptionManagement from '../components/SubscriptionManagement.jsx';

export default function SubscriptionPage({ userId, premium, navigate, trackEvent }) {
  return (
    <SubscriptionManagement
      userId={userId}
      isPremium={premium}
      onNavigate={navigate}
      trackEvent={trackEvent}
    />
  );
}
