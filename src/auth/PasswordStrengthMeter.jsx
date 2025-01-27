import { Check, X } from "lucide-react";
import "./PasswordStrengthMeter.css"; // Import the CSS file

const PasswordCriteria = ({ password }) => {
	const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className="password-criteria">
			{criteria.map((item) => (
				<div key={item.label} className="criteria-item">
					{item.met ? (
						<Check className="check-icon" />
					) : (
						<X className="x-icon" />
					)}
					<span className={item.met ? "met" : "not-met"}>{item.label}</span>
				</div>
			))}
		</div>
	);
};

const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

	const getColor = (strength) => {
		if (strength === 0) return "red-500";
		if (strength === 1) return "red-400";
		if (strength === 2) return "yellow-500";
		if (strength === 3) return "yellow-400";
		return "green-500";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";
		return "Strong";
	};

	return (
		<div className="password-strength-meter">
			<div className="strength-header">
				<span>Password strength</span>
				<span>{getStrengthText(strength)}</span>
			</div>

			<div className="strength-bar">
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`strength-segment ${index < strength ? getColor(strength) : "gray-600"}`}
					/>
				))}
			</div>
			<PasswordCriteria password={password} />
		</div>
	);
};

export default PasswordStrengthMeter;