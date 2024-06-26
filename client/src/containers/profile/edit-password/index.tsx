import { FC } from "react";

import { Card, CardTitle } from "@/components/ui/card";

import EditPasswordForm from "./form";

const EditPassword: FC = () => {
  return (
    <Card className="px-0">
      <CardTitle className="pl-8">Edit Password</CardTitle>
      <div className="flex flex-col">
        <EditPasswordForm />
      </div>
    </Card>
  );
};

export default EditPassword;
