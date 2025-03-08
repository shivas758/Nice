import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChildrenFormFieldsProps {
  formData: {
    number_of_children: number;
    child_1_name: string;
    child_1_dob: string;
    child_2_name: string;
    child_2_dob: string;
    child_3_name: string;
    child_3_dob: string;
    child_4_name: string;
    child_4_dob: string;
  };
  handleInputChange: (name: string, value: string | number) => void;
}

export const ChildrenFormFields = ({
  formData,
  handleInputChange,
}: ChildrenFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="number_of_children">Number of Children</Label>
        <Input
          id="number_of_children"
          type="number"
          min="0"
          max="4"
          value={formData.number_of_children}
          onChange={(e) =>
            handleInputChange("number_of_children", parseInt(e.target.value) || 0)
          }
        />
      </div>

      {formData.number_of_children >= 1 && (
        <div className="space-y-2">
          <Label>Child 1</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Name"
              value={formData.child_1_name}
              onChange={(e) => handleInputChange("child_1_name", e.target.value)}
            />
            <Input
              type="date"
              value={formData.child_1_dob}
              onChange={(e) => handleInputChange("child_1_dob", e.target.value)}
            />
          </div>
        </div>
      )}

      {formData.number_of_children >= 2 && (
        <div className="space-y-2">
          <Label>Child 2</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Name"
              value={formData.child_2_name}
              onChange={(e) => handleInputChange("child_2_name", e.target.value)}
            />
            <Input
              type="date"
              value={formData.child_2_dob}
              onChange={(e) => handleInputChange("child_2_dob", e.target.value)}
            />
          </div>
        </div>
      )}

      {formData.number_of_children >= 3 && (
        <div className="space-y-2">
          <Label>Child 3</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Name"
              value={formData.child_3_name}
              onChange={(e) => handleInputChange("child_3_name", e.target.value)}
            />
            <Input
              type="date"
              value={formData.child_3_dob}
              onChange={(e) => handleInputChange("child_3_dob", e.target.value)}
            />
          </div>
        </div>
      )}

      {formData.number_of_children >= 4 && (
        <div className="space-y-2">
          <Label>Child 4</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Name"
              value={formData.child_4_name}
              onChange={(e) => handleInputChange("child_4_name", e.target.value)}
            />
            <Input
              type="date"
              value={formData.child_4_dob}
              onChange={(e) => handleInputChange("child_4_dob", e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};