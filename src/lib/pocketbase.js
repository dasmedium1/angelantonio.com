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
    
    // If health check passes, consider it connected
    if (health.code === 200) {
      console.log('PocketBase health check successful');
      return true;
    }
    
    // Additional collection check
    try {
      await pb.collection('timeline_events').getList(1, 1);
      console.log('Collection query successful');
      return true;
    } catch (queryError) {
      if (queryError.status === 404) {
        // Collection might not exist yet, but server is up
        console.log('Collection not found, but server is up');
        return true;
      }
      throw queryError;
    }
  } catch (error) {
    console.error('PocketBase connection error:', error);
    throw error;
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
