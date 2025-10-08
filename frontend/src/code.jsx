import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Play, Save, Upload, Download, Settings, BarChart3, Battery, Zap, Thermometer, Settings2 } from 'lucide-react';

const batteryModels = {
  'lithium-ion': {
    'SPM': 'Single Particle Model',
    'SPMe': 'Single Particle Model with Electrolyte',
    'DFN': 'Doyle-Fuller-Newman Model',
    'MPM': 'Many Particle Model',
    'MSMR': 'Multi-Species Multi-Reaction Model'
  },
  'lead-acid': {
    'LOQS': 'Leading-Order Quasi-Static Model',
    'Composite': 'Composite Model',
    'Full': 'Full Porous Electrode Model'
  },
  'sodium-ion': {
    'SPM': 'Single Particle Model',
    'DFN': 'Doyle-Fuller-Newman Model'
  },
  'lithium-metal': {
    'SPM': 'Single Particle Model',
    'DFN': 'Doyle-Fuller-Newman Model'
  },
  'lithium-sulfur': {
    'SPM': 'Single Particle Model',
    'DFN': 'Doyle-Fuller-Newman Model'
  },
  'zinc-air': {
    'SPM': 'Single Particle Model'
  }
};

const parameterSets = {
  'lithium-ion': ['Chen2020', 'Marquis2019', 'Mohtat2020', 'Ai2020', 'Ecker2015', 'OKane2020'],
  'lead-acid': ['Sulzer2019', 'Quarti2020', 'Bode1977'],
  'sodium-ion': ['Palmer2015', 'Tomaszewska2019'],
  'lithium-metal': ['OKane2022', 'Plating2021'],
  'lithium-sulfur': ['Marinescu2016', 'Danner2019'],
  'zinc-air': ['Stamm2017']
};

const experimentTypes = {
  'constant_current': 'Constant Current (CC)',
  'constant_voltage': 'Constant Voltage (CV)',
  'cccv': 'Constant Current Constant Voltage (CCCV)',
  'pulse': 'Pulse Test',
  'eis': 'Electrochemical Impedance Spectroscopy',
  'gitt': 'Galvanostatic Intermittent Titration',
  'drive_cycle': 'Drive Cycle',
  'calendar_aging': 'Calendar Aging',
  'cycle_aging': 'Cycle Aging'
};

const defaultParameterCategories = {
  electrochemical: {
    "Negative electrode thickness [m]": 1e-4,
    "Positive electrode thickness [m]": 1e-4,
    "Negative electrode porosity": 0.3,
    "Positive electrode porosity": 0.3,
    "Negative particle radius [m]": 1e-6,
    "Positive particle radius [m]": 1e-6,
    "Negative electrode conductivity [S.m-1]": 100,
    "Positive electrode conductivity [S.m-1]": 10,
    "Negative electrode diffusivity [m2.s-1]": 1e-14,
    "Positive electrode diffusivity [m2.s-1]": 1e-15,
    "Negative electrode OCP [V]": 0.1,
    "Positive electrode OCP [V]": 4.2,
    "Negative electrode exchange current density [A.m-2]": 5,
    "Positive electrode exchange current density [A.m-2]": 1,
    "SEI resistivity [Ohm.m]": 0.0001,
    "SEI thickness [m]": 2.5e-9
  },
  electrolyte: {
    "Electrolyte conductivity [S.m-1]": 1.2,
    "Electrolyte diffusivity [m2.s-1]": 2e-10,
    "Electrolyte transference number": 0.2594,
    "Initial electrolyte concentration [mol.m-3]": 1000,
    "Separator thickness [m]": 2.5e-5,
    "Separator porosity": 0.47,
    "Separator tortuosity": 1.5
  },
  thermal: {
    "Total heat transfer coefficient [W.m-2.K-1]": 10,
    "Ambient temperature [K]": 298.15,
    "Negative electrode thermal conductivity [W.m-1.K-1]": 1.7,
    "Positive electrode thermal conductivity [W.m-1.K-1]": 2.1,
    "Electrolyte thermal conductivity [W.m-1.K-1]": 0.6,
    "Negative electrode heat capacity [J.kg-1.K-1]": 700,
    "Positive electrode heat capacity [J.kg-1.K-1]": 700,
    "Electrolyte heat capacity [J.kg-1.K-1]": 2055,
    "Negative electrode density [kg.m-3]": 1800,
    "Positive electrode density [kg.m-3]": 5010,
    "Electrolyte density [kg.m-3]": 1200
  },
  physical: {
    "Electrode width [m]": 0.065,
    "Electrode height [m]": 0.1016,
    "Cell cooling surface area [m2]": 0.00531,
    "Cell volume [m3]": 2.42e-6,
    "Number of electrode pairs connected in parallel": 1,
    "Negative current collector thickness [m]": 1.2e-5,
    "Positive current collector thickness [m]": 1.6e-5,
    "Negative current collector conductivity [S.m-1]": 5.96e7,
    "Positive current collector conductivity [S.m-1]": 3.55e7
  },
  operating: {
    "C-rate": 1,
    "Simulation duration [s]": 3600,
    "Maximum voltage [V]": 4.2,
    "Minimum voltage [V]": 2.5,
    "Initial SOC": 1.0,
    "Operating current [A]": 1.0,
    "Rest time [s]": 300
  }
};

export default function EnhancedBatterySimulator() {
  const [activeTab, setActiveTab] = useState('model');
  const [selectedModel, setSelectedModel] = useState('SPM');
  const [selectedChemistry, setSelectedChemistry] = useState('lithium-ion');
  const [parameterSet, setParameterSet] = useState('Chen2020');
  const [expandedSections, setExpandedSections] = useState({
    electrochemical: true,
    electrolyte: false,
    thermal: false,
    physical: false,
    operating: false
  });
  const [parameters, setParameters] = useState(defaultParameterCategories);
  const [experimentType, setExperimentType] = useState('constant_current');
  const [experimentParams, setExperimentParams] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  // Initialize parameters when chemistry changes
  useEffect(() => {
    setParameters(defaultParameterCategories);
    if (parameterSets[selectedChemistry]) {
      setParameterSet(parameterSets[selectedChemistry][0]);
    }
    if (batteryModels[selectedChemistry]) {
      setSelectedModel(Object.keys(batteryModels[selectedChemistry])[0]);
    }
  }, [selectedChemistry]);

  const handleParameterChange = (category, paramName, value) => {
    setParameters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [paramName]: parseFloat(value) || 0
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSimulate = async () => {
    setIsRunning(true);
    
    // Flatten parameters for backend compatibility
    const flatParams = {};
    Object.values(parameters).forEach(category => {
      Object.assign(flatParams, category);
    });

    // Prepare payload with enhanced structure
    const payload = {
      battery_type: selectedChemistry,
      model_type: selectedModel,
      parameter_set: parameterSet,
      experiment_type: experimentType,
      params: flatParams,
      experiment_params: experimentParams
    };

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result for demonstration
      const mockResult = {
        voltage: Array.from({length: 100}, (_, i) => 4.2 - (i * 0.02)),
        current: Array.from({length: 100}, () => 1.0),
        temperature: Array.from({length: 100}, (_, i) => 298.15 + (i * 0.1)),
        soc: Array.from({length: 100}, (_, i) => 1.0 - (i * 0.01)),
        time: Array.from({length: 100}, (_, i) => i * 36)
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Simulation failed. Please check your parameters.');
    } finally {
      setIsRunning(false);
    }
  };

  const loadParameterSet = () => {
    // In real implementation, this would load predefined parameter sets
    alert(`Loading parameter set: ${parameterSet}`);
  };

  const saveParameterSet = () => {
    // In real implementation, this would save current parameters
    alert('Parameter set saved locally');
  };

  const exportResults = () => {
    if (result) {
      const dataStr = JSON.stringify(result, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'battery_simulation_results.json';
      link.click();
    }
  };

  const renderParameterSection = (categoryName, categoryParams, icon) => (
    <div key={categoryName} className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => toggleSection(categoryName)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium capitalize">{categoryName} Parameters</span>
          <span className="text-sm text-gray-500">
            ({Object.keys(categoryParams).length} parameters)
          </span>
        </div>
        {expandedSections[categoryName] ? <ChevronDown /> : <ChevronRight />}
      </button>
      
      {expandedSections[categoryName] && (
        <div className="p-4 space-y-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryParams).map(([paramName, value]) => (
              <div key={paramName} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {paramName}
                </label>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => handleParameterChange(categoryName, paramName, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Advanced Battery Simulator
        </h1>
        <p className="text-gray-600">
          Comprehensive battery modeling and simulation platform
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['model', 'parameters', 'experiment', 'results'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Model Selection Tab */}
      {activeTab === 'model' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Battery Chemistry
              </label>
              <select
                value={selectedChemistry}
                onChange={(e) => setSelectedChemistry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(batteryModels).map(chemistry => (
                  <option key={chemistry} value={chemistry}>
                    {chemistry.charAt(0).toUpperCase() + chemistry.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Type
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(batteryModels[selectedChemistry] || {}).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key} - {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parameter Set
              </label>
              <div className="flex space-x-2">
                <select
                  value={parameterSet}
                  onChange={(e) => setParameterSet(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(parameterSets[selectedChemistry] || []).map(set => (
                    <option key={set} value={set}>{set}</option>
                  ))}
                </select>
                <button
                  onClick={loadParameterSet}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Model Information</h3>
            <p className="text-blue-800 text-sm">
              <strong>Selected:</strong> {batteryModels[selectedChemistry]?.[selectedModel]} 
              for {selectedChemistry.replace('-', ' ')} chemistry using {parameterSet} parameters.
            </p>
          </div>
        </div>
      )}

      {/* Parameters Tab */}
      {activeTab === 'parameters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Model Parameters</h2>
            <div className="flex space-x-2">
              <button
                onClick={saveParameterSet}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Set</span>
              </button>
            </div>
          </div>

          {renderParameterSection('electrochemical', parameters.electrochemical, <Battery className="w-5 h-5 text-blue-500" />)}
          {renderParameterSection('electrolyte', parameters.electrolyte, <Zap className="w-5 h-5 text-yellow-500" />)}
          {renderParameterSection('thermal', parameters.thermal, <Thermometer className="w-5 h-5 text-red-500" />)}
          {renderParameterSection('physical', parameters.physical, <Settings2 className="w-5 h-5 text-gray-500" />)}
          {renderParameterSection('operating', parameters.operating, <Settings className="w-5 h-5 text-purple-500" />)}
        </div>
      )}

      {/* Experiment Tab */}
      {activeTab === 'experiment' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiment Type
            </label>
            <select
              value={experimentType}
              onChange={(e) => setExperimentType(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(experimentTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Experiment Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current [A]
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="1.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration [s]
                </label>
                <input
                  type="number"
                  step="1"
                  defaultValue="3600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSimulate}
              disabled={isRunning}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2 text-lg font-medium"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Running Simulation...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {result ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Simulation Results</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={exportResults}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Visualize</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Final Voltage</h3>
                  <p className="text-2xl font-bold text-blue-700">
                    {result.voltage[result.voltage.length - 1].toFixed(2)} V
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Final SOC</h3>
                  <p className="text-2xl font-bold text-green-700">
                    {(result.soc[result.soc.length - 1] * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900">Max Temperature</h3>
                  <p className="text-2xl font-bold text-red-700">
                    {Math.max(...result.temperature).toFixed(1)} K
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Runtime</h3>
                  <p className="text-2xl font-bold text-purple-700">
                    {(result.time[result.time.length - 1] / 60).toFixed(0)} min
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Results visualization would appear here. In a real implementation, 
                  this would show interactive charts of voltage, current, temperature, 
                  and SOC over time.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
              <p className="text-gray-600">Run a simulation to see results here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



//views.py
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
import pybamm
import numpy as np
import json
from datetime import datetime
import traceback

class SimulateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            battery_type = data.get("battery_type", "lithium-ion")
            model_name = data.get("model", "SPM")
            parameter_set = data.get("parameter_set", "Chen2020")
            experiment_type = data.get("experiment_type", "constant_current")
            parameters = data.get("parameters", {})
            
            # Run simulation
            result = self.run_pybamm_simulation(
                battery_type, model_name, parameter_set, 
                experiment_type, parameters
            )
            
            return Response({
                "success": True,
                "data": result,
                "timestamp": datetime.now().isoformat()
            })
            
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def run_pybamm_simulation(self, battery_type, model_name, parameter_set, experiment_type, custom_params):
        """
        Run PyBaMM simulation with comprehensive battery support
        """
        try:
            # Model selection based on battery type and model name
            model = self.get_model(battery_type, model_name)
            
            # Parameter set selection
            params = self.get_parameter_set(battery_type, parameter_set)
            
            # Apply custom parameters
            if custom_params:
                for param_name, value in custom_params.items():
                    if param_name in params:
                        params[param_name] = value
            
            # Create experiment
            experiment = self.create_experiment(experiment_type, custom_params)
            
            # Set up simulation
            sim = pybamm.Simulation(model, parameter_values=params, experiment=experiment)
            
            # Solve
            solution = sim.solve()
            
            # Extract results
            results = self.extract_results(solution, custom_params.get("Simulation duration [s]", 3600))
            
            return results
            
        except Exception as e:
            raise Exception(f"Simulation failed: {str(e)}")

    def get_model(self, battery_type, model_name):
        """Get appropriate PyBaMM model based on battery type and model name"""
        
        model_mapping = {
            'lithium-ion': {
                'SPM': pybamm.lithium_ion.SPM,
                'SPMe': pybamm.lithium_ion.SPMe,
                'DFN': pybamm.lithium_ion.DFN,
                'MPM': pybamm.lithium_ion.MPM,
                'MSMR': pybamm.lithium_ion.MSMR
            },
            'lead-acid': {
                'LOQS': pybamm.lead_acid.LOQS,
                'Composite': pybamm.lead_acid.Composite,
                'Full': pybamm.lead_acid.Full
            },
            'sodium-ion': {
                'SPM': lambda: pybamm.lithium_ion.SPM({"working ion": "sodium"}),
                'DFN': lambda: pybamm.lithium_ion.DFN({"working ion": "sodium"})
            },
            'lithium-metal': {
                'SPM': lambda: pybamm.lithium_ion.SPM({"lithium plating": "reversible"}),
                'DFN': lambda: pybamm.lithium_ion.DFN({"lithium plating": "reversible"})
            }
        }
        
        if battery_type not in model_mapping:
            raise ValueError(f"Unsupported battery type: {battery_type}")
        
        if model_name not in model_mapping[battery_type]:
            raise ValueError(f"Unsupported model '{model_name}' for battery type '{battery_type}'")
        
        model_class = model_mapping[battery_type][model_name]
        
        # Handle callable models (with options)
        if callable(model_class):
            return model_class()
        else:
            return model_class()

    def get_parameter_set(self, battery_type, parameter_set):
        """Get parameter set based on battery type"""
        
        parameter_mapping = {
            'lithium-ion': {
                'Chen2020': pybamm.ParameterValues("Chen2020"),
                'Marquis2019': pybamm.ParameterValues("Marquis2019"),
                'Mohtat2020': pybamm.ParameterValues("Mohtat2020"),
                'Ai2020': pybamm.ParameterValues("Ai2020"),
                'Ecker2015': pybamm.ParameterValues("Ecker2015"),
                'OKane2022': pybamm.ParameterValues("OKane2022"),
                'Prada2013': pybamm.ParameterValues("Prada2013")
            },
            'lead-acid': {
                'Sulzer2019': pybamm.ParameterValues("Sulzer2019"),
                'Quarti2020': pybamm.ParameterValues("Quarti2020")
            },
            'sodium-ion': {
                'Palmer2015': pybamm.ParameterValues("Palmer2015")
            },
            'lithium-metal': {
                'OKane2022': pybamm.ParameterValues("OKane2022")
            }
        }
        
        if battery_type not in parameter_mapping:
            raise ValueError(f"No parameters available for battery type: {battery_type}")
        
        if parameter_set not in parameter_mapping[battery_type]:
            raise ValueError(f"Parameter set '{parameter_set}' not available for '{battery_type}'")
        
        return parameter_mapping[battery_type][parameter_set]

    def create_experiment(self, experiment_type, params):
        """Create experiment based on type and parameters"""
        
        # Default values
        c_rate = params.get("C-rate", 1)
        duration = params.get("Simulation duration [s]", 3600)
        voltage_cutoff = params.get("Voltage cut-off [V]", 2.5)
        upper_voltage = params.get("Upper voltage cut-off [V]", 4.2)
        current = params.get("Current function [A]", 5)
        
        experiment_protocols = {
            'constant_current': [
                f"Discharge at {c_rate}C for {duration/3600} hours or until {voltage_cutoff}V"
            ],
            'constant_voltage': [
                f"Charge at {upper_voltage}V for {duration/3600} hours"
            ],
            'cccv': [
                f"Charge at {c_rate}C until {upper_voltage}V",
                f"Hold at {upper_voltage}V for {duration/3600} hours"
            ],
            'current_function': [
                f"Discharge at {current}A for {duration/3600} hours or until {voltage_cutoff}V"
            ],
            'power_function': [
                f"Discharge at {current*3.7}W for {duration/3600} hours or until {voltage_cutoff}V"
            ],
            'resistance_function': [
                f"Discharge at {1/current}Ohm for {duration/3600} hours or until {voltage_cutoff}V"
            ]
        }
        
        if experiment_type not in experiment_protocols:
            experiment_type = 'constant_current'
        
        return pybamm.Experiment(experiment_protocols[experiment_type])

    def extract_results(self, solution, duration):
        """Extract and format simulation results"""
        try:
            # Time array
            time = solution["Time [s]"].entries
            
            # Key variables to extract
            variables = {
                'time': time,
                'voltage': solution["Terminal voltage [V]"].entries,
                'current': solution["Current [A]"].entries,
                'soc': solution["Discharge capacity [A.h]"].entries,
            }
            
            # Try to extract additional variables if available
            optional_variables = {
                'temperature': "X-averaged cell temperature [K]",
                'power': "Terminal power [W]",
                'resistance': "Terminal resistance [Ohm]",
                'electrolyte_potential': "X-averaged electrolyte potential [V]",
                'negative_potential': "X-averaged negative electrode potential [V]",
                'positive_potential': "X-averaged positive electrode potential [V]",
                'negative_concentration': "X-averaged negative particle surface concentration [mol.m-3]",
                'positive_concentration': "X-averaged positive particle surface concentration [mol.m-3]"
            }
            
            for var_name, pybamm_name in optional_variables.items():
                try:
                    if pybamm_name in solution:
                        variables[var_name] = solution[pybamm_name].entries
                except:
                    # Variable not available in this model/solution
                    pass
            
            # Convert numpy arrays to lists for JSON serialization
            for key, value in variables.items():
                if hasattr(value, 'tolist'):
                    variables[key] = value.tolist()
                elif isinstance(value, np.ndarray):
                    variables[key] = value.tolist()
            
            # Calculate summary statistics
            summary = {
                'final_voltage': float(variables['voltage'][-1]) if len(variables['voltage']) > 0 else 0,
                'average_voltage': float(np.mean(variables['voltage'])) if len(variables['voltage']) > 0 else 0,
                'total_capacity': float(variables['soc'][-1]) if len(variables['soc']) > 0 else 0,
                'simulation_time': float(time[-1]) if len(time) > 0 else 0,
                'energy_delivered': float(np.trapz(np.array(variables['voltage']) * np.abs(np.array(variables['current'])), time)) if len(time) > 1 else 0
            }
            
            return {
                'variables': variables,
                'summary': summary,
                'metadata': {
                    'total_points': len(time),
                    'time_range': [float(time[0]), float(time[-1])] if len(time) > 0 else [0, 0]
                }
            }
            
        except Exception as e:
            # Fallback with minimal data
            return {
                'variables': {
                    'time': [0, duration],
                    'voltage': [4.0, 3.0],
                    'current': [1.0, 1.0],
                    'soc': [0, 1]
                },
                'summary': {
                    'final_voltage': 3.0,
                    'average_voltage': 3.5,
                    'total_capacity': 1.0,
                    'simulation_time': duration,
                    'energy_delivered': 3.5 * duration
                },
                'metadata': {
                    'total_points': 2,
                    'time_range': [0, duration],
                    'extraction_error': str(e)
                }
            }


class ParameterInfoView(APIView):
    """Get available parameters for a specific battery type and model"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        battery_type = request.query_params.get('battery_type', 'lithium-ion')
        model_name = request.query_params.get('model', 'SPM')
        parameter_set = request.query_params.get('parameter_set', 'Chen2020')
        
        try:
            # Get default parameters for the specified configuration
            sim_view = SimulateView()
            model = sim_view.get_model(battery_type, model_name)
            params = sim_view.get_parameter_set(battery_type, parameter_set)
            
            # Extract parameter information
            param_info = {}
            for key in params.keys():
                try:
                    value = params[key]
                    param_info[key] = {
                        'value': float(value) if isinstance(value, (int, float, np.number)) else str(value),
                        'type': type(value).__name__
                    }
                except:
                    param_info[key] = {
                        'value': str(params[key]),
                        'type': 'unknown'
                    }
            
            return Response({
                'success': True,
                'parameters': param_info,
                'battery_type': battery_type,
                'model': model_name,
                'parameter_set': parameter_set
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ModelInfoView(APIView):
    """Get information about available models and parameter sets"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            info = {
                'battery_types': {
                    'lithium-ion': {
                        'name': 'Lithium-Ion',
                        'models': ['SPM', 'SPMe', 'DFN', 'MPM', 'MSMR'],
                        'parameter_sets': ['Chen2020', 'Marquis2019', 'Mohtat2020', 'Ai2020', 'Ecker2015', 'OKane2022', 'Prada2013'],
                        'description': 'Standard lithium-ion battery chemistry'
                    },
                    'lead-acid': {
                        'name': 'Lead-Acid',
                        'models': ['LOQS', 'Composite', 'Full'],
                        'parameter_sets': ['Sulzer2019', 'Quarti2020'],
                        'description': 'Traditional lead-acid battery chemistry'
                    },
                    'sodium-ion': {
                        'name': 'Sodium-Ion',
                        'models': ['SPM', 'DFN'],
                        'parameter_sets': ['Palmer2015'],
                        'description': 'Emerging sodium-ion battery technology'
                    },
                    'lithium-metal': {
                        'name': 'Lithium-Metal',
                        'models': ['SPM', 'DFN'],
                        'parameter_sets': ['OKane2022'],
                        'description': 'Next-generation lithium-metal batteries'
                    }
                },
                'experiment_types': {
                    'constant_current': 'Constant Current Discharge',
                    'constant_voltage': 'Constant Voltage',
                    'cccv': 'Constant Current Constant Voltage',
                    'current_function': 'Current Function',
                    'power_function': 'Power Function',
                    'resistance_function': 'Resistance Function'
                },
                'pybamm_version': pybamm.__version__
            }
            
            return Response({
                'success': True,
                'data': info
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AskAIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            from .aihelper import answer_query
            data = request.data
            answer = answer_query(data.get("question"))
            return Response({"answer": answer})
        except ImportError:
            return Response({
                "error": "AI helper not available"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            # Validate required fields
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if not data.get(field):
                    return Response({
                        'error': f'{field} is required'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if username already exists
            if User.objects.filter(username=data['username']).exists():
                return Response({
                    'error': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email already exists
            if User.objects.filter(email=data['email']).exists():
                return Response({
                    'error': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password'])
            )
            
            return Response({
                'message': 'User registered successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)


# Utility function for parameter validation
def validate_parameters(parameters, battery_type, model):
    """Validate and sanitize parameters"""
    validated_params = {}
    
    # Define parameter bounds
    parameter_bounds = {
        'C-rate': (0.01, 20),
        'Ambient temperature [K]': (250, 400),
        'Simulation duration [s]': (1, 86400),
        'Negative electrode thickness [m]': (1e-6, 1e-2),
        'Positive electrode thickness [m]': (1e-6, 1e-2),
        'Negative electrode porosity': (0.01, 0.99),
        'Positive electrode porosity': (0.01, 0.99),
        'Electrolyte conductivity [S.m-1]': (0.001, 100),
        'Total heat transfer coefficient [W.m-2.K-1]': (0.1, 1000)
    }
    
    for param_name, value in parameters.items():
        if param_name in parameter_bounds:
            min_val, max_val = parameter_bounds[param_name]
            validated_value = max(min_val, min(max_val, float(value)))
            validated_params[param_name] = validated_value
        else:
            validated_params[param_name] = float(value)
    
    return validated_params


    //urls.py
    # urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    
    # Simulation endpoints
    path('simulate/', views.SimulateView.as_view(), name='simulate'),
    path('parameters/', views.ParameterInfoView.as_view(), name='parameter_info'),
    path('models/', views.ModelInfoView.as_view(), name='model_info'),
    
    # AI helper endpoint
    path('ai/ask/', views.AskAIView.as_view(), name='ask_ai'),
]


requirements.Extract
# Core Django and DRF
Django>=4.2.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.2.0
django-cors-headers>=4.0.0

# PyBaMM and scientific computing
pybamm>=23.5
numpy>=1.21.0
scipy>=1.7.0
matplotlib>=3.5.0
pandas>=1.3.0

# Database
psycopg2-binary>=2.9.0  # for PostgreSQL
# or sqlite3 (built-in with Python)

# Additional scientific libraries
casadi>=3.5.5  # Required by PyBaMM for some models
scikit-fem>=3.0.0  # For finite element methods

# Development and utilities
python-dotenv>=0.19.0
celery>=5.2.0  # For background tasks (optional)
redis>=4.0.0   # For caching and Celery backend (optional)

# Testing
pytest>=7.0.0
pytest-django>=4.5.0

# Production
gunicorn>=20.1.0
whitenoise>=6.0.0