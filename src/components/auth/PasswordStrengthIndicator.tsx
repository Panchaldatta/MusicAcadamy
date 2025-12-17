import { getPasswordStrength } from '@/lib/validations';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;
  
  const strength = getPasswordStrength(password);
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.score <= 2 ? 'text-red-500' : 
        strength.score <= 4 ? 'text-yellow-600' : 
        'text-green-500'
      }`}>
        Password strength: {strength.label}
      </p>
      {strength.score < 6 && (
        <ul className="text-xs text-muted-foreground space-y-0.5">
          {!/[A-Z]/.test(password) && <li>• Add uppercase letter</li>}
          {!/[a-z]/.test(password) && <li>• Add lowercase letter</li>}
          {!/[0-9]/.test(password) && <li>• Add number</li>}
          {!/[^A-Za-z0-9]/.test(password) && <li>• Add special character</li>}
          {password.length < 12 && <li>• Use 12+ characters for extra security</li>}
        </ul>
      )}
    </div>
  );
};
