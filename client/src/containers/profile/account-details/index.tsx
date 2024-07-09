import { FC } from "react";

import { Card, CardTitle } from "@/components/ui/card";

import DeleteAccount from "./delete-account";
import AccountDetailsForm from "./form";

const AccountDetails: FC = () => {
  return (
    <Card className="h-full grow px-0">
      <CardTitle className="pl-8">Account details</CardTitle>
      <div className="flex h-full flex-col justify-between">
        <AccountDetailsForm />
        <DeleteAccount />
      </div>
    </Card>
  );
};

export default AccountDetails;
