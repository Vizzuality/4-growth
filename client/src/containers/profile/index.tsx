import AccountDetails from "./account-details";
import UserCharts from "./custom-charts";
import EditPassword from "./edit-password";

export default async function Profile() {
  return (
    <div className="flex h-full flex-col space-y-0.5">
      <div className="flex h-full">
        <UserCharts />
      </div>
      <div className="grid grid-cols-12 space-x-0.5">
        <div className="col-span-6">
          <AccountDetails />
        </div>
        <div className="col-span-6 h-full">
          <EditPassword />
        </div>
      </div>
    </div>
  );
}
