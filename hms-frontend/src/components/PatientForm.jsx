import { useState } from "react";

function PatientForm({ onCreate, disabled }) {
  const [patient, setPatient] = useState({
    name: "",
    disease: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!patient.name.trim() || !patient.disease.trim()) {
      return;
    }

    await onCreate({
      name: patient.name.trim(),
      disease: patient.disease.trim(),
    });

    setPatient({ name: "", disease: "" });
  };

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Patient name"
        value={patient.name}
        onChange={(event) =>
          setPatient({ ...patient, name: event.target.value })
        }
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Disease"
        value={patient.disease}
        onChange={(event) =>
          setPatient({ ...patient, disease: event.target.value })
        }
        disabled={disabled}
      />
      <button type="submit" className="secondary-button" disabled={disabled}>
        Add patient
      </button>
    </form>
  );
}

export default PatientForm;
