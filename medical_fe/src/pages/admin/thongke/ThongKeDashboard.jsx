import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress
} from "@mui/material";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import reportsService from "../../../services/reportsService";

const ThongKeDashboard = () => {
    const [serviceUsage, setServiceUsage] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [svc, rev, vis] = await Promise.all([
                    reportsService.getServiceUsage(),
                    reportsService.getRevenueByMonth(),
                    reportsService.getDailyVisits()
                ]);

                setServiceUsage(svc);
                setRevenue(rev);
                setVisits(vis);

            } catch (e) {
                console.error("Error loading reports:", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <Box p={4} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Đang tải thống kê...</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
                📊 Thống kê tổng quan
            </Typography>

            {/* KPI CARDS */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6">Dịch vụ sử dụng</Typography>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                            {serviceUsage.length}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6">Tổng doanh thu tháng</Typography>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                            {revenue.reduce((t, r) => t + r.totalRevenue, 0).toLocaleString()} đ
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6">Lượt khám hôm nay</Typography>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                            {visits.length > 0 ? visits[visits.length - 1].totalVisits : 0}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* SERVICE USAGE */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    📌 Thống kê sử dụng dịch vụ
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={serviceUsage}>
                        <XAxis dataKey="serviceName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="usageCount" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* REVENUE */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    💰 Doanh thu theo tháng
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#2e7d32" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            {/* VISITS */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    🏥 Lượt khám theo ngày
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={visits}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalVisits" stroke="#0288d1" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default ThongKeDashboard;
