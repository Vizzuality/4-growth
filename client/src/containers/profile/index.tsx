import AccountDetails from "./account-details";
import EditPassword from "./edit-password";
import SavedVisualizations from "./saved-visualizations";

export default async function Profile() {
  return (
    <div className="h-full space-y-0.5 overflow-auto md:grid md:grid-rows-2 md:gap-0.5 md:space-y-0">
      <div className="flex h-[400px] md:h-auto">
        <SavedVisualizations />
      </div>
      <div className="grid grid-cols-12 gap-0.5">
        <div className="col-span-12 xl:col-span-6">
          <AccountDetails />
        </div>
        <div className="col-span-full xl:col-span-6">
          <EditPassword />
        </div>
      </div>
    </div>
  );
}
