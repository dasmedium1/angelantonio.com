import PocketBase from 'pocketbase';

// Initialize PocketBase with configuration
const pocketbaseUrl = process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090';
console.log('Initializing PocketBase with URL:', pocketbaseUrl);
export const pb = new PocketBase(pocketbaseUrl);

// Add connection status check
export const checkConnection = async () => {
  try {
    // Try health check first
    const health = await pb.health.check();
    console.log('PocketBase health check passed');
    
    // Then try a collection query
    try {
      await pb.collection('timeline_events').getList(1, 1);
      console.log('PocketBase collection query successful');
      return true;
    } catch (queryError) {
      // If collection query fails but health check passed, 
      // it might just be an empty collection
      console.log('Collection query failed but health check passed:', queryError);
      return true;
    }
  } catch (error) {
    console.error('PocketBase connection error:', error);
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
