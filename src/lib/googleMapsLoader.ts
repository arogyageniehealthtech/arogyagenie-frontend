export const loadGoogleMaps = async () => (window as any).google?.maps || null;
export const getGoogleMapsApiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";