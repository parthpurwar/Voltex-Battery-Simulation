import pybamm
import matplotlib.pyplot as plt
import io
import base64

def run_simulation(battery_type, params_from_request):
    # Select model and parameters
    if battery_type == "lithium-ion":
        model = pybamm.lithium_ion.DFN()
        param = pybamm.ParameterValues("Chen2020")
    elif battery_type == "lead-acid":
        model = pybamm.lead_acid.LOQS()
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
    sim.plot(["Terminal voltage [V]"])
    fig = plt.gcf()
    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)

    return {
        "status": "success",
        "plot_base64": img_b64,
        "summary": "Simulation completed"
    }
