
interface EducationSectionProps {
  educationLevel?: string | null;
  school?: string | null;
  undergraduate_college?: string | null;
  postgraduate_college?: string | null;
  schools?: any[]; // Added to support the existing usage in ProfileInfo
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educationLevel,
  school,
  undergraduate_college,
  postgraduate_college,
  schools
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Education</h3>
      <div className="space-y-2">
        {educationLevel && (
          <div>
            <span className="font-medium">Education Level:</span> {educationLevel}
          </div>
        )}
        {school && (
          <div>
            <span className="font-medium">School:</span> {school}
          </div>
        )}
        {undergraduate_college && (
          <div>
            <span className="font-medium">Undergraduate College:</span> {undergraduate_college}
          </div>
        )}
        {postgraduate_college && (
          <div>
            <span className="font-medium">Postgraduate College:</span> {postgraduate_college}
          </div>
        )}
        {schools && schools.length > 0 && (
          <div>
            <span className="font-medium">Schools:</span>
            <ul className="list-disc pl-5 mt-1">
              {schools.map((school, index) => (
                <li key={index}>{school}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
