package com.nhom2.qnu.service;
import java.util.List;

import com.nhom2.qnu.payload.request.MedicinesRequest;
import com.nhom2.qnu.payload.response.MedicinesResponse;

public interface MedicinesService {
    MedicinesResponse createMedicins(MedicinesRequest medicines);
    MedicinesResponse updateMedicines(MedicinesRequest request, String id);
    MedicinesResponse getMedicines(String id);
    List<MedicinesResponse> getAllMedicines();
}
