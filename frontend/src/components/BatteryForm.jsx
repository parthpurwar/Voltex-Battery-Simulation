import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight, Play, Upload } from 'lucide-react';

const batteryModels = {
  'lithium-ion': {
    SPM: 'Single Particle Model',
    SPMe: 'Single Particle Model with Electrolyte',
    DFN: 'Doyle-Fuller-Newman Model',
    MPM: 'Many Particle Model',
    MSMR: 'Multi-Species Multi-Reaction Model',
  },
  'lead-acid': {
    LOQS: 'Leading-Order Quasi-Static Model',
    Composite: 'Composite Model',
    Full: 'Full Porous Electrode Model',
  },
  'sodium-ion': {
    SPM: 'Single Particle Model',
    DFN: 'Doyle-Fuller-Newman Model'
  },
  'lithium-metal': {
    SPM: 'Single Particle Model',
    DFN: 'Doyle-Fuller-Newman Model'
  },
  'lithium-sulfur': {
    SPM: 'Single Particle Model',
    DFN: 'Doyle-Fuller-Newman Model'
  },
  'zinc-air': {
    SPM: 'Single Particle Model'
  }
};

const parameterSets = {
  'lithium-ion': ['Chen2020', 'Marquis2019', 'Mohtat2020'],
  'lead-acid': ['Sulzer2019', 'Quarti2020'],
  'sodium-ion': ['Palmer2015', 'Tomaszewska2019'],
  'lithium-metal': ['OKane2022', 'Plating2021'],
  'lithium-sulfur': ['Marinescu2016', 'Danner2019'],
  'zinc-air': ['Stamm2017']
};

const defaultParams = {
  'Negative electrode thickness [m]': 1e-4,
  'Positive electrode thickness [m]': 1e-4,
  'Negative electrode porosity': 0.3,
  'Positive electrode porosity': 0.3,
  'Negative particle radius [m]': 1e-6,
  'Positive particle radius [m]': 1e-6,
  'Electrolyte conductivity [S.m-1]': 1.2,
  'Electrolyte diffusivity [m2.s-1]': 2e-10,
  'SEI resistivity [Ohm.m]': 0.0001,
  'C-rate': 1,
  'Total heat transfer coefficient [W.m-2.K-1]': 10,
  'Ambient temperature [K]': 298.15,
  'Simulation duration [s]': 3600,
};

export default function BatteryForm() {
  const [batteryType, setBatteryType] = useState('lithium-ion');
  const [selectedModel, setSelectedModel] = useState('SPM');
  const [parameterSet, setParameterSet] = useState('Chen2020');
  const [params, setParams] = useState(defaultParams);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('model');

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  const loadParameterSet = () => {
    // Simulated parameter set loading
    alert(`Loading parameter set: ${parameterSet} for ${batteryType}`);
  };

  const handleSimulate = async () => {
    setIsRunning(true);
    const token = localStorage.getItem('access');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/simulate/',
        { battery_type: batteryType, params,selected_model:selectedModel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (error) {
      alert('Authentication failed or server error.');
      console.error(error);
    }
    setIsRunning(false);
  };

  return (
    <div className="container-fluid p-4 bg-light">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h1 className="h3 mb-0">Advanced Battery Simulator</h1>
          <p className="mb-0">Comprehensive battery modeling and simulation platform</p>
        </div>

        <div className="card-body">
          <ul className="nav nav-tabs mb-4">
            {['model', 'parameters', 'results'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* --- MODEL TAB --- */}
          {activeTab === 'model' && (
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label">Battery Chemistry</label>
                <select
                  value={batteryType}
                  onChange={(e) => {
                    setBatteryType(e.target.value);
                    setSelectedModel(Object.keys(batteryModels[e.target.value])[0]);
                    setParameterSet(parameterSets[e.target.value][0]);
                  }}
                  className="form-select"
                >
                  {Object.keys(batteryModels).map((chem) => (
                    <option key={chem} value={chem}>
                      {chem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Model Type</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="form-select"
                >
                  {Object.entries(batteryModels[batteryType]).map(([key, label]) => (
                    <option key={key} value={key}>
                      {key} - {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Parameter Set</label>
                <div className="d-flex">
                  <select
                    value={parameterSet}
                    onChange={(e) => setParameterSet(e.target.value)}
                    className="form-select me-2"
                  >
                    {parameterSets[batteryType].map((set) => (
                      <option key={set} value={set}>
                        {set}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline-secondary" onClick={loadParameterSet}>
                    <Upload size={16} />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleSimulate} disabled={isRunning}>
              {isRunning ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Simulating...
                </>
              ) : (
                <>
                  <Play size={18} className="me-2" />
                  Simulate
                </>
              )}
            </button>
          </div>
            </div>
          )}

          {/* --- PARAMETERS TAB --- */}
          {activeTab === 'parameters' && (
            <div className="row">
              {Object.keys(params).map((key) => (
                <div className="col-md-4 mb-3" key={key}>
                  <label className="form-label">{key}</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    name={key}
                    value={params[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleSimulate} disabled={isRunning}>
              {isRunning ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Simulating...
                </>
              ) : (
                <>
                  <Play size={18} className="me-2" />
                  Simulate
                </>
              )}
            </button>
          </div>
            </div>
            
          )}

        {activeTab === 'results' && (
        <div className="card shadow mt-4">
          <div className="card-header bg-success text-white">
            <h2 className="h5 mb-0">Simulation Results</h2>
          </div>
          <div className="card-body">
            {result.plot_base64 ? (
              <img
                src={`data:image/png;base64,${result.plot_base64}`}
                alt="Simulation Plot"
                style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}
              />
            ) : (
              <p>No plot image returned from simulation.</p>
            )}
            <pre className="mt-3">{JSON.stringify(result.summary, null, 2)}</pre>
          </div>
        </div>
      )}
          
        </div>
      </div>

      {/* --- RESULTS --- */}
      {result && (
        <div className="card shadow mt-4">
          <div className="card-header bg-success text-white">
            <h2 className="h5 mb-0">Simulation Results</h2>
          </div>
          <div className="card-body">
            {result.plot_base64 ? (
              <img
                src={`data:image/png;base64,${result.plot_base64}`}
                alt="Simulation Plot"
                style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}
              />
            ) : (
              <p>No plot image returned from simulation.</p>
            )}
            <pre className="mt-3">{JSON.stringify(result.summary, null, 2)}</pre>
          </div>
        </div>
      )}
      
    </div>
  );
}
