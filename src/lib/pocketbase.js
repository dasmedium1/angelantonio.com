import PocketBase from 'pocketbase';

// Initialize PocketBase with configuration
const pocketbaseUrl = 'http://localhost:8090';
console.log('Initializing PocketBase with URL:', pocketbaseUrl);
export const pb = new PocketBase(pocketbaseUrl);

// Add authentication state change listener
pb.authStore.onChange(() => {
  console.log('Auth state changed:', pb.authStore.isValid);
  console.log('Current auth model:', pb.authStore.model);
});

// Export helper functions
export const isAuthenticated = () => {
  console.log('Checking auth state:', pb.authStore.isValid);
  return pb.authStore.isValid;
};

export const logout = () => {
  console.log('Logging out');
  pb.authStore.clear();
};
