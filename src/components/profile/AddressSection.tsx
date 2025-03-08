interface AddressSectionProps {
  gccAddress?: string;
  indiaAddress?: string;
}

export const AddressSection = ({ gccAddress, indiaAddress }: AddressSectionProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">Addresses</h3>
      {gccAddress && (
        <div className="mb-2">
          <p className="font-medium">GCC Address:</p>
          <p className="text-gray-700">{gccAddress}</p>
        </div>
      )}
      {indiaAddress && (
        <div>
          <p className="font-medium">India Address:</p>
          <p className="text-gray-700">{indiaAddress}</p>
        </div>
      )}
    </div>
  );
};