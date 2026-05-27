import { useEffect, useMemo, useState } from "react";
import API from "./api/api";
import Login from "./components/Login";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => {
    localStorage.removeItem("token");
    return null;
  });
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [serviceStatus, setServiceStatus] = useState({
    auth: "Checking",
    patient: "Login required",
    gateway: "http://localhost:8080",
    eureka: "http://localhost:8761",
  });

  const serviceCards = useMemo(
    () => [
      {
        name: "API Gateway",
        type: "gateway",
        port: "8080",
        status: serviceStatus.gateway,
        path: "Routes /auth and /patients",
      },
      {
        name: "Auth Service",
        type: "auth",
        port: "8081",
        status: serviceStatus.auth,
        path: "Gateway path /auth/test",
      },
      {
        name: "Patient Service",
        type: "patient",
        port: "8082",
        status: serviceStatus.patient,
        path: "Gateway path /patients/patient-db-test",
      },
      {
        name: "Eureka Server",
        type: "eureka",
        port: "8761",
        status: serviceStatus.eureka,
        path: "Service discovery dashboard",
      },
    ],
    [serviceStatus],
  );

  const checkAuthService = async () => {
    try {
      const response = await API.get("/auth/test");
      setServiceStatus((current) => ({ ...current, auth: response.data }));
    } catch {
      setServiceStatus((current) => ({ ...current, auth: "Unavailable" }));
    }
  };

  const loadPatients = async () => {
    if (!localStorage.getItem("token")) {
      setServiceStatus((current) => ({ ...current, patient: "Login required" }));
      return;
    }

    setPatientsLoading(true);
    setPatientsError("");

    try {
      const response = await API.get("/patients/patient-db-test");
      setPatients(response.data);
      setServiceStatus((current) => ({ ...current, patient: "Connected" }));
    } catch {
      setPatientsError("Unable to load patients through the gateway.");
      setServiceStatus((current) => ({ ...current, patient: "Unavailable" }));
    } finally {
      setPatientsLoading(false);
    }
  };

  const createPatient = async (patient) => {
    setPatientsError("");

    try {
      await API.post("/patients/patient-db-test", patient);
      await loadPatients();
    } catch {
      setPatientsError("Unable to create patient.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPatients([]);
    setServiceStatus((current) => ({ ...current, patient: "Login required" }));
  };

  useEffect(() => {
    // Initial API checks are external synchronization for the gateway-backed UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuthService();
  }, []);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPatients();
    }
  }, [token]);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="topbar">
          <div>
            <p className="eyebrow">MediTrack</p>
            <h1>Hospital Dashboard</h1>
            <p className="hero-copy">
              Monitor gateway routing, authenticate through JWT, and manage
              patient records from one working console.
            </p>
          </div>
          {token && (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        <div className="summary-strip">
          <div>
            <span>{token ? "Authenticated" : "Signed out"}</span>
            <strong>Session</strong>
          </div>
          <div>
            <span>{patients.length}</span>
            <strong>Loaded patients</strong>
          </div>
          <div>
            <span>JWT</span>
            <strong>Gateway security</strong>
          </div>
        </div>
      </section>

      <section className="service-grid" aria-label="Service status">
        {serviceCards.map((service) => (
          <article className={`service-card ${service.type}`} key={service.name}>
            <div className="service-card-header">
              <div>
                <span className="status-dot" aria-hidden="true" />
                <h2>{service.name}</h2>
              </div>
              <span>{service.port}</span>
            </div>
            <p className="status-text">{service.status}</p>
            <p>{service.path}</p>
          </article>
        ))}
      </section>

      <section className="workspace">
        <Login onLogin={setToken} />

        <div className="panel patients-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Patient service</p>
              <h2>Patients</h2>
            </div>
            <div className="actions">
              <button
                type="button"
                className="secondary-button"
                onClick={loadPatients}
              >
                Refresh
              </button>
              <PatientForm
                onCreate={createPatient}
                disabled={!token || patientsLoading}
              />
            </div>
          </div>

          {patientsError && <p className="error-message">{patientsError}</p>}
          {!token && (
            <p className="empty-state">
              Login first. The gateway requires a bearer token for patient routes.
            </p>
          )}
          {token && <PatientList patients={patients} loading={patientsLoading} />}
        </div>
      </section>
    </main>
  );
}

export default App;
