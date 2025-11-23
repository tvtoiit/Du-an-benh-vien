import api from "../core/api";

const reportsService = {
    getServiceUsage: () => api.get("/reports/services"),
    getRevenueByMonth: () => api.get("/reports/revenue/monthly"),
    getDailyVisits: () => api.get("/reports/visits/daily")
};

export default reportsService;
