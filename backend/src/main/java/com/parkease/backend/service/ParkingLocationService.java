package com.parkease.backend.service;

import com.parkease.backend.model.ParkingLocation;
import com.parkease.backend.repository.ParkingLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParkingLocationService {

    @Autowired
    private ParkingLocationRepository locationRepository;

    public ParkingLocation createLocation(ParkingLocation location) {
        return locationRepository.save(location);
    }
}