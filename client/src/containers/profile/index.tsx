import AccountDetails from "./account-details";
import EditPassword from "./edit-password";
import SavedVisualizations from "./saved-visualizations";

export default async function Profile() {
  return (
    <div className="grid h-full grid-rows-2 gap-0.5">
      <div className="row-span-12 flex shrink">
        <SavedVisualizations />
      </div>
      <div className="row-span-12 grid grid-cols-12 gap-0.5">
        <div className="col-span-6">
          <AccountDetails />
        </div>
        <div className="col-span-6">
          <EditPassword />
        </div>
      </div>
    </div>
  );
}
