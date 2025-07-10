import { ProfilePage } from "@/components/settings/profile-page";

// Example usage with initial data
const initialProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  profileImage: "/placeholder.svg?height=128&width=128",
};

export function SettingsPage() {
  return (
    <div>
      <ProfilePage initialData={initialProfileData} />
    </div>
  );
}
