import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useUserRole } from '../hooks/useUserRole';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { role, isLoaded: roleLoaded } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (authLoaded && roleLoaded) {
      if (!isSignedIn) {
        router.replace('/login');
      } else if (role !== 'admin') {
        router.replace('/home');
      }
    }
  }, [authLoaded, roleLoaded, isSignedIn, role]);

  if (!authLoaded || !roleLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (role !== 'admin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Access Denied: Admins only</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default RequireAdmin; 