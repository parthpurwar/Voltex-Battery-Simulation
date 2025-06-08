import pybamm
import matplotlib.pyplot as plt
import io
import base64
import matplotlib
matplotlib.use('Agg')



def run_simulation(battery_type, params_from_request,selected_model):
    lithium_models = {
        "SPM": pybamm.lithium_ion.SPM,
        "SPMe": pybamm.lithium_ion.SPMe,
        "DFN": pybamm.lithium_ion.DFN,
        "MPM": pybamm.lithium_ion.MPM,
        "MSMR": pybamm.lithium_ion.MSMR,
    }

    lead_acid_models = {
        "LOQS": pybamm.lead_acid.LOQS,
        "Full": pybamm.lead_acid.Full,
    }
    # Select model and parameters
    if battery_type == "lithium-ion":
        model_class = lithium_models[selected_model]
        model=model_class()
        param = pybamm.ParameterValues("Chen2020")
    elif battery_type == "lead-acid":
        model_class = lead_acid_models[selected_model]
        model=model_class()
        param = pybamm.ParameterValues("Sulzer2019")
    else:
        raise ValueError(f"Unsupported battery type: {battery_type}")
    

    # Filter out invalid parameters
    valid_keys = set(param.keys())
    filtered_params = {
        k: v for k, v in params_from_request.items() if k in valid_keys
    }

    # Safely update model parameters
    param.update(filtered_params)

    c_rate = float(params_from_request.get("c_rate", 1))
    duration = float(params_from_request.get("duration", 3600))  # seconds
    t_eval = [0, duration]

    # Run simulation
    sim = pybamm.Simulation(model, parameter_values=param)
    sim.solve(t_eval=t_eval)

    # Generate and encode plot
    solution=sim.solution
    var=solution["Terminal voltage [V]"]
    plt.figure(figsize=(8, 4))
    plt.plot(solution["Time [s]"].entries, var.entries)
    plt.xlabel("Time [s]")
    plt.ylabel("Terminal Voltage [V]")
    plt.title(f"{battery_type.capitalize()} Battery Voltage Over Time")
    plt.grid(True)

    # Save to BytesIO for base64
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close()

    return {
        "status": "success",
        "plot_base64": img_b64,
        "summary": "Simulation completed",
        "image":"plot.png"
    }
