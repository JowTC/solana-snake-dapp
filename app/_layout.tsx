// Polyfills are handled in index.js (the custom entrypoint)
// See: https://docs.solanamobile.com/react-native/expo#step-3---update-appjs-with-polyfills
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
