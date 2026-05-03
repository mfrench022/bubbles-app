import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../data/contacts';
import { Bubble } from '../data/bubbles';
import { UserProfile } from '../data/user';

const APP_STORAGE_KEY = 'bubbles-app-data-v1';

export interface StoredData {
  contacts: Contact[];
  bubbles: Bubble[];
  userProfile?: UserProfile;
}

export async function saveAppData(data: StoredData): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to save Bubble data', error);
  }
}

export async function loadAppData(): Promise<StoredData | null> {
  try {
    const stored = await AsyncStorage.getItem(APP_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as StoredData;
  } catch (error) {
    console.warn('Unable to load saved Bubble data', error);
    return null;
  }
}

export async function clearAppData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear saved Bubble data', error);
  }
}
