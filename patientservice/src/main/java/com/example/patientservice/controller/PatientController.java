package com.example.patientservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.patientservice.model.Patient;
import com.example.patientservice.repository.PatientRepository;

@RestController
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping("/test")
    public String test() {
        return "Patient Service Running";
    }

    // 1. Clean GET endpoint: Just reads from the DB
    @GetMapping("/patient-db-test")
    public List<Patient> getPatients() {
        return patientRepository.findAll();
    }

    // 2. Clean POST endpoint: Handles writing patient data to the DB
    @PostMapping("/patient-db-test")
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }
}
