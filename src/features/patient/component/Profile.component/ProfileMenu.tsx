import { PROFILE_MENU_ITEMS } from "../../../../constants/profile.constants";
import { ProfileMenuItem } from "./ProfileMenuItem";

export function ProfileMenu() {
  return (
    <nav 
      aria-label="Profile navigation" 
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col mx-4 md:mx-0"
    >
      {PROFILE_MENU_ITEMS.map((item, index) => (
        <div 
          key={item.href}
          className={index !== PROFILE_MENU_ITEMS.length - 1 ? "border-b border-[#E2E8F0]" : ""}
        >
          <ProfileMenuItem {...item} />
        </div>
      ))}
    </nav>
  );
}