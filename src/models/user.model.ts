export enum UserType {
  HOMEOWNER = 'homeowner',
  PROVIDER = 'provider',
}

export interface User {
  userId: string;
  userType: UserType;
  name: string;
  phone: string;
  email?: string;
  profilePhotoUrl?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  fcmToken?: string;
}

export interface Address {
  addressId: string;
  label: string; // e.g. "Home", "Office"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  coords: { lat: number; lng: number };
  isDefault: boolean;
}
