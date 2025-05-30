from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .pybamm_runner import run_simulation
from .aihelper import answer_query

@csrf_exempt
def simulate(request):
    if request.method == "POST":
        data = json.loads(request.body)
        result = run_simulation(data.get("battery_type"), data.get("params", {}))
        return JsonResponse(result)
    return JsonResponse({"error": "Invalid method"})

@csrf_exempt
def ask_ai(request):
    if request.method == "POST":
        data = json.loads(request.body)
        answer = answer_query(data.get("question"))
        return JsonResponse({"answer": answer})
    return JsonResponse({"error": "Invalid method"})
