import PocketBase from 'pocketbase';

// Initialize PocketBase with configuration
export const pb = new PocketBase(process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090');

// Add authentication state change listener
pb.authStore.onChange(() => {
  console.log('Auth state changed:', pb.authStore.isValid);
});

// Export helper functions
export const isAuthenticated = () => pb.authStore.isValid;

export const logout = () => {
  pb.authStore.clear();
};
