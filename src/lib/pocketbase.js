import PocketBase from 'pocketbase';

// Initialize PocketBase with configuration
const pocketbaseUrl = process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090';
console.log('Initializing PocketBase with URL:', pocketbaseUrl);
export const pb = new PocketBase(pocketbaseUrl);

// Add connection status check
export const checkConnection = async () => {
  try {
    console.log('Attempting PocketBase health check...');
    const health = await pb.health.check();
    console.log('PocketBase health check response:', health);
    
    console.log('Attempting collection query...');
    try {
      const result = await pb.collection('timeline_events').getList(1, 1);
      console.log('Collection query result:', result);
      return true;
    } catch (queryError) {
      console.error('Collection query error:', queryError);
      // If we got this far, the server is up but might not have the collection
      // This is okay for initial setup
      return true;
    }
  } catch (error) {
    console.error('PocketBase connection error:', error);
    if (error.status === 404) {
      console.error('PocketBase URL not found. Check if the server is running on the correct port');
    }
    return false;
  }
};

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
