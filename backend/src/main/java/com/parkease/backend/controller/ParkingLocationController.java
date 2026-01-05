package com.parkease.backend.controller;

import com.parkease.backend.model.ParkingLocation;
import com.parkease.backend.service.ParkingLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class ParkingLocationController {

    @Autowired
    private ParkingLocationService locationService;

    @PostMapping
    public ParkingLocation create(@RequestBody ParkingLocation location) {
        return locationService.createLocation(location);
    }
}