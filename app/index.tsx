import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to the camera tab
  return <Redirect href="/(tabs)/camera" />;
}

