interface BioSectionProps {
  bio: string;
}

export const BioSection = ({ bio }: BioSectionProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">About Me</h3>
      <p className="text-gray-700">{bio}</p>
    </div>
  );
};