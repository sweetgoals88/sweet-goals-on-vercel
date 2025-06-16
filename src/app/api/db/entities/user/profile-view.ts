import { AdminProfileView } from "./admin/profile-view";
import { CustomerProfileView } from "./customer/profile-view";

export type UserProfileView = AdminProfileView | CustomerProfileView;