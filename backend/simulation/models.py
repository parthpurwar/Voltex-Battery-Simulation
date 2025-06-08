# models.py
from django.db import models
from django.contrib.auth.models import User
import json
from django.core.validators import MinValueValidator, MaxValueValidator

class BatteryType(models.Model):
    """Model to store battery type configurations"""
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    available_models = models.JSONField(default=list)  # List of available PyBaMM models
    parameter_sets = models.JSONField(default=list)    # List of available parameter sets
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.display_name
    
    class Meta:
        db_table = 'battery_types'

class SimulationTemplate(models.Model):
    """Template for commonly used simulation configurations"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    battery_type = models.ForeignKey(BatteryType, on_delete=models.CASCADE)
    model_name = models.CharField(max_length=50)
    parameter_set = models.CharField(max_length=50)
    experiment_type = models.CharField(max_length=50)
    parameters = models.JSONField(default=dict)
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.battery_type.name})"
    
    class Meta:
        db_table = 'simulation_templates'

class SimulationRun(models.Model):
    """Model to store simulation run history and results"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Basic info
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    
    # Configuration
    battery_type = models.CharField(max_length=50)
    model_name = models.CharField(max_length=50)
    parameter_set = models.CharField(max_length=50)
    experiment_type = models.CharField(max_length=50)
    parameters = models.JSONField(default=dict)
    
    # Execution info
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    execution_time = models.FloatField(null=True, blank=True)  # in seconds
    
    # Results
    results = models.JSONField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Simulation {self.id} - {self.user.username} ({self.status})"
    
    @property
    def duration(self):
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return None
    
    class Meta:
        db_table = 'simulation_runs'
        ordering = ['-created_at']

class ParameterSet(models.Model):
    """Custom parameter sets created by users"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    battery_type = models.ForeignKey(BatteryType, on_delete=models.CASCADE)
    base_parameter_set = models.CharField(max_length=50)  # Base PyBaMM parameter set
    custom_parameters = models.JSONField(default=dict)
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (by {self.created_by.username})"
    
    class Meta:
        db_table = 'parameter_sets'
        unique_together = ['name', 'created_by']

class UserProfile(models.Model):
    """Extended user profile for battery simulation preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Preferences
    default_battery_type = models.CharField(max_length=50, default='lithium-ion')
    default_model = models.CharField(max_length=50, default='SPM')
    default_parameter_set = models.CharField(max_length=50, default='Chen2020')
    
    # Usage statistics
    total_simulations = models.IntegerField(default=0)
    successful_simulations = models.IntegerField(default=0)
    last_simulation = models.DateTimeField(null=True, blank=True)
    
    # Account settings
    email_notifications = models.BooleanField(default=True)
    share_results = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile of {self.user.username}"
    
    @property
    def success_rate(self):
        if self.total_simulations > 0:
            return (self.successful_simulations / self.total_simulations) * 100
        return 0
    
    class Meta:
        db_table = 'user_profiles'

class SimulationShare(models.Model):
    """Model for sharing simulation results"""
    simulation = models.ForeignKey(SimulationRun, on_delete=models.CASCADE)
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    share_token = models.CharField(max_length=64, unique=True)
    is_public = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Share {self.share_token} for Simulation {self.simulation.id}"
    
    class Meta:
        db_table = 'simulation_shares'

class APIUsage(models.Model):
    """Track API usage for monitoring and billing"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    endpoint = models.CharField(max_length=100)
    method = models.CharField(max_length=10)
    status_code = models.IntegerField()
    execution_time = models.FloatField()  # in milliseconds
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Additional metadata
    user_agent = models.CharField(max_length=200, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'api_usage'
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['endpoint', 'timestamp']),
        ]